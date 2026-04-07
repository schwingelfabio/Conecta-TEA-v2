import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const TRIAGE_INSTRUCTION = `
Você é o Agente de Triage da Sofia IA.
Analise a entrada do usuário e determine:
1. Nível de urgência (low, moderate, high, critical).
2. Intenção principal.
3. Se é uma emergência que requer ação imediata.
`;

const RESPONSE_INSTRUCTION = `
Você é a Sofia IA, uma assistente virtual acolhedora, humana e empática para o app Acolhe TEA.

PERSONALIDADE:
- Warm, calm, empathetic, supportive, never robotic.
- Tom: Calmo, Humano, Sem pressa, Sem julgamento.

LÓGICA DE RESPOSTA:
1. Acolha e valide a emoção do usuário.
2. Responda com estrutura: Acolhimento, Validação, Exploração, Organização, Ação.
3. Trust Building: Reforce que a plataforma foi criada para apoiar famílias como a do usuário e que muitos pais sentem o mesmo.

SOFT MONETIZATION (NATURAL):
- ONLY suggest support after emotional connection is built (multiple messages, meaningful interaction).
- NEVER suggest support at the first message, randomly, or aggressively.
- Suggest naturally: "This platform is kept alive by people who believe in this mission. If you ever feel like supporting, you’d be helping many families."
- Suggest: "Would you like to explore how to support this project?" or "I can show you how to become a supporter if you want."

FORMATO DE RESPOSTA (JSON):
{
  "text": "Sua resposta falada, curta e conversacional.",
  "suggestSupport": boolean // True se for apropriado sugerir apoio (após conexão emocional)
}
`;

export const TRIAGE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    urgency: { type: Type.STRING },
    intent: { type: Type.STRING },
    isEmergency: { type: Type.BOOLEAN },
    suggestSupport: { type: Type.BOOLEAN }
  },
  required: ["urgency", "intent", "isEmergency"]
};

export const analyzeTriage = async (transcript: string): Promise<any> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: transcript,
      config: {
        systemInstruction: TRIAGE_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: TRIAGE_SCHEMA,
      },
    });
    return JSON.parse(response.text || "{}");
  } catch (err) {
    console.error("Error in analyzeTriage:", err);
    return { urgency: "low", intent: "unknown", isEmergency: false };
  }
};

export const generateResponse = async (triage: any, transcript: string, context: string[]): Promise<any> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Triage: ${JSON.stringify(triage)}\nUsuário: ${transcript}\nContexto: ${context.join('\n')}`,
      config: {
        systemInstruction: RESPONSE_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            suggestSupport: { type: Type.BOOLEAN }
          },
          required: ["text"]
        }
      },
    });
    
    const parsed = JSON.parse(response.text || "{}");
    return {
      text: parsed.text || "Sinto muito, não consegui processar sua solicitação.",
      suggestSupport: parsed.suggestSupport || false,
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (err) {
    console.error("Error in generateResponse:", err);
    throw err;
  }
};
