import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ShieldCheck, Crown, Heart, Zap, ExternalLink, X, Copy, Check, ArrowRight, MapPin, Activity, BookOpen, Search, Shield, Smartphone, HeartHandshake } from 'lucide-react';
import AuthForm from './AuthForm';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

interface LandingPageProps {
  onLogin: () => void;
  onShowTerms: () => void;
  onGuestLogin: () => void;
  onOpenAcolhe: (urgent: boolean) => void;
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
          Apoiar o Projeto
        </h3>

        <div className="space-y-4">
          <div className="p-6 bg-sky-50 rounded-2xl border border-sky-100">
            <p className="text-sm font-bold text-sky-700 uppercase tracking-wider mb-3">Pix (Brasil)</p>
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
              Sua doação ajuda a manter o app gratuito para milhares de famílias.
            </p>
          </div>

          <a 
            href="https://www.paypal.com/donate/?hosted_button_id=QFNBCLB7HH3QE"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 bg-[#0070ba] text-white rounded-2xl font-bold hover:bg-[#005ea6] transition-colors shadow-lg shadow-blue-100"
          >
            <ExternalLink size={20} />
            Doar com PayPal
          </a>
        </div>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Todo valor arrecadado é revertido para melhorias no app e servidores.
        </p>
      </motion.div>
    </div>
  );
}

export default function LandingPage({ onLogin, onShowTerms, onGuestLogin, onOpenAcolhe }: LandingPageProps) {
  const { i18n } = useTranslation();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMainAction = () => {
    setShowAuthForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 pb-20 md:pb-0 relative">
      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      {/* SOFIA IA BANNER (TOP) */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="w-full bg-gradient-to-r from-rose-50 to-purple-50 border-b border-rose-100 p-4 sticky top-0 z-40 shadow-sm"
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h3 className="text-slate-800 font-bold">Precisa conversar agora?</h3>
              <p className="text-sm text-slate-600">Sofia IA pode te ajudar neste momento</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button 
              onClick={() => onOpenAcolhe(true)}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-full font-bold transition-all flex items-center justify-center gap-2"
            >
              Estou sobrecarregado(a)
            </button>
            <button 
              onClick={() => onOpenAcolhe(false)}
              className="w-full sm:w-auto px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-bold shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2"
            >
              Falar com Sofia agora
            </button>
          </div>
        </div>
      </motion.div>

      {/* FLOATING URGENT BUTTON */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onOpenAcolhe(true)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-rose-500 text-white rounded-full shadow-2xl shadow-rose-500/40 flex items-center justify-center md:w-auto md:h-auto md:px-6 md:py-4 md:gap-2 group"
      >
        <Heart className="w-6 h-6 animate-pulse" />
        <span className="hidden md:block font-bold">Preciso de ajuda agora</span>
      </motion.button>

      {/* STICKY BOTTOM CTA (MOBILE FIRST) */}
      <AnimatePresence>
        {showSticky && !showAuthForm && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-100 z-40 flex justify-center md:hidden"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={{ boxShadow: ["0px 0px 0px rgba(14, 165, 233, 0)", "0px 0px 20px rgba(14, 165, 233, 0.5)", "0px 0px 0px rgba(14, 165, 233, 0)"] }}
              transition={{ duration: 2, repeat: Infinity }}
              onClick={handleMainAction}
              className="w-full max-w-md px-8 py-4 bg-sky-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2"
            >
              Entrar na Comunidade
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-16 overflow-hidden px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-sky-200 rounded-full blur-[80px] mix-blend-multiply"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-purple-200 rounded-full blur-[80px] mix-blend-multiply"></div>
        </div>

        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8 flex justify-center">
              <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1602030028438-4cf153cbae9e?auto=format&fit=crop&w=800&q=80" 
                  alt="Mãe e filho em um momento acolhedor" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-[1.2]">
              Você percebe que algo pode estar diferente no seu filho… mas não sabe o que fazer?
            </h1>

            <div className="space-y-4 mb-8">
              <p className="text-lg md:text-xl font-bold text-sky-700 bg-sky-50 inline-block px-6 py-2 rounded-full">
                Você não está sozinho(a). Isso acontece com muitas famílias.
              </p>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed px-2">
                Você só precisa dar o primeiro passo. Nós te ajudamos no resto.
              </p>
            </div>

            {showAuthForm ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 max-w-md mx-auto bg-white p-2 rounded-[2.5rem] shadow-2xl border border-slate-100"
              >
                <AuthForm onSuccess={onLogin} onShowTerms={onShowTerms} />
                <button
                  onClick={() => setShowAuthForm(false)}
                  className="mb-6 text-slate-500 hover:text-slate-700 font-medium transition-colors"
                >
                  Voltar
                </button>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 w-full max-w-md mx-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{ boxShadow: ["0px 0px 0px rgba(14, 165, 233, 0)", "0px 0px 20px rgba(14, 165, 233, 0.5)", "0px 0px 0px rgba(14, 165, 233, 0)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  onClick={handleMainAction}
                  className="w-full px-8 py-5 bg-sky-500 text-white rounded-2xl font-bold text-xl shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2"
                >
                  Quero ajuda agora
                  <ArrowRight size={20} />
                </motion.button>

                <div className="flex flex-col items-center gap-2 mt-2 w-full">
                  <div className="flex items-center gap-2 text-slate-600 font-medium text-sm bg-slate-50 px-4 py-3 rounded-xl w-full justify-center border border-slate-100">
                    <Zap size={18} className="text-amber-500" />
                    Sem cadastro complicado. Comece em segundos.
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 font-medium text-sm bg-slate-50 px-4 py-3 rounded-xl w-full justify-center text-center border border-slate-100">
                    <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
                    Se não for útil, você pode sair a qualquer momento.
                  </div>
                </div>

                <div className="mt-4 flex flex-col items-center gap-1">
                  <p className="text-sm text-slate-500 font-medium">
                    Famílias reais já estão usando e encontrando apoio.
                  </p>
                  <p className="text-sm text-slate-400 font-medium italic border-b border-slate-200 pb-1 mt-2">
                    Ignorar isso pode atrasar o desenvolvimento da criança.
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
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">Como funciona?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mb-4">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Entenda os sinais</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Identifique comportamentos importantes de forma simples.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Conecte-se</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Encontre famílias e apoio na sua cidade.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Aja com segurança</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Receba orientação prática para os próximos passos.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleMainAction}
              className="px-8 py-4 bg-sky-100 text-sky-700 rounded-2xl font-bold text-lg hover:bg-sky-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Quero ajuda agora
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* BLOCO DE IDENTIFICAÇÃO */}
      <section className="py-16 bg-white px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-sky-50 rounded-[2.5rem] p-8 md:p-12 border border-sky-100">
            <div className="text-center mb-10">
              <p className="text-sky-600 font-bold mb-3 uppercase tracking-wider text-sm">Se você chegou até aqui, provavelmente está buscando respostas.</p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">Esse app é para você se:</h2>
            </div>
            
            <div className="space-y-4 max-w-xl mx-auto mb-10">
              <div className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-sm">
                <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center shrink-0">
                  <Check size={18} />
                </div>
                <p className="text-slate-700 font-medium pt-1">Você tem dúvidas sobre o desenvolvimento do seu filho</p>
              </div>
              
              <div className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-sm">
                <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center shrink-0">
                  <Check size={18} />
                </div>
                <p className="text-slate-700 font-medium pt-1">Quer entender melhor sinais de autismo</p>
              </div>
              
              <div className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-sm">
                <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center shrink-0">
                  <Check size={18} />
                </div>
                <p className="text-slate-700 font-medium pt-1">Busca apoio e orientação confiável</p>
              </div>
              
              <div className="flex items-start gap-4 bg-white p-4 rounded-2xl shadow-sm">
                <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center shrink-0">
                  <Check size={18} />
                </div>
                <p className="text-slate-700 font-medium pt-1">Se sente perdido(a) e precisa de direção</p>
              </div>

              <div className="flex items-start gap-4 bg-sky-500 p-5 rounded-2xl shadow-md mt-6">
                <div className="w-8 h-8 bg-white text-sky-600 rounded-full flex items-center justify-center shrink-0">
                  <Search size={18} />
                </div>
                <p className="text-white font-bold pt-1 text-lg">Se você está em dúvida… já é um sinal de que vale investigar.</p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={handleMainAction}
                className="w-full sm:w-auto px-8 py-4 bg-sky-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-sky-500/30 hover:bg-sky-600 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Quero ajuda agora
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO DE BENEFÍCIOS */}
      <section className="py-16 bg-slate-50 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">O que você vai encontrar</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Comunidades locais</h3>
                <p className="text-slate-500 text-sm">Conexão com famílias e profissionais</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                <Smartphone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Carteirinha digital</h3>
                <p className="text-slate-500 text-sm">Identificação e suporte rápido</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shrink-0">
                <Activity size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">SOS Sensorial</h3>
                <p className="text-slate-500 text-sm">Ajuda imediata em crises</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Apoio Inicial</h3>
                <p className="text-slate-500 text-sm">Tecnologia para ajudar a entender os sinais precoces</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleMainAction}
              className="px-8 py-4 bg-sky-100 text-sky-700 rounded-2xl font-bold text-lg hover:bg-sky-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Quero ajuda agora
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* BLOCO DE IMPACTO */}
      <section className="py-16 bg-sky-500 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-black text-white mb-6 leading-tight">
            Quanto antes os sinais do autismo são identificados, maiores são as chances de desenvolvimento da criança.
          </h2>
          
          <div className="bg-white/20 inline-block px-6 py-4 rounded-2xl mb-8 border border-white/30 shadow-inner">
            <p className="text-white text-xl md:text-2xl font-bold">
              Cada mês faz diferença no desenvolvimento.
            </p>
          </div>

          <p className="text-sky-100 text-lg mb-10">
            Nossa tecnologia ajuda você a agir no momento certo.
          </p>
          
          <button
            onClick={handleMainAction}
            className="w-full sm:w-auto px-10 py-5 bg-white text-sky-600 rounded-2xl font-bold text-xl shadow-xl hover:bg-sky-50 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2 mx-auto"
          >
            Quero ajuda agora
            <ArrowRight size={20} />
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
            Criado para famílias reais, por quem entende essa jornada.
          </h2>
          <p className="text-slate-500 font-medium mb-6">
            Construindo uma rede de apoio para famílias TEA no Brasil 🇧🇷
          </p>
          
          <div className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-50 px-5 py-3 rounded-full text-sm font-bold border border-emerald-100 mb-8">
            <ShieldCheck size={18} />
            Baseado em boas práticas utilizadas por profissionais.
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={handleMainAction}
              className="px-8 py-4 bg-sky-100 text-sky-700 rounded-2xl font-bold text-lg hover:bg-sky-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Quero ajuda agora
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* BLOCO FINAL (CTA) */}
      <section className="py-20 bg-slate-50 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
            Você chegou até aqui por um motivo.
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Agora você pode dar o primeiro passo.
          </p>
          
          <p className="text-lg font-bold text-amber-600 mb-8">
            Ignorar isso hoje pode virar arrependimento amanhã.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={{ boxShadow: ["0px 0px 0px rgba(14, 165, 233, 0)", "0px 0px 20px rgba(14, 165, 233, 0.5)", "0px 0px 0px rgba(14, 165, 233, 0)"] }}
            transition={{ duration: 2, repeat: Infinity }}
            onClick={handleMainAction}
            className="w-full sm:w-auto px-10 py-5 bg-sky-500 text-white rounded-2xl font-bold text-xl shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 mx-auto"
          >
            Quero ajuda agora
            <ArrowRight size={20} />
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
            Apoiar Projeto
          </button>
          <p className="text-sm">© {new Date().getFullYear()} Conecta TEA.</p>
          <button onClick={onShowTerms} className="text-xs hover:text-sky-500 transition-colors">
            Termos de Uso e Privacidade
          </button>
        </div>
      </footer>
    </div>
  );
}
