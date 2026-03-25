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
        setSofiaState('listening');
      }
    } else {
      setSofiaState('listening');
      if (mode === 'voice') startListening();
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    setMessages(prev => [...prev, {sender: 'user', text: textInput}]);
    setTextInput('');
    setSofiaState('processing');
    const res = await processTurn(textInput);
    setSofiaState('fallback_text');
    setMessages(prev => [...prev, {sender: 'sofia', text: res.response}]);
  };

  const getStatusMessage = () => {
    if (sofiaState === 'fallback_text') return 'Conversando por texto';
    switch (sofiaState) {
      case 'connecting': return 'Conectando...';
      case 'listening': return mode === 'turn_based' ? 'Toque no microfone para falar' : 'Estou ouvindo você...';
      case 'processing': return 'Entendendo...';
      case 'speaking': return 'Respondendo com cuidado...';
      default: return 'Sofia está pronta';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${sofiaState === 'ready' || sofiaState === 'listening' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
          <span className="text-sm font-medium text-slate-400">Sofia IA ({mode === 'voice' ? 'Voz' : mode === 'turn_based' ? 'Áudio' : 'Texto'})</span>
        </div>
        <div className="flex gap-2">
          {mode !== 'text' && sofiaState !== 'fallback_text' && (
            <button onClick={() => { stopListening(); setSofiaState('fallback_text'); setMode('text'); }} className="p-2 bg-slate-800 rounded-full text-slate-400"><MessageSquare size={20} /></button>
          )}
          <button onClick={onEndCall} className="text-slate-400"><PhoneOff size={20} /></button>
        </div>
      </div>

      {sofiaState === 'fallback_text' ? (
        <div className="flex-1 flex flex-col overflow-y-auto mb-6 gap-4">
          {messages.map((m, i) => (
            <div key={i} className={`p-4 rounded-2xl max-w-[80%] ${m.sender === 'user' ? 'bg-sky-600 self-end' : 'bg-slate-800 self-start'}`}>
              {m.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
          <div className="flex gap-2 mt-auto pt-4">
            <input 
              value={textInput} 
              onChange={(e) => setTextInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTextSubmit()}
              className="flex-1 p-4 rounded-2xl bg-slate-800 text-white"
              placeholder="Escreva para Sofia..."
            />
            <button onClick={handleTextSubmit} className="p-4 bg-sky-500 rounded-2xl"><Send /></button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <Avatar state={sofiaState === 'speaking' ? 'speaking' : sofiaState === 'listening' ? 'listening' : 'idle'} />
          <p className="text-lg font-medium text-slate-300 mt-12">{getStatusMessage()}</p>
        </div>
      )}

      {sofiaState !== 'fallback_text' && (
        <div className="flex justify-center gap-8 p-6 bg-slate-900/50 rounded-3xl backdrop-blur-md">
          <button 
            onClick={() => {
              if (mode === 'turn_based') {
                if (sofiaState === 'listening') handleStopListening();
                else startListening();
              } else {
                sofiaState === 'listening' ? handleStopListening() : startListening();
              }
            }}
            className={`p-6 rounded-full ${sofiaState === 'listening' ? 'bg-sky-500/20 text-sky-400' : 'bg-slate-800 text-slate-400'}`}
          >
            {sofiaState === 'listening' ? <Mic size={32} /> : <MicIcon size={32} />}
          </button>
        </div>
      )}
    </div>
  );
};
