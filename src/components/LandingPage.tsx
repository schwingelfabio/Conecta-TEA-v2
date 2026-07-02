import React from 'react';
import { Brain, Camera, FileText, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onLogin?: () => void;
  onShowTerms?: () => void;
  onGuestLogin?: (targetTab?: string) => void;
  onNavigate?: (path: string, tab: string) => void;
}

export default function LandingPage({}: LandingPageProps) {
  const TRIAGEM_URL = "https://triagem-tea-ia-oficial.vercel.app/";

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 flex flex-col">
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-emerald-50 opacity-70"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100 text-sky-800 font-semibold text-sm mb-6">
              <Brain size={18} />
              <span>Tecnologia Assistiva</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              Triagem TEA IA – Entenda os sinais de forma rápida e simples
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Uma ferramenta que ajuda você a identificar possíveis sinais de autismo em poucos minutos.
            </p>
            <a 
              href={TRIAGEM_URL}
              className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-emerald-500/25 active:scale-95"
            >
              Fazer Triagem Agora
            </a>
          </motion.div>
        </div>
      </section>

      {/* O que é */}
      <section className="py-16 md:py-24 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">O que é?</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            A Triagem TEA IA é uma ferramenta que utiliza inteligência artificial para ajudar a identificar sinais comportamentais relacionados ao autismo. É um primeiro passo para quem busca orientação.
          </p>
        </div>
      </section>

      {/* Para que serve */}
      <section className="py-16 px-6 bg-white border-y border-slate-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Para que serve?</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-sky-50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={24} />
              </div>
              <p className="font-semibold text-slate-800">Ajudar pais e responsáveis com dúvidas</p>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={24} />
              </div>
              <p className="font-semibold text-slate-800">Identificar possíveis sinais precoces</p>
            </div>
            <div className="bg-sky-50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={24} />
              </div>
              <p className="font-semibold text-slate-800">Orientar sobre próximos passos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-16 md:py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">Como funciona?</h2>
          <p className="text-center text-slate-500 font-medium mb-12">Leva menos de 3 minutos.</p>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-slate-200 -z-10"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white border-4 border-sky-100 text-sky-600 rounded-full flex items-center justify-center mb-6 shadow-sm z-10">
                <Camera size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">1. Grave um pequeno vídeo</h3>
              <p className="text-slate-600">De 1 a 3 minutos</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white border-4 border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-sm z-10">
                <Brain size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">2. A inteligência artificial analisa</h3>
              <p className="text-slate-600">Processamento rápido e seguro</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white border-4 border-sky-100 text-sky-600 rounded-full flex items-center justify-center mb-6 shadow-sm z-10">
                <FileText size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">3. Receba uma orientação</h3>
              <p className="text-slate-600">Informação inicial clara</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 md:py-32 px-6 bg-white text-center flex-grow flex flex-col justify-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 leading-tight">
            Quanto antes entender, mais cedo você pode ajudar.
          </h2>
          <a 
            href={TRIAGEM_URL}
            className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xl transition-all shadow-xl shadow-emerald-500/30 active:scale-95"
          >
            Fazer Triagem Gratuita
          </a>
        </div>
      </section>

      {/* Aviso Importante (Footer) */}
      <footer className="py-8 px-6 border-t border-slate-200 bg-slate-50 text-center mt-auto">
        <p className="text-xs md:text-sm text-slate-500 max-w-3xl mx-auto">
          Esta ferramenta não substitui avaliação médica. Em caso de dúvidas, procure um profissional especializado.
        </p>
      </footer>
    </div>
  );
}
