import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Olá! Sou seu assistente Conecta TEA. Como posso ajudar você hoje com informações sobre autismo, direitos ou suporte?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })), { role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: "Você é um assistente especializado em autismo (TEA) para a plataforma Conecta TEA. Seu objetivo é fornecer informações acolhedoras, baseadas em evidências científicas e úteis para pais, profissionais e pessoas autistas. Sempre seja empático e sugira que o usuário consulte profissionais de saúde para diagnósticos ou tratamentos específicos.",
        }
      });

      const aiText = response.text || 'Desculpe, não consegui processar sua solicitação.';
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: 'Ocorreu um erro ao conectar com a IA. Verifique sua conexão ou tente novamente mais tarde.' }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'model', text: 'Chat reiniciado. Como posso ajudar?' }]);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-40 transition-all duration-500 ease-in-out ${isExpanded ? 'w-[400px] h-[600px]' : 'w-16 h-16'}`}>
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="button"
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            onClick={() => setIsExpanded(true)}
            className="w-16 h-16 bg-brand-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-brand-primary/90 transition-all group"
          >
            <Bot size={32} className="group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-secondary rounded-full border-2 border-white animate-ping" />
          </motion.button>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="w-full h-full bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900 p-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center">
                  <Bot size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Assistente Conecta TEA</h4>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse" />
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={clearChat} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
                  <Trash2 size={18} />
                </button>
                <button onClick={() => setIsExpanded(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
                  <Minimize2 size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scroll-smooth"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-brand-primary text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                  }`}>
                    <div className="markdown-body text-sm">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center space-x-2">
                    <Loader2 className="animate-spin text-brand-primary" size={18} />
                    <span className="text-sm text-slate-400">IA está pensando...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua dúvida..."
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all text-sm"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-all disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="mt-2 text-[10px] text-center text-slate-400">
                Respostas geradas por IA. Consulte sempre um profissional.
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AiAssistant;
