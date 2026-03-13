import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const TypingMessage: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, 10);
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return <ReactMarkdown>{displayedText}</ReactMarkdown>;
};

const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string; isNew?: boolean }[]>([
    { role: 'model', text: 'Olá! Sou seu assistente Conecta TEA. Como posso ajudar você hoje com informações sobre autismo, direitos ou suporte?', isNew: false }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev.map(m => ({ ...m, isNew: false })), { role: 'user', text: userMessage, isNew: true }]);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: "Você é um assistente especializado em autismo (TEA) para a plataforma Conecta TEA. Seu objetivo é fornecer informações acolhedoras, baseadas em evidências científicas e úteis para pais, profissionais e pessoas autistas. Sempre seja empático e sugira que o usuário consulte profissionais de saúde para diagnósticos ou tratamentos específicos. Mantenha as respostas concisas e use formatação markdown para facilitar a leitura.",
        }
      });

      const aiText = response.text || 'Desculpe, não consegui processar sua solicitação.';
      setMessages(prev => [...prev, { role: 'model', text: aiText, isNew: true }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: 'Ocorreu um erro ao conectar com a IA. Verifique sua conexão ou tente novamente mais tarde.', isNew: true }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'model', text: 'Chat reiniciado. Como posso ajudar?', isNew: false }]);
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
            className="w-16 h-16 bg-gradient-to-br from-sky-500 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:shadow-sky-200/50 transition-all group"
          >
            <Bot size={32} className="group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
          </motion.button>
        ) : (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="w-full h-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900 p-5 flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Bot size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Conecta Assistente</h4>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-black">IA Ativa</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button onClick={clearChat} title="Limpar conversa" className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white">
                  <Trash2 size={18} />
                </button>
                <button onClick={() => setIsExpanded(false)} title="Fechar" className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white">
                  <Minimize2 size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/30 scroll-smooth"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-sky-100 text-sky-600'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  
                  <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                  }`}>
                    <div className="markdown-body text-sm leading-relaxed">
                      {msg.role === 'model' && msg.isNew ? (
                        <TypingMessage text={msg.text} />
                      ) : (
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {loading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 shadow-sm">
                    <Bot size={16} />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                        className="w-1.5 h-1.5 bg-sky-400 rounded-full" 
                      />
                      <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                        className="w-1.5 h-1.5 bg-sky-400 rounded-full" 
                      />
                      <motion.div 
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                        className="w-1.5 h-1.5 bg-sky-400 rounded-full" 
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-5 bg-white border-t border-slate-100">
              <div className="relative group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Como posso ajudar hoje?"
                  className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none transition-all text-sm placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-sky-500 text-white rounded-xl flex items-center justify-center hover:bg-sky-600 transition-all disabled:opacity-30 disabled:hover:bg-sky-500 shadow-lg shadow-sky-200"
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-center space-x-2">
                <Sparkles size={12} className="text-amber-400" />
                <p className="text-[10px] text-slate-400 font-medium">
                  IA Conecta TEA • Use com moderação
                </p>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AiAssistant;

