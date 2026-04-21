import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, ExternalLink, X, Users, Heart, Brain, Puzzle } from 'lucide-react';
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
      <section className="relative pt-12 pb-16 overflow-hidden px-4 bg-gradient-to-b from-brand-primary/20 via-[#FEA6CC]/10 to-transparent">
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
              Descobriu os sinais de autismo no seu filho?
              <span className="block mt-2 text-brand-primary">Nós seguramos a sua mão desde o primeiro dia.</span>
            </h1>

            <p className="text-sm text-slate-600 mb-8 font-medium px-2 leading-relaxed">
              Carteirinha digital oficial + SOS Sensorial + Sofia IA + Comunidade de famílias reais
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
                  {isEntering ? 'Entrando...' : 'Receber meu primeiro mapa + Carteirinha Grátis agora'}
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
                  Sem cadastro complicado • Sem jargão médico • De pais para pais • 100% gratuito para começar • Feito no RS
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
            +152 famílias ajudadas hoje • Comunidades ativas em RS, SP, AC e mais
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-0.5"><Check size={14} strokeWidth={3} /></div>
              <p className="text-slate-700 text-sm font-semibold">Carteirinha Digital Oficial (exemplo da Vic, Parobé/RS)</p>
            </div>
            <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-0.5"><Check size={14} strokeWidth={3} /></div>
              <p className="text-slate-700 text-sm font-semibold">SOS Sensorial (acesso imediato em crise)</p>
            </div>
            <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0 mt-0.5"><Check size={14} strokeWidth={3} /></div>
              <p className="text-slate-700 text-sm font-semibold">Sofia IA online 24h</p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO O QUE VOCE RECEBE HOJE */}
      <section className="py-12 bg-slate-50 px-6">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-black text-brand-dark mb-8">O que torna o Conecta TEA único</h2>

          <div className="grid grid-cols-1 gap-6">

            {/* MOCK: Carteirinha */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-brand-primary">
                   <img src="https://images.unsplash.com/photo-1517672651691-24622a91b550?auto=format&fit=crop&w=100&q=80" alt="Criança" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-dark text-sm leading-tight">Vic</h3>
                  <p className="text-slate-500 text-[11px] leading-snug">Parobé/RS</p>
                </div>
                <div className="ml-auto w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  <div className="w-6 h-6 border-2 border-slate-400 border-dashed rounded-sm"></div>
                </div>
              </div>
              <div className="bg-sky-50 text-sky-700 text-[11px] font-bold px-3 py-2 rounded-xl text-center">Carteirinha Digital Oficial</div>
            </div>

            {/* MOCK: Comunidade Real */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-3">
              <h3 className="font-bold text-brand-dark text-sm flex items-center gap-2 mb-1">
                 <Users size={16} className="text-sky-500" />
                 Comunidade Real
              </h3>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                       <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" alt="User avatar" className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Mãe do RS</p>
                      <p className="text-[10px] text-slate-500">Há 2 horas</p>
                    </div>
                 </div>
                 <p className="text-xs text-slate-700 font-medium">Primeiro contato visual! Chorei de alegria! 🥰</p>
              </div>
            </div>

            {/* MOCK: SOS Sensorial */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
              <h3 className="font-bold text-brand-dark text-sm flex items-center gap-2">
                 <Heart size={16} className="text-pink-400" />
                 SOS Sensorial
              </h3>
              <div className="flex flex-col gap-2">
                 <div className="bg-[#FEA6CC]/20 text-[#0F2F4A] p-3 rounded-2xl font-semibold text-xs border border-[#FEA6CC]/30 flex justify-between items-center">
                    Crise em Público
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm text-pink-500 font-bold">›</div>
                 </div>
                 <div className="bg-[#FEA6CC]/20 text-[#0F2F4A] p-3 rounded-2xl font-semibold text-xs border border-[#FEA6CC]/30 flex justify-between items-center">
                    Ambiente Barulhento
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm text-pink-500 font-bold">›</div>
                 </div>
                 <div className="bg-[#FEA6CC]/20 text-[#0F2F4A] p-3 rounded-2xl font-semibold text-xs border border-[#FEA6CC]/30 flex justify-between items-center">
                    Comunicação Alternativa
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm text-pink-500 font-bold">›</div>
                 </div>
              </div>
            </div>

            {/* MOCK: Sofia IA */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
               <h3 className="font-bold text-brand-dark text-sm flex items-center gap-2">
                 <Brain size={16} className="text-purple-500" />
                 Sofia IA
              </h3>
              <div className="flex items-end gap-3 mt-1">
                 <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-slate-200">
                    <img src="https://images.unsplash.com/photo-1610892955519-940026e6ef1a?auto=format&fit=crop&w=100&q=80" alt="Sofia Avatar" className="w-full h-full object-cover" />
                 </div>
                 <div className="bg-brand-primary text-white p-3 rounded-2xl rounded-bl-sm shadow-sm text-xs leading-relaxed max-w-[85%]">
                    Oi, eu sou a Sofia. Como você está se sentindo hoje?
                 </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section className="py-12 bg-white border-t border-slate-100 px-6">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-black text-brand-dark mb-8">Famílias reais já estão aqui</h2>
          <div className="bg-slate-50 p-6 rounded-3xl shadow-sm border border-slate-100 mb-4 relative">
            <div className="text-amber-400 mb-3 text-2xl">★★★★★</div>
            <p className="text-slate-600 font-medium mb-4 text-sm leading-relaxed">
              "Sofia IA me ouviu quando eu estava exausta às 3h da manhã."
            </p>
            <div className="flex items-center gap-3">
              <img src="https://images.unsplash.com/photo-1531123897727-8f129e1eb1ef?auto=format&fit=crop&w=100&q=80" alt="Mãe avaliando" className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Elena Rodriguez</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL FORTE CTA - DOAÇÃO */}
      <section className="py-16 bg-[#FEA6CC]/10 px-6 text-center border-t border-pink-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-40 rounded-full blur-[60px]"></div>
        <div className="max-w-md mx-auto relative z-10 flex flex-col items-center">
          
          <div className="w-24 h-24 rounded-3xl bg-white p-4 mb-4 shadow-lg rotate-[3deg] flex items-center justify-center text-pink-500 border-4 border-[#FEA6CC]/30">
             <Puzzle size={48} className="fill-pink-500" />
          </div>

          <p className="text-slate-800 text-[18px] mb-8 font-black leading-tight max-w-[250px]">
             Even R$ 5 faz diferença para outra família brasileira
          </p>
          
          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="w-full px-8 py-5 bg-[#FEA6CC] text-[#0F2F4A] rounded-2xl font-black text-lg shadow-xl shadow-[#FEA6CC]/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
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
          <p className="text-xs font-bold text-slate-500">© 2026 Conecta TEA • Feito com ❤️ no Rio Grande do Sul • Termos • Privacidade</p>
        </div>
      </footer>
    </div>
  );
}
