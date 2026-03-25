import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, PhoneOff, Volume2, MoreVertical, Heart } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { useVoiceCapture } from '../hooks/useVoiceCapture';
import { useSofiaOrchestrator } from '../hooks/useSofiaOrchestrator';

export type CallState = 'idle' | 'connecting' | 'listening' | 'processing' | 'retrieving' | 'thinking' | 'speaking' | 'urgent' | 'finished';

export const SofiaCallScreen = ({ onEndCall }: { onEndCall: () => void }) => {
  const { isListening, transcript, startListening, stopListening } = useVoiceCapture();
  const { processTurn, state, setState } = useSofiaOrchestrator();
  const [lastResponse, setLastResponse] = useState<{ response: string, grounding?: any[] } | null>(null);

  // 1. Início automático
  useEffect(() => {
    setState('connecting');
    const timer = setTimeout(() => {
      setState('speaking');
      setLastResponse({ response: "Oi, eu sou a Sofia. Estou aqui pra te ajudar. Pode falar comigo." });
      
      // Após a fala inicial, inicia a escuta
      setTimeout(() => {
        startListening();
      }, 2000);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // 2. Loop de escuta contínua
  useEffect(() => {
    if (state === 'listening' && transcript) {
      stopListening();
      setState('processing');
      processTurn(transcript).then(res => {
        setLastResponse(res);
        setState('speaking');
        
        // Após responder, volta a escutar
        setTimeout(() => {
          startListening();
        }, 3000);
      });
    }
  }, [state, transcript, processTurn, stopListening, startListening, setState]);

  // 3. Botão central (pausa/retoma)
  const toggleListening = () => {
    if (isListening) {
      stopListening();
      setState('idle');
    } else {
      startListening();
      setState('listening');
    }
  };

  // 4. Silêncio inteligente
  useEffect(() => {
    let silenceTimer: NodeJS.Timeout;
    if (state === 'listening') {
      silenceTimer = setTimeout(() => {
        setLastResponse({ response: "Pode falar comigo no seu tempo. Estou aqui com você." });
      }, 7000);
    }
    return () => clearTimeout(silenceTimer);
  }, [state]);

  const getStatusMessage = () => {
    switch (state) {
      case 'connecting': return 'Conectando...';
      case 'listening': return 'Estou ouvindo você...';
      case 'processing': return 'Processando...';
      case 'thinking': return 'Estou organizando isso com você...';
      case 'retrieving': return 'Buscando informações relevantes...';
      case 'speaking': return 'Sofia está falando...';
      case 'urgent': return 'Modo de emergência ativo';
      default: return 'Sofia está pronta';
    }
  };

  const getAvatarState = () => {
    switch (state) {
      case 'listening': return 'listening';
      case 'speaking': return 'speaking';
      case 'processing':
      case 'thinking':
      case 'retrieving':
      case 'connecting': return 'processing';
      case 'urgent': return 'urgent';
      default: return 'idle';
    }
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
