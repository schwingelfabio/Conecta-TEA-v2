import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, LogIn, ShieldCheck, MessageCircle, Crown, Heart, Zap, ExternalLink, X, Copy, Check, ArrowRight, MapPin, Activity, BookOpen, Search, Shield, Smartphone } from 'lucide-react';
import AuthForm from './AuthForm';
import DonationSupportCard from './DonationSupportCard';
import LanguageSelector from './LanguageSelector';
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
          {t('landing.supportModalTitle')}
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
              {t('landing.supportModalPix')}
            </p>
          </div>

          <a 
            href="https://www.paypal.com/donate/?hosted_button_id=QFNBCLB7HH3QE"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 bg-[#0070ba] text-white rounded-2xl font-bold hover:bg-[#005ea6] transition-colors shadow-lg shadow-blue-100"
          >
            <ExternalLink size={20} />
            {t('landing.supportModalPayPal')}
          </a>
        </div>

        <p className="mt-6 text-center text-gray-500 text-sm">
          {t('donation.description')}
        </p>
      </motion.div>
    </div>
  );
}

export default function LandingPage({ onLogin, onShowTerms, onGuestLogin }: LandingPageProps) {
  const { t, i18n } = useTranslation();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      {/* SEÇÃO 1 — HERO PRINCIPAL */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-300 rounded-full blur-[100px] opacity-60 mix-blend-multiply"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-300 rounded-full blur-[100px] opacity-60 mix-blend-multiply"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-white rounded-3xl shadow-lg flex items-center justify-center text-sky-500 border border-sky-50">
                <Users size={40} strokeWidth={2.5} />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1] max-w-4xl mx-auto">
              Apoio real para famílias na jornada do autismo.
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
              Comunidade acolhedora, orientação prática e tecnologia acessível para ajudar famílias desde os primeiros sinais.
            </p>

            {showAuthForm ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 max-w-md mx-auto"
              >
                <AuthForm onSuccess={onLogin} />
                <button
                  onClick={() => setShowAuthForm(false)}
                  className="mt-6 text-slate-500 hover:text-slate-700 font-medium transition-colors"
                >
                  Voltar
                </button>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-8">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
                  <button
                    onClick={() => setShowAuthForm(true)}
                    className="w-full px-8 py-4 bg-sky-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-sky-500/30 hover:bg-sky-600 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    Começar agora
                    <ArrowRight size={20} />
                  </button>

                  <button
                    onClick={() => scrollToSection('como-ajuda')}
                    className="w-full px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    Conhecer o app
                  </button>
                </div>

                <div className="flex flex-wrap justify-center gap-6 md:gap-10 mt-4">
                  <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                    <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                      <Search size={16} />
                    </div>
                    Entenda os sinais
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <Users size={16} />
                    </div>
                    Conecte-se
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Shield size={16} />
                    </div>
                    Apoio prático
                  </div>
                </div>
                
                <button
                  onClick={onGuestLogin}
                  className="mt-2 text-sm text-slate-500 hover:text-slate-800 font-medium transition-colors underline underline-offset-4"
                >
                  Apenas explorar como visitante
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO 2 — COMO O CONECTA TEA AJUDA */}
      <section id="como-ajuda" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Como o Conecta TEA ajuda?</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Três passos simples para trazer mais clareza e segurança para a sua jornada.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 text-center">
              <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1. Entenda</h3>
              <p className="text-slate-600 leading-relaxed">
                Acesse orientações e conteúdos que ajudam a dar clareza aos primeiros passos e sinais.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2. Conecte-se</h3>
              <p className="text-slate-600 leading-relaxed">
                Encontre uma comunidade acolhedora com famílias e apoio perto de você.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">3. Aja com segurança</h3>
              <p className="text-slate-600 leading-relaxed">
                Use ferramentas e recursos que ajudam no dia a dia e no acompanhamento da jornada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3 — PARA QUEM É */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-sky-50 rounded-[3rem] p-10 md:p-16 border border-sky-100">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-10 text-center">Isso foi feito para você?</h2>
            
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center shrink-0 mt-1">
                  <Check size={18} />
                </div>
                <p className="text-lg text-slate-700 font-medium">Para pais e mães com dúvidas sobre sinais de autismo.</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center shrink-0 mt-1">
                  <Check size={18} />
                </div>
                <p className="text-lg text-slate-700 font-medium">Para famílias que buscam acolhimento e orientação.</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center shrink-0 mt-1">
                  <Check size={18} />
                </div>
                <p className="text-lg text-slate-700 font-medium">Para responsáveis que querem apoio prático no dia a dia.</p>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center shrink-0 mt-1">
                  <Check size={18} />
                </div>
                <p className="text-lg text-slate-700 font-medium">Para quem deseja entender melhor os próximos passos.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4 — BENEFÍCIOS PRINCIPAIS */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">O que você encontra no app</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Ferramentas pensadas para facilitar a sua rotina.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-4">
              <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1 text-lg">Comunidades Locais</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Conecte-se com famílias e profissionais mais perto de você.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                <Smartphone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1 text-lg">Carteirinha Digital</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Organize informações importantes da pessoa com TEA de forma prática.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shrink-0">
                <Activity size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1 text-lg">SOS Sensorial</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Acesse orientações rápidas para momentos de crise e sobrecarga.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1 text-lg">Vídeos e Materiais</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Conteúdos úteis para entender, aprender e aplicar no dia a dia.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1 text-lg">Triagem TEA IA</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Tecnologia de apoio para observação inicial e acompanhamento.</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                <Crown size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1 text-lg">Área VIP</h3>
                <p className="text-slate-600 text-sm leading-relaxed">Materiais exclusivos para aprofundar sua jornada com mais suporte.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 5 — PROVA DE CONFIANÇA */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-10">
            Construindo uma rede de apoio para famílias TEA no Brasil
          </h2>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-600">
                <Heart size={24} />
              </div>
              <span className="text-sm font-medium text-slate-600">Acolhimento</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-600">
                <BookOpen size={24} />
              </div>
              <span className="text-sm font-medium text-slate-600">Informação prática</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-600">
                <Users size={24} />
              </div>
              <span className="text-sm font-medium text-slate-600">Comunidade</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-600">
                <Zap size={24} />
              </div>
              <span className="text-sm font-medium text-slate-600">Tecnologia acessível</span>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 6 — BLOCO TRIAGEM TEA IA */}
      <section className="py-24 bg-indigo-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl mb-6">
            <Zap size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">Triagem TEA IA</h2>
          <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Uma tecnologia parceira para auxiliar na observação inicial de sinais e no acompanhamento do desenvolvimento.
          </p>
          <a
            href="https://sites.google.com/view/triagemteaia/portugu%C3%AAs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 border border-indigo-200 rounded-2xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-sm"
          >
            Conhecer Triagem TEA IA
            <ExternalLink size={20} />
          </a>
        </div>
      </section>

      {/* SEÇÃO 7 — CTA FINAL FORTE */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-br from-sky-500 to-indigo-600 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl shadow-sky-200">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Pronto para começar?</h2>
            <p className="text-xl text-sky-50 mb-12 max-w-2xl mx-auto leading-relaxed">
              Junte-se a outras famílias e faça parte de uma rede de apoio feita com acolhimento, informação e tecnologia.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => {
                  setShowAuthForm(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-10 py-5 bg-white text-sky-600 rounded-2xl font-bold text-xl hover:bg-sky-50 transition-all shadow-lg hover:-translate-y-0.5 active:scale-95"
              >
                Começar gratuitamente
              </button>
            </div>
            <p className="mt-6 text-sm text-sky-100 font-medium opacity-90">
              Entrada simples e gratuita.
            </p>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-100 bg-white">
        <SupportModal 
          isOpen={isSupportModalOpen} 
          onClose={() => setIsSupportModalOpen(false)} 
        />
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-6 text-slate-500">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSupportModalOpen(true)} className="text-sm font-medium hover:text-sky-500 transition-colors flex items-center gap-2">
              <Heart size={16} className="text-emerald-500" />
              Apoiar Projeto
            </button>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} Conecta TEA. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <button onClick={onShowTerms} className="text-sm hover:text-sky-500 transition-colors">
              Termos de Uso e Privacidade
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
