import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PhoneOff, Send, MessageSquare, Loader2, AlertCircle, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSofiaOrchestrator } from '../hooks/useSofiaOrchestrator';
import { SofiaState } from '../types';
import Markdown from 'react-markdown';

export const SofiaCallScreen = ({ onEndCall, isVip }: { onEndCall: () => void, isVip: boolean }) => {
  const { t, i18n } = useTranslation();
  const { processTurn, state: orchestratorState } = useSofiaOrchestrator();
  const [sofiaState, setSofiaState] = useState<SofiaState>('idle');
  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState<{sender: 'user' | 'sofia', text: string, suggestSupport?: boolean, suggestedAction?: string}[]>([]);
  const [messageCount, setMessageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const hasInitialized = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const txt = {
    pt: {
      initialGreeting: "Oi, eu sou a Sofia. Estou aqui para te ouvir e apoiar. Como você está se sentindo hoje?",
      errorMsg: "Estamos com instabilidade no momento. Tente novamente em instantes.",
      thinking: "Pensando...",
      online: "Online",
      titleMsg: "Estou aqui para te ouvir e apoiar em sua jornada. Sinta-se à vontade para compartilhar o que estiver sentindo.",
      connecting: "Iniciando conversa segura...",
      clearError: "Limpar erro e continuar",
      placeholder: "Escreva sua mensagem...",
      limitOver: "Seu limite gratuito acabou hoje.",
      limitDesc: "Não pague por um aplicativo. Invista na sua paz de espírito. Ter o Conecta VIP é como ter um especialista e um ombro amigo no seu bolso de madrugada por menos do que você gasta em um lanche. Liberte-se da solidão e saiba exatamente o que fazer na próxima crise. Assine agora.",
      unlockBtn: "Liberar Chat Ilimitado (R$ 9,99/mês)",
      paywallHref: "https://pag.ae/81AiqTpHL",
      comeBackLater: "Voltar depois"
    },
    en: {
      initialGreeting: "Hi, I'm Sofia. I'm here to listen and support you. How are you feeling today?",
      errorMsg: "We are experiencing instability at the moment. Please try again soon.",
      thinking: "Thinking...",
      online: "Online",
      titleMsg: "I'm here to listen and support you on your journey. Feel free to share whatever you're feeling.",
      connecting: "Starting secure conversation...",
      clearError: "Clear error and continue",
      placeholder: "Type your message...",
      limitOver: "Your free limit is over for today.",
      limitDesc: "Don't pay for an app. Invest in your peace of mind. Having Conecta VIP is like having an expert and a friendly shoulder in your pocket at dawn for less than you spend on a snack. Free yourself from loneliness and know exactly what to do in the next meltdown. Subscribe now.",
      unlockBtn: "Unlock Unlimited Chat (US$ 9.99/mo)",
      paywallHref: "https://pag.ae/81AiqTpHL",
      comeBackLater: "Come back later"
    },
    es: {
      initialGreeting: "Hola, soy Sofía. Estoy aquí para escucharte y apoyarte. ¿Cómo te sientes hoy?",
      errorMsg: "Estamos experimentando inestabilidad en este momento. Por favor, inténtalo de nuevo pronto.",
      thinking: "Pensando...",
      online: "En línea",
      titleMsg: "Estoy aquí para escucharte y apoyarte en tu viaje. Siéntete libre de compartir lo que estés sintiendo.",
      connecting: "Iniciando conversación segura...",
      clearError: "Borrar error y continuar",
      placeholder: "Escribe tu mensaje...",
      limitOver: "Tu límite gratuito ha terminado por hoy.",
      limitDesc: "No pagues por una aplicación. Invierte en tu tranquilidad. Tener Conecta VIP es como tener a un experto y un hombro amigable en tu bolsillo de madrugada por menos de lo que gastas en un refrigerio. Libérate de la soledad y sabe exactamente qué hacer en la próxima crisis. Suscríbete ahora.",
      unlockBtn: "Desbloquear Chat Ilimitado (US$ 9.99/mes)",
      paywallHref: "https://pag.ae/81AiqTpHL",
      comeBackLater: "Volver más tarde"
    },
    ja: {
      initialGreeting: "こんにちは、ソフィアです。あなたのお話を聴き、サポートするためにここにいます。今日の気分はどうですか？",
      errorMsg: "現在不安定な状況です。しばらくしてからもう一度お試しください。",
      thinking: "考え中...",
      online: "オンライン",
      titleMsg: "あなたの旅に寄り添い、サポートするためにここにいます。感じていることを何でも自由に共有してください。",
      connecting: "安全な会話を開始しています...",
      clearError: "エラーをクリアして続行",
      placeholder: "メッセージを入力してください...",
      limitOver: "今日の無料上限に達しました。",
      limitDesc: "アプリにお金を払うのではなく、心の平安に投資してください。Conecta VIPを持つことは、夜明けにおやつ代以下の費用で、ポケットに専門家と優しい友人がいるようなものです。孤独から解放され、次のパニック時に何をすべきかを正確に知ることができます。今すぐ登録してください。",
      unlockBtn: "無制限チャットをロック解除 (US$ 9.99/月)",
      paywallHref: "https://pag.ae/81AiqTpHL",
      comeBackLater: "後で戻る"
    }
  };

  const langMatch = i18n.language && i18n.language.substring(0, 2) || 'pt';
  const c = txt[langMatch as keyof typeof txt] || txt['pt'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sofiaState, showPaywall]);

  const initConversation = useCallback(async () => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    setSofiaState('ready');
    setMessages([{sender: 'sofia', text: c.initialGreeting}]);
  }, [c.initialGreeting]);

  useEffect(() => {
    initConversation();
  }, [initConversation]);

  const handleTextSubmit = async () => {
    if (!textInput.trim() || sofiaState === 'processing') return;

    // No limit on messages - open for all users
    const userText = textInput;
    setMessages(prev => [...prev, {sender: 'user', text: userText}]);
    setTextInput('');
    setSofiaState('processing');

    try {
      const res = await processTurn(userText, i18n.language);
      setMessages(prev => [...prev, {
        sender: 'sofia', 
        text: res.response, 
        suggestSupport: res.suggestSupport, 
        suggestedAction: res.suggestedAction
      }]);
      setMessageCount(prev => prev + 1);
      setSofiaState('ready');
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'sofia', 
        text: c.errorMsg 
      }]);
      setSofiaState('error');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden font-sans">
      {/* Header */}
      <div className="flex justify-between items-center p-5 bg-slate-900/80 border-b border-white/5 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${sofiaState === 'ready' || sofiaState === 'processing' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-500'} transition-all duration-500`} />
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Sofia IA</h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-semibold">
              {sofiaState === 'processing' ? c.thinking : c.online}
            </p>
          </div>
        </div>
        <button 
          onClick={onEndCall} 
          className="p-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 transition-all border border-red-500/20"
          title="Encerrar conversa"
        >
          <PhoneOff size={18} />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_50%_50%,_#0f172a_0%,_#020617_100%)]">
        <div className="flex-1 flex flex-col p-4 md:p-8 overflow-hidden max-w-4xl mx-auto w-full">
          {/* Explanatory Text */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Sofia IA</h1>
            <p className="text-slate-400 text-sm md:text-base max-w-md mx-auto">
              {c.titleMsg}
            </p>
          </div>

          {sofiaState === 'connecting' ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
              <p className="text-slate-400 text-sm animate-pulse">{c.connecting}</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto flex flex-col pr-2 custom-scrollbar space-y-6 pb-4">
                {messages.map((m, index) => (
                  <div 
                    key={index}
                    className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`relative p-4 md:p-5 rounded-2xl max-w-[85%] text-sm md:text-base leading-relaxed shadow-lg ${
                      m.sender === 'user' 
                        ? 'bg-sky-600 text-white rounded-tr-none shadow-sky-900/20' 
                        : 'bg-slate-800 text-slate-100 rounded-tl-none border border-white/5 shadow-black/40'
                    }`}>
                      {m.sender === 'user' ? (
                        m.text
                      ) : (
                        <div className="markdown-body text-slate-100 prose prose-invert prose-sm max-w-none">
                          <Markdown>{m.text}</Markdown>
                        </div>
                      )}
                      <div className={`absolute top-0 ${m.sender === 'user' ? '-right-1 border-l-sky-600' : '-left-1 border-r-slate-800'} w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[8px]`} />
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="mt-4">
                {sofiaState === 'processing' && (
                  <div className="flex justify-start mb-6 animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="bg-slate-800/50 p-4 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}

                {sofiaState === 'error' && (
                  <div className="flex justify-center mb-4">
                    <button 
                      onClick={() => setSofiaState('ready')}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-xs text-slate-400 transition-all border border-white/5"
                    >
                      <AlertCircle size={14} />
                      {c.clearError}
                    </button>
                  </div>
                )}
                
                <div className="flex gap-2 bg-slate-900/90 p-2 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl focus-within:border-sky-500/50 transition-all">
                  <input 
                    value={textInput} 
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                    className="flex-1 bg-transparent px-4 py-4 text-sm md:text-base text-white outline-none placeholder:text-slate-500"
                    placeholder={c.placeholder}
                    autoFocus
                  />
                  <button 
                    onClick={handleTextSubmit} 
                    disabled={!textInput.trim() || sofiaState === 'processing'}
                    className="p-4 bg-sky-500 hover:bg-sky-400 disabled:opacity-30 disabled:hover:bg-sky-500 rounded-xl transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center min-w-[56px]"
                  >
                    {sofiaState === 'processing' ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {showPaywall && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl max-w-md w-full text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white mb-4">{c.limitOver}</h2>
            <p className="text-slate-300 mb-8 leading-relaxed">
              {c.limitDesc}
            </p>
            <a 
              href={c.paywallHref}
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full bg-amber-500 hover:bg-amber-600 text-slate-900 py-4 rounded-xl font-black text-lg mb-4"
            >
              {c.unlockBtn}
            </a>
            <button 
              onClick={() => setShowPaywall(false)}
              className="text-sm text-slate-500 hover:text-slate-400"
            >
              {c.comeBackLater}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
