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
          You are the lead content editor for "Conecta TEA", a global, premium social platform for autism support.
          Generate a JSON array of 3 highly engaging, emotional, and helpful social media posts for today.
          
          The 3 posts MUST be:
          1. An emotional story (relatable, empathetic).
          2. A practical autism tip (actionable, simple).
          3. A hope/positive outcome post (inspiring).
          
          Rotate topics daily among: Early signs, Communication, Sensory, Parenting struggles, Small wins.
          
          The posts MUST be in ${i18n.language === 'en' ? 'natural global English' : i18n.language === 'es' ? 'natural neutral Spanish' : 'natural Brazilian Portuguese'}.
          
          Each post object must have:
          - "text": The main content of the post. Make it warm, supportive, and human. Use emojis.
          - "topic": One of the rotating topics above.
          - "authorName": A realistic user name.
          - "authorRole": e.g., "Mãe", "Pai", "Cuidador", "Especialista"
          - "contentType": "text"
          
          Safety Rules:
          - No dangerous medical claims.
          - No false diagnosis language.
          - Non-clinical tone.
          
          Return ONLY the raw JSON array. No markdown blocks, no extra text.
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
