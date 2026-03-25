import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Info, HeartHandshake, Zap, BatteryWarning, HeartCrack, Search, HelpCircle, AlertTriangle } from 'lucide-react';
import { analytics } from '../../services/logger';

interface OnboardingProps {
  onStart: (initialMessage?: string) => void;
}

export default function Onboarding({ onStart }: OnboardingProps) {
  useEffect(() => {
    analytics.trackEvent('sofia_onboarding_viewed');
  }, []);

  const quickModes = [
    { text: 'Estou esgotado(a)', icon: BatteryWarning, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' },
    { text: 'Meu filho teve uma crise', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
    { text: 'Preciso desabafar', icon: HeartCrack, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' },
    { text: 'Acho que meu filho pode ter sinais', icon: Search, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100' },
    { text: 'Não sei o que fazer', icon: HelpCircle, color: 'text-sky-500', bg: 'bg-sky-50', border: 'border-sky-100' },
    { text: 'Quero ajuda agora', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
  ];

  const handleStart = (message?: string) => {
    analytics.trackEvent('sofia_onboarding_started', { initialMessage: message });
    onStart(message);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 py-12 bg-gradient-to-b from-sky-50 via-white to-purple-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center relative">
            <div className="absolute inset-0 bg-sky-200 rounded-full animate-ping opacity-20"></div>
            <HeartHandshake className="w-12 h-12 text-sky-500" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-slate-800 leading-tight">
            Você não precisa passar por isso sozinho(a).
          </h1>
          <p className="text-lg text-slate-600">
            Converse agora com uma assistente de IA que escuta, entende e ajuda você em tempo real.
          </p>
        </div>

        <div className="space-y-3 pt-4">
          <button
            onClick={() => handleStart()}
            className="w-full py-4 px-6 bg-sky-500 hover:bg-sky-600 text-white rounded-full font-semibold text-lg shadow-lg shadow-sky-200 transition-all flex items-center justify-center gap-2"
          >
            <Video className="w-5 h-5" />
            Iniciar conversa por voz
          </button>
          
          <button className="w-full py-4 px-6 bg-white hover:bg-slate-50 text-slate-600 rounded-full font-medium text-base border border-slate-200 transition-all flex items-center justify-center gap-2">
            <Info className="w-5 h-5" />
            Ver como funciona
          </button>
        </div>

        <div className="pt-8 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Atalhos Rápidos</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickModes.map((mode, index) => (
              <button
                key={index}
                onClick={() => handleStart(mode.text)}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border ${mode.bg} ${mode.border} hover:opacity-80 transition-opacity text-center gap-2`}
              >
                <mode.icon className={`w-6 h-6 ${mode.color}`} />
                <span className="text-xs font-semibold text-slate-700">{mode.text}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-8">
          A Sofia IA oferece apoio emocional e orientação inicial. Não substitui atendimento médico, psicológico ou de emergência.
        </p>
      </motion.div>
    </div>
  );
}
