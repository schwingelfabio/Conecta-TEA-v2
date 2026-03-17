import express from "express";
import { createServer as createViteServer } from "vite";
import admin from "firebase-admin";
import axios from "axios";
import { parseStringPromise } from "xml2js";
import dotenv from "dotenv";
import cron from "node-cron";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { getFirestore } from "firebase-admin/firestore";
import { fetchAndPostAutismNews } from "./src/lib/news.js";
import firebaseConfig from "./firebase-applet-config.json";

dotenv.config();

// Initialize Firebase Admin
const projectId = firebaseConfig.projectId;
const databaseId = firebaseConfig.firestoreDatabaseId || '(default)';

async function initAdmin() {
  if (!admin.apps.length) {
    try {
      // In Cloud Run / AI Studio, the environment is usually pre-configured.
      // Initializing without arguments is often the most reliable way to get the correct service account.
      admin.initializeApp();
      const currentId = admin.app().options.projectId || process.env.GOOGLE_CLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID;
      console.log(`[Server] Firebase Admin initialized (default). Project: ${currentId}`);
      
      // If the environment project doesn't match our config project, we might have permission issues
      if (currentId && projectId && currentId !== projectId) {
        console.warn(`[Server] WARNING: Environment project (${currentId}) differs from config project (${projectId}).`);
        console.warn(`[Server] If you get PERMISSION_DENIED, ensure the service account for ${currentId} has access to ${projectId}.`);
      }
    } catch (error) {
      console.error('[Server] Default Firebase Admin initialization failed, trying with config...', error);
      try {
        admin.initializeApp({
          projectId: projectId,
          credential: admin.credential.applicationDefault()
        });
        console.log(`[Server] Firebase Admin initialized with config project: ${projectId}`);
      } catch (configError) {
        console.error('[Server] Firebase Admin initialization with config also failed:', configError);
      }
    }
  }
}

await initAdmin();

// Get Firestore instance with error handling
let db: admin.firestore.Firestore;
try {
  // Explicitly use the database ID from config
  db = getFirestore(admin.app(), databaseId);
  console.log(`[Server] Firestore initialized. Database: ${databaseId}, Project: ${admin.app().options.projectId}`);
} catch (error) {
  console.error(`[Server] Failed to initialize Firestore with database ${databaseId}. Falling back to (default).`, error);
  db = getFirestore(admin.app(), '(default)');
}

// Test connection and provide helpful error message for PERMISSION_DENIED
async function testFirestoreConnection() {
  try {
    // Try a simple read first as it's less invasive than a write
    await db.collection('test_connection').limit(1).get();
    console.log('[Server] Firestore connection test (read) successful.');
    
    // Then try a write to confirm full permissions
    await db.collection('test_connection').doc('status').set({
      last_check: admin.firestore.FieldValue.serverTimestamp(),
      status: 'ok',
      project: admin.app().options.projectId,
      database: databaseId
    });
    console.log('[Server] Firestore connection test (write) successful.');
  } catch (error: any) {
    console.error('[Server] Firestore connection test failed:', error.message || error);
    if (error.code === 7 || error.message?.includes('PERMISSION_DENIED')) {
      const currentProject = admin.app().options.projectId || process.env.GOOGLE_CLOUD_PROJECT;
      console.error('--------------------------------------------------------------------------------');
      console.error('CRITICAL: PERMISSION_DENIED (Error 7)');
      console.error(`The service account for project "${currentProject}" does not have permission to access Firestore in project "${projectId}".`);
      console.error('To fix this:');
      console.error(`1. Go to Google Cloud Console for project "${projectId}"`);
      console.error('2. Go to IAM & Admin > IAM');
      console.error(`3. Add the service account for "${currentProject}" as a member`);
      console.error('4. Grant it the "Cloud Datastore User" and "Firebase Admin" roles');
      console.error('--------------------------------------------------------------------------------');
    }
  }
}

await testFirestoreConnection();

async function initializeSystemData() {
  if (!projectId) return;

  try {
    // Initialize Admins
    const ADMIN_EMAILS = [
      'fabiopalacioschwingel@gmail.com',
      'fabiparadox2@gmail.com'
    ];
    const adminsRef = db.collection('admins');
    
    // Use a try-catch specifically for the get() to handle PERMISSION_DENIED gracefully
    let snapshot;
    try {
      snapshot = await adminsRef.get();
    } catch (e: any) {
      if (e.code === 7 || e.message?.includes('PERMISSION_DENIED')) {
        console.warn('Firebase Admin: Permission denied when accessing Firestore. Please ensure the service account has "Cloud Datastore User" role.');
        return;
      }
      throw e;
    }

    if (snapshot.empty) {
      for (const rawEmail of ADMIN_EMAILS) {
        const email = rawEmail.toLowerCase().trim();
        await adminsRef.doc(email).set({
          email,
          role: 'admin',
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
      console.log('Admins initialized.');
    }

    // Initialize Default Topic
    const topicsRef = db.collection('topics');
    const q = topicsRef.where('titulo', '==', 'Bem-vindos à Comunidade!');
    const querySnapshot = await q.get();
    if (querySnapshot.empty) {
      await topicsRef.add({
        titulo: 'Bem-vindos à Comunidade!',
        city: 'Geral',
        state: 'Geral',
        author: 'Sistema',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log('Default topic initialized.');
    }
  } catch (error) {
    console.error('Error initializing system data:', error);
  }
}

async function startServer() {
  await initializeSystemData();
  const app = express();
  const PORT = 3000;

  // Middleware for PagSeguro notifications (usually urlencoded)
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // API Route: Create PagSeguro Checkout
  app.post("/api/create-checkout", async (req, res) => {
    try {
      const { planType, userId, userEmail, userName } = req.body;

      const token = process.env.PAGSEGURO_TOKEN || process.env.VITE_PAGSEGURO_TOKEN || process.env.PAGBANK_TOKEN || 'aa75da37-a368-4f6c-a7e9-6d819c8ad0cc0ee89bfb41d9bd1fdab25ef33af844e65ea2-c25b-492d-8c4e-2ed40cf90cc3';

      const planDetails = {
        mensal: { id: "0001", name: "Plano Mensal Conecta TEA", amount: 2990 }, // in cents
        anual: { id: "0002", name: "Plano Anual Conecta TEA", amount: 29900 }
      };

      const plan = planDetails[planType as keyof typeof planDetails];
      if (!plan) {
        return res.status(400).json({ error: "Invalid plan type" });
      }

      const payload = {
        reference_id: userId,
        items: [
          {
            reference_id: plan.id,
            name: plan.name,
            quantity: 1,
            unit_amount: plan.amount
          }
        ],
        payment_methods: [
          { type: "CREDIT_CARD" },
          { type: "PIX" },
          { type: "BOLETO" }
        ],
        redirect_url: `${process.env.APP_URL}/payment-success`,
        notification_urls: [
          `${process.env.APP_URL}/api/pagseguro-webhook`
        ]
      };

      const response = await axios.post(
        "https://api.pagseguro.com/checkouts",
        payload,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const checkoutUrl = response.data.links.find((link: any) => link.rel === "PAY").href;
      res.json({ url: checkoutUrl });
    } catch (error: any) {
      console.error("Error creating PagSeguro checkout:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // API Route: PagSeguro Webhook
  app.post("/api/pagseguro-webhook", async (req, res) => {
    try {
      const { notificationCode, notificationType } = req.body;

      if (notificationType === "transaction") {
        const email = process.env.PAGSEGURO_EMAIL || process.env.VITE_PAGSEGURO_EMAIL || '';
        const token = process.env.PAGSEGURO_TOKEN || process.env.VITE_PAGSEGURO_TOKEN || '';

        if (!email || !token) {
          console.warn("PagSeguro credentials not configured. Ignoring webhook.");
          return res.status(200).send("OK");
        }
        const response = await axios.get(
          `https://ws.pagseguro.uol.com.br/v3/transactions/notifications/${notificationCode}?email=${email}&token=${token}`
        );

        const result = await parseStringPromise(response.data);
        const transaction = result.transaction;
        const status = parseInt(transaction.status[0]);
        const reference = transaction.reference[0]; // This is our userId

        console.log(`PagSeguro Notification: Status ${status} for User ${reference}`);

        // Status 3: Paga, Status 4: Disponível
        if (status === 3 || status === 4) {
          await db.collection("users").doc(reference).set({
            isVip: true,
            vipSince: admin.firestore.FieldValue.serverTimestamp(),
            lastPaymentStatus: "paid"
          }, { merge: true });
          console.log(`User ${reference} promoted to VIP`);
        }
      }

      res.status(200).send("OK");
    } catch (error: any) {
      console.error("Webhook Error:", error.response?.data || error.message);
      res.status(500).send("Error");
    }
  });

  // AI News Fetching Logic
  // Schedule to run every minute for testing
  cron.schedule("* * * * *", () => fetchAndPostAutismNews(db));

  // Manual trigger for testing
  app.get("/api/trigger-news", async (req, res) => {
    try {
      await fetchAndPostAutismNews(db);
      res.json({ success: true, message: "News fetch triggered." });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message || "Failed to generate news" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
