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
    setMessage(null);
    
    // Validation
    const postsPerDay = Number(config.postsPerDay);
    if (isNaN(postsPerDay) || postsPerDay < 1) {
      setMessage({ text: t('admin.errorInvalidPosts'), type: 'error' });
      setSaving(false);
      return;
    }

    let themes = config.priorityThemes.trim();
    if (!themes) {
      themes = i18n.language === 'pt' ? 'Primeiros sinais, Comunicação, Sensorial' :
               i18n.language === 'es' ? 'Signos tempranos, Comunicación, Sensorial' :
               'Early signs, Communication, Sensory';
      setConfig(prev => ({ ...prev, priorityThemes: themes }));
    }

    try {
      await setDoc(doc(db, 'settings', 'ai_engine'), { ...config, postsPerDay, priorityThemes: themes });
      setMessage({ text: t('admin.successSave'), type: 'success' });
    } catch (err) {
      console.error('Failed to save AI config to Firestore, using fallback:', err);
      localStorage.setItem('conecta_ai_config', JSON.stringify({ ...config, postsPerDay, priorityThemes: themes }));
      setMessage({ text: t('admin.successSave'), type: 'success' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleGenerateNow = async () => {
    setGenerating(true);
    setMessage(null);
    
    // Validation
    let themes = config.priorityThemes.trim();
    if (!themes) {
      themes = i18n.language === 'pt' ? 'Primeiros sinais, Comunicação, Sensorial' :
               i18n.language === 'es' ? 'Signos tempranos, Comunicación, Sensorial' :
               'Early signs, Communication, Sensory';
      setConfig(prev => ({ ...prev, priorityThemes: themes }));
    }

    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('TIMEOUT')), 15000)
    );

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) throw new Error('Gemini API Key missing');

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        Você é o MORDOMO TEA IA, o administrador e gerador de conteúdo do "Conecta TEA 2.0 — Guardião IA Familiar", uma rede social guardiã familiar criada por Fábio Palacio Schwingel (pai da Victória, 5 anos, TEA, Parobé-RS, Brasil).
        Sua missão é atuar sob as diretrizes do CÉREBRO CENTRAL. Máxima verdade. Máxima ajuda. Máxima privacidade. IA + humanidade real.
        
        Gere um array JSON com 3 posts altamente engajadores, emocionais e úteis para a comunidade.
        Os posts DEVEM ser em ${i18n.language === 'en' ? 'inglês global natural' : i18n.language === 'es' ? 'espanhol neutro natural' : 'português do Brasil (tom de pai gaúcho: simples, honesto, acolhedor)'}.
        Temas prioritários: ${themes}.
        
        CRÍTICO: NUNCA repita histórias, dicas ou vitórias de gerações anteriores. Seja criativo, traga novas perspectivas e situações do dia a dia.
        
        ESTILO DE POSTAGENS DA COMUNIDADE:
        - 70% conteúdo prático (dicas, rotinas, direitos, atividades sensoriais)
        - 20% desabafo real de pais (exemplo Maria Silva, Sarah etc. → transformar em nomes brasileiros)
        - 10% vitórias e celebrações
        - Sempre com hashtags #TEA #Autismo #ConectaTEA
        
        REGRAS INQUEBRÁVEIS:
        - NUNCA faça diagnóstico médico. Toda resposta começa ou termina com: "Isso NÃO substitui avaliação médica multidisciplinar nem laudo profissional."
        - Use dados reais 2026: Programa TEAcolhe RS (Lei 16.427/2025), APAE Três Coroas, direitos da Lei Brasileira de Inclusão.
        - Inclua upsell sutil em pelo menos 1 post (ex: "Quer apoiar nossa missão? Conheça o VIP por US$ 9,99 ou doe via Stripe").
        
        Cada objeto de post deve ter:
        - "text": O conteúdo principal do post. Seja caloroso, acolhedor e humano. Use emojis.
        - "topic": Um de ["Dúvidas", "Conquistas", "Desabafos", "Dicas", "geral"]
        - "authorName": Um nome de usuário realista.
        - "authorRole": ex: "Mãe", "Pai", "Cuidador", "Especialista"
        - "contentType": Um de ["text", "video_script", "educational_card", "engagement_question"]
        
        Retorne APENAS o array JSON bruto. Sem blocos markdown, sem texto extra.
      `;

      const generationTask = ai.models.generateContent({
        model: 'gemini-3.1-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const response = await Promise.race([generationTask, timeout]) as any;

      let posts = JSON.parse(response.text || '[]');
      
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

      setMessage({ text: t('admin.successGenerate', { count: posts.length }), type: 'success' });
      // Trigger feed refresh by dispatching a custom event
      window.dispatchEvent(new CustomEvent('refresh-feed'));
    } catch (err: any) {
      console.error('Generation failed:', err);
      
      if (err.message === 'TIMEOUT') {
        setMessage({ text: t('admin.errorTimeout'), type: 'error' });
      } else {
        setMessage({ text: t('admin.errorGenerate'), type: 'error' });
      }

      // Fallback content
      try {
        const postsRef = collection(db, 'posts');
        const fallbackPosts = [
          { text: i18n.language === 'pt' ? 'Dica do dia: Pequenas vitórias contam muito!' : i18n.language === 'es' ? 'Consejo del día: ¡Las pequeñas victorias cuentan mucho!' : 'Tip of the day: Small wins count a lot!', topic: 'conquistas', authorName: 'Sofia', authorRole: 'Assistente' },
          { text: i18n.language === 'pt' ? 'Alguém mais sente que o dia foi longo?' : i18n.language === 'es' ? '¿Alguien más siente que el día fue largo?' : 'Does anyone else feel like the day was long?', topic: 'geral', authorName: 'Mãe', authorRole: 'Mãe' },
          { text: i18n.language === 'pt' ? 'Dica de comunicação: Use cartões visuais.' : i18n.language === 'es' ? 'Consejo de comunicación: Use tarjetas visuales.' : 'Communication tip: Use visual cards.', topic: 'dicas', authorName: 'Especialista', authorRole: 'Especialista' }
        ];
        for (const post of fallbackPosts) {
          await addDoc(postsRef, {
            ...post,
            authorId: 'ai-generated-fallback',
            timestamp: serverTimestamp(),
            likes: [],
            comments: [],
            isAiGenerated: true,
            language: i18n.language
          });
        }
        window.dispatchEvent(new CustomEvent('refresh-feed'));
      } catch (fallbackErr) {
        console.error('Fallback generation failed:', fallbackErr);
      }
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
