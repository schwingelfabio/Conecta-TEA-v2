import React, { useState, useEffect } from 'react';
import { Mic, MicOff, PhoneOff, Volume2, MoreVertical, Heart } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { useSofiaVoice } from '../hooks/useSofiaVoice';
import { useSofiaOrchestrator } from '../hooks/useSofiaOrchestrator';

export type CallState = 'idle' | 'connecting' | 'listening' | 'processing' | 'retrieving' | 'thinking' | 'speaking' | 'urgent' | 'finished';

export const SofiaCallScreen = ({ onEndCall }: { onEndCall: () => void }) => {
  const { isListening, isProcessing, isSpeaking, startListening, stopListening, speak } = useSofiaVoice();
  const { processTurn, state, setState } = useSofiaOrchestrator();
  const [lastResponse, setLastResponse] = useState<{ response: string, grounding?: any[] } | null>(null);

  // 1. Início automático
  useEffect(() => {
    setState('connecting');
    const timer = setTimeout(async () => {
      const initialGreeting = "Oi, eu sou a Sofia. Estou aqui pra te ajudar. Pode falar comigo.";
      setLastResponse({ response: initialGreeting });
      await speak(initialGreeting);
      setState('listening');
      startListening();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // 2. Loop de conversa contínua
  const handleStopListening = async () => {
    const transcript = await stopListening();
    if (transcript) {
      setState('processing');
      const res = await processTurn(transcript);
      setLastResponse(res);
      setState('speaking');
      await speak(res.response);
      setState('listening');
      startListening();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      handleStopListening();
    } else {
      startListening();
    }
  };

  const getStatusMessage = () => {
    if (isSpeaking) return 'Sofia está falando...';
    if (isProcessing) return 'Processando...';
    if (isListening) return 'Estou ouvindo você...';
    switch (state) {
      case 'connecting': return 'Conectando...';
      case 'thinking': return 'Estou organizando isso com você...';
      case 'retrieving': return 'Buscando informações relevantes...';
      case 'urgent': return 'Modo de emergência ativo';
      default: return 'Sofia está pronta';
    }
  };

  const getAvatarState = () => {
    if (isSpeaking) return 'speaking';
    if (isListening) return 'listening';
    if (isProcessing) return 'processing';
    return 'idle';
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white p-6">
      {/* Top Status */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-slate-400">Sofia IA</span>
        </div>
        <div className="flex gap-4 text-slate-400">
          <button><Volume2 size={20} /></button>
          <button><MoreVertical size={20} /></button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <Avatar state={getAvatarState()} />
        
        <p className="text-lg font-medium text-slate-300 mt-12">{getStatusMessage()}</p>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-8 p-6 bg-slate-900/50 rounded-3xl backdrop-blur-md">
        <button 
          onClick={toggleListening}
          className={`p-6 rounded-full flex justify-center transition-all ${isListening ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-800 text-slate-400'}`}
        >
          {isListening ? <Mic size={32} /> : <MicOff size={32} />}
        </button>
        <button className="p-6 bg-red-900/20 text-red-400 rounded-full flex justify-center"><Heart size={32} /></button>
        <button onClick={onEndCall} className="p-6 bg-red-600/20 text-red-500 rounded-full flex justify-center"><PhoneOff size={32} /></button>
      </div>
    </div>
  );
};
