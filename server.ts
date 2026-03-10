import express from "express";
import { createServer as createViteServer } from "vite";
import admin from "firebase-admin";
import axios from "axios";
import { parseStringPromise } from "xml2js";
import dotenv from "dotenv";
import cron from "node-cron";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Initialize Firebase Admin
// If running in a Google Cloud environment, it will automatically use the service account
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID
  });
}

const db = admin.firestore();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for PagSeguro notifications (usually urlencoded)
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // API Route: Create PagSeguro Checkout
  app.post("/api/create-checkout", async (req, res) => {
    try {
      const { planType, userId, userEmail } = req.body;

      const email = process.env.VITE_PAGSEGURO_EMAIL || '';
      const token = process.env.VITE_PAGSEGURO_TOKEN || '';

      if (!email || !token) {
        console.warn("PagSeguro credentials not configured (VITE_PAGSEGURO_EMAIL or VITE_PAGSEGURO_TOKEN). Using mock checkout URL.");
        return res.json({ url: "/payment-success" });
      }

      const planDetails = {
        mensal: { id: "0001", description: "Plano Mensal Conecta TEA", amount: "29.90" },
        anual: { id: "0002", description: "Plano Anual Conecta TEA", amount: "299.00" }
      };

      const plan = planDetails[planType as keyof typeof planDetails];

      // Constructing the XML for PagSeguro Checkout API (v2/v3)
      // Note: This is the standard redirect checkout
      const params = new URLSearchParams();
      params.append("email", email);
      params.append("token", token);
      params.append("currency", "BRL");
      params.append("itemId1", plan.id);
      params.append("itemDescription1", plan.description);
      params.append("itemAmount1", plan.amount);
      params.append("itemQuantity1", "1");
      params.append("reference", userId); // Critical: Store userId in reference
      params.append("senderEmail", userEmail);
      params.append("redirectURL", `${process.env.APP_URL || 'http://localhost:3000'}/payment-success`);
      params.append("notificationURL", `${process.env.APP_URL || 'http://localhost:3000'}/api/pagseguro-webhook`);

      const response = await axios.post(
        "https://ws.pagseguro.uol.com.br/v2/checkout",
        params.toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=ISO-8859-1"
          }
        }
      );

      const result = await parseStringPromise(response.data);
      const checkoutCode = result.checkout.code[0];
      const checkoutUrl = `https://pagseguro.uol.com.br/v2/checkout/payment.html?code=${checkoutCode}`;

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
        const email = process.env.VITE_PAGSEGURO_EMAIL || '';
        const token = process.env.VITE_PAGSEGURO_TOKEN || '';

        if (!email || !token) {
          console.warn("PagSeguro credentials not configured (VITE_PAGSEGURO_EMAIL or VITE_PAGSEGURO_TOKEN). Ignoring webhook.");
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
          await db.collection("users").doc(reference).update({
            isVip: true,
            vipSince: admin.firestore.FieldValue.serverTimestamp(),
            lastPaymentStatus: "paid"
          });
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
  async function fetchAndPostAutismNews() {
    try {
      if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY not set. Skipping AI news fetch.");
        return;
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      console.log("Fetching AI news about autism...");

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Busque as notícias mais recentes e relevantes sobre autismo (TEA), benefícios, direitos ou avanços científicos no Brasil. Escreva uma postagem curta e engajadora para uma comunidade de apoio ao autismo. Inclua os links das fontes se possível. Formate como um post de rede social.",
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const newsText = response.text;
      if (!newsText) return;

      // Extract grounding URLs if available
      let finalContent = newsText;
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks && chunks.length > 0) {
        finalContent += "\n\nFontes:\n";
        chunks.forEach((chunk: any) => {
          if (chunk.web?.uri && chunk.web?.title) {
            finalContent += `- [${chunk.web.title}](${chunk.web.uri})\n`;
          }
        });
      }

      await db.collection('posts').add({
        text: finalContent,
        content: finalContent,
        authorId: 'ai-bot',
        userId: 'ai-bot',
        authorName: 'Conecta TEA IA',
        authorPhoto: 'https://api.dicebear.com/7.x/bottts/svg?seed=ConectaTEA&backgroundColor=0ea5e9',
        mediaType: 'text',
        state: 'Geral',
        city: 'Geral',
        estado: 'Geral',
        cidade: 'Geral',
        topic: 'noticias',
        location: 'Brasil',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        isVip: true,
        isGlobal: true
      });
      console.log("AI News posted successfully.");
    } catch (error) {
      console.error("Error fetching AI news:", error);
    }
  }

  // Schedule to run every 6 hours
  cron.schedule("0 */6 * * *", fetchAndPostAutismNews);

  // Manual trigger for testing
  app.get("/api/trigger-news", async (req, res) => {
    await fetchAndPostAutismNews();
    res.send("News fetch triggered.");
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
