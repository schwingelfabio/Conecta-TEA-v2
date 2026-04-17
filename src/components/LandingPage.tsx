import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShieldCheck, Crown, Heart, Zap, ExternalLink, X, Copy, Check, ArrowRight, MapPin, Activity, BookOpen, Search, Shield, Smartphone, HeartHandshake } from 'lucide-react';
import AuthForm from './AuthForm';
import LanguageSelector from './LanguageSelector';
import Logo from './Logo';
import { useTranslation } from 'react-i18next';

interface LandingPageProps {
  onLogin: () => void;
  onShowTerms: () => void;
  onGuestLogin: () => void;
}

function SupportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const pixKey = "01244056065";

  const copyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <h3 className="text-2xl font-bold text-gray-900 mb-6 pr-8">
          {t('supportModal.title')}
        </h3>

        <div className="space-y-4">
          <div className="p-6 bg-sky-50 rounded-2xl border border-sky-100">
            <p className="text-sm font-bold text-sky-700 uppercase tracking-wider mb-3">{t('supportModal.pixLabel')}</p>
            <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-sky-200">
              <code className="text-sky-900 font-mono text-sm">{pixKey}</code>
              <button 
                onClick={copyPix}
                className="p-2 hover:bg-sky-50 rounded-lg transition-colors text-sky-600"
                title="Copiar chave Pix"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
            <p className="text-xs text-sky-600 mt-3 italic">
              {t('supportModal.pixDesc')}
            </p>
          </div>

          <a 
            href="https://www.paypal.com/donate/?hosted_button_id=QFNBCLB7HH3QE"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 bg-[#0070ba] text-white rounded-2xl font-bold hover:bg-[#005ea6] transition-colors shadow-lg shadow-blue-100"
          >
            <ExternalLink size={20} />
            {t('supportModal.paypalButton')}
          </a>
        </div>

        <p className="mt-6 text-center text-gray-500 text-sm">
          {t('supportModal.footer')}
        </p>
      </motion.div>
    </div>
  );
}

export default function LandingPage({ onLogin, onShowTerms, onGuestLogin }: LandingPageProps) {
  const { t, i18n } = useTranslation();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMainAction = async () => {
    setIsEntering(true);
    await onGuestLogin();
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 pb-20 md:pb-0 relative">
      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-16 overflow-hidden px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-brand-primary/20 rounded-full blur-[80px] mix-blend-multiply"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-brand-secondary/20 rounded-full blur-[80px] mix-blend-multiply"></div>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8 flex justify-center">
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-[2.5rem] shadow-2xl bg-white border border-slate-100 flex items-center justify-center p-4 transform hover:scale-105 transition-transform duration-300">
                <Logo size="xl" showText={false} />
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-brand-dark mb-6 tracking-tight leading-[1.2]">
              Descobriu os sinais de autismo e não sabe o que fazer? Nós seguramos a sua mão.
            </h1>

            <div className="space-y-4 mb-8">
              <p className="text-lg md:text-xl font-bold font-sans text-brand-primary bg-brand-primary/10 inline-block px-6 py-2 rounded-full border border-brand-primary/20">
                {t('landing.hero.badge')}
              </p>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed px-2 font-medium">
                Receba orientação imediata, apoio psicológico para você e o primeiro mapa prático do que fazer hoje. Sem jargão médico. De pais para pais.
              </p>
            </div>

            {showAuthForm ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 max-w-md mx-auto bg-white p-4 rounded-[2.5rem] shadow-2xl border border-slate-100"
              >
                <AuthForm onSuccess={onLogin} onShowTerms={onShowTerms} />
                <button
                  onClick={() => setShowAuthForm(false)}
                  className="mb-6 text-slate-500 hover:text-slate-700 font-medium transition-colors"
                >
                  {t('common.back')}
                </button>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 w-full max-w-md mx-auto">
                <button
                  onClick={() => setIsSupportModalOpen(true)}
                  className="w-full px-8 py-4 bg-[#FEA6CC] text-[#0F2F4A] rounded-2xl font-bold text-lg shadow-lg shadow-[#FEA6CC]/30 flex items-center justify-center gap-2 hover:bg-pink-400 transition-colors"
                >
                  <Heart size={20} className="fill-[#0F2F4A] text-[#0F2F4A]" />
                  {i18n.language === 'en' ? 'Support this project ❤️' : 'Apoie este projeto ❤️'}
                </button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{ boxShadow: ["0px 0px 0px rgba(19, 131, 164, 0)", "0px 0px 20px rgba(19, 131, 164, 0.4)", "0px 0px 0px rgba(19, 131, 164, 0)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  onClick={handleMainAction}
                  disabled={isEntering}
                  className="w-full px-8 py-5 bg-brand-primary text-white rounded-2xl font-bold text-xl shadow-lg shadow-brand-primary/30 flex items-center justify-center gap-2 hover:bg-opacity-90"
                >
                  {isEntering ? (i18n.language === 'en' ? 'Entering...' : 'Entrando...') : 'Receber meu primeiro mapa agora (Grátis)'}
                  {!isEntering && <ArrowRight size={20} />}
                </motion.button>

                <button
                  onClick={() => {
                    setShowAuthForm(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-brand-primary font-bold text-base hover:underline mt-2"
                >
                  {i18n.language === 'en' ? 'Already have an account? Log in' : 'Já tem uma conta? Entrar'}
                </button>

                <div className="flex flex-col items-center gap-3 mt-4 w-full">
                  <div className="flex items-center gap-3 text-brand-dark font-medium text-sm bg-white shadow-sm px-5 py-4 rounded-xl w-full justify-center border border-slate-100">
                    <Zap size={20} className="text-amber-500 drop-shadow-sm" />
                    {t('landing.hero.feature1')}
                  </div>
                  <div className="flex items-center gap-3 text-brand-dark font-medium text-sm bg-white shadow-sm px-5 py-4 rounded-xl w-full justify-center text-center border border-slate-100">
                    <ShieldCheck size={20} className="text-emerald-500 shrink-0 drop-shadow-sm" />
                    {t('landing.hero.feature2')}
                  </div>
                </div>

                <div className="mt-6 flex flex-col items-center gap-2">
                  <p className="text-sm text-slate-500 font-semibold bg-slate-100 px-4 py-1 rounded-full">
                    {t('landing.hero.socialProof')}
                  </p>
                  <p className="text-xs text-slate-400 font-medium italic border-b border-slate-200 pb-1 pt-1">
                    {t('landing.hero.warning')}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* BLOCO COMO FUNCIONA */}
      <section className="py-16 bg-slate-50 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">{t('landing.howItWorks.title')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-6 shadow-md border-4 border-sky-50">
                <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80" alt="Triagem" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{t('landing.howItWorks.step1.title')}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t('landing.howItWorks.step1.desc')}
              </p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-6 shadow-md border-4 border-purple-50">
                <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=400&q=80" alt="Comunidade" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{t('landing.howItWorks.step2.title')}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t('landing.howItWorks.step2.desc')}
              </p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-6 shadow-md border-4 border-emerald-50">
                <img src="https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=400&q=80" alt="Segurança" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{t('landing.howItWorks.step3.title')}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t('landing.howItWorks.step3.desc')}
              </p>
            </div>
          </div>
          
          <div className="flex justify-center mt-12">
            <button
              onClick={handleMainAction}
              disabled={isEntering}
              className="px-8 py-5 bg-brand-primary/10 text-brand-primary rounded-2xl font-bold text-lg hover:bg-brand-primary hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {isEntering ? (i18n.language === 'en' ? 'Entering...' : 'Entrando...') : t('landing.hero.cta')}
              {!isEntering && <ArrowRight size={20} />}
            </button>
          </div>
        </div>
      </section>

      {/* BLOCO DE IDENTIFICAÇÃO */}
      <section className="py-16 bg-white px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-sky-50 rounded-[2.5rem] p-8 md:p-12 border border-sky-100">
            <div className="text-center mb-10">
              <p className="text-sky-600 font-bold mb-3 uppercase tracking-wider text-sm">{t('landing.whyUs.badge')}</p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">{t('landing.whyUs.title')}</h2>
            </div>
            
            <div className="space-y-4 max-w-xl mx-auto mb-10">
              <div className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-sm">
                <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center shrink-0">
                  <Check size={18} />
                </div>
                <p className="text-slate-700 font-medium pt-1">{t('landing.whyUs.item1')}</p>
              </div>
              
              <div className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-sm">
                <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center shrink-0">
                  <Check size={18} />
                </div>
                <p className="text-slate-700 font-medium pt-1">{t('landing.whyUs.item2')}</p>
              </div>
              
              <div className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-sm">
                <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center shrink-0">
                  <Check size={18} />
                </div>
                <p className="text-slate-700 font-medium pt-1">{t('landing.whyUs.item3')}</p>
              </div>
              
              <div className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-sm">
                <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center shrink-0">
                  <Check size={18} />
                </div>
                <p className="text-slate-700 font-medium pt-1">{t('landing.whyUs.item4')}</p>
              </div>

              <div className="flex items-start gap-4 bg-sky-500 p-5 rounded-2xl shadow-md mt-6">
                <div className="w-8 h-8 bg-white text-sky-600 rounded-full flex items-center justify-center shrink-0">
                  <Search size={18} />
                </div>
                <p className="text-white font-bold pt-1 text-lg">{t('landing.whyUs.highlight')}</p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleMainAction}
                disabled={isEntering}
                className="w-full sm:w-auto px-8 py-4 bg-sky-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-sky-500/30 hover:bg-sky-600 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isEntering ? (i18n.language === 'en' ? 'Entering...' : 'Entrando...') : t('landing.hero.cta')}
                {!isEntering && <ArrowRight size={20} />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO DE BENEFÍCIOS */}
      <section className="py-16 bg-slate-50 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">{t('landing.features.title')}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80" alt="Map" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{t('landing.features.item1.title')}</h3>
                <p className="text-slate-500 text-sm">{t('landing.features.item1.desc')}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80" alt="Book" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{t('landing.features.item2.title')}</h3>
                <p className="text-slate-500 text-sm">{t('landing.features.item2.desc')}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80" alt="Activity" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{t('landing.features.item3.title')}</h3>
                <p className="text-slate-500 text-sm">{t('landing.features.item3.desc')}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=400&q=80" alt="AI Robot" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">{t('landing.features.item4.title')}</h3>
                <p className="text-slate-500 text-sm">{t('landing.features.item4.desc')}</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleMainAction}
              className="px-8 py-4 bg-sky-100 text-sky-700 rounded-2xl font-bold text-lg hover:bg-sky-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {t('landing.hero.cta')}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* BLOCO DE IMPACTO */}
      <section className="py-16 bg-sky-500 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-black text-white mb-6 leading-tight">
            {t('landing.impact.title')}
          </h2>
          
          <div className="bg-white/20 inline-block px-6 py-4 rounded-2xl mb-8 border border-white/30 shadow-inner">
            <p className="text-white text-xl md:text-2xl font-bold">
              {t('landing.impact.highlight')}
            </p>
          </div>

          <p className="text-sky-100 text-lg mb-10">
            {t('landing.impact.subtitle')}
          </p>
          
          <button
            onClick={handleMainAction}
            disabled={isEntering}
            className="w-full sm:w-auto px-10 py-5 bg-white text-sky-600 rounded-2xl font-bold text-xl shadow-xl hover:bg-sky-50 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto"
          >
            {isEntering ? (i18n.language === 'en' ? 'Entering...' : 'Entrando...') : t('landing.hero.cta')}
            {!isEntering && <ArrowRight size={20} />}
          </button>
        </div>
      </section>

      {/* BLOCO DE CONFIANÇA */}
      <section className="py-16 bg-white px-4 text-center border-b border-slate-100">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="flex -space-x-4">
              <div className="w-12 h-12 rounded-full border-2 border-white bg-sky-100 flex items-center justify-center"><Heart size={20} className="text-sky-500" /></div>
              <div className="w-12 h-12 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center"><Users size={20} className="text-purple-500" /></div>
              <div className="w-12 h-12 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center"><Shield size={20} className="text-emerald-500" /></div>
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
            {t('landing.trust.title')}
          </h2>
          <p className="text-slate-500 font-medium mb-6">
            {t('landing.trust.subtitle')}
          </p>
          
          <div className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-50 px-5 py-3 rounded-full text-sm font-bold border border-emerald-100 mb-8">
            <ShieldCheck size={18} />
            {t('landing.trust.badge')}
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleMainAction}
              className="px-8 py-4 bg-sky-100 text-sky-700 rounded-2xl font-bold text-lg hover:bg-sky-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {t('landing.hero.cta')}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* BLOCO FINAL (CTA) */}
      <section className="py-20 bg-slate-50 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            {t('landing.finalCta.title')}
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            {t('landing.finalCta.subtitle')}
          </p>
          
          <p className="text-lg font-bold text-amber-600 mb-8">
            {t('landing.finalCta.warning')}
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={{ boxShadow: ["0px 0px 0px rgba(14, 165, 233, 0)", "0px 0px 20px rgba(14, 165, 233, 0.5)", "0px 0px 0px rgba(14, 165, 233, 0)"] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={handleMainAction}
            disabled={isEntering}
            className="w-full sm:w-auto px-10 py-5 bg-sky-500 text-white rounded-2xl font-bold text-xl shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 mx-auto"
          >
            {isEntering ? (i18n.language === 'en' ? 'Entering...' : 'Entrando...') : t('landing.hero.cta')}
            {!isEntering && <ArrowRight size={20} />}
          </motion.button>
        </div>
      </section>

      <footer className="py-8 bg-white text-center pb-28 md:pb-8">
        <SupportModal 
          isOpen={isSupportModalOpen} 
          onClose={() => setIsSupportModalOpen(false)} 
        />
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <button onClick={() => setIsSupportModalOpen(true)} className="text-sm font-medium hover:text-sky-500 transition-colors flex items-center gap-2">
            <Heart size={16} className="text-emerald-500" />
            {t('landing.footer.support')}
          </button>
          <p className="text-sm">© {new Date().getFullYear()} Conecta TEA.</p>
          <button onClick={onShowTerms} className="text-xs hover:text-sky-500 transition-colors">
            {t('landing.footer.terms')}
          </button>
        </div>
      </footer>
    </div>
  );
}
