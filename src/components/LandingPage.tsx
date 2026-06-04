import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, ExternalLink, X, Users, Heart, Brain, Puzzle, FileText, PlayCircle } from 'lucide-react';
import AuthForm from './AuthForm';
import LanguageSelector from './LanguageSelector';
import Logo from './Logo';
import AdBanner from './AdBanner';
import { useTranslation } from 'react-i18next';

interface LandingPageProps {
  onLogin: () => void;
  onShowTerms: () => void;
  onGuestLogin: (targetTab?: string) => void;
  onNavigate?: (path: string, tab: string) => void;
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

export default function LandingPage({ onLogin, onShowTerms, onGuestLogin, onNavigate }: LandingPageProps) {
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


  const handleEnterNow = async () => {
    setIsEntering(true);
    await onGuestLogin('feed');
  };

  const handleEnterTriagem = async () => {
    setIsEntering(true);
    await onGuestLogin('triagem');
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
            <div className="flex items-center bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-sm mb-6 border border-slate-100/80">
              <Logo size="sm" showText={false} className="w-8 h-8 focus:outline-none shrink-0" />
              <div className="ml-3 flex flex-col items-start justify-center">
                <span className="text-lg font-black tracking-tight text-[#0F2F4A] leading-none">
                  Conecta TEA <span className="text-[#0EA5E9]">IA</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-0.5">
                  Guardião Familiar
                </span>
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
              Conecta TEA – Apoio para famílias com crianças com autismo
            </h1>

            <div className="text-sm text-slate-600 mb-8 font-medium px-2 leading-relaxed text-left space-y-4">
              <p>O Conecta TEA é uma plataforma criada para apoiar famílias que convivem com o Transtorno do Espectro Autista (TEA). Sabemos que muitas dúvidas surgem no dia a dia, principalmente no início da jornada. Por isso, reunimos tecnologia, informação e conteúdo prático para ajudar pais e responsáveis a entender melhor cada situação.</p>
              
              <p>Nosso objetivo é oferecer orientação clara e acessível, ajudando famílias a tomarem decisões com mais segurança. Aqui você encontra recursos que auxiliam na rotina, no comportamento e na adaptação da criança em diferentes ambientes.</p>
              
              <p>Acreditamos que informação de qualidade pode transformar vidas. Por isso, todo o conteúdo do Conecta TEA é pensado para ser simples, direto e útil na prática.</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 w-full px-2">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleEnterNow}
                disabled={isEntering}
                className="w-full px-6 py-4 bg-brand-primary text-white rounded-2xl font-bold text-lg shadow-lg shadow-brand-primary/30 flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all cursor-pointer"
              >
                {isEntering ? 'Entrando...' : 'Entrar Agora'}
              </motion.button>

              <a
                href="https://triagem-tea-ia-oficial.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-6 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer text-center"
              >
                Acessar Triagem TEA IA
              </a>

              <p className="text-[11px] text-slate-400 font-medium mt-3 max-w-[300px] leading-relaxed mx-auto">
                Sem necessidade de login ou cadastro • Sem jargão médico • De pais para pais • 100% gratuito • Feito no RS
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO 2: Triagem TEA IA */}
      <section className="py-16 bg-white px-6 border-y border-slate-100">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-brand-primary/10 rounded-[3rem] -rotate-3 transform origin-center scale-105"></div>
            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-xl relative z-10">
              <div className="w-16 h-16 bg-brand-primary text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-primary/30">
                <Brain size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-3">Triagem TEA IA</h3>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                Ferramenta Preventiva
              </div>
              <div className="space-y-4">
                <div className="h-2 w-3/4 bg-slate-200 rounded-full"></div>
                <div className="h-2 w-full bg-slate-200 rounded-full"></div>
                <div className="h-2 w-5/6 bg-slate-200 rounded-full"></div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-black text-brand-dark leading-tight">O que é e como funciona nossa Triagem TEA IA?</h2>
            
            <div className="text-slate-600 space-y-4 leading-relaxed">
              <p>A Triagem TEA IA é uma ferramenta desenvolvida para auxiliar na identificação inicial de sinais relacionados ao autismo. Ela não substitui diagnóstico médico, mas ajuda famílias a entender melhor comportamentos e buscar ajuda especializada com mais clareza.</p>
              
              <p>Através de perguntas simples, a triagem orienta os responsáveis sobre possíveis sinais e caminhos a seguir. Isso ajuda a reduzir a insegurança e acelera o processo de busca por apoio profissional.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: SOFIA E THEO */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-purple-100 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="flex-1 w-full max-w-sm">
             <div className="relative aspect-[3/4] rounded-2xl shadow-2xl overflow-hidden border-8 border-white group">
               <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=800&fit=crop" alt="Crianças Lendo Livro" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
               <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent flex items-end p-6">
                 <div>
                   <span className="text-xs font-black text-white bg-purple-500 px-2 py-1 rounded">VOLUME 02</span>
                   <h3 className="text-white font-black text-xl mt-2 leading-tight">Sofia e Theo - Aventuras Fora de Casa</h3>
                 </div>
               </div>
             </div>
          </div>
          
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-black text-brand-dark leading-tight">Conheça os guias para rotinas sem estresse: Sofia e Theo</h2>
            
            <div className="text-slate-700 space-y-4 leading-relaxed font-medium">
              <p>O livro Sofia e Theo foi criado para ajudar crianças a compreenderem situações do dia a dia fora de casa, como escola, consultas e passeios.</p>
              
              <p>Através de uma abordagem visual e simples, a criança consegue antecipar o que vai acontecer, reduzindo ansiedade e facilitando a adaptação.</p>
            </div>
            
            <a 
               href="https://pay.kiwify.com.br/E6Aju2a" 
               target="_blank" 
               rel="noopener noreferrer"
               className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-2xl text-lg font-black hover:bg-purple-500 transition-all shadow-lg hover:shadow-purple-500/30"
             >
               <FileText size={22} />
               Saber Mais Sobre Sofia & Theo
            </a>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: BENEFÍCIOS DO CONECTA TEA */}
      <section className="py-16 bg-slate-50 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-brand-dark mb-4">Principais Benefícios do Conecta TEA</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-4">
              <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center font-black text-xl shadow-sm">1</div>
              <h3 className="font-bold text-lg text-slate-800 leading-tight">Mais segurança para famílias</h3>
            </div>
            
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-black text-xl shadow-sm">2</div>
              <h3 className="font-bold text-lg text-slate-800 leading-tight">Melhor compreensão do comportamento</h3>
            </div>
            
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-black text-xl shadow-sm">3</div>
              <h3 className="font-bold text-lg text-slate-800 leading-tight">Redução de crises</h3>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-4">
              <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center font-black text-xl shadow-sm">4</div>
              <h3 className="font-bold text-lg text-slate-800 leading-tight">Apoio na rotina diária</h3>
            </div>

            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-4 md:col-span-2">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center font-black text-xl shadow-sm">5</div>
              <h3 className="font-bold text-lg text-slate-800 leading-tight">Conteúdo acessível e prático</h3>
            </div>
          </div>
        </div>
      </section>



      {/* FINAL FORTE CTA - CHAMADA PARA AÇÃO (SEÇÃO 5) */}
      <section className="py-20 bg-brand-primary px-6 text-center border-t border-sky-400 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-white opacity-10 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-emerald-400 opacity-20 rounded-full blur-[60px]"></div>
        
        <div className="max-w-3xl mx-auto relative z-10 flex flex-col items-center">
          
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight shadow-sm drop-shadow-md">
            Você já teve dúvidas, medos e se sentiu perdido?
          </h2>
          
          <p className="text-white/90 text-lg md:text-xl mb-10 font-medium leading-relaxed max-w-2xl">
            Deixe as incertezas no passado. Entre hoje mesmo de forma rápida na plataforma Conecta TEA e inicie sua travessia na primeira casa de famílias com o real acolhimento diário focado no Transtorno do Espectro Autista. Descubra agora as respostas e orientações seguras que a sua criança merece.
          </p>

          <div className="w-full max-w-md bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20 shadow-2xl mb-8">
            <h3 className="text-white font-black text-xl mb-6">Pronto para transformar a sua rotina?</h3>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  handleEnterNow();
                }}
                disabled={isEntering}
                className="w-full px-8 py-4 bg-white text-brand-dark rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] hover:bg-sky-50 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                {isEntering ? 'Entrando...' : 'Entrar Agora'}
              </button>

              <a
                href="https://triagem-tea-ia-oficial.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 cursor-pointer text-center"
              >
                Acessar Triagem TEA IA
              </a>
            </div>
            <p className="text-white/60 text-xs font-semibold mt-4">
              Acesso instantâneo e 100% gratuito. Sem necessidade de cadastro.
            </p>
          </div>
        </div>
      </section>

      {/* Bloco de Anúncios Google Ads Inferior */}
      <AdBanner className="bg-slate-50 border-t border-slate-100 py-6" />

      <footer className="py-8 bg-white border-t border-slate-100 flex flex-col items-center pb-28 md:pb-8">
        <SupportModal 
          isOpen={isSupportModalOpen} 
          onClose={() => setIsSupportModalOpen(false)} 
        />
        <div className="w-full max-w-5xl mx-auto px-4 flex flex-col items-center gap-6">
          <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold text-slate-600">
            <a 
              href="/sobre" 
              className="hover:text-brand-primary transition-colors cursor-pointer"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('/sobre', 'sobre');
                }
              }}
            >
              Sobre Nós
            </a>
            <a 
              href="/contato" 
              className="hover:text-brand-primary transition-colors cursor-pointer"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('/contato', 'contato');
                }
              }}
            >
              Contato
            </a>
            <a 
              href="/politica-de-privacidade" 
              className="hover:text-brand-primary transition-colors cursor-pointer"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('/politica-de-privacidade', 'privacidade');
                }
              }}
            >
              Política de Privacidade
            </a>
            <a 
              href="/termos-de-uso" 
              className="hover:text-brand-primary transition-colors cursor-pointer"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('/termos-de-uso', 'termos');
                }
              }}
            >
              Termos de Uso
            </a>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 font-medium">
            <a 
              href="/blog/o-que-e-autismo" 
              className="hover:text-brand-primary transition-colors cursor-pointer"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('/blog/o-que-e-autismo', 'blog');
                }
              }}
            >
              O que é TEA?
            </a>
            <a 
              href="/blog/como-identificar-sinais-de-tea" 
              className="hover:text-brand-primary transition-colors cursor-pointer"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('/blog/como-identificar-sinais-de-tea', 'blog');
                }
              }}
            >
              Sinais do TEA
            </a>
            <a 
              href="/blog/rotina-para-criancas-com-tea" 
              className="hover:text-brand-primary transition-colors cursor-pointer"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('/blog/rotina-para-criancas-com-tea', 'blog');
                }
              }}
            >
              Importância da Rotina
            </a>
          </div>
          
          <p className="text-xs font-bold text-slate-400 text-center mt-4">
            © 2026 Conecta TEA • Feito com ❤️ no Rio Grande do Sul
          </p>
        </div>
      </footer>
    </div>
  );
}
