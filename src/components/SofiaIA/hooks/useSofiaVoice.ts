import { useState, useRef, useCallback } from 'react';
import axios from 'axios';

export type VoiceCapability = 'full' | 'turn_based' | 'text_only';

export const useSofiaVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mimeTypeRef = useRef<string>('audio/webm');

  const checkCapabilities = useCallback((): VoiceCapability => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn("Sofia IA: MediaDevices API not available");
        return 'text_only';
      }
      if (!window.MediaRecorder) {
        console.warn("Sofia IA: MediaRecorder API not available");
        return 'text_only';
      }

      const userAgent = navigator.userAgent.toLowerCase();
      const isFirefox = userAgent.includes('firefox');
      const isSafari = userAgent.includes('safari') && !userAgent.includes('chrome');
      const isIOS = /ipad|iphone|ipod/.test(userAgent);

      // Firefox and Safari/iOS are more stable with turn-based audio in this context
      if (isFirefox || isSafari || isIOS) {
        console.log(`Sofia IA: Turn-based mode selected for ${isFirefox ? 'Firefox' : 'Safari/iOS'}`);
        return 'turn_based';
      }

      return 'full';
    } catch (e) {
      console.error("Sofia IA: Error checking capabilities", e);
      return 'text_only';
    }
  }, []);

  const getSupportedMimeType = () => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/ogg;codecs=opus',
      'audio/webm',
      'audio/ogg',
      'audio/mp4',
      'audio/aac'
    ];
    for (const type of types) {
      try {
        if (MediaRecorder.isTypeSupported(type)) {
          console.log(`Sofia IA: Using MIME type ${type}`);
          return type;
        }
      } catch (e) {}
    }
    return '';
  };

  const startListening = useCallback(async () => {
    if (isListening) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      const mimeType = getSupportedMimeType();
      if (!mimeType) {
        throw new Error("No supported audio MIME type found");
      }
      
      mimeTypeRef.current = mimeType;
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(1000); // Collect data every second for better stability
      setIsListening(true);
    } catch (error) {
      console.error("Sofia IA: Error starting microphone:", error);
      setIsListening(false);
      throw error;
    }
  }, [isListening]);

  const stopListening = useCallback(async () => {
    return new Promise<string | undefined>((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        resolve(undefined);
        return;
      }

      const recorder = mediaRecorderRef.current;
      
      recorder.onstop = async () => {
        setIsListening(false);
        setIsProcessing(true);

        try {
          if (audioChunksRef.current.length === 0) {
            setIsProcessing(false);
            resolve(undefined);
            return;
          }

          const audioBlob = new Blob(audioChunksRef.current, { type: mimeTypeRef.current });
          const formData = new FormData();
          
          let extension = 'webm';
          if (mimeTypeRef.current.includes('ogg')) extension = 'ogg';
          else if (mimeTypeRef.current.includes('mp4')) extension = 'mp4';
          else if (mimeTypeRef.current.includes('aac')) extension = 'aac';
          
          formData.append('audio', audioBlob, `recording.${extension}`);

          const sttResponse = await axios.post('/api/stt', formData);
          const text = sttResponse.data.text;
          setIsProcessing(false);
          resolve(text);
        } catch (error) {
          console.error("Sofia IA: STT Error:", error);
          setIsProcessing(false);
          resolve(undefined);
        } finally {
          // Cleanup stream tracks
          recorder.stream.getTracks().forEach(track => track.stop());
        }
      };

      recorder.stop();
    });
  }, []);

  const speak = useCallback(async (text: string) => {
    if (!text) return;
    
    return new Promise<void>(async (resolve) => {
      setIsSpeaking(true);
      let audioUrl = '';
      try {
        const response = await axios.post('/api/tts', { text }, { responseType: 'blob' });
        audioUrl = URL.createObjectURL(response.data);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          resolve();
        };
        
        audio.onerror = (e) => {
          console.error("Sofia IA: Audio playback error", e);
          setIsSpeaking(false);
          if (audioUrl) URL.revokeObjectURL(audioUrl);
          resolve(); // Resolve anyway to not block the orchestrator
        };

        await audio.play();
      } catch (error) {
        console.error("Sofia IA: TTS Error:", error);
        setIsSpeaking(false);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        resolve();
      }
    });
  }, []);

  return { isListening, isProcessing, isSpeaking, startListening, stopListening, speak, checkCapabilities };
};
