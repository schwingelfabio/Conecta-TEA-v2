import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { SofiaCallScreen } from './screens/SofiaCallScreen';
import { trackEvent } from '../../lib/monitoring';

export const SofiaIA = () => {
  const [screen, setScreen] = useState<'call' | 'landing'>('call');

  React.useEffect(() => {
    trackEvent('sofia_open');
  }, []);

  return (
    <div className="w-full h-full min-h-[calc(100vh-64px)] bg-slate-950">
      {screen === 'call' && <SofiaCallScreen onEndCall={() => setScreen('landing')} />}
      {screen === 'landing' && (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <div className="w-24 h-24 bg-sky-500/10 rounded-full flex items-center justify-center mb-6 border border-sky-500/20">
            <MessageCircle className="w-12 h-12 text-sky-500" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Sofia IA</h1>
          <p className="text-slate-400 text-lg max-w-md mb-8">
            A conversa foi encerrada. Quando precisar, estarei aqui para te ouvir novamente.
          </p>
          <button 
            onClick={() => setScreen('call')} 
            className="px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-sky-500/20"
          >
            Iniciar nova conversa
          </button>
        </div>
      )}
    </div>
  );
};
