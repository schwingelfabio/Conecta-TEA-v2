import { useState, useCallback, useEffect } from 'react';
import { analyzeTriage, generateResponse } from '../../../services/sofiaService';
import { SofiaState } from '../types';
import { db, auth } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../../lib/errorHandling';

export const useSofiaOrchestrator = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [state, setState] = useState<SofiaState>('idle');
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Initialize session
  useEffect(() => {
    const initSession = async () => {
      if (auth.currentUser && !sessionId) {
        try {
          const sessionRef = await addDoc(collection(db, 'sofia_sessions'), {
            userId: auth.currentUser.uid,
            startedAt: serverTimestamp(),
            mode: 'voice',
            urgentFlag: false
          });
          setSessionId(sessionRef.id);
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, 'sofia_sessions');
        }
      }
    };
    initSession();
  }, [sessionId]);

  const processTurn = useCallback(async (transcript: string) => {
    setState('processing');
    
    try {
      const triage = await analyzeTriage(transcript);
      const result = await generateResponse(triage, transcript, history);
      
      // Update history
      setHistory(prev => [...prev, `User: ${transcript}`, `Sofia: ${result.text}`]);
      
      // Persist messages
      if (sessionId && auth.currentUser) {
        try {
          await addDoc(collection(db, 'sofia_messages'), {
            sessionId,
            sender: 'user',
            text: transcript,
            timestamp: serverTimestamp(),
            detectedEmotion: triage.intent
          });
          await addDoc(collection(db, 'sofia_messages'), {
            sessionId,
            sender: 'sofia',
            text: result.text,
            timestamp: serverTimestamp(),
            detectedEmotion: triage.intent
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, 'sofia_messages');
        }
      }
      
      // Handle safety/urgency
      if (triage.urgency === 'critical' || triage.isEmergency) {
        setState('urgent');
      } else {
        setState('speaking');
      }
      
      return { response: result.text, grounding: result.grounding };
    } catch (error) {
      console.error('Error processing turn:', error);
      setState('idle');
      return { response: "Desculpe, tive um pequeno problema de conexão. Podemos tentar de novo?" };
    }
  }, [history, sessionId]);

  return { processTurn, state, setState };
};
