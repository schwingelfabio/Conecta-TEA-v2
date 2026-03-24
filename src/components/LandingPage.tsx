import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ShieldCheck, Crown, Heart, Zap, ExternalLink, X, Copy, Check, ArrowRight, MapPin, Activity, BookOpen, Search, Shield, Smartphone } from 'lucide-react';
import AuthForm from './AuthForm';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

interface LandingPageProps {
  onLogin: () => void;
  onShowTerms: () => void;
  onGuestLogin: () => void; // Keeping prop but won't use it in UI as requested
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
          Todo valor arrecadado é revertido para melhorias na plataforma e servidores.
        </p>
      </motion.div>
    </div>
  );
}

export default function LandingPage({ onLogin, onShowTerms }: LandingPageProps) {
  const { i18n } = useTranslation();
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-20 overflow-hidden px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-sky-200 rounded-full blur-[80px] mix-blend-multiply"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-purple-200 rounded-full blur-[80px] mix-blend-multiply"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-10 flex justify-center">
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-2xl">
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

            <div className="space-y-4 mb-10">
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed px-2">
                O Conecta TEA ajuda você a entender os sinais, se conectar com outras famílias e encontrar apoio real — de forma simples, segura e acolhedora.
              </p>
              <p className="text-lg md:text-xl font-bold text-sky-600 bg-sky-50 inline-block px-6 py-2 rounded-full">
                Você não está sozinho(a). Isso acontece com muitas famílias.
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
                <button
                  onClick={() => setShowAuthForm(true)}
                  className="w-full px-8 py-5 bg-sky-500 text-white rounded-2xl font-bold text-xl shadow-lg shadow-sky-500/30 hover:bg-sky-600 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Quero ajuda agora
                  <ArrowRight size={20} />
                </button>

                <div className="flex flex-col items-center gap-1 mt-2">
                  <p className="text-sm text-slate-500 font-medium">
                    Leva menos de 1 minuto para começar
                  </p>
                  <p className="text-sm text-slate-400 italic">
                    Criado por quem vive essa realidade.
                  </p>
                </div>

                <button
                  onClick={() => scrollToSection('como-funciona')}
                  className="w-full mt-6 px-8 py-4 bg-slate-50 text-slate-700 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Entender como funciona
                </button>

                <div className="mt-8 flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 px-5 py-3 rounded-full text-sm font-bold">
                  <ShieldCheck size={18} />
                  Sem julgamentos. Sem complicação. Só apoio.
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* BLOCO COMO FUNCIONA */}
      <section id="como-funciona" className="py-20 bg-slate-50 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Como funciona?</h2>
            <p className="text-lg text-slate-600">Três passos simples para sua jornada.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mb-6">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Entenda os sinais</h3>
              <p className="text-slate-600 leading-relaxed">
                Identifique comportamentos importantes de forma simples.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Users size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Conecte-se</h3>
              <p className="text-slate-600 leading-relaxed">
                Encontre famílias e apoio na sua cidade.
              </p>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Aja com segurança</h3>
              <p className="text-slate-600 leading-relaxed">
                Receba orientação prática para os próximos passos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO DE IDENTIFICAÇÃO */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-sky-50 rounded-[3rem] p-8 md:p-14 border border-sky-100">
            <div className="text-center mb-10">
              <p className="text-sky-600 font-bold mb-3 uppercase tracking-wider text-sm">Se você chegou até aqui, provavelmente está buscando respostas.</p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">Esse app é para você se:</h2>
            </div>
            
            <div className="space-y-5 max-w-xl mx-auto">
              <div className="flex items-start gap-4 bg-white p-5 rounded-2xl shadow-sm">
                <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center shrink-0">
                  <Check size={18} />
                </div>
                <p className="text-slate-700 font-medium pt-1 text-lg">Você tem dúvidas sobre o desenvolvimento do seu filho</p>
              </div>
              
              <div className="flex items-start gap-4 bg-white p-5 rounded-2xl shadow-sm">
                <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center shrink-0">
                  <Check size={18} />
                </div>
                <p className="text-slate-700 font-medium pt-1 text-lg">Quer entender melhor sinais de autismo</p>
              </div>
              
              <div className="flex items-start gap-4 bg-white p-5 rounded-2xl shadow-sm">
                <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center shrink-0">
                  <Check size={18} />
                </div>
                <p className="text-slate-700 font-medium pt-1 text-lg">Busca apoio e orientação confiável</p>
              </div>
              
              <div className="flex items-start gap-4 bg-white p-5 rounded-2xl shadow-sm">
                <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center shrink-0">
                  <Check size={18} />
                </div>
                <p className="text-slate-700 font-medium pt-1 text-lg">Se sente perdido(a) e precisa de direção</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO DE BENEFÍCIOS */}
      <section className="py-20 bg-slate-50 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">O que você vai encontrar</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center shrink-0">
                <MapPin size={32} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xl mb-2">Comunidades locais</h3>
                <p className="text-slate-500">Conexão com famílias e profissionais</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                <Smartphone size={32} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xl mb-2">Carteirinha digital</h3>
                <p className="text-slate-500">Identificação e suporte rápido</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shrink-0">
                <Activity size={32} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xl mb-2">SOS Sensorial</h3>
                <p className="text-slate-500">Ajuda imediata em crises</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-4 lg:col-start-1 lg:col-span-1">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                <Zap size={32} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xl mb-2">Triagem TEA IA</h3>
                <p className="text-slate-500">Inteligência artificial para sinais precoces</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center gap-4 sm:col-span-2 lg:col-span-2">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                <Crown size={32} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xl mb-2">Área VIP</h3>
                <p className="text-slate-500">Conteúdos exclusivos e aprofundados</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOCO DE IMPACTO */}
      <section className="py-24 bg-sky-500 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-10 md:p-16 rounded-[3rem] shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight">
              Quanto antes você entende os sinais, maiores são as chances de desenvolvimento da criança.
            </h2>
            <p className="text-sky-100 text-xl mb-12 font-medium">
              Nossa tecnologia ajuda você a agir no momento certo.
            </p>
            <button
              onClick={() => {
                setShowAuthForm(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-12 py-5 bg-white text-sky-600 rounded-2xl font-bold text-xl shadow-xl hover:bg-sky-50 hover:-translate-y-1 transition-all active:scale-95"
            >
              Começar gratuitamente
            </button>
          </div>
        </div>
      </section>

      {/* BLOCO DE CONFIANÇA */}
      <section className="py-20 bg-white px-4 text-center border-b border-slate-100">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="flex -space-x-4">
              <div className="w-14 h-14 rounded-full border-4 border-white bg-sky-100 flex items-center justify-center shadow-sm"><Heart size={24} className="text-sky-500" /></div>
              <div className="w-14 h-14 rounded-full border-4 border-white bg-purple-100 flex items-center justify-center shadow-sm"><Users size={24} className="text-purple-500" /></div>
              <div className="w-14 h-14 rounded-full border-4 border-white bg-emerald-100 flex items-center justify-center shadow-sm"><Shield size={24} className="text-emerald-500" /></div>
            </div>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Criado para famílias reais, por quem entende essa jornada.
          </h2>
          <p className="text-slate-500 text-lg font-medium">
            Construindo uma rede de apoio para famílias TEA no Brasil 🇧🇷
          </p>
        </div>
      </section>

      {/* BLOCO FINAL (CTA) */}
      <section className="py-24 bg-slate-50 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8">
            Você não precisa enfrentar isso sozinho(a).
          </h2>
          <p className="text-xl text-slate-600 mb-12 leading-relaxed">
            Junte-se a outras famílias e tenha acesso a uma rede de apoio feita com acolhimento, informação e tecnologia.
          </p>

          <button
            onClick={() => {
              setShowAuthForm(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-12 py-6 bg-sky-500 text-white rounded-2xl font-bold text-2xl shadow-xl shadow-sky-500/30 hover:bg-sky-600 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 mx-auto"
          >
            Quero começar agora
            <ArrowRight size={24} />
          </button>
        </div>
      </section>

      <footer className="py-10 bg-white text-center border-t border-slate-100">
        <SupportModal 
          isOpen={isSupportModalOpen} 
          onClose={() => setIsSupportModalOpen(false)} 
        />
        <div className="flex flex-col items-center gap-5 text-slate-400">
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
