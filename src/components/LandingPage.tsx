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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 md:pb-0 relative overflow-x-hidden">
      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 overflow-hidden px-4 bg-gradient-to-b from-brand-primary/20 via-[#a78bfa]/10 to-transparent">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-60">
          <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] bg-brand-primary/30 rounded-full blur-[80px] mix-blend-multiply"></div>
          <div className="absolute top-[20%] right-[-10%] w-[250px] h-[250px] bg-brand-secondary/20 rounded-full blur-[80px] mix-blend-multiply"></div>
        </div>

        <div className="max-w-md mx-auto text-center mt-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Fake NavBar just for aesthetic visualization */}
            <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-sm mb-6 border border-slate-100">
              <Logo size="sm" showText={false} className="w-8 h-8 focus:outline-none" />
              <div className="flex gap-4 text-slate-400">
                 <Home size={20} />
                 <Heart size={20} />
                 <MessageCircle size={20} />
              </div>
              <div className="w-8 h-8 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80" alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="w-full relative rounded-3xl overflow-hidden shadow-2xl mb-8 aspect-[4/5] border-4 border-white">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent z-10" />
              <img 
                src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Mãe brasileira abraçando filho no RS com alívio" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <h1 className="text-[28px] leading-tight font-black text-brand-dark mb-4 tracking-tight">
              Descobriu os sinais de autismo e não sabe por onde começar?
              <span className="block mt-2 text-brand-primary">Nós seguramos a sua mão desde o primeiro dia.</span>
            </h1>

            <p className="text-sm text-slate-600 mb-8 font-medium px-2 leading-relaxed">
              Mapa prático grátis • Sofia IA • Comunidade de famílias reais no Brasil • Robô de apoio
            </p>

            {showAuthForm ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-white p-6 rounded-3xl shadow-xl border border-slate-100"
              >
                <AuthForm onSuccess={onLogin} onShowTerms={onShowTerms} />
                <button
                  onClick={() => setShowAuthForm(false)}
                  className="mt-6 text-slate-500 hover:text-slate-700 font-medium transition-colors"
                >
                  Voltar
                </button>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 w-full px-2">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleMainAction}
                  disabled={isEntering}
                  className="w-full px-6 py-4 bg-brand-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand-primary/30 flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all"
                >
                  {isEntering ? 'Entrando...' : 'Receber meu primeiro mapa agora (Grátis)'}
                </motion.button>

                <button
                  onClick={() => {
                    setShowAuthForm(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full px-6 py-4 bg-white text-brand-dark rounded-2xl font-bold text-[17px] border-2 border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-all"
                >
                  Já tenho conta → Entrar
                </button>

                <p className="text-[11px] text-slate-400 font-medium mt-3 max-w-[280px] leading-relaxed mx-auto">
                  Sem cadastro complicado • Sem jargão médico • De pais para pais • 100% gratuito para começar
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* BLOCO VOCÊ NÃO ESTÁ SOZINHO */}
      <section className="py-12 bg-white px-6 border-y border-slate-100">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-black text-brand-dark mb-3">Você não está sozinho(a)</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
            Todo mês que passa sem orientação pode atrasar o desenvolvimento da criança. Aqui você age no momento certo com Sofia IA e famílias reais.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-0.5"><Check size={14} strokeWidth={3} /></div>
              <p className="text-slate-700 text-sm font-semibold">+152 famílias ajudadas hoje</p>
            </div>
            <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-0.5"><Check size={14} strokeWidth={3} /></div>
              <p className="text-slate-700 text-sm font-semibold">Comunidades ativas em RS, SP, AC e mais</p>
            </div>
            <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-0.5"><Check size={14} strokeWidth={3} /></div>
              <p className="text-slate-700 text-sm font-semibold">Sofia IA online 24h para te ouvir</p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO O QUE VOCE RECEBE HOJE */}
      <section className="py-12 bg-slate-50 px-6">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-black text-brand-dark mb-8">O que você recebe HOJE</h2>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-14 h-14 bg-sky-100 text-brand-primary rounded-2xl flex items-center justify-center shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Comunidades Locais</h3>
                <p className="text-slate-500 text-xs mt-1 leading-snug">Famílias da sua cidade</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                <Brain size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Sofia IA</h3>
                <p className="text-slate-500 text-xs mt-1 leading-snug">Conversa imediata de apoio</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                <IdCard size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">Carteirinha Digital</h3>
                <p className="text-slate-500 text-xs mt-1 leading-snug">Suporte rápido em qualquer lugar</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-14 h-14 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">SOS Sensorial</h3>
                <p className="text-slate-500 text-xs mt-1 leading-snug">Ferramentas para crises agora</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GALERIA E MATERIAIS */}
      <section className="py-12 bg-white px-6 border-y border-slate-100">
         <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-black text-brand-dark mb-6">Galeria de Vídeos e Materiais</h2>
            <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 cursor-pointer hover:bg-slate-100 transition-colors">
               <div className="w-20 h-20 bg-brand-primary/10 rounded-2xl overflow-hidden shrink-0 relative">
                  <img src="https://images.unsplash.com/photo-1610892955519-940026e6ef1a?auto=format&fit=crop&w=200&q=80" alt="Robô interativo" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                      <div className="w-0 h-0 border-t-4 border-b-4 border-l-[6px] border-transparent border-l-brand-primary ml-1" />
                    </div>
                  </div>
               </div>
               <div>
                  <h3 className="font-bold text-slate-800 text-sm">Biblioteca Desbloqueada</h3>
                  <p className="text-slate-500 text-xs mt-1">E-books VIPs e vídeos curtos práticos para te guiar nesta jornada.</p>
               </div>
            </div>
         </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-12 bg-slate-50 px-6">
        <div className="max-w-md mx-auto">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-4 relative">
            <div className="text-amber-400 mb-3 text-2xl">★★★★★</div>
            <p className="text-slate-800 font-bold text-sm mb-1">Primeiro contato visual!</p>
            <p className="text-slate-600 font-medium mb-4 text-sm leading-relaxed">
              "Hoje meu filho olhou nos meus olhos pela primeira vez. Chorei de alegria!"
            </p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="Mãe avaliando" className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Mãe do RS</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative">
            <div className="text-amber-400 mb-3 text-2xl">★★★★★</div>
            <p className="text-slate-600 font-medium mb-4 text-sm leading-relaxed">
              "Sofia IA me ajudou quando eu estava exausta"
            </p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1531123897727-8f129e1eb1ef?auto=format&fit=crop&w=100&q=80" alt="Mãe avaliando" className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Mãe de Porto Alegre</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL FORTE CTA - DOAÇÃO */}
      <section className="py-16 bg-gradient-to-r from-brand-primary to-brand-dark px-6 text-center shadow-inner relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-[60px]"></div>
        <div className="max-w-md mx-auto relative z-10 flex flex-col items-center">
          
          <div className="w-32 h-32 rounded-3xl bg-white p-2 mb-6 shadow-2xl rotate-[-3deg]">
             <img src="https://images.unsplash.com/photo-1610892955519-940026e6ef1a?auto=format&fit=crop&w=300&q=80" alt="Robô" className="w-full h-full object-cover rounded-2xl" />
          </div>

          <h2 className="text-[24px] font-black text-white mb-2 leading-tight drop-shadow-md">
            Support families with autism – Conecta TEA
          </h2>
          <p className="text-sky-100 text-sm mb-8 font-medium">
            Even R$ 5 makes a difference
          </p>
          
          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="w-full px-8 py-5 bg-gradient-to-r from-[#FEA6CC] to-pink-400 text-[#0F2F4A] rounded-2xl font-black text-lg shadow-xl shadow-[#FEA6CC]/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            Apoiar famílias agora ❤️
          </button>
        </div>
      </section>

      <footer className="py-8 bg-white text-center pb-28 md:pb-8 border-t border-slate-100">
        <SupportModal 
          isOpen={isSupportModalOpen} 
          onClose={() => setIsSupportModalOpen(false)} 
        />
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <p className="text-xs font-bold text-slate-500">© 2026 Conecta TEA • Termos • Privacidade • Feito com ❤️ no Brasil</p>
        </div>
      </footer>
    </div>
  );
}
