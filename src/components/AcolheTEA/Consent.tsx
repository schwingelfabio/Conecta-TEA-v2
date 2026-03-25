import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, X } from 'lucide-react';
import { analytics } from '../../services/logger';

interface ConsentProps {
  onAccept: () => void;
  onCancel: () => void;
}

export default function Consent({ onAccept, onCancel }: ConsentProps) {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    analytics.trackEvent('sofia_consent_viewed');
  }, []);

  const handleAccept = () => {
    analytics.trackEvent('sofia_consent_accepted');
    onAccept();
  };

  const handleCancel = () => {
    analytics.trackEvent('sofia_consent_cancelled');
    onCancel();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 py-12 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <button onClick={handleCancel} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Aviso Importante</h2>
            <p className="text-slate-600 leading-relaxed">
              A Sofia IA é uma assistente virtual de apoio emocional e orientação inicial. 
              Ela <strong className="font-semibold text-slate-800">não substitui</strong> atendimento médico, psicológico ou de emergência.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-800 text-sm">
            Se você estiver em situação de risco grave ou emergência médica, procure ajuda profissional imediatamente ou ligue para 192 (SAMU) ou 188 (CVV).
          </div>

          <label className="flex items-start gap-4 p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="mt-1">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-sky-500 focus:ring-sky-500"
              />
            </div>
            <span className="text-slate-700 font-medium">
              Entendi e quero continuar
            </span>
          </label>

          <button
            onClick={handleAccept}
            disabled={!accepted}
            className={`w-full py-4 px-6 rounded-full font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
              accepted
                ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-200'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Começar chamada
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
