import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, PhoneOff, Volume2, MoreVertical, Heart, Send, MessageSquare, Mic as MicIcon } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { useSofiaVoice, VoiceCapability } from '../hooks/useSofiaVoice';
import { useSofiaOrchestrator } from '../hooks/useSofiaOrchestrator';

import { SofiaState, InteractionMode } from '../types';

export const SofiaCallScreen = ({ onEndCall }: { onEndCall: () => void }) => {
  const { isListening, isProcessing, isSpeaking, startListening, stopListening, speak, checkCapabilities } = useSofiaVoice();
  const { processTurn, state: orchestratorState, setState: setOrchestratorState } = useSofiaOrchestrator();
  const [sofiaState, setSofiaState] = useState<SofiaState>('idle');
  const [mode, setMode] = useState<InteractionMode>('text');
  const [textInput, setTextInput] = useState('');
  const [messages, setMessages] = useState<{sender: 'user' | 'sofia', text: string}[]>([]);
  const hasInitialized = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initConversation = useCallback(async () => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    const capability = checkCapabilities();
    let initialMode: InteractionMode = 'text';
    
    if (capability === 'full') initialMode = 'voice';
    else if (capability === 'turn_based') initialMode = 'turn_based';
    
    setMode(initialMode);
    setSofiaState('connecting');

    const initialGreeting = "Oi, eu sou a Sofia. Estou aqui com você.";
    setMessages([{sender: 'sofia', text: initialGreeting}]);

    if (initialMode === 'text') {
      setSofiaState('fallback_text');
      return;
    }

    try {
      await speak(initialGreeting);
      setSofiaState('ready');
      if (initialMode === 'voice') {
        setSofiaState('listening');
        startListening();
      } else {
        setSofiaState('listening');
      }
    } catch (err) {
      console.error("Initialization failed:", err);
      setMode('text');
      setSofiaState('fallback_text');
      setMessages(prev => [...prev, {sender: 'sofia', text: "A voz não ficou disponível. Vamos continuar por texto."}]);
    }
  }, [speak, startListening, checkCapabilities]);

  useEffect(() => {
    initConversation();
  }, [initConversation]);

  const handleStopListening = async () => {
    setSofiaState('processing');
    const transcript = await stopListening();
    if (transcript) {
      setMessages(prev => [...prev, {sender: 'user', text: transcript}]);
      const res = await processTurn(transcript);
      setSofiaState('speaking');
      setMessages(prev => [...prev, {sender: 'sofia', text: res.response}]);
      await speak(res.response);
      
      if (mode === 'voice') {
        setSofiaState('listening');
        startListening();
      } else {
        setSofiaState('ready');
      }
    } else {
      setSofiaState('listening');
      if (mode === 'voice') startListening();
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    const userText = textInput;
    setMessages(prev => [...prev, {sender: 'user', text: userText}]);
    setTextInput('');
    setSofiaState('processing');
    const res = await processTurn(userText);
    setSofiaState('speaking');
    setMessages(prev => [...prev, {sender: 'sofia', text: res.response}]);
    
    if (mode !== 'text') {
      await speak(res.response);
      setSofiaState('listening');
      if (mode === 'voice') startListening();
    } else {
      setSofiaState('fallback_text');
    }
  };

  const switchToText = () => {
    stopListening();
    setMode('text');
    setSofiaState('fallback_text');
  };

  const getStatusMessage = () => {
    if (sofiaState === 'fallback_text') return 'Conversando por texto';
    switch (sofiaState) {
      case 'connecting': return 'Conectando...';
      case 'listening': return mode === 'turn_based' ? 'Toque no microfone para falar' : 'Pode falar, estou ouvindo...';
      case 'processing': return 'Entendendo...';
      case 'speaking': return 'Sofia está respondendo...';
      case 'error': return 'Ops, tive um probleminha técnico.';
      default: return 'Sofia está pronta';
    }
  };

  const retryConnection = () => {
    hasInitialized.current = false;
    setSofiaState('idle');
    initConversation();
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-slate-900/50 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${sofiaState === 'ready' || sofiaState === 'listening' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-500'}`} />
          <div>
            <h2 className="text-sm font-bold text-white">Sofia IA</h2>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">
              {mode === 'voice' ? 'Voz Contínua' : mode === 'turn_based' ? 'Áudio por Turno' : 'Modo Texto'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {mode !== 'text' && (
            <button 
              onClick={switchToText} 
              className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-all"
              title="Mudar para texto"
            >
              <MessageSquare size={18} />
            </button>
          )}
          <button 
            onClick={onEndCall} 
            className="p-2.5 bg-red-500/10 hover:bg-red-500/20 rounded-xl text-red-400 transition-all"
            title="Encerrar"
          >
            <PhoneOff size={18} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {mode === 'text' || sofiaState === 'fallback_text' ? (
          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 custom-scrollbar">
              {messages.map((m, i) => (
                <div 
                  key={i} 
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                    m.sender === 'user' 
                      ? 'bg-sky-600 text-white rounded-tr-none' 
                      : 'bg-slate-800 text-slate-200 rounded-tl-none border border-white/5'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="flex gap-2 bg-slate-900 p-2 rounded-2xl border border-white/5 shadow-2xl">
              <input 
                value={textInput} 
                onChange={(e) => setTextInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
                className="flex-1 bg-transparent p-3 text-sm text-white outline-none placeholder:text-slate-500"
                placeholder="Escreva sua mensagem..."
                autoFocus
              />
              <button 
                onClick={handleTextSubmit} 
                disabled={!textInput.trim() || sofiaState === 'processing'}
                className="p-3 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 disabled:hover:bg-sky-500 rounded-xl transition-all shadow-lg shadow-sky-500/20"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="relative">
              <Avatar state={sofiaState === 'speaking' ? 'speaking' : sofiaState === 'listening' ? 'listening' : 'idle'} />
              {sofiaState === 'processing' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border-4 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div className="mt-12 text-center">
              <p className="text-xl font-medium text-white mb-2">{getStatusMessage()}</p>
              <p className="text-sm text-slate-400 max-w-xs mx-auto mb-6">
                {sofiaState === 'listening' && mode === 'voice' ? 'Fale naturalmente, eu estou ouvindo.' : 
                 sofiaState === 'listening' && mode === 'turn_based' ? 'Toque no botão abaixo para começar a falar.' : 
                 sofiaState === 'processing' ? 'Estou processando o que você disse...' : 
                 sofiaState === 'error' ? 'Houve um erro na conexão. Tente novamente.' : ''}
              </p>
              {sofiaState === 'error' && (
                <button 
                  onClick={retryConnection}
                  className="px-6 py-3 bg-sky-500 hover:bg-sky-400 rounded-2xl font-bold transition-all shadow-lg shadow-sky-500/20"
                >
                  Tentar Novamente
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Voice Controls */}
      {mode !== 'text' && sofiaState !== 'fallback_text' && (
        <div className="p-8 flex justify-center items-center bg-slate-900/80 border-t border-white/5 backdrop-blur-xl">
          <button 
            onClick={() => {
              if (sofiaState === 'listening') {
                handleStopListening();
              } else if (sofiaState === 'ready' || sofiaState === 'speaking') {
                startListening();
              }
            }}
            disabled={sofiaState === 'processing' || sofiaState === 'connecting'}
            className={`relative p-8 rounded-full transition-all duration-300 transform active:scale-95 ${
              sofiaState === 'listening' 
                ? 'bg-sky-500 text-white shadow-[0_0_30px_rgba(14,165,233,0.4)]' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            } disabled:opacity-50`}
          >
            {sofiaState === 'listening' ? <Mic size={36} /> : <MicIcon size={36} />}
            {sofiaState === 'listening' && (
              <span className="absolute inset-0 rounded-full bg-sky-500 animate-ping opacity-20" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};
