import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Settings, Play, Pause, RefreshCw, CheckCircle, AlertCircle, Bot } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GoogleGenAI } from '@google/genai';

export default function AiContentAdmin() {
  const { t, i18n } = useTranslation();
  const [config, setConfig] = useState({
    enabled: false,
    postsPerDay: 5,
    priorityThemes: 'Early signs, Communication, Sensory',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const docRef = doc(db, 'settings', 'ai_engine');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setConfig(docSnap.data() as any);
        }
      } catch (err) {
        console.error('Failed to fetch AI config:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'ai_engine'), config);
      setMessage({ text: 'Configurações salvas com sucesso!', type: 'success' });
    } catch (err) {
      console.error('Failed to save AI config:', err);
      setMessage({ text: 'Erro ao salvar configurações.', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleGenerateNow = async () => {
    setGenerating(true);
    setMessage(null);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error('Gemini API Key missing');

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        You are the lead content editor for "Conecta TEA", a global, premium social platform for autism support.
        Generate a JSON array of 3 highly engaging, emotional, and helpful social media posts.
        The posts MUST be in ${i18n.language === 'en' ? 'natural global English' : i18n.language === 'es' ? 'natural neutral Spanish' : 'natural Brazilian Portuguese'}.
        Themes to prioritize: ${config.priorityThemes}.
        
        Include a diverse mix of content types:
        - Educational content (tips, routines, behavior understanding)
        - Emotional support ("You are not alone", hopeful stories)
        - Community questions (conversation starters, polls)
        - Viral/High-engagement (relatable parenting pain points)
        - Monetization-aware (soft prompts to support the mission, e.g., "Help us keep this free for families")
        - Video scripts (short 15-30s TikTok/Reels style scripts with hook and CTA)
        
        Each post object must have:
        - "text": The main content of the post. Make it warm, supportive, and human. Use emojis. If it's a video script, format it clearly with [HOOK], [BODY], [CTA].
        - "topic": One of ["Dúvidas", "Conquistas", "Desabafos", "Dicas", "geral"]
        - "authorName": A realistic user name from diverse cultures.
        - "authorRole": e.g., "Mãe", "Pai", "Cuidador", "Especialista"
        - "contentType": One of ["text", "video_script", "educational_card", "engagement_question"]
        
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
        console.error('Failed to parse Gemini response:', response.text);
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

      setMessage({ text: `${posts.length} posts gerados e publicados com sucesso!`, type: 'success' });
    } catch (err: any) {
      console.error('Generation failed:', err);
      setMessage({ text: `Erro na geração: ${err.message}`, type: 'error' });
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Carregando...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-4 pb-24"
    >
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">AI Content Engine</h2>
            <p className="text-sm text-slate-500">Gerador automático de conteúdo</p>
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-xl mb-6 flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900">Auto-Posting Diário</h3>
              <p className="text-sm text-slate-500">Publicar conteúdo automaticamente todos os dias</p>
            </div>
            <button
              onClick={() => setConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
              className={`w-14 h-8 rounded-full transition-colors relative ${config.enabled ? 'bg-indigo-500' : 'bg-slate-300'}`}
            >
              <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${config.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Posts por dia ({config.postsPerDay})
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={config.postsPerDay}
              onChange={(e) => setConfig(prev => ({ ...prev, postsPerDay: parseInt(e.target.value) }))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Temas Prioritários
            </label>
            <textarea
              value={config.priorityThemes}
              onChange={(e) => setConfig(prev => ({ ...prev, priorityThemes: e.target.value }))}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
              rows={3}
              placeholder="Ex: Sinais precoces, Dicas de comunicação..."
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar Configurações'}
            </button>
            <button
              onClick={handleGenerateNow}
              disabled={generating}
              className="flex-1 bg-indigo-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
            >
              {generating ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <>
                  <Play size={20} />
                  Gerar Agora
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
