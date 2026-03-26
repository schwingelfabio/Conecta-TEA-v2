import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, PhoneOff, MessageSquare, AlertCircle, HelpCircle, Heart, FileText, Volume2, VolumeX, Search, Loader2, Phone } from 'lucide-react';
import { sofiaService } from '../../services/sofiaAI';
import { logger, analytics } from '../../services/logger';

interface CallScreenProps {
  onEndCall: (summary: any) => void;
  isUrgent?: boolean;
  initialMessage?: string;
}

type CallState = 'connecting' | 'idle' | 'listening' | 'processing' | 'searching' | 'thinking' | 'speaking' | 'summary';

export default function CallScreen({ onEndCall, isUrgent = false, initialMessage }: CallScreenProps) {
  const [callState, setCallState] = useState<CallState>('connecting');
  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [currentSubtitle, setCurrentSubtitle] = useState('Conectando com Sofia IA...');
  const [isCrisisMode, setIsCrisisMode] = useState(isUrgent);
  
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stateTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    logger.info('CallScreen', 'Initializing CallScreen', { isUrgent, initialMessage });
    
    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        logger.info('CallScreen', `Speech recognized: ${transcript}`);
        handleUserMessage(transcript);
      };

      recognition.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
          logger.error('CallScreen', 'Speech recognition error', event.error);
        }
        setCallState('idle');
      };

      recognition.onend = () => {
        if (callState === 'listening') {
          // If it ended but we are still supposed to be listening, it might have timed out
          setCallState('idle');
        }
      };

      recognitionRef.current = recognition;
    } else {
      logger.warn('CallScreen', 'SpeechRecognition API not supported in this browser');
    }

    // Initial greeting
    const startGreeting = async () => {
      setCallState('thinking');
      setCurrentSubtitle('Conectando...');
      let msgToSend = 'Olá, acabei de entrar na chamada.';
      if (isUrgent) {
        msgToSend = 'Estou sobrecarregado(a), preciso de ajuda agora.';
      } else if (initialMessage) {
        msgToSend = initialMessage;
      }
      const response = await sofiaService.sendMessage(msgToSend);
      await playResponse(response.text, response.emotion, response.isEmergency);
    };

    startGreeting();

    return () => {
      if (stateTimerRef.current) clearTimeout(stateTimerRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playResponse = async (text: string, emotion: string, isEmergency: boolean) => {
    if (stateTimerRef.current) clearTimeout(stateTimerRef.current);
    setCallState('speaking');
    setCurrentSubtitle(text);
    
    if (emotion === 'exaustão' || emotion === 'pânico' || isEmergency) {
      setIsCrisisMode(true);
    } else {
      setIsCrisisMode(false);
    }

    if (!isMuted) {
      const base64Audio = await sofiaService.generateSpeech(text);
      if (base64Audio) {
        const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
        audioRef.current = audio;
        audio.onended = () => {
          setCallState('idle');
          setCurrentSubtitle('');
        };
        await audio.play().catch(e => {
          logger.error('CallScreen', "Audio play failed", e);
          setCallState('idle');
          setCurrentSubtitle('');
        });
      } else {
        // Fallback to browser TTS if Gemini TTS fails
        logger.warn('CallScreen', 'Using fallback browser TTS');
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.onend = () => {
          setCallState('idle');
          setCurrentSubtitle('');
        };
        window.speechSynthesis.speak(utterance);
      }
    } else {
      setTimeout(() => {
        setCallState('idle');
        setCurrentSubtitle('');
      }, text.length * 100); // Rough estimate of reading time
    }
  };

  const handleUserMessage = async (message: string) => {
    setCallState('processing');
    setCurrentSubtitle(message); // Show what the user said briefly
    
    const response = await sofiaService.sendMessage(message);
    await playResponse(response.text, response.emotion, response.isEmergency);
  };

  const handleQuickAction = async (action: string) => {
    analytics.trackEvent('sofia_quick_action', { action });
    if (callState === 'speaking' && audioRef.current) {
      audioRef.current.pause();
      window.speechSynthesis.cancel();
    }
    await handleUserMessage(action);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setCurrentSubtitle('Desculpe, o reconhecimento de voz não é suportado neste navegador.');
      setTimeout(() => setCurrentSubtitle(''), 3000);
      return;
    }

    if (callState === 'listening') {
      recognitionRef.current?.stop();
      setCallState('idle');
    } else {
      if (callState === 'speaking' && audioRef.current) {
        audioRef.current.pause();
        window.speechSynthesis.cancel();
      }
      try {
        recognitionRef.current?.start();
        setCallState('listening');
        setCurrentSubtitle('Ouvindo...');
      } catch (e) {
        logger.error('CallScreen', "Could not start recognition", e);
        setCallState('idle');
      }
    }
  };

  const handleEndCallClick = async () => {
    analytics.trackEvent('sofia_call_ended_by_user');
    setCallState('summary');
    setCurrentSubtitle('Gerando resumo da sessão...');
    if (audioRef.current) audioRef.current.pause();
    window.speechSynthesis.cancel();
    
    const summary = await sofiaService.generateSummary();
    await sofiaService.endSession();
    onEndCall(summary);
  };

  const handleEmergencyCall = () => {
    analytics.trackEvent('sofia_emergency_call_clicked');
    window.location.href = 'tel:188'; // CVV
  };

  return (
    <div className={`relative w-full h-[calc(100vh-64px)] overflow-hidden flex flex-col transition-colors duration-1000 ${isCrisisMode ? 'bg-orange-950' : 'bg-slate-900'}`}>
      {/* Avatar Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        {/* Using a high-quality, calm, professional woman portrait */}
        <div className={`relative w-full h-full transition-all duration-1000 ${callState === 'speaking' ? 'scale-105' : 'scale-100'}`}>
          <img 
            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=1080&h=1920" 
            alt="Sofia IA Avatar" 
            className={`w-full h-full object-cover object-center transition-all duration-1000 ${isCrisisMode ? 'brightness-75 sepia-[0.2]' : 'brightness-90'} ${callState === 'idle' ? 'animate-[breath_4s_ease-in-out_infinite]' : ''}`}
            style={{ objectPosition: 'center 20%' }}
            referrerPolicy="no-referrer"
          />
          
          {/* Subtle overlay for different states */}
          <div className={`absolute inset-0 transition-opacity duration-500 ${
            ['thinking', 'processing', 'searching', 'summary'].includes(callState) 
              ? 'bg-black/20 backdrop-blur-[2px]' 
              : 'bg-transparent'
          }`}></div>
          
          {/* Speaking indicator glow */}
          <div className={`absolute inset-0 bg-sky-500/10 mix-blend-overlay transition-opacity duration-300 ${callState === 'speaking' ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>
        </div>
        
        {/* Gradients for text readability */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
      </div>

      {/* Top Bar */}
      <div className="relative z-10 p-6 flex justify-between items-start">
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 shadow-lg">
          <div className="relative flex h-3 w-3">
            {callState !== 'connecting' && callState !== 'summary' && (
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                callState === 'speaking' ? 'bg-emerald-400' : 
                callState === 'listening' ? 'bg-sky-400' : 
                callState === 'searching' ? 'bg-purple-400' :
                'bg-amber-400'
              }`}></span>
            )}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${
              callState === 'speaking' ? 'bg-emerald-500' : 
              callState === 'listening' ? 'bg-sky-500' : 
              callState === 'connecting' || callState === 'summary' ? 'bg-slate-400' : 
              callState === 'searching' ? 'bg-purple-500' :
              'bg-amber-500'
            }`}></span>
          </div>
          <span className="text-white text-sm font-medium tracking-wide flex items-center gap-2">
            {callState === 'connecting' ? 'Conectando...' : 
             callState === 'listening' ? 'Sofia está ouvindo' : 
             callState === 'processing' ? 'Analisando...' :
             callState === 'thinking' ? 'Um momento...' : 
             callState === 'searching' ? (
               <>Buscando <Search size={14} className="animate-pulse" /></>
             ) :
             callState === 'speaking' ? 'Sofia está falando' : 
             callState === 'summary' ? (
               <>Finalizando <Loader2 size={14} className="animate-spin" /></>
             ) : 'Sofia IA'}
          </span>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setShowSubtitles(!showSubtitles)}
            className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors border border-white/10 shadow-lg"
            title="Legendas"
          >
            {showSubtitles ? <MessageSquare size={20} /> : <MessageSquare size={20} className="opacity-50" />}
          </button>
          {!isCrisisMode && (
            <button 
              className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors border border-white/10 flex items-center gap-2 text-sm font-medium shadow-lg"
              title="Encontrar ajuda humana"
            >
              <Heart size={16} className="text-rose-400" />
              <span className="hidden sm:inline">Ajuda Humana</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col justify-end p-6 pb-32">
        
        {/* Crisis Mode Message & Actions */}
        <AnimatePresence>
          {isCrisisMode && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-8 max-w-2xl mx-auto w-full flex flex-col items-center gap-4"
            >
              <p className="text-orange-200 text-lg font-medium bg-orange-950/80 backdrop-blur-md py-3 px-8 rounded-full inline-block border border-orange-500/50 shadow-xl text-center">
                Você não precisa passar por isso sozinho(a). Estou aqui.
              </p>
              
              <div className="flex gap-3">
                <button 
                  onClick={handleEmergencyCall}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium flex items-center gap-2 shadow-lg transition-colors"
                >
                  <Phone size={18} />
                  Ligar CVV (188)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtitles */}
        <AnimatePresence>
          {showSubtitles && currentSubtitle && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mb-8 max-w-2xl mx-auto w-full"
            >
              <div className="text-center px-4">
                <p className="text-white text-xl md:text-2xl font-medium leading-relaxed drop-shadow-lg text-shadow-sm">
                  {currentSubtitle}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions (Hidden in crisis mode to simplify UI) */}
        {!isCrisisMode && (
          <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar snap-x mask-linear-fade">
            <button onClick={() => handleQuickAction('Estou sobrecarregado(a)')} className="snap-start shrink-0 px-5 py-3 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white text-sm font-medium transition-all flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-400" />
              Estou sobrecarregado(a)
            </button>
            <button onClick={() => handleQuickAction('Meu filho teve uma crise')} className="snap-start shrink-0 px-5 py-3 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white text-sm font-medium transition-all flex items-center gap-2">
              <Heart size={16} className="text-red-400" />
              Meu filho teve uma crise
            </button>
            <button onClick={() => handleQuickAction('Preciso desabafar')} className="snap-start shrink-0 px-5 py-3 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white text-sm font-medium transition-all flex items-center gap-2">
              <MessageSquare size={16} className="text-sky-400" />
              Preciso desabafar
            </button>
            <button onClick={() => handleQuickAction('Não sei o que fazer')} className="snap-start shrink-0 px-5 py-3 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white text-sm font-medium transition-all flex items-center gap-2">
              <HelpCircle size={16} className="text-purple-400" />
              Não sei o que fazer
            </button>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 w-full p-6 pb-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 flex justify-center items-center gap-6 sm:gap-10">
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-white/20 text-white' : 'bg-black/40 text-white hover:bg-black/60'} backdrop-blur-md border border-white/10`}
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>

        <div className="relative">
          {/* Ripple effect when listening */}
          {callState === 'listening' && (
            <>
              <div className="absolute inset-0 rounded-full bg-sky-500/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
              <div className="absolute inset-0 rounded-full bg-sky-500/20 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite] delay-300"></div>
            </>
          )}
          
          <button 
            onClick={toggleListening}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${callState === 'listening' ? 'bg-sky-500 scale-105 shadow-sky-500/50' : 'bg-white/90 backdrop-blur-sm text-slate-900 hover:scale-105 hover:bg-white'}`}
          >
            {callState === 'listening' ? (
              <div className="flex gap-1.5 items-center h-8">
                <span className="w-1.5 h-4 bg-white rounded-full animate-[bounce_1s_infinite_0ms]"></span>
                <span className="w-1.5 h-8 bg-white rounded-full animate-[bounce_1s_infinite_200ms]"></span>
                <span className="w-1.5 h-5 bg-white rounded-full animate-[bounce_1s_infinite_400ms]"></span>
                <span className="w-1.5 h-3 bg-white rounded-full animate-[bounce_1s_infinite_600ms]"></span>
              </div>
            ) : (
              <Mic size={36} className="text-sky-600" />
            )}
          </button>
        </div>

        <button 
          onClick={handleEndCallClick}
          className="w-14 h-14 rounded-full bg-red-500/90 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-500/30 transition-all border border-red-400/50 backdrop-blur-sm"
        >
          <PhoneOff size={24} />
        </button>
      </div>
      
      {/* Floating Urgent Button (Only show if not already in crisis mode) */}
      {!isCrisisMode && (
        <button 
          onClick={() => setIsCrisisMode(true)}
          className="absolute bottom-32 right-6 z-30 w-14 h-14 bg-rose-500/90 backdrop-blur-sm text-white rounded-full shadow-xl shadow-rose-500/30 flex items-center justify-center hover:scale-105 transition-transform border border-rose-400/50"
          title="Preciso de ajuda agora"
        >
          <Heart className="w-6 h-6 animate-pulse" />
        </button>
      )}
    </div>
  );
}
