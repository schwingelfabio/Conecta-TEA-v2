import React from 'react';
import { motion } from 'framer-motion';
import { Brain, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../lib/monitoring';

export default function TriagemTeaIa() {
  const { t } = useTranslation();

  React.useEffect(() => {
    trackEvent('triagem_open');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-sky-100 border border-sky-50 text-center">
          <div className="w-24 h-24 bg-sky-100 rounded-3xl flex items-center justify-center text-sky-500 mx-auto mb-8 shadow-inner">
            <Brain size={48} />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            {t('triagem.title').split(' ').map((word, i, arr) => 
              i === arr.length - 2 || i === arr.length - 1 ? <span key={i} className="text-sky-500">{word} </span> : word + ' '
            )}
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            {t('triagem.subtitle')}
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
            <div className="bg-sky-50 p-6 rounded-3xl">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-sky-500 mb-4 shadow-sm">
                <Sparkles size={24} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{t('triagem.feature1Title')}</h3>
              <p className="text-slate-600 text-sm">{t('triagem.feature1Desc')}</p>
            </div>
            
            <div className="bg-emerald-50 p-6 rounded-3xl">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 mb-4 shadow-sm">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{t('triagem.feature2Title')}</h3>
              <p className="text-slate-600 text-sm">{t('triagem.feature2Desc')}</p>
            </div>
            
            <div className="bg-amber-50 p-6 rounded-3xl">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 mb-4 shadow-sm">
                <ArrowRight size={24} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{t('triagem.feature3Title')}</h3>
              <p className="text-slate-600 text-sm">{t('triagem.feature3Desc')}</p>
            </div>
          </div>

          <a 
            href="https://sites.google.com/view/triagemteaia/portugu%C3%AAs" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={() => trackEvent('triagem_start')}
            className="inline-flex items-center justify-center gap-3 bg-sky-500 text-white px-8 py-5 rounded-2xl font-bold text-xl hover:bg-sky-600 transition-all shadow-xl shadow-sky-200 hover:-translate-y-1 active:scale-95 w-full md:w-auto"
          >
            {t('triagem.cta')}
            <ArrowRight size={24} />
          </a>
          
          <p className="mt-6 text-sm text-slate-500">
            {t('triagem.disclaimer')}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
