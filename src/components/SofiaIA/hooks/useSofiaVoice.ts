import { useState, useRef, useCallback } from 'react';
import axios from 'axios';

export const useSofiaVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (error) {
      console.error("Error starting microphone:", error);
    }
  }, []);

  const stopListening = useCallback(async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setIsProcessing(true);

      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      try {
        const sttResponse = await axios.post('/api/stt', formData);
        const text = sttResponse.data.text;
        
        // This is where we would call the Sofia IA (Gemini)
        // For now, let's just return the transcribed text
        setIsProcessing(false);
        return text;
      } catch (error) {
        console.error("STT Error:", error);
        setIsProcessing(false);
      }
    }
  }, []);

  const speak = useCallback(async (text: string) => {
    setIsSpeaking(true);
    try {
      const response = await axios.post('/api/tts', { text }, { responseType: 'blob' });
      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsSpeaking(false);
      audio.play();
    } catch (error) {
      console.error("TTS Error:", error);
      setIsSpeaking(false);
    }
  }, []);

  return { isListening, isProcessing, isSpeaking, startListening, stopListening, speak };
};
