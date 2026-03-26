import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Lock, Crown, Loader2, Download, Heart, BookOpen, ShieldCheck, ExternalLink, ShieldAlert, Video, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PlanosVip from './PlanosVip';
import DonationSupportCard from './DonationSupportCard';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const loading = !authReady;

  const [suggestionText, setSuggestionText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
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
      alert(t('vip.suggestionError'));
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    console.log('[VIP] AreaVip render');
    console.log('[VIP] authReady:', authReady);
    console.log('[VIP] authenticated:', !!user);
    console.log('[VIP] isVip:', isVip);
    console.log('[VIP] isAdmin:', isAdmin);
    console.log('[VIP] download allowed:', effectiveVip);
  }, [authReady, user, isVip, isAdmin, effectiveVip]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-sky-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium">{t('vip.verifyingAccess')}</p>
      </div>
    );
  }

  if (!user && isGuest) {
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('vip.restrictedAccess')}</h2>
          <p className="text-gray-600 text-xl leading-relaxed mb-8">
            {t('vip.loginToAccess')}
          </p>
        </motion.div>
      </div>
    );
  }

  const ebooks = [
    {
      id: '1',
      title: t('vip.ebooks.crises.title'),
      description: t('vip.ebooks.crises.description'),
      url: 'https://drive.google.com/file/d/1H4WwZKD7jqqbkMccFjc6PiyDTn0nqJPM/view?usp=drivesdk',
      color: 'border-sky-100 bg-sky-50/30',
      btnColor: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      id: '2',
      title: t('vip.ebooks.direitos.title'),
      description: t('vip.ebooks.direitos.description'),
      url: 'https://drive.google.com/file/d/1T9stxGqRGRA8w1sWqNB-9FnamWBwnzc0/view?usp=drivesdk',
      color: 'border-emerald-100 bg-emerald-50/30',
      btnColor: 'bg-emerald-500 hover:bg-emerald-600'
    },
    {
      id: '3',
      title: t('vip.ebooks.seletividade.title'),
      description: t('vip.ebooks.seletividade.description'),
      url: 'https://drive.google.com/file/d/1wIwhkQsuaJJqdtDfCjBPgjLirIj8AqKC/view?usp=drivesdk',
      color: 'border-sky-100 bg-sky-50/30',
      btnColor: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      id: '4',
      title: t('vip.ebooks.higiene.title'),
      description: t('vip.ebooks.higiene.description'),
      url: 'https://drive.google.com/file/d/1rl_vcqm3uZWMCTz38MRi3KgxaRtYqJTp/view?usp=drivesdk',
      color: 'border-emerald-100 bg-emerald-50/30',
      btnColor: 'bg-emerald-500 hover:bg-emerald-600'
    },
    {
      id: '5',
      title: t('vip.ebooks.diagnostico.title'),
      description: t('vip.ebooks.diagnostico.description'),
      url: 'https://drive.google.com/file/d/1GsICIFDJZb30xTT3AujMlsxEVre0iHzg/view?usp=drivesdk',
      color: 'border-sky-100 bg-sky-50/30',
      btnColor: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      id: '6',
      title: t('vip.ebooks.sinais.title'),
      description: t('vip.ebooks.sinais.description'),
      url: 'https://drive.google.com/file/d/14g7yE7Yk6Aa__QM309PoFY_fjUL4EL2p/view?usp=drivesdk',
      color: 'border-emerald-100 bg-emerald-50/30',
      btnColor: 'bg-emerald-500 hover:bg-emerald-600'
    },
    {
      id: '7',
      title: t('vip.ebooks.guia.title'),
      description: t('vip.ebooks.guia.description'),
      url: 'https://drive.google.com/file/d/1aFcrP3_-16aRFRypJ-tlrqO1WdXygBNC/view?usp=drivesdk',
      color: 'border-sky-100 bg-sky-50/30',
      btnColor: 'bg-sky-500 hover:bg-sky-600'
    }
  ];

  const vipVideos = [
    {
      id: 'v1',
      title: 'Estratégias Avançadas de Regulação Sensorial',
      description: 'Aprenda técnicas práticas para ajudar na regulação sensorial no dia a dia.',
      videoId: 'TW2Y33Tqja8',
      color: 'border-purple-100 bg-purple-50/30',
      btnColor: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 'v2',
      title: 'Comunicação Alternativa e Aumentativa (CAA)',
      description: 'Como introduzir e utilizar sistemas de comunicação alternativa.',
      videoId: 'k382m4l-yq0',
      color: 'border-rose-100 bg-rose-50/30',
      btnColor: 'bg-rose-500 hover:bg-rose-600'
    },
    {
      id: 'v3',
      title: 'Manejo de Comportamentos Desafiadores',
      description: 'Entendendo a função do comportamento e estratégias de intervenção.',
      videoId: 'gM218B11B8w',
      color: 'border-amber-100 bg-amber-50/30',
      btnColor: 'bg-amber-500 hover:bg-amber-600'
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
                  {effectiveVip ? t('vip.welcomeVip') : t('vip.welcomeLibrary')}
                </h2>
                <p className="text-gray-600 text-xl leading-relaxed">
                  {effectiveVip 
                    ? t('vip.thanksVip')
                    : t('vip.exploreLibrary')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {onNavigate && (
          <div className="mb-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-[3rem] p-8 md:p-12 text-white shadow-xl shadow-red-200 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform active:scale-95" onClick={() => onNavigate('sos')}>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left max-w-xl">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-4">
                  <ShieldAlert size={18} />
                  <span className="text-sm font-bold uppercase tracking-wider">Acesso Rápido</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                  {t('vip.sosSensorial')}
                </h3>
                <p className="text-red-50 text-lg mb-8">
                  Ferramentas imediatas para regulação sensorial, comunicação alternativa e suporte em crises.
                </p>
                <button className="bg-white text-red-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-red-50 transition-all flex items-center justify-center gap-2 shadow-lg">
                  Acessar SOS Agora
                </button>
              </div>
              <div className="hidden lg:block">
                <div className="w-64 h-64 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                  <ShieldAlert size={120} className="text-white opacity-80" />
                </div>
              </div>
            </div>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-red-400/20 rounded-full blur-3xl"></div>
          </div>
        )}

        <div className="mb-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[3rem] p-8 md:p-12 text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-4">
                <ShieldCheck size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">{t('vip.officialPartner')}</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                {t('vip.triagemTitle')}
              </h3>

              <p className="text-emerald-50 text-lg mb-8">
                {t('vip.triagemSubtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="https://sites.google.com/view/triagemteaia/portugu%C3%AAs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-emerald-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <ExternalLink size={20} />
                  {t('vip.goToSite')}
                </a>

                {appDownloadUrl ? (
                  <a
                    href={appDownloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-800/30 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-800/40 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={20} />
                    {t('vip.downloadApp')}
                  </a>
                ) : (
                  <button
                    disabled
                    className="bg-emerald-800/20 border border-white/20 text-white/70 px-8 py-4 rounded-2xl font-bold text-lg cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Download size={20} />
                    {t('vip.appSoon')}
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

        <div>
          <div className="flex items-center gap-3 mb-8 px-4">
            <BookOpen className="text-lavender-600" size={32} />
            <h3 className="text-2xl font-bold text-gray-900">{t('vip.materialsTitle')}</h3>
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
                  <p className="text-xs font-bold uppercase tracking-wider text-lavender-400 mb-2">{t('vip.ebookVip')}</p>
                  <h4 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{ebook.title}</h4>
                  <p className="text-gray-500 text-sm line-clamp-2">{ebook.description}</p>
                </div>

                {effectiveVip ? (
                  <a
                    href={ebook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold transition-all shadow-md active:scale-95 ${ebook.btnColor}`}
                  >
                    <Download size={20} />
                    {t('vip.downloadGuide')}
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      console.log('[VIP] download blocked for non-vip');
                      alert(t('vip.subscribeToDownload'));
                    }}
                    className="flex items-center justify-center gap-2 py-4 rounded-2xl text-gray-400 bg-gray-100 font-bold transition-all cursor-not-allowed"
                  >
                    <Lock size={20} />
                    {t('vip.vipOnly')}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <div className="flex items-center gap-3 mb-8 px-4">
            <Video className="text-lavender-600" size={32} />
            <h3 className="text-2xl font-bold text-gray-900">Vídeos Exclusivos VIP</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vipVideos.map((video) => (
              <div
                key={video.id}
                className={`flex flex-col p-8 rounded-[2.5rem] border transition-all hover:shadow-xl hover:-translate-y-1 ${video.color}`}
              >
                <div className="bg-white p-4 rounded-2xl w-fit mb-6 shadow-sm">
                  <PlayCircle size={32} className="text-lavender-600" />
                </div>

                <div className="flex-grow mb-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-lavender-400 mb-2">Vídeo VIP</p>
                  <h4 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{video.title}</h4>
                  <p className="text-gray-500 text-sm line-clamp-2">{video.description}</p>
                </div>

                {effectiveVip ? (
                  <button
                    onClick={() => setSelectedVideo(video.videoId)}
                    className={`flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold transition-all shadow-md active:scale-95 ${video.btnColor}`}
                  >
                    <PlayCircle size={20} />
                    Assistir Agora
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      alert(t('vip.subscribeToDownload'));
                    }}
                    className="flex items-center justify-center gap-2 py-4 rounded-2xl text-gray-400 bg-gray-100 font-bold transition-all cursor-not-allowed"
                  >
                    <Lock size={20} />
                    {t('vip.vipOnly')}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {!effectiveVip && (
          <div className="mt-12 bg-lavender-100/50 border border-lavender-200 rounded-3xl p-8 text-center">
            <h3 className="text-xl font-bold text-lavender-800 mb-2">{t('vip.viewingLibrary')}</h3>
            <p className="text-lavender-600 mb-6">{t('vip.becomeVipToUnlock')}</p>
            <PlanosVip isVip={effectiveVip} />
          </div>
        )}

        <div className="mt-12">
          <DonationSupportCard />
        </div>

        <div className="mt-20 p-12 bg-white rounded-[3rem] border-2 border-dashed border-lavender-200 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('vip.suggestionTitle')}</h3>
          <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
            {t('vip.suggestionSubtitle')}
          </p>

          {showSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl font-bold border border-emerald-100"
            >
              {t('vip.suggestionSuccess')}
            </motion.div>
          ) : (
            <div className="space-y-4 max-w-xl mx-auto">
              <textarea
                value={suggestionText}
                onChange={(e) => setSuggestionText(e.target.value)}
                placeholder={t('vip.suggestionPlaceholder')}
                className="w-full p-6 bg-lavender-50 rounded-2xl border-none focus:ring-2 focus:ring-lavender-200 resize-none text-lg min-h-[150px]"
              />

              <button
                onClick={handleSubmitSuggestion}
                disabled={isSending || !suggestionText.trim()}
                className="w-full bg-lavender-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-lavender-700 transition-all shadow-xl shadow-lavender-200 active:scale-95 disabled:bg-gray-300 disabled:shadow-none"
              >
                {isSending ? t('vip.sending') : t('vip.sendSuggestion')}
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              >
                <Lock size={24} className="hidden" /> {/* Just to keep import used if needed, but actually I'll use a close icon, wait, I didn't import X. Let me just use text or a simple SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="YouTube video player"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
