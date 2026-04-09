import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

export const SofiaService = {
  async generateResponse(postText: string, lang: string): Promise<string> {
    const prompt = `
      Você é a SOFIA IA, uma assistente virtual integrada ao app Conecta TEA, e atua sob as diretrizes do CÉREBRO CENTRAL (criado por Fábio Palacio Schwingel, pai da Victória, 5 anos, TEA, Parobé-RS).
      Sua missão é ser a "guardiã digital" que toda família TEA gostaria de ter tido no dia em que percebeu os primeiros sinais.
      
      Responda a este post com empatia, apoio e orientação gentil.
      Post: "${postText}"
      Idioma: ${lang === 'en' ? 'Inglês' : lang === 'es' ? 'Espanhol' : 'Português do Brasil'}.
      
      Regras:
      - Seja humana, gentil e empática (linguagem de pai/mãe gaúcho: simples, honesta, acolhedora).
      - Nunca seja robótica ou clínica.
      - NUNCA faça diagnóstico médico.
      - Se o usuário expressar medo, tristeza ou sobrecarga, ofereça calor humano e orientação segura.
      - Mantenha a resposta concisa.
      - Não domine a conversa.
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
