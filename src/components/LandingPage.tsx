import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, LogIn, ShieldCheck, MessageCircle, Crown, Heart, Zap, ExternalLink } from 'lucide-react';
import AuthForm from './AuthForm';
import DonationSupportCard from './DonationSupportCard';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

interface LandingPageProps {
  onLogin: () => void;
  onShowTerms: () => void;
  onGuestLogin: () => void;
}

export default function LandingPage({ onLogin, onShowTerms, onGuestLogin }: LandingPageProps) {
  const { t, i18n } = useTranslation();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false);

  const handleLoginClick = () => {
    if (!acceptedTerms) {
      alert(t('landing.termsAlert'));
      return;
    }
    setShowAuthForm(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-400 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-sky-500 border border-sky-50">
                  <Users size={48} />
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
              Conecta <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">TEA</span>
            </h1>

            <p className="text-2xl md:text-3xl font-bold text-gray-700 mb-8">
              {t('landing.title')}
            </p>

            <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-12 leading-relaxed">
              {t('landing.subtitle')}
            </p>

            {showAuthForm ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <AuthForm onSuccess={onLogin} />
                <button
                  onClick={() => setShowAuthForm(false)}
                  className="mt-6 text-gray-500 hover:text-gray-700 font-medium"
                >
                  {t('common.back')}
                </button>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                  <button
                    onClick={handleLoginClick}
                    className={`w-full sm:w-auto px-10 py-5 rounded-2xl font-bold text-xl shadow-lg hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 ${acceptedTerms ? 'bg-sky-500 text-white shadow-sky-200 hover:bg-sky-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    <LogIn size={24} />
                    {t('landing.login')}
                  </button>

                  <button
                    onClick={handleLoginClick}
                    className={`w-full sm:w-auto px-10 py-5 bg-white text-gray-900 border-2 border-gray-100 rounded-2xl font-bold text-xl shadow-md hover:bg-gray-50 hover:border-sky-100 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 ${!acceptedTerms ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {t('landing.createAccount')}
                  </button>

                  <button
                    onClick={() => {
                      if (!acceptedTerms) {
                        alert(t('landing.termsAlert'));
                        return;
                      }
                      onGuestLogin();
                    }}
                    className={`w-full sm:w-auto px-10 py-5 bg-slate-100 text-slate-700 rounded-2xl font-bold text-xl shadow-sm hover:bg-slate-200 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 ${!acceptedTerms ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Entrar como visitante
                  </button>

                  <a
                    href="https://sites.google.com/view/triagemteaia/portugu%C3%AAs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-10 py-5 bg-emerald-500 text-white rounded-2xl font-bold text-xl shadow-lg hover:bg-emerald-600 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    <ExternalLink size={22} />
                    {t('landing.triagemLink')}
                  </a>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 bg-white/50 p-3 rounded-xl border border-gray-100">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                  />
                  <label htmlFor="terms" className="cursor-pointer">
                    {t('landing.readAndAccept')}{' '}
                    <button onClick={onShowTerms} className="text-sky-500 font-bold hover:underline">
                      {t('landing.termsLink')}
                    </button>
                  </label>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mb-6">
                <Users size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('landing.features.communities.title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('landing.features.communities.desc')}
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <Crown size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('landing.features.vip.title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('landing.features.vip.desc')}
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{t('landing.features.triagem.title')}</h3>
              <p className="text-gray-600 leading-relaxed">
                {t('landing.features.triagem.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-50 text-sky-700 rounded-full font-bold text-sm mb-8">
            <Zap size={16} />
            {t('landing.network.badge')}
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-12">{t('landing.network.title')}</h2>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <Users size={40} />
            <Heart size={40} />
            <ShieldCheck size={40} />
            <MessageCircle size={40} />
          </div>
        </div>
      </section>

      <div className="px-4">
        <DonationSupportCard />
      </div>

      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl shadow-sky-200">
            <h2 className="text-4xl md:text-5xl font-black mb-8">{t('landing.cta.title')}</h2>
            <p className="text-xl text-sky-50 mb-12 max-w-2xl mx-auto">
              {t('landing.cta.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => {
                  if (!acceptedTerms) {
                    alert(t('landing.termsAlertTop'));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                  }
                  setShowAuthForm(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-12 py-5 rounded-2xl font-bold text-xl transition-colors shadow-xl ${acceptedTerms ? 'bg-white text-sky-600 hover:bg-sky-50' : 'bg-white/50 text-white cursor-not-allowed'}`}
              >
                {t('landing.cta.button')}
              </button>

              <a
                href="https://sites.google.com/view/triagemteaia/portugu%C3%AAs"
                target="_blank"
                rel="noopener noreferrer"
                className="px-12 py-5 rounded-2xl font-bold text-xl transition-colors shadow-xl bg-emerald-500 text-white hover:bg-emerald-600 inline-flex items-center justify-center gap-3"
              >
                <ExternalLink size={22} />
                {t('landing.cta.triagemButton')}
              </a>
            </div>

            {!acceptedTerms && (
              <p className="mt-4 text-sm text-sky-100 opacity-80">
                {t('landing.cta.termsHint')}
              </p>
            )}
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-4 text-gray-500">
          <p>{t('landing.footer.rights')}</p>
          <div className="flex items-center gap-4">
            <button onClick={onShowTerms} className="text-sm hover:text-sky-500 transition-colors">
              {t('landing.termsLink')}
            </button>
            {(i18n.language === 'en' || i18n.language === 'es') && (
              <>
                <span>•</span>
                <a 
                  href="https://www.paypal.com/donate/?hosted_button_id=QFNBCLB7HH3QE" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm hover:text-sky-500 transition-colors"
                >
                  {t('donation.footerLink')}
                </a>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
