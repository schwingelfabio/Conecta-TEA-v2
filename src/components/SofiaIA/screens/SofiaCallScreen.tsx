import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PhoneOff, Send, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { useSofiaOrchestrator } from '../hooks/useSofiaOrchestrator';
import { SofiaState } from '../types';
import Markdown from 'react-markdown';

export const SofiaCallScreen = ({ onEndCall }: { onEndCall: () => void }) => {
  const { processTurn, state: orchestratorState } = useSofiaOrchestrator();
  const [sofiaState, setSofiaState] = useState<SofiaState>('idle');
  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState<{sender: 'user' | 'sofia', text: string, suggestSupport?: boolean, suggestedAction?: string}[]>([]);
  const hasInitialized = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sofiaState]);

  const initConversation = useCallback(async () => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    setSofiaState('ready');
    const initialGreeting = "Oi, eu sou a Sofia. Estou aqui para te ouvir e apoiar. Como você está se sentindo hoje?";
    setMessages([{sender: 'sofia', text: initialGreeting}]);
  }, []);

  useEffect(() => {
    initConversation();
  }, [initConversation]);

  const handleTextSubmit = async () => {
    console.log('[SofiaCallScreen] handleTextSubmit called with text:', textInput);
    if (!textInput.trim() || sofiaState === 'processing') {
      console.log('[SofiaCallScreen] Ignoring submit. textInput empty or already processing.');
      return;
    }
    
    const userText = textInput;
    setMessages(prev => {
      console.log('[SofiaCallScreen] Adding user message to state:', userText);
      return [...prev, {sender: 'user', text: userText}];
    });
    setTextInput('');
    setSofiaState('processing');

    try {
      console.log('[SofiaCallScreen] Calling processTurn...');
      const res = await processTurn(userText);
      console.log('[SofiaCallScreen] processTurn returned:', res);
      setMessages(prev => {
        console.log('[SofiaCallScreen] Adding sofia message to state:', res.response);
        return [...prev, {
          sender: 'sofia', 
          text: res.response, 
          suggestSupport: res.suggestSupport, 
          suggestedAction: res.suggestedAction
        }];
      });
      setSofiaState('ready');
    } catch (err) {
      console.error("[SofiaCallScreen] Error in Sofia response:", err);
      setMessages(prev => [...prev, {
        sender: 'sofia', 
        text: "Estamos com instabilidade no momento. Tente novamente em instantes." 
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
              {sofiaState === 'processing' ? 'Pensando...' : 'Online'}
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
              Estou aqui para te ouvir e apoiar em sua jornada. Sinta-se à vontade para compartilhar o que estiver sentindo.
            </p>
          </div>

          {sofiaState === 'connecting' ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
              <p className="text-slate-400 text-sm animate-pulse">Iniciando conversa segura...</p>
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
                          {m.suggestSupport && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              <button className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-bold transition-all">
                                ❤️ Support Project
                              </button>
                              <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-xs font-bold transition-all">
                                ⭐ Become VIP
                              </button>
                            </div>
                          )}
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
                      Limpar erro e continuar
                    </button>
                  </div>
                )}
                
                <div className="flex gap-2 bg-slate-900/90 p-2 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl focus-within:border-sky-500/50 transition-all">
                  <input 
                    value={textInput} 
                    onChange={(e) => setTextInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                    className="flex-1 bg-transparent px-4 py-4 text-sm md:text-base text-white outline-none placeholder:text-slate-500"
                    placeholder="Escreva sua mensagem..."
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
    </div>
  );
};
