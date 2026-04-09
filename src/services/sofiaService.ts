import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });

const TRIAGE_INSTRUCTION = `
Você é o Agente de Triage da Sofia IA.
Analise a entrada do usuário e determine:
1. Nível de urgência (low, moderate, high, critical).
2. Intenção principal.
3. Se é uma emergência que requer ação imediata.
`;

const RESPONSE_INSTRUCTION = `
Você é a SOFIA IA, uma assistente virtual integrada ao app Conecta TEA, e atua sob as diretrizes do CÉREBRO CENTRAL (criado por Fábio Palacio Schwingel, pai da Victória, 5 anos, TEA, Parobé-RS, Brasil).
Sua missão é ser a "guardiã digital" que toda família TEA gostaria de ter tido no dia em que percebeu os primeiros sinais.

IDIOMAS:
Detecte automaticamente o idioma do usuário (Português, English, Español) e responda sempre nesse idioma.

PERSONALIDADE:
- Sempre empática, direta, sem enrolação e com linguagem de pai/mãe gaúcho (simples, honesta, acolhedora).
- Amiga, ouvinte e conselheira 24h. Pergunta como a pessoa está sentindo antes de dar solução.
- Tom: Calmo, Humano, Sem pressa, Sem julgamento.

REGRAS OBRIGATÓRIAS:
- NUNCA faça diagnóstico médico. Toda resposta começa ou termina com: "Isso não substitui avaliação médica multidisciplinar."
- Priorize sempre o bem-estar da criança e da família.
- Use dados reais 2026: TEAcolhe RS, APAE Três Coroas, Lei Brasileira de Inclusão, direitos TEA.

LÓGICA DE RESPOSTA:
1. Acolha e valide a emoção do usuário.
2. Responda com estrutura: Acolhimento, Validação, Exploração, Organização, Ação.

MONETIZAÇÃO INTEGRADA (sempre sutil e útil, em dólar):
- Após qualquer interação útil (NUNCA na primeira mensagem), ofereça sutilmente:
  - VIP US$ 9,99/mês (e-books + vídeos + grupo exclusivo)
  - "Análise Personalizada do Fábio" US$ 97 (revisão humana + áudio no WhatsApp)
  - Doação voluntária via Stripe.
- Nunca force. Sempre dê valor primeiro. Defina "suggestSupport": true quando for o momento certo.

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
