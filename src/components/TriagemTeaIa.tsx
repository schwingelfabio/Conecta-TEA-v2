import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ArrowRight, CheckCircle2, Lock, Unlock, Zap, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../lib/monitoring';

export default function TriagemTeaIa() {
  const { t, i18n } = useTranslation();
  const [step, setStep] = useState(1);
  const [childName, setChildName] = useState('');
  const [concern, setConcern] = useState('');

  const nextStep = () => {
    trackEvent(`triagem_step_${step}_completed`);
    setStep(step + 1);
  };

  const concerns = [
    { id: 'comportamento', label: 'Comportamento e Agressividade' },
    { id: 'fala', label: 'Atraso na Fala e Comunicação' },
    { id: 'crises', label: 'Crises de Choro e Sobrecarga' },
    { id: 'desespero', label: 'Desespero total, não sei por onde começar' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 flex flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-xl text-center"
          >
            <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-sky-500 fill-sky-500" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 mb-4">
              Oi. Eu sou a Sofia. Eu sei que você está cansado(a).
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Respire fundo. Você não precisa mais passar por isso sozinho(a). Você está em um lugar seguro agora. Para eu te ajudar, qual é o nome da sua criança?
            </p>
            <input 
              type="text" 
              placeholder="Nome da criança..." 
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="w-full text-center text-xl p-4 border border-slate-200 rounded-2xl mb-8 focus:ring-2 focus:ring-sky-500 outline-none"
            />
            <button 
              disabled={!childName}
              onClick={nextStep}
              className="w-full bg-sky-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-sky-600 disabled:opacity-50 transition-all"
            >
              Continuar <ArrowRight className="inline ml-2" />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="max-w-xl w-full bg-white rounded-3xl p-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
              O que mais está tirando o seu sono em relação {childName ? `ao/à ${childName}` : 'à criança'} hoje?
            </h2>
            <div className="space-y-3 mb-8">
              {concerns.map(c => (
                <button
                  key={c.id}
                  onClick={() => { setConcern(c.id); nextStep(); }}
                  className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50 transition-all font-medium text-slate-700 flex justify-between items-center group"
                >
                  {c.label}
                  <ArrowRight className="text-slate-300 group-hover:text-sky-500 h-5 w-5" />
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full"
          >
            {/* O Alívio */}
            <div className="bg-white rounded-3xl p-8 shadow-xl mb-8 text-center border-t-8 border-sky-400">
              <h2 className="text-3xl font-black text-slate-800 mb-4">
                Você não está falhando.
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Cuidar de uma criança que pensa diferente exige muito de nós. É normal sentir medo. Preparei um relatório de primeiros passos exclusivo para você e para {childName || 'sua criança'}.
              </p>
              
              <div className="bg-sky-50 p-6 rounded-2xl flex items-center justify-between text-left mb-6">
                <div>
                  <h4 className="font-bold text-sky-900 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-sky-500"/> Passo 1: Não entre em pânico</h4>
                  <p className="text-sm text-sky-700 mt-1">Sua primeira ação hoje é garantir a regulação. Tente criar um ambiente com luzes mais baixas...</p>
                </div>
              </div>

              {/* Blurred Paywall Area */}
              <div className="relative mt-8 group">
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent z-10 flex flex-col items-center justify-end pb-8">
                  <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-2xl max-w-sm text-center transform group-hover:scale-105 transition-transform">
                    <Lock className="w-8 h-8 mx-auto mb-3 text-amber-400" />
                    <h3 className="text-xl font-bold mb-2">
                      {i18n.language === 'en' ? 'Unlock Full Map' : 'Desbloquear Mapa Completo'}
                    </h3>
                    <p className="text-sm text-slate-300 mb-4">
                      {i18n.language === 'en' ? 'Get all steps, 24/7 chat with Sofia AI and SOS tools.' : 'Tenha acesso a todos os passos, chat 24h com a Sofia IA e ferramentas SOS.'}
                    </p>
                    <a 
                      href={i18n.language === 'en' ? 'https://buy.stripe.com/28E9AU1fH3zobvWfdx2wU01' : 'https://buy.stripe.com/cNi9AU4rT5HwfMc3uP2wU05'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="block w-full bg-amber-500 hover:bg-amber-600 text-slate-900 py-3 rounded-xl font-black text-lg"
                    >
                      {i18n.language === 'en' ? 'Become VIP (US$ 9.99/mo)' : 'Tornar-se VIP (R$ 49,90/mês)'}
                    </a>
                    <p className="text-xs text-slate-400 mt-3">
                      {i18n.language === 'en' ? 'Cancel anytime. Donations accepted.' : 'Cancele quando quiser. Doações também aceitas.'}
                    </p>
                  </div>
                </div>
                
                <div className="blur-sm opacity-50 space-y-4 pointer-events-none select-none">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-800">Passo 2: Entendendo a Comunicação</h4>
                    <p className="text-sm text-slate-500 mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in odio id est tristique mattis.</p>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h4 className="font-bold text-slate-800">Passo 3: Como agir em crises</h4>
                    <p className="text-sm text-slate-500 mt-2">Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
