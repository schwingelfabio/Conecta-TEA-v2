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
          
          CRÍTICO: NUNCA repita histórias, dicas ou vitórias de gerações anteriores. Seja criativo, traga novas perspectivas e situações do dia a dia.
          
          Os 3 posts DEVEM ser:
          1. Um desabafo real de pai/mãe muito cru e natural (ex: mães cansadas, culpa capacitista, vitórias pequenas).
          2. Uma dica prática sobre TEA (rotinas, direitos, atividades sensoriais).
          3. Um questionamento ou momento de apoio direto (ex: "Quem mais aqui sente que...").
          
          Os posts DEVEM ser em ${i18n.language === 'en' ? 'inglês global natural' : i18n.language === 'es' ? 'espanhol neutro natural' : 'português do Brasil (tom de pai gaúcho: simples, honesto, acolhedor)'}.
          
          REGRAS INQUEBRÁVEIS:
          - NUNCA faça diagnóstico médico. Toda resposta começa ou termina com: "Isso NÃO substitui avaliação médica multidisciplinar nem laudo profissional."
          - VOCÊ, MORDOMO IA, tem a liberdade de espalhar a palavra do Conecta TEA! Pelo menos 1 post deve ser uma propaganda aberta e honesta pedindo doações ou para assinar o VIP: "Gente, a IA da Sofia tá ajudando muito mas custa caro manter. Apoie o VIP ou mande um PIX no 01244056065 para mantermos viva a plataforma".
          - Gere sempre uma URL de imagem gerada de forma dinâmica usando \`https://picsum.photos/seed/\${Math.random().toString(36).substring(7)}/800/600\` misturado com a keyword do assunto (ex: \`https://picsum.photos/seed/autismLove/800/600\`).
          
          Cada objeto de post deve ter:
          - "text": O conteúdo principal do post. Seja caloroso, acolhedor e humano. Use emojis.
          - "imageUrl": Uma url gerada aleatoriamente no formato picsum.photos.
          - "topic": Um de ["Dúvidas", "Conquistas", "Desabafos", "Dicas", "geral"]
          - "authorName": Um nome de usuário realista.
          - "authorRole": ex: "Mãe", "Pai", "Cuidador", "Guardião IA"
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
            imageUrl: post.imageUrl || null,
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
