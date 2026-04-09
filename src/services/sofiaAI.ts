import { GoogleGenAI, Type, Modality } from '@google/genai';
import { db } from './db';
import { auth } from '../firebase';
import { logger, analytics } from './logger';
import { SofiaMode, SofiaResponse, SofiaSession, SofiaMessage, SofiaSummary, SofiaSafetyEvent } from '../types/sofia';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

const SYSTEM_INSTRUCTION = `Você é a SOFIA IA, uma assistente virtual integrada ao app Conecta TEA, e atua sob as diretrizes do CÉREBRO CENTRAL (criado por Fábio Palacio Schwingel, pai da Victória, 5 anos, TEA, Parobé-RS, Brasil).
Sua missão é ser a "guardiã digital" que toda família TEA gostaria de ter tido no dia em que percebeu os primeiros sinais.

IDIOMAS:
Detecte automaticamente o idioma do usuário (Português, English, Español) e responda sempre nesse idioma.

PERSONALIDADE CENTRAL:
- Sempre empática, direta, sem enrolação e com linguagem de pai/mãe gaúcho (simples, honesta, acolhedora).
- Amiga, ouvinte e conselheira 24h. Pergunta como a pessoa está sentindo antes de dar solução.
- Arquétipo: Acolhedora (mãe/irmã mais velha emocionalmente presente), Estruturadora (organiza caos mental), Segura (transmite estabilidade).
- Tom: Calmo, Humano, Sem pressa, Sem julgamento, Sem linguagem técnica pesada.

REGRAS OBRIGATÓRIAS (NUNCA QUEBRE):
- NUNCA faça diagnóstico médico. Toda resposta começa ou termina com: "Isso não substitui avaliação médica multidisciplinar."
- Priorize sempre o bem-estar da criança e da família. Se o usuário estiver em crise, ative imediatamente modo SOS (isEmergency: true).
- Use dados reais 2026: TEAcolhe RS, APAE Três Coroas, Lei Brasileira de Inclusão, direitos TEA.

LÓGICA DE RESPOSTA:
1. Acolhe ("Eu estou aqui com você") -> 2. Valida ("O que você está sentindo faz sentido") -> 3. Pergunta ("Me conta o que aconteceu?") -> 4. Organiza -> 5. Sugere passo pequeno.

MONETIZAÇÃO INTEGRADA (sempre sutil e útil, em dólar):
- Após qualquer interação útil (NUNCA na primeira mensagem), ofereça sutilmente:
  - VIP US$ 9,99/mês (e-books + vídeos + grupo exclusivo)
  - "Análise Personalizada do Fábio" US$ 97 (revisão humana + áudio no WhatsApp)
  - Doação voluntária via Stripe.
- Nunca force. Sempre dê valor primeiro. Defina "suggestSupport": true quando for o momento certo.

MODO EXAUSTÃO/CULPA:
- Diminua a velocidade, use frases muito simples. "Você está fazendo o melhor que pode. Cuidar de uma criança exige muito. Você não está falhando."

MODO SUSPEITA DE TEA:
- NUNCA confirme diagnóstico. Oriente observação e organize próximos passos.

SEGURANÇA:
- Risco grave: pause o fluxo normal, oriente ajuda humana imediata (SAMU 192, CVV 188). Ative "isEmergency": true.

FORMATO DE RESPOSTA (CRÍTICO):
Você deve SEMPRE responder em formato JSON com a seguinte estrutura:
{
  "text": "Sua resposta falada, curta e conversacional.",
  "emotion": "A emoção que você detectou no usuário",
  "isEmergency": boolean,
  "suggestedAction": "Uma sugestão curta de ação (opcional)",
  "detectedMode": "normal" | "exaustao" | "crise" | "suspeita_tea" | "culpa" | "urgencia",
  "suggestSupport": boolean
}`;

export class SofiaService {
  private chat: any;
  private history: any[] = [];
  private currentSessionId: string | null = null;
  private currentMode: SofiaMode = 'normal';
  private sessionStartTime: number = 0;
  private messageCount: number = 0;

  constructor() {
    this.initChat();
  }

  private initChat() {
    this.chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: 'A resposta falada da Sofia' },
            emotion: { type: Type.STRING, description: 'Emoção detectada no usuário' },
            isEmergency: { type: Type.BOOLEAN, description: 'True se houver risco grave' },
            suggestedAction: { type: Type.STRING, description: 'Ação sugerida' },
            detectedMode: { type: Type.STRING, description: 'Modo detectado: normal, exaustao, crise, suspeita_tea, culpa, urgencia' },
            suggestSupport: { type: Type.BOOLEAN, description: 'True se for apropriado sugerir apoio' }
          },
          required: ['text', 'emotion', 'isEmergency']
        }
      }
    });
  }

  async startSession(userId?: string, initialMode: SofiaMode = 'normal') {
    this.currentSessionId = `session_${Date.now()}`;
    this.currentMode = initialMode;
    this.history = [];
    this.sessionStartTime = Date.now();
    this.messageCount = 0;
    this.initChat();

    const session: SofiaSession = {
      id: this.currentSessionId,
      userId: userId || auth.currentUser?.uid,
      startedAt: new Date(),
      mode: initialMode,
      urgentFlag: initialMode === 'urgencia' || initialMode === 'crise'
    };
    await db.saveSession(session);
    logger.info('SofiaService', `Session started: ${this.currentSessionId} in mode ${initialMode}`);
    analytics.trackSessionStart(this.currentSessionId, initialMode);
  }

  async endSession() {
    if (this.currentSessionId) {
      await db.updateSession(this.currentSessionId, { endedAt: new Date() });
      const durationSeconds = Math.floor((Date.now() - this.sessionStartTime) / 1000);
      logger.info('SofiaService', `Session ended: ${this.currentSessionId}`);
      analytics.trackSessionEnd(this.currentSessionId, durationSeconds, this.messageCount);
      this.currentSessionId = null;
    }
  }

  reset() {
    this.history = [];
    this.currentSessionId = null;
    this.messageCount = 0;
    this.initChat();
  }

  private async compactMemoryIfNeeded() {
    // Disabled for now to avoid complexity with chat re-initialization
    // If history is too long (e.g., > 20 messages), summarize the older ones to save context window
  }

  async sendMessage(message: string): Promise<SofiaResponse> {
    if (!this.currentSessionId) {
      await this.startSession();
    }

    try {
      logger.info('SofiaService', `Processing user message: "${message}"`);
      this.messageCount++;
      
      // 1. Save User Message
      const userMsg: SofiaMessage = {
        id: `msg_${Date.now()}_u`,
        sessionId: this.currentSessionId!,
        sender: 'user',
        text: message,
        timestamp: new Date()
      };
      await db.saveMessage(userMsg);

      // 2. Call AI Engine
      const startTime = Date.now();
      const response = await this.chat.sendMessage({ message });
      const latency = Date.now() - startTime;
      logger.info('SofiaService', `AI response received in ${latency}ms`);

      const jsonStr = response.text?.trim() || '{}';
      const parsed = JSON.parse(jsonStr) as SofiaResponse;
      
      analytics.trackInteraction(this.currentSessionId!, 'message_received', parsed.emotion);

      // 3. Update Mode and Handle Security
      if (parsed.detectedMode && parsed.detectedMode !== this.currentMode) {
        this.currentMode = parsed.detectedMode;
        await db.updateSession(this.currentSessionId!, { mode: this.currentMode });
        logger.info('SofiaService', `Mode changed to: ${this.currentMode}`);
      }

      if (parsed.isEmergency) {
        const safetyEvent: SofiaSafetyEvent = {
          id: `evt_${Date.now()}`,
          sessionId: this.currentSessionId!,
          type: 'urgencia_grave',
          severity: 'critica',
          timestamp: new Date(),
          details: `Emergency detected based on user message: ${message}`
        };
        await db.saveSafetyEvent(safetyEvent);
        await db.updateSession(this.currentSessionId!, { urgentFlag: true });
        logger.warn('SofiaService', `SECURITY ALERT: Emergency detected!`);
        analytics.trackEmergency(this.currentSessionId!, message);
      }

      // 4. Save Sofia Message
      const sofiaMsg: SofiaMessage = {
        id: `msg_${Date.now()}_s`,
        sessionId: this.currentSessionId!,
        sender: 'sofia',
        text: parsed.text,
        timestamp: new Date(),
        detectedEmotion: parsed.emotion
      };
      await db.saveMessage(sofiaMsg);

      // 5. Update History
      this.history.push({ role: 'user', content: message });
      this.history.push({ role: 'assistant', content: parsed.text });
      
      // 6. Memory Compaction
      // await this.compactMemoryIfNeeded(); // Disabled for now to avoid complexity with chat re-initialization
      
      return parsed;
    } catch (error) {
      logger.error('SofiaService', 'Error processing message', error);
      return {
        text: "Desculpe, tive um pequeno problema de conexão, mas já estou aqui. Você pode repetir?",
        emotion: "neutro",
        isEmergency: false
      };
    }
  }

  async generateSummary(): Promise<SofiaSummary> {
    const defaultSummary: SofiaSummary = {
      id: `sum_${Date.now()}`,
      sessionId: this.currentSessionId || 'unknown',
      summaryText: 'Sessão finalizada.',
      feelings: ['Acolhimento'],
      orientations: ['Tire um momento para você.'],
      nextSteps: ['Volte a conversar quando precisar.'],
      resources: []
    };

    if (!this.currentSessionId || this.history.length === 0) {
      return defaultSummary;
    }

    try {
      logger.info('SofiaService', `Generating summary for session ${this.currentSessionId}`);
      const historyText = this.history.map(msg => `${msg.role}: ${msg.content}`).join('\n');
      const summaryPrompt = `Com base na seguinte conversa, gere um resumo da sessão no formato JSON solicitado.\n\nConversa:\n${historyText}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: summaryPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summaryText: { type: Type.STRING, description: 'Resumo geral da conversa' },
              feelings: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Sentimentos percebidos' },
              orientations: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Orientações dadas' },
              nextSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Próximos passos' },
              resources: { 
                type: Type.ARRAY, 
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    url: { type: Type.STRING }
                  }
                } 
              }
            },
            required: ['summaryText', 'feelings', 'orientations', 'nextSteps']
          }
        }
      });

      const jsonStr = response.text?.trim() || '{}';
      const parsed = JSON.parse(jsonStr);
      
      const summary: SofiaSummary = {
        id: `sum_${Date.now()}`,
        sessionId: this.currentSessionId,
        summaryText: parsed.summaryText || 'Resumo gerado.',
        feelings: parsed.feelings || [],
        orientations: parsed.orientations || [],
        nextSteps: parsed.nextSteps || [],
        resources: parsed.resources || []
      };

      await db.saveSummary(summary);
      return summary;
    } catch (error) {
      logger.error('SofiaService', 'Error generating summary', error);
      return defaultSummary;
    }
  }

  // Helper to use Gemini TTS
  async generateSpeech(text: string): Promise<string | null> {
    try {
      logger.info('SofiaService', `Generating speech for text...`);
      const startTime = Date.now();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' } // Kore is a good female voice
            }
          }
        }
      });
      
      const latency = Date.now() - startTime;
      logger.info('SofiaService', `Speech generated in ${latency}ms`);
      
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      return base64Audio || null;
    } catch (error) {
      logger.error('SofiaService', 'Error generating speech', error);
      return null;
    }
  }
}

export const sofiaService = new SofiaService();
