import React, { useState, useEffect } from 'react';
import Onboarding from './Onboarding';
import Consent from './Consent';
import CallScreen from './CallScreen';
import PostCall from './PostCall';

import { sofiaService } from '../../services/sofiaAI';

export type AcolheTEAState = 'onboarding' | 'consent' | 'call' | 'post-call';

interface AcolheTEAProps {
  isDirectEntry?: boolean;
  isUrgent?: boolean;
  onRequireLogin?: () => void;
}

export default function AcolheTEA({ isDirectEntry = false, isUrgent = false, onRequireLogin }: AcolheTEAProps) {
  const [currentState, setCurrentState] = useState<AcolheTEAState>(isDirectEntry ? 'call' : 'onboarding');
  const [sessionSummary, setSessionSummary] = useState<any>(null);
  const [initialMessage, setInitialMessage] = useState<string | undefined>();

  useEffect(() => {
    if (isDirectEntry) {
      sofiaService.reset();
      setCurrentState('call');
    }
  }, [isDirectEntry]);

  const handleStartCall = (message?: string) => {
    setInitialMessage(message);
    setCurrentState('consent');
  };

  const handleConsent = () => {
    sofiaService.reset();
    setCurrentState('call');
  };

  const handleEndCall = (summary: any) => {
    setSessionSummary(summary);
    setCurrentState('post-call');
  };

  const handleRestart = () => {
    sofiaService.reset();
    setCurrentState(isDirectEntry ? 'call' : 'onboarding');
    setSessionSummary(null);
    setInitialMessage(undefined);
  };

  return (
    <div className="w-full h-full min-h-[calc(100vh-64px)] bg-slate-50 relative overflow-hidden">
      {currentState === 'onboarding' && (
        <Onboarding onStart={handleStartCall} />
      )}
      {currentState === 'consent' && (
        <Consent onAccept={handleConsent} onCancel={() => setCurrentState('onboarding')} />
      )}
      {currentState === 'call' && (
        <CallScreen onEndCall={handleEndCall} isUrgent={isUrgent} initialMessage={initialMessage} />
      )}
      {currentState === 'post-call' && (
        <PostCall summary={sessionSummary} onRestart={handleRestart} onRequireLogin={onRequireLogin} />
      )}
    </div>
  );
}
