import { GoogleGenAI } from "@google/genai";
import admin from "firebase-admin";

export async function fetchAndPostAutismNews(db: admin.firestore.Firestore) {
  try {
    console.log("[News] Starting fetchAndPostAutismNews");
    // Check for recent news first
    console.log("[News] Querying recent news...");
    const recentNewsQuery = await db.collection('posts')
      .where('topic', '==', 'noticias')
      .orderBy('timestamp', 'desc')
      .limit(1)
      .get();
    console.log("[News] Recent news query successful");

    if (!recentNewsQuery.empty) {
      const latestNews = recentNewsQuery.docs[0].data();
      const latestTimestamp = latestNews.timestamp?.toDate() || new Date(0);
      const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

      if (latestTimestamp > twelveHoursAgo) {
        console.log("[News] Recent news already exists. Skipping generation.");
        return { success: true, skipped: true, reason: 'recent_news_exists' };
      }
    }

    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY not set. Skipping AI news fetch.");
      throw new Error("GEMINI_API_KEY environment variable is not set.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    console.log("Fetching AI news about autism...");

    console.log("[News] Calling ai.models.generateContent...");
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-preview",
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
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      isGlobal: true
    };

    console.log("[News] payload created:", JSON.stringify(payload));

    console.log("[News] Writing to Firestore...");
    await db.collection('posts').add(payload);
    console.log("[News] Firestore write success");
    return { success: true };
  } catch (error: any) {
    console.error("[News] generation failed:", error.message || error);
    throw error;
  }
}
