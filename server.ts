import express from "express";
import { createServer as createViteServer } from "vite";
import admin from "firebase-admin";
import axios from "axios";
import { parseStringPromise } from "xml2js";
import dotenv from "dotenv";
import path from "path";
import { getFirestore } from "firebase-admin/firestore";
import multer from "multer";
import OpenAI from "openai";
import { ElevenLabsClient } from "elevenlabs";
import fs from "fs";
import { startMordomoIA, logSystemError, runAnalysisAndReport } from "./mordomoIA.ts";
import { trackMonetizationEvent, startMonetizationEngine } from "./monetizationEngine.ts";

const firebaseConfig = JSON.parse(fs.readFileSync(new URL("./firebase-applet-config.json", import.meta.url), "utf-8"));

dotenv.config();

// Initialize Firebase Admin
const projectId = firebaseConfig.projectId;
const databaseId = firebaseConfig.firestoreDatabaseId || '(default)';

// Force environment variables to match our target project
if (projectId) {
  process.env.GOOGLE_CLOUD_PROJECT = projectId;
  process.env.FIREBASE_PROJECT_ID = projectId;
}

async function initAdmin() {
  if (!admin.apps.length) {
    try {
      // Initialize with default credentials, which should have the necessary permissions
      admin.initializeApp();
      console.log(`[Server] Firebase Admin initialized (default). Project: ${admin.app().options.projectId}`);
    } catch (error) {
      console.error('[Server] Firebase Admin initialization failed:', error);
    }
  }
}

await initAdmin();

// Get Firestore instance with error handling
let db: admin.firestore.Firestore;
try {
  // Always use the databaseId from the config, not '(default)' unless it's explicitly '(default)'
  db = getFirestore(admin.app(), databaseId);
  console.log(`[Server] Firestore initialized. Database: ${databaseId}, Project: ${admin.app().options.projectId}`);
} catch (error) {
  console.error(`[Server] Failed to initialize Firestore with database ${databaseId}. Falling back to (default).`, error);
  db = getFirestore(admin.app(), '(default)');
}

// Test connection and provide helpful error message for PERMISSION_DENIED
async function testFirestoreConnection() {
  try {
    console.log(`[Server] Testing Firestore connection for project: ${admin.app().options.projectId}, database: ${databaseId}...`);
    await db.collection('test_connection').limit(1).get();
    console.log('[Server] Firestore connection test (read) successful.');
  } catch (error: any) {
    console.error('[Server] Firestore connection test failed:', error.message || error);
    
    if (databaseId !== '(default)' && (error.code === 7 || error.message?.includes('PERMISSION_DENIED'))) {
      console.warn('[Server] PERMISSION_DENIED on named database. Falling back to (default) database...');
      try {
        db = getFirestore(admin.app(), '(default)');
        await db.collection('test_connection').limit(1).get();
        console.log('[Server] Firestore connection test (read) successful on (default) database.');
      } catch (fallbackError: any) {
        console.error('[Server] Fallback to (default) database also failed:', fallbackError.message || fallbackError);
      }
    }
  }
}

await testFirestoreConnection();

async function initializeSystemData() {
  if (!projectId) return;

  try {
    const ADMIN_EMAILS = [
      'fabiopalacioschwingel@gmail.com',
      'fabiparadox2@gmail.com'
    ];
    const adminsRef = db.collection('admins');
    
    let snapshot;
    try {
      snapshot = await adminsRef.get();
    } catch (e: any) {
      console.warn('Firebase Admin: Permission denied or error accessing Firestore:', e.message);
      return;
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

    const topicsRef = db.collection('topics');
    try {
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
    } catch (e: any) {
      console.warn('Firebase Admin: Error checking/initializing topics:', e.message);
    }
  } catch (error) {
    console.error('Error initializing system data:', error);
  }
}

async function startServer() {
  await initializeSystemData();
  startMonetizationEngine(db);
  const app = express();
  const PORT = 3000;

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const elevenlabs = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });
  const upload = multer({ 
    storage: multer.diskStorage({
      destination: 'uploads/',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
      }
    }),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });

  if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
  }

  // API Route: File Upload
  app.post("/api/upload", upload.single('file'), (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file provided" });
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl });
    } catch (error: any) {
      console.error("Upload Error:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  app.use('/uploads', express.static('uploads'));

  // API Route: Mordomo IA Error Logging
  app.post("/api/mordomo/log", async (req, res) => {
    try {
      await logSystemError(db, req.body);
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to log error" });
    }
  });

  // API Route: Trigger Mordomo IA Analysis Manually (for testing)
  app.post("/api/mordomo/trigger", async (req, res) => {
    try {
      const result = await runAnalysisAndReport(db);
      if (result && result.status === 'no_logs') {
        res.status(200).json({ success: true, message: "Nenhum log pendente para análise. Sistema saudável!" });
      } else {
        res.status(200).json({ success: true, message: "Análise concluída. Verifique seu e-mail e o painel." });
      }
    } catch (err) {
      res.status(500).json({ error: "Failed to trigger analysis" });
    }
  });

  // API Route: Monetization Engine Logging
  app.post("/api/monetization/log", async (req, res) => {
    try {
      const { userId, eventType, pageUrl, deviceType, metadata } = req.body;
      await trackMonetizationEvent(db, { userId, eventType, pageUrl, deviceType, metadata });
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error logging monetization event:", error);
      res.status(500).json({ error: "Failed to log event" });
    }
  });

  // API Route: Speech-to-Text (Whisper)
  app.post("/api/stt", upload.single('audio'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No audio file provided" });
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(req.file.path),
        model: "whisper-1",
      });
      fs.unlinkSync(req.file.path);
      res.json({ text: transcription.text });
    } catch (error: any) {
      console.error("STT Error:", error);
      res.status(500).json({ error: "Failed to transcribe audio" });
    }
  });

  // API Route: Text-to-Speech (ElevenLabs)
  app.post("/api/tts", async (req, res) => {
    try {
      const { text } = req.body;
      const audio = await elevenlabs.generate({
        voice: "Sofia", // Need to pick a voice ID
        text,
        model_id: "eleven_monolingual_v1",
      });
      
      const chunks: Buffer[] = [];
      for await (const chunk of audio) {
        chunks.push(chunk);
      }
      const audioBuffer = Buffer.concat(chunks);
      
      res.set('Content-Type', 'audio/mpeg');
      res.send(audioBuffer);
    } catch (error: any) {
      console.error("TTS Error:", error);
      res.status(500).json({ error: "Failed to generate speech" });
    }
  });

  // API Route: Create PagSeguro Checkout
  app.post("/api/create-checkout", async (req, res) => {
    try {
      const { planType, userId, userEmail, userName } = req.body;
      const token = process.env.PAGSEGURO_TOKEN || process.env.VITE_PAGSEGURO_TOKEN || process.env.PAGBANK_TOKEN || 'aa75da37-a368-4f6c-a7e9-6d819c8ad0cc0ee89bfb41d9bd1fdab25ef33af844e65ea2-c25b-492d-8c4e-2ed40cf90cc3';
      const planDetails = {
        mensal: { id: "0001", name: "Plano Mensal Conecta TEA", amount: 2990 },
        anual: { id: "0002", name: "Plano Anual Conecta TEA", amount: 29900 }
      };
      const plan = planDetails[planType as keyof typeof planDetails];
      if (!plan) return res.status(400).json({ error: "Invalid plan type" });

      const payload = {
        reference_id: userId,
        items: [{ reference_id: plan.id, name: plan.name, quantity: 1, unit_amount: plan.amount }],
        payment_methods: [{ type: "CREDIT_CARD" }, { type: "PIX" }, { type: "BOLETO" }],
        redirect_url: `${process.env.APP_URL}/payment-success`,
        notification_urls: [`${process.env.APP_URL}/api/pagseguro-webhook`]
      };

      const response = await axios.post("https://api.pagseguro.com/checkouts", payload, {
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }
      });
      res.json({ url: response.data.links.find((link: any) => link.rel === "PAY").href });
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
        if (!email || !token) return res.status(200).send("OK");
        const response = await axios.get(`https://ws.pagseguro.uol.com.br/v3/transactions/notifications/${notificationCode}?email=${email}&token=${token}`);
        const result = await parseStringPromise(response.data);
        const transaction = result.transaction;
        const status = parseInt(transaction.status[0]);
        const reference = transaction.reference[0];
        if (status === 3 || status === 4) {
          await db.collection("users").doc(reference).set({
            isVip: true,
            vipSince: admin.firestore.FieldValue.serverTimestamp(),
            lastPaymentStatus: "paid"
          }, { merge: true });
        }
      }
      res.status(200).send("OK");
    } catch (error: any) {
      console.error("Webhook Error:", error.response?.data || error.message);
      res.status(500).send("Error");
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

  // Start Mordomo IA background tasks
  startMordomoIA(db);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
