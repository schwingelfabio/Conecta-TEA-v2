import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, ArrowRight, ShieldCheck, Sparkles, Heart, CreditCard, Copy, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '../lib/monitoring';
import { analytics } from '../services/logger';

export default function TriagemTeaIa() {
  const { t, i18n } = useTranslation();
  const [pixCopied, setPixCopied] = useState(false);

  const handleCopyPix = () => {
    navigator.clipboard.writeText('01244056065');
    setPixCopied(true);
    analytics.trackEvent('pix_copy_click');
    setTimeout(() => setPixCopied(false), 2000);
  };

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
            href="https://triagem-tea-ia-oficial.vercel.app/" 
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

        {/* Monetization Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 bg-gradient-to-br from-rose-50 to-orange-50 rounded-[3rem] p-8 md:p-12 shadow-xl shadow-rose-100 border border-rose-50 text-center"
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-rose-500 mx-auto mb-4 shadow-sm">
            <Heart className="w-8 h-8 fill-rose-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            {i18n.language === 'en' ? 'Support this project ❤️' : 'Apoie este projeto ❤️'}
          </h2>
          
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            {i18n.language === 'en' 
              ? 'Want Fábio (Victória\'s dad) to personally review your case for $19? Support this project so we can help more families.' 
              : 'Quer que o Fábio (pai da Victória) revise pessoalmente por R$ 97 via PIX? Apoie este projeto para ajudar mais famílias.'}
          </p>

          {i18n.language === 'en' ? (
            <div className="space-y-4">
              <a 
                href="https://buy.stripe.com/28E9AU1fH3zobvWfdx2wU01"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.trackEvent('donate_stripe_click')}
                className="inline-flex items-center justify-center gap-2 w-full max-w-sm py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 mx-auto"
              >
                <CreditCard className="w-5 h-5" />
                Support with Card / Donate
              </a>
              <p className="text-sm text-slate-500 font-medium">Cancel anytime. No risk.</p>
            </div>
          ) : (
            <div className="max-w-sm mx-auto bg-white p-6 rounded-2xl border border-rose-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">Pagamento via PIX</h3>
              <div className="space-y-2 mb-6 text-left">
                <p className="text-sm text-slate-600"><span className="font-semibold">CPF:</span> 01244056065</p>
                <p className="text-sm text-slate-600"><span className="font-semibold">Nome:</span> Fábio Palacio Schwingel</p>
              </div>
              <button 
                onClick={handleCopyPix}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-200"
              >
                {pixCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {pixCopied ? 'Chave copiada!' : 'Copiar chave PIX'}
              </button>
            </div>
          )}

          <p className="mt-8 text-sm font-medium text-slate-500 italic">
            {i18n.language === 'en' 
              ? 'Even a small support makes a big difference.' 
              : 'Qualquer valor já faz a diferença.'}
          </p>
        </motion.section>

      </motion.div>
    </div>
  );
}
