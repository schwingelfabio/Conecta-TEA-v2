import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Heart, CheckCircle2, Share2, RefreshCw, ExternalLink, ArrowLeft, LogIn, Copy, Check, CreditCard } from 'lucide-react';
import { analytics } from '../../services/logger';
import { useTranslation } from 'react-i18next';

interface PostCallProps {
  summary: any;
  onRestart: () => void;
  onRequireLogin?: () => void;
}

export default function PostCall({ summary, onRestart, onRequireLogin }: PostCallProps) {
  const { i18n } = useTranslation();
  const [saved, setSaved] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  const handleCopyPix = () => {
    navigator.clipboard.writeText('01244056065');
    setPixCopied(true);
    analytics.trackEvent('pix_copy_click');
    setTimeout(() => setPixCopied(false), 2000);
  };

  useEffect(() => {
    if (summary) {
      analytics.trackEvent('sofia_summary_viewed', { sessionId: summary.sessionId });
      const timer = setTimeout(() => {
        setShowSupportModal(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [summary]);

  if (!summary) return null;

  const handleSave = () => {
    analytics.trackEvent('sofia_summary_saved', { sessionId: summary.sessionId });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleShare = () => {
    analytics.trackEvent('sofia_summary_shared', { sessionId: summary.sessionId });
    // Implement share logic here
  };

  const handleHumanHelp = () => {
    analytics.trackEvent('sofia_human_help_requested_from_summary', { sessionId: summary.sessionId });
    // Implement human help logic here
  };

  const handleRestartClick = () => {
    analytics.trackEvent('sofia_restart_clicked_from_summary', { sessionId: summary.sessionId });
    onRestart();
  };

  const handleLoginClick = () => {
    analytics.trackEvent('sofia_login_clicked_from_summary', { sessionId: summary.sessionId });
    if (onRequireLogin) onRequireLogin();
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 overflow-y-auto pb-24 relative">
      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative text-center"
          >
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-4">
              <Heart className="w-8 h-8 fill-rose-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              {i18n.language === 'en' ? 'This tool exists to help families.' : 'Esta ferramenta existe para ajudar famílias.'}
            </h3>
            <p className="text-slate-600 mb-8">
              {i18n.language === 'en' ? 'If it helped you, please consider supporting ❤️' : 'Se te ajudou, por favor considere apoiar ❤️'}
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  setShowSupportModal(false);
                  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                }}
                className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-rose-200"
              >
                {i18n.language === 'en' ? 'Support now' : 'Apoiar agora'}
              </button>
              <button 
                onClick={() => setShowSupportModal(false)}
                className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-bold transition-all"
              >
                {i18n.language === 'en' ? 'Maybe later' : 'Talvez depois'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast */}
      {saved && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">Salvo no diário com sucesso!</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={handleRestartClick} className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Resumo da Sessão</h1>
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-8">
        
        {/* Sentimentos Percebidos */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Sentimentos Percebidos</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {summary.feelings.map((feeling: string, index: number) => (
              <span key={index} className="px-4 py-2 bg-rose-50 text-rose-700 rounded-full text-sm font-medium border border-rose-100">
                {feeling}
              </span>
            ))}
          </div>
        </motion.section>

        {/* Orientações Práticas */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-sky-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Orientações Práticas</h2>
          </div>
          <ul className="space-y-3">
            {summary.orientations.map((orientation: string, index: number) => (
              <li key={index} className="flex items-start gap-3 text-slate-600">
                <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{orientation}</span>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Próximos Passos */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Próximos Passos Sugeridos</h2>
          </div>
          <div className="space-y-3">
            {summary.nextSteps.map((step: string, index: number) => (
              <label key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors">
                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 mt-0.5" />
                <span className="text-slate-700 font-medium">{step}</span>
              </label>
            ))}
          </div>
        </motion.section>

        {/* Recursos Úteis */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <ExternalLink className="w-5 h-5 text-purple-500" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Recursos Úteis</h2>
          </div>
          <div className="space-y-3">
            {summary.resources.map((resource: any, index: number) => (
              <a key={index} href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl border border-purple-100 hover:bg-purple-100 transition-colors group">
                <span className="text-purple-900 font-medium">{resource.title}</span>
                <ExternalLink className="w-5 h-5 text-purple-400 group-hover:text-purple-600 transition-colors" />
              </a>
            ))}
          </div>
        </motion.section>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4"
        >
          {onRequireLogin && (
            <div className="sm:col-span-2 mb-4 p-6 bg-sky-50 rounded-3xl border border-sky-100 text-center">
              <h3 className="text-xl font-bold text-sky-900 mb-2">Quer continuar recebendo apoio?</h3>
              <p className="text-sky-700 mb-6">Entre na comunidade Conecta TEA para salvar seu histórico, conversar com outras famílias e ter acesso a mais recursos.</p>
              <button 
                onClick={handleLoginClick}
                className="w-full py-4 px-6 bg-sky-500 hover:bg-sky-600 text-white rounded-full font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-200"
              >
                <LogIn className="w-5 h-5" />
                Entrar no Conecta TEA
              </button>
            </div>
          )}

          <button 
            onClick={handleSave}
            className="py-4 px-6 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <FileText className="w-5 h-5" />
            Salvar no diário
          </button>
          <button onClick={handleShare} className="py-4 px-6 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full font-semibold transition-all flex items-center justify-center gap-2 shadow-sm">
            <Share2 className="w-5 h-5" />
            Compartilhar com parceiro(a)
          </button>
          <button onClick={handleRestartClick} className="py-4 px-6 bg-sky-500 hover:bg-sky-600 text-white rounded-full font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-200">
            <RefreshCw className="w-5 h-5" />
            Falar novamente
          </button>
          <button onClick={handleHumanHelp} className="py-4 px-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200">
            <Heart className="w-5 h-5" />
            Buscar ajuda humana
          </button>
        </motion.div>

        {/* Monetization Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl p-8 shadow-sm border border-rose-100 text-center"
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-rose-500 mx-auto mb-4 shadow-sm">
            <Heart className="w-8 h-8 fill-rose-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            {i18n.language === 'en' ? 'Support this project ❤️' : 'Apoie este projeto ❤️'}
          </h2>
          
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            {i18n.language === 'en' 
              ? 'If this helped you, consider supporting this project so we can help more families worldwide.' 
              : 'Se isso te ajudou, considere apoiar este projeto para ajudar mais famílias.'}
          </p>

          {i18n.language === 'en' ? (
            <div className="space-y-4">
              <a 
                href="https://buy.stripe.com/28E9AU1fH3zobvWfdx2wU01"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.trackEvent('donate_stripe_click')}
                className="inline-flex items-center justify-center gap-2 w-full max-w-sm py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
              >
                <CreditCard className="w-5 h-5" />
                Support with Card / Donate
              </a>
              <p className="text-sm text-slate-500 font-medium">Cancel anytime. No risk.</p>
            </div>
          ) : (
            <div className="max-w-sm mx-auto bg-white p-6 rounded-2xl border border-rose-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">Pagamento via PIX</h3>
              <div className="space-y-2 mb-6 text-left">
                <p className="text-sm text-slate-600"><span className="font-semibold">CPF:</span> 01244056065</p>
                <p className="text-sm text-slate-600"><span className="font-semibold">Nome:</span> Fábio Palacio Schwingel</p>
              </div>
              <button 
                onClick={handleCopyPix}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-200"
              >
                {pixCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {pixCopied ? 'Chave copiada!' : 'Copiar chave PIX'}
              </button>
            </div>
          )}

          <p className="mt-8 text-sm font-medium text-slate-500 italic">
            {i18n.language === 'en' 
              ? 'Even a small support makes a big difference.' 
              : 'Qualquer valor já faz a diferença.'}
          </p>
        </motion.section>

      </div>
    </div>
  );
}
