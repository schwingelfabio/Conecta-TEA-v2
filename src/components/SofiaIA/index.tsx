import React, { useState } from 'react';
import { SofiaCallScreen } from './screens/SofiaCallScreen';

export const SofiaIA = () => {
  const [screen, setScreen] = useState<'call' | 'landing'>('call');

  return (
    <div className="w-full h-full">
      {screen === 'call' && <SofiaCallScreen onEndCall={() => setScreen('landing')} />}
      {screen === 'landing' && (
        <div className="p-4">
          <h1 className="text-2xl font-bold">SOFIA IA</h1>
          <button onClick={() => setScreen('call')} className="mt-4 px-4 py-2 bg-sky-500 text-white rounded">Falar com Sofia</button>
        </div>
      )}
    </div>
  );
};
