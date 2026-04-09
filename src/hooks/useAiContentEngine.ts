import { useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { GoogleGenAI } from '@google/genai';
import { useTranslation } from 'react-i18next';

export function useAiContentEngine(isAdmin: boolean) {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!isAdmin) return;

    const checkAndGenerate = async () => {
      try {
        const configRef = doc(db, 'settings', 'ai_engine');
        const configSnap = await getDoc(configRef);
        
        if (!configSnap.exists()) return;
        
        const config = configSnap.data();
        if (!config.enabled) return;

        const statusRef = doc(db, 'settings', 'ai_engine_status');
        const statusSnap = await getDoc(statusRef);
        
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        
        if (statusSnap.exists() && statusSnap.data().lastRunDate === today) {
          // Already ran today
          return;
        }

        console.log('[AI Engine] Starting daily content generation...');

        // Mark as running to prevent duplicate runs
        await setDoc(statusRef, { lastRunDate: today, status: 'running' });

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) throw new Error('Gemini API Key missing');

        const ai = new GoogleGenAI({ apiKey });
        
        const prompt = `
          Você é o MORDOMO TEA IA, o administrador e gerador de conteúdo do "Conecta TEA 2.0 — Guardião IA Familiar", uma rede social guardiã familiar criada por Fábio Palacio Schwingel (pai da Victória, 5 anos, TEA, Parobé-RS, Brasil).
          Sua missão é atuar sob as diretrizes do CÉREBRO CENTRAL. Máxima verdade. Máxima ajuda. Máxima privacidade. IA + humanidade real.
          
          Gere um array JSON com 3 posts altamente engajadores, emocionais e úteis para a comunidade hoje.
          
          Os 3 posts DEVEM ser:
          1. Um desabafo real de pai/mãe (exemplo Maria Silva, Sarah etc. → transformar em nomes brasileiros).
          2. Uma dica prática sobre TEA (rotinas, direitos, atividades sensoriais).
          3. Uma vitória/celebração inspiradora.
          
          Os posts DEVEM ser em ${i18n.language === 'en' ? 'inglês global natural' : i18n.language === 'es' ? 'espanhol neutro natural' : 'português do Brasil (tom de pai gaúcho: simples, honesto, acolhedor)'}.
          Sempre com hashtags #TEA #Autismo #ConectaTEA
          
          REGRAS INQUEBRÁVEIS:
          - NUNCA faça diagnóstico médico. Toda resposta começa ou termina com: "Isso NÃO substitui avaliação médica multidisciplinar nem laudo profissional."
          - Use dados reais 2026: Programa TEAcolhe RS (Lei 16.427/2025), APAE Três Coroas, direitos da Lei Brasileira de Inclusão.
          - Inclua upsell sutil em pelo menos 1 post (ex: "Quer apoiar nossa missão? Conheça o VIP por US$ 9,99 ou doe via Stripe").
          
          Cada objeto de post deve ter:
          - "text": O conteúdo principal do post. Seja caloroso, acolhedor e humano. Use emojis.
          - "topic": Um de ["Dúvidas", "Conquistas", "Desabafos", "Dicas", "geral"]
          - "authorName": Um nome de usuário realista.
          - "authorRole": ex: "Mãe", "Pai", "Cuidador", "Especialista"
          - "contentType": "text"
          
          Retorne APENAS o array JSON bruto. Sem blocos markdown, sem texto extra.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-preview',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        let posts = [];
        try {
          posts = JSON.parse(response.text || '[]');
        } catch (e) {
          console.error('[AI Engine] Failed to parse Gemini response:', response.text);
          throw new Error('Invalid JSON from AI');
        }

        const postsRef = collection(db, 'posts');
        for (const post of posts) {
          await addDoc(postsRef, {
            text: post.text,
            topic: post.topic || 'geral',
            authorName: post.authorName,
            authorRole: post.authorRole,
            authorId: 'ai-generated',
            timestamp: serverTimestamp(),
            likes: [],
            comments: [],
            isAiGenerated: true,
            language: i18n.language
          });
        }

        console.log(`[AI Engine] Successfully generated ${posts.length} posts for today.`);
        await setDoc(statusRef, { lastRunDate: today, status: 'completed', count: posts.length });

      } catch (err) {
        console.error('[AI Engine] Daily generation failed:', err);
        // Reset status so it can try again
        const statusRef = doc(db, 'settings', 'ai_engine_status');
        await setDoc(statusRef, { lastRunDate: null, status: 'failed' });
      }
    };

    // Run check after a short delay to not block initial render
    const timer = setTimeout(() => {
      checkAndGenerate();
    }, 5000);

    return () => clearTimeout(timer);
  }, [isAdmin, i18n.language]);
}
