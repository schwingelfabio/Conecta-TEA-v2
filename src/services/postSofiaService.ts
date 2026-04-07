import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

export const SofiaService = {
  async generateResponse(postText: string, lang: string): Promise<string> {
    const prompt = `
      You are Sofia, a warm, kind, and emotionally intelligent AI assistant for "Conecta TEA", a global autism support community.
      Respond to this post with empathy, support, and gentle guidance.
      Post: "${postText}"
      Language: ${lang === 'en' ? 'English' : lang === 'es' ? 'Spanish' : 'Portuguese'}.
      
      Rules:
      - Be human, kind, and gentle.
      - Never be robotic or overly clinical.
      - If the user expresses fear, sadness, or overwhelm, offer warmth and safe guidance.
      - Keep it concise.
      - Do not dominate the conversation.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-preview',
      contents: prompt,
    });

    return response.text || '';
  },

  async suggestReply(postText: string, lang: string): Promise<string[]> {
    const prompt = `
      Suggest 3 short, supportive, and engaging replies for this post in ${lang === 'en' ? 'English' : lang === 'es' ? 'Spanish' : 'Portuguese'}.
      Post: "${postText}"
      Return as a JSON array of strings.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-preview',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    try {
      return JSON.parse(response.text || '[]');
    } catch {
      return [];
    }
  }
};
