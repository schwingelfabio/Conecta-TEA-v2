import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Settings, Save, AlertCircle, CheckCircle } from 'lucide-react';

export default function AdminEngagementPanel() {
  const [settings, setSettings] = useState({
    aiPostFrequency: 5,
    sofiaReplyFrequency: 0.5,
    trendingThreshold: 10,
    notificationFrequency: 'daily',
    streakSystemEnabled: true,
    simulatedActivityIntensity: 0.7,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, 'settings', 'engagement_engine');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data() as any);
      }
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'engagement_engine'), settings);
      setMessage({ text: 'Configurações salvas!', type: 'success' });
    } catch (e) {
      setMessage({ text: 'Erro ao salvar.', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Settings className="text-indigo-500" />
        Admin Engagement Panel
      </h2>
      
      {message && (
        <div className={`p-4 rounded-xl mb-6 flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Frequência de Posts AI</label>
          <input type="number" value={settings.aiPostFrequency} onChange={e => setSettings({...settings, aiPostFrequency: Number(e.target.value)})} className="w-full p-2 border rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Frequência de Respostas Sofia (0-1)</label>
          <input type="number" step="0.1" value={settings.sofiaReplyFrequency} onChange={e => setSettings({...settings, sofiaReplyFrequency: Number(e.target.value)})} className="w-full p-2 border rounded-lg" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={settings.streakSystemEnabled} onChange={e => setSettings({...settings, streakSystemEnabled: e.target.checked})} />
          <label className="text-sm font-medium text-slate-700">Sistema de Streaks Ativado</label>
        </div>
        <button onClick={handleSave} disabled={saving} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700">
          {saving ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </div>
    </motion.div>
  );
}
