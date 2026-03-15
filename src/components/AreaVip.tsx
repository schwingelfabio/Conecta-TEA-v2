import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Lock, Crown, Loader2, Download, Heart, BookOpen, ShieldCheck, ExternalLink, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import PlanosVip from './PlanosVip';
import VideoGallery from './VideoGallery';

export default function AreaVip({
  isAdmin,
  isVip,
  authReady,
  onNavigate,
  isGuest
}: {
  isAdmin?: boolean,
  isVip?: boolean,
  authReady?: boolean,
  onNavigate?: (tab: string) => void,
  isGuest?: boolean
}) {
  const loading = !authReady;

  const [suggestionText, setSuggestionText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const user = auth.currentUser;
  
  const effectiveVip = Boolean(isVip || isAdmin);

  useEffect(() => {
    console.log('[VIP] AreaVip props:', { isAdmin, isVip, authReady });
    console.log('[VIP] AreaVip effectiveVip:', effectiveVip);
    console.log('[VIP] ebook access decision:', { effectiveVip, authReady });
  }, [isAdmin, isVip, authReady, effectiveVip]);

  const handleSubmitSuggestion = async () => {
    if (!suggestionText.trim() || !user) return;

    setIsSending(true);
    try {
      await addDoc(collection(db, 'suggestions'), {
        texto: suggestionText,
        usuarioEmail: user.email,
        data: serverTimestamp(),
        status: 'pendente'
      });
      setSuggestionText('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error('Erro ao enviar sugestão:', error);
      alert('Erro ao enviar sugestão. Tente novamente.');
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    console.log(`[AreaVip] Auth status: ready=${authReady}, effectiveVip=${effectiveVip}, isAdmin=${isAdmin}`);
  }, [authReady, effectiveVip, isAdmin]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-sky-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium">Verificando acesso exclusivo...</p>
      </div>
    );
  }

  if (!effectiveVip) {
    return (
      <div className="min-h-screen bg-lavender-50 py-8 px-4 space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-lavender-200 rounded-[2.5rem] p-10 text-center shadow-xl shadow-lavender-200/50 max-w-3xl mx-auto"
        >
          <div className="w-20 h-20 bg-lavender-100 rounded-3xl flex items-center justify-center text-lavender-600 mx-auto mb-6">
            <Lock size={40} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Área Exclusiva</h2>
          <p className="text-gray-600 text-xl leading-relaxed mb-8">
            Olá! Esta área é exclusiva para nossos apoiadores VIP. Sua contribuição ajuda a manter o projeto Conecta TEA ativo para milhares de famílias em todo o Brasil.
          </p>
          <div className="inline-flex items-center gap-2 text-lavender-600 font-bold bg-lavender-50 px-6 py-3 rounded-full">
            <Heart size={20} fill="currentColor" />
            Junte-se à nossa causa
          </div>
        </motion.div>

        <PlanosVip isVip={effectiveVip} />
      </div>
    );
  }

  const ebooks = [
    {
      id: '1',
      title: 'Crises no Autismo',
      description: 'Aprenda estratégias práticas para acalmar a sobrecarga sensorial e lidar com momentos de crise.',
      url: 'https://drive.google.com/file/d/1H4WwZKD7jqqbkMccFjc6PiyDTn0nqJPM/view?usp=drivesdk',
      color: 'border-sky-100 bg-sky-50/30',
      btnColor: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      id: '2',
      title: 'Direitos TEA no Brasil',
      description: 'Um guia completo sobre as leis, benefícios e garantias para pessoas com autismo no Brasil.',
      url: 'https://drive.google.com/file/d/1T9stxGqRGRA8w1sWqNB-9FnamWBwnzc0/view?usp=drivesdk',
      color: 'border-emerald-100 bg-emerald-50/30',
      btnColor: 'bg-emerald-500 hover:bg-emerald-600'
    },
    {
      id: '3',
      title: 'Seletividade Alimentar',
      description: 'Dicas e técnicas para lidar com as dificuldades alimentares comuns no espectro autista.',
      url: 'https://drive.google.com/file/d/1wIwhkQsuaJJqdtDfCjBPgjLirIj8AqKC/view?usp=drivesdk',
      color: 'border-sky-100 bg-sky-50/30',
      btnColor: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      id: '4',
      title: 'Higiene sem Crise',
      description: 'Como tornar os momentos de higiene pessoal mais tranquilos e previsíveis para a criança.',
      url: 'https://drive.google.com/file/d/1rl_vcqm3uZWMCTz38MRi3KgxaRtYqJTp/view?usp=drivesdk',
      color: 'border-emerald-100 bg-emerald-50/30',
      btnColor: 'bg-emerald-500 hover:bg-emerald-600'
    },
    {
      id: '5',
      title: 'O Diagnóstico Chegou, e Agora?',
      description: 'Os primeiros passos e orientações fundamentais para famílias que acabaram de receber o diagnóstico.',
      url: 'https://drive.google.com/file/d/1GsICIFDJZb30xTT3AujMlsxEVre0iHzg/view?usp=drivesdk',
      color: 'border-sky-100 bg-sky-50/30',
      btnColor: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      id: '6',
      title: 'Os Sinais do Autismo',
      description: 'Entenda os principais sinais e comportamentos que podem indicar o transtorno do espectro autista.',
      url: 'https://drive.google.com/file/d/14g7yE7Yk6Aa__QM309PoFY_fjUL4EL2p/view?usp=drivesdk',
      color: 'border-emerald-100 bg-emerald-50/30',
      btnColor: 'bg-emerald-500 hover:bg-emerald-600'
    },
    {
      id: '7',
      title: 'Guia Inicial',
      description: 'Um material introdutório essencial para entender as bases do TEA e como começar o suporte.',
      url: 'https://drive.google.com/file/d/1aFcrP3_-16aRFRypJ-tlrqO1WdXygBNC/view?usp=drivesdk',
      color: 'border-sky-100 bg-sky-50/30',
      btnColor: 'bg-sky-500 hover:bg-sky-600'
    }
  ];

  const appDownloadUrl = '';

  return (
    <div className="min-h-screen bg-lavender-50 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto py-12 px-4"
      >
        <div className="bg-white rounded-[3rem] p-10 shadow-xl shadow-lavender-200/50 border border-white mb-12 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-24 h-24 bg-amber-100 rounded-[2rem] flex items-center justify-center text-amber-500 shrink-0 shadow-inner">
                <Crown size={56} />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                  Bem-vindo à Comunidade VIP!
                </h2>
                <p className="text-gray-600 text-xl leading-relaxed">
                  Muito obrigado por fazer parte da nossa comunidade VIP! Sua ajuda é fundamental para transformarmos a jornada das famílias TEA.
                </p>
              </div>
            </div>

            {onNavigate && (
              <button
                onClick={() => onNavigate('sos')}
                className="bg-red-500 text-white px-8 py-5 rounded-3xl font-black text-xl shadow-xl shadow-red-200 hover:bg-red-600 hover:scale-105 transition-all active:scale-95 flex items-center gap-3 animate-pulse"
              >
                <ShieldAlert size={28} />
                SOS SENSORIAL
              </button>
            )}
          </div>
        </div>

        <div className="mb-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[3rem] p-8 md:p-12 text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-4">
                <ShieldCheck size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">Parceiro Oficial</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                Triagem TEA IA: Tecnologia a favor do diagnóstico precoce.
              </h3>

              <p className="text-emerald-50 text-lg mb-8">
                Utilize nossa inteligência artificial para auxiliar na triagem e acompanhamento do desenvolvimento.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://sites.google.com/view/triagemteaia/portugu%C3%AAs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-emerald-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <ExternalLink size={20} />
                  Ir para o Site
                </a>

                {appDownloadUrl ? (
                  <a
                    href={appDownloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-800/30 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-800/40 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={20} />
                    Baixar App
                  </a>
                ) : (
                  <button
                    disabled
                    className="bg-emerald-800/20 border border-white/20 text-white/70 px-8 py-4 rounded-2xl font-bold text-lg cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Download size={20} />
                    App em breve
                  </button>
                )}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="w-64 h-64 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                <ShieldCheck size={120} className="text-white opacity-80" />
              </div>
            </div>
          </div>

          <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="mb-16">
          <VideoGallery />
        </div>

        <div>
          <div className="flex items-center gap-3 mb-8 px-4">
            <BookOpen className="text-lavender-600" size={32} />
            <h3 className="text-2xl font-bold text-gray-900">Materiais e E-books</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ebooks.map((ebook) => (
              <div
                key={ebook.id}
                className={`flex flex-col p-8 rounded-[2.5rem] border transition-all hover:shadow-xl hover:-translate-y-1 ${ebook.color}`}
              >
                <div className="bg-white p-4 rounded-2xl w-fit mb-6 shadow-sm">
                  <BookOpen size={32} className="text-lavender-600" />
                </div>

                <div className="flex-grow mb-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-lavender-400 mb-2">E-book VIP</p>
                  <h4 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{ebook.title}</h4>
                  <p className="text-gray-500 text-sm line-clamp-2">{ebook.description}</p>
                </div>

                <a
                  href={ebook.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold transition-all shadow-md active:scale-95 ${ebook.btnColor}`}
                >
                  <Download size={20} />
                  Baixar Guia
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 p-12 bg-white rounded-[3rem] border-2 border-dashed border-lavender-200 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Tem uma sugestão de conteúdo?</h3>
          <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
            Como membro VIP, sua voz é prioridade. Diga-nos qual tema você gostaria de ver aqui!
          </p>

          {showSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl font-bold border border-emerald-100"
            >
              Sugestão enviada com sucesso! Obrigado pelo apoio.
            </motion.div>
          ) : (
            <div className="space-y-4 max-w-xl mx-auto">
              <textarea
                value={suggestionText}
                onChange={(e) => setSuggestionText(e.target.value)}
                placeholder="Escreva sua sugestão aqui..."
                className="w-full p-6 bg-lavender-50 rounded-2xl border-none focus:ring-2 focus:ring-lavender-200 resize-none text-lg min-h-[150px]"
              />

              <button
                onClick={handleSubmitSuggestion}
                disabled={isSending || !suggestionText.trim()}
                className="w-full bg-lavender-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-lavender-700 transition-all shadow-xl shadow-lavender-200 active:scale-95 disabled:bg-gray-300 disabled:shadow-none"
              >
                {isSending ? 'A enviar...' : 'Enviar Sugestão'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
