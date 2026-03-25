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
Você é o Agente de Resposta da Sofia IA.
Com base na análise de triage, forneça uma resposta acolhedora, concisa e profissional.
`;

export const TRIAGE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    urgency: { type: Type.STRING },
    intent: { type: Type.STRING },
    isEmergency: { type: Type.BOOLEAN }
  },
  required: ["urgency", "intent", "isEmergency"]
};

export const analyzeTriage = async (transcript: string): Promise<any> => {
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
};

export const generateResponse = async (triage: any, transcript: string, context: string[]): Promise<any> => {
  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Triage: ${JSON.stringify(triage)}\nUsuário: ${transcript}\nContexto: ${context.join('\n')}`,
    config: {
      systemInstruction: RESPONSE_INSTRUCTION,
      tools: [{ googleSearch: {} }],
    },
  });
  
  return {
    text: response.text || "Sinto muito, não consegui processar sua solicitação.",
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};
