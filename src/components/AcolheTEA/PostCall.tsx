import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Heart, CheckCircle2, Share2, RefreshCw, ExternalLink, ArrowLeft, LogIn } from 'lucide-react';
import { analytics } from '../../services/logger';

interface PostCallProps {
  summary: any;
  onRestart: () => void;
  onRequireLogin?: () => void;
}

export default function PostCall({ summary, onRestart, onRequireLogin }: PostCallProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (summary) {
      analytics.trackEvent('sofia_summary_viewed', { sessionId: summary.sessionId });
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

      </div>
    </div>
  );
}
