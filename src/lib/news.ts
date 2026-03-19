import { GoogleGenAI } from "@google/genai";
import admin from "firebase-admin";
import { db as clientDb } from "./firebase.js";
import { collection, query, where, orderBy, limit, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

export async function fetchAndPostAutismNews(adminDb: admin.firestore.Firestore) {
  try {
    console.log("[News] Starting fetchAndPostAutismNews");
    
    // Try to use the admin SDK first, but be ready to fall back to client SDK
    // which uses the API Key and is more resilient to IAM issues.
    let postsRef: any = adminDb?.collection('posts');
    let useClientSdk = false;

    // Check for recent news first
    console.log("[News] Querying recent news...");
    
    let recentNewsQuery;
    try {
      if (!adminDb) throw new Error("Admin DB not initialized");
      recentNewsQuery = await postsRef
        .where('topic', '==', 'noticias')
        .orderBy('timestamp', 'desc')
        .limit(1)
        .get();
      console.log("[News] Recent news query successful (Admin SDK)");
    } catch (queryError: any) {
      console.warn("[News] Admin SDK query failed, falling back to Client SDK:", queryError.message || queryError);
      useClientSdk = true;
      
      try {
        const q = query(
          collection(clientDb, 'posts'),
          where('topic', '==', 'noticias'),
          orderBy('timestamp', 'desc'),
          limit(1)
        );
        recentNewsQuery = await getDocs(q);
        console.log("[News] Recent news query successful (Client SDK)");
      } catch (clientError: any) {
        console.error("[News] Client SDK query also failed:", clientError.message || clientError);
        throw clientError;
      }
    }

    if (!recentNewsQuery.empty) {
      const doc = useClientSdk ? recentNewsQuery.docs[0] : recentNewsQuery.docs[0];
      const latestNews = doc.data();
      const latestTimestamp = latestNews.timestamp?.toDate() || new Date(0);
      const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

      if (latestTimestamp > twelveHoursAgo) {
        console.log("[News] Recent news already exists. Skipping generation.");
        return { success: true, skipped: true, reason: 'recent_news_exists' };
      }
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY or API_KEY not set. Skipping AI news fetch.");
      throw new Error("Gemini API key environment variable is not set.");
    }

    console.log(`[News] Using API Key starting with: ${apiKey.substring(0, 5)}...`);
    const ai = new GoogleGenAI({ apiKey });
    console.log("Fetching AI news about autism...");

    console.log("[News] Calling ai.models.generateContent with model: gemini-3-flash-preview");
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Busque as notícias mais recentes e relevantes sobre autismo (TEA), benefícios, direitos ou avanços científicos no Brasil. Escreva uma postagem curta e engajadora para uma comunidade de apoio ao autismo. Inclua os links das fontes se possível. Formate como um post de rede social.",
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    console.log("[News] ai.models.generateContent successful");

    const newsText = response.text;
    if (!newsText) {
      console.warn("[News] AI returned empty text");
      throw new Error("AI returned empty text content");
    }

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
      timestamp: useClientSdk ? serverTimestamp() : admin.firestore.FieldValue.serverTimestamp(),
      createdAt: useClientSdk ? serverTimestamp() : admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: useClientSdk ? serverTimestamp() : admin.firestore.FieldValue.serverTimestamp(),
      isGlobal: true
    };

    console.log("[News] payload created:", JSON.stringify(payload));

    console.log("[News] Writing to Firestore...");
    if (useClientSdk) {
      await addDoc(collection(clientDb, 'posts'), payload);
    } else {
      await adminDb.collection('posts').add(payload);
    }
    console.log("[News] Firestore write success");
    return { success: true };
  } catch (error: any) {
    console.error("[News] generation failed:", error.message || error);
    throw error;
  }
}
