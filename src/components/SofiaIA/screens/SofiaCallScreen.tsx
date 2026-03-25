import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, PhoneOff, AlertTriangle, BookOpen } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { useVoiceCapture } from '../hooks/useVoiceCapture';
import { useSofiaOrchestrator } from '../hooks/useSofiaOrchestrator';

export type CallState = 'idle' | 'connecting' | 'listening' | 'processing' | 'retrieving' | 'thinking' | 'speaking' | 'urgent' | 'finished';

export const SofiaCallScreen = ({ onEndCall }: { onEndCall: () => void }) => {
  const { isListening, transcript, startListening, stopListening } = useVoiceCapture();
  const { processTurn, state, setState } = useSofiaOrchestrator();
  const [lastResponse, setLastResponse] = useState<{ response: string, grounding?: any[] } | null>(null);

  useEffect(() => {
    if (isListening) {
      setState('listening');
    } else if (state === 'listening' && transcript) {
      processTurn(transcript).then(res => {
        setLastResponse(res);
        setState('speaking');
      });
    }
  }, [isListening, transcript, processTurn, state, setState]);

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

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white p-4">
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Avatar Component */}
        <Avatar state={state} />
        
        {/* Status Message */}
        <p className="text-lg font-medium text-slate-300 mt-8">{getStatusMessage()}</p>
        {isListening && <p className="text-sm text-slate-400 mt-2 italic">"{transcript}"</p>}
        {lastResponse && !isListening && <p className="text-sm text-slate-100 mt-4">"{lastResponse.response}"</p>}
        {lastResponse?.grounding && lastResponse.grounding.length > 0 && (
          <div className="mt-4 text-xs text-slate-400">
            <p>Fontes:</p>
            {lastResponse.grounding.map((g: any, i: number) => (
              <a key={i} href={g.web?.uri} target="_blank" rel="noreferrer" className="block underline">{g.web?.title}</a>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-slate-800 rounded-2xl">
        <button 
          onClick={isListening ? stopListening : startListening}
          className={`p-4 rounded-full flex justify-center ${isListening ? 'bg-red-500' : 'bg-slate-700'}`}
        >
          {isListening ? <MicOff /> : <Mic />}
        </button>
        <button className="p-4 bg-slate-700 rounded-full flex justify-center"><BookOpen /></button>
        <button className="p-4 bg-red-900 rounded-full flex justify-center"><AlertTriangle /></button>
        <button onClick={onEndCall} className="p-4 bg-red-600 rounded-full flex justify-center"><PhoneOff /></button>
      </div>
    </div>
  );
};
