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
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return 'text_only';
    }
    if (!window.MediaRecorder) {
      return 'text_only';
    }
    // Simple check for Safari/iOS which often has issues with continuous streaming
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) || /Safari/.test(navigator.userAgent)) {
      return 'turn_based';
    }
    return 'full';
  }, []);

  const getSupportedMimeType = () => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4'
    ];
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) return type;
    }
    return 'audio/webm';
  };

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      mimeTypeRef.current = mimeType;
      
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (error) {
      console.error("Error starting microphone:", error);
      throw error;
    }
  }, []);

  const stopListening = useCallback(async () => {
    return new Promise<string | undefined>((resolve) => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.onstop = async () => {
          setIsListening(false);
          setIsProcessing(true);

          const audioBlob = new Blob(audioChunksRef.current, { type: mimeTypeRef.current });
          const formData = new FormData();
          const extension = mimeTypeRef.current.includes('ogg') ? 'ogg' : mimeTypeRef.current.includes('mp4') ? 'mp4' : 'webm';
          formData.append('audio', audioBlob, `recording.${extension}`);

          try {
            const sttResponse = await axios.post('/api/stt', formData);
            const text = sttResponse.data.text;
            setIsProcessing(false);
            resolve(text);
          } catch (error) {
            console.error("STT Error:", error);
            setIsProcessing(false);
            resolve(undefined);
          }
        };
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      } else {
        resolve(undefined);
      }
    });
  }, []);

  const speak = useCallback(async (text: string) => {
    setIsSpeaking(true);
    try {
      const response = await axios.post('/api/tts', { text }, { responseType: 'blob' });
      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      await audio.play();
    } catch (error) {
      console.error("TTS Error:", error);
      setIsSpeaking(false);
    }
  }, []);

  return { isListening, isProcessing, isSpeaking, startListening, stopListening, speak, checkCapabilities };
};
