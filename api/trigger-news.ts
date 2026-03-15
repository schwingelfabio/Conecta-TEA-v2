import { GoogleGenAI } from "@google/genai";
import admin from "firebase-admin";

export default async function handler(req: any, res: any) {
  // Allow only GET and POST requests
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
    
    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      if (projectId) {
        admin.initializeApp({ projectId });
      } else {
        admin.initializeApp();
      }
    }

    const db = admin.firestore();

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is not set.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Busque as notícias mais recentes e relevantes sobre autismo (TEA), benefícios, direitos ou avanços científicos no Brasil. Escreva uma postagem curta e engajadora para uma comunidade de apoio ao autismo. Inclua os links das fontes se possível. Formate como um post de rede social.",
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const newsText = response.text;
    if (!newsText) {
      throw new Error("AI returned empty text content");
    }

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

    const payload = {
      text: finalContent,
      content: finalContent,
      authorId: 'ai-bot',
      userId: 'ai-bot',
      authorName: 'Conecta TEA IA',
      authorPhoto: 'https://api.dicebear.com/7.x/bottts/svg?seed=ConectaTEA&backgroundColor=0ea5e9',
      mediaType: 'text',
      state: 'Geral',
      city: 'Geral',
      topic: 'noticias',
      location: 'Brasil',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      isGlobal: true
    };

    await db.collection('posts').add(payload);

    return res.status(200).json({ success: true, message: "News fetch triggered successfully." });
  } catch (error: any) {
    console.error("[News API] Error:", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to generate news" });
  }
}
