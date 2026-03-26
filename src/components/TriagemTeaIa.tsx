import React from 'react';
import { motion } from 'framer-motion';
import { Brain, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function TriagemTeaIa() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl shadow-sky-100 border border-sky-50 text-center">
          <div className="w-24 h-24 bg-sky-100 rounded-3xl flex items-center justify-center text-sky-500 mx-auto mb-8 shadow-inner">
            <Brain size={48} />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Triagem <span className="text-sky-500">TEA IA</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Nossa ferramenta de inteligência artificial foi desenvolvida para auxiliar na identificação precoce de sinais de autismo. Uma análise rápida, segura e baseada em evidências para orientar os próximos passos.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
            <div className="bg-sky-50 p-6 rounded-3xl">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-sky-500 mb-4 shadow-sm">
                <Sparkles size={24} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Análise Inteligente</h3>
              <p className="text-slate-600 text-sm">Algoritmos treinados para identificar padrões comportamentais de forma sensível.</p>
            </div>
            
            <div className="bg-emerald-50 p-6 rounded-3xl">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-500 mb-4 shadow-sm">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">100% Seguro</h3>
              <p className="text-slate-600 text-sm">Seus dados são protegidos e a análise é totalmente confidencial e privada.</p>
            </div>
            
            <div className="bg-amber-50 p-6 rounded-3xl">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 mb-4 shadow-sm">
                <ArrowRight size={24} />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Próximos Passos</h3>
              <p className="text-slate-600 text-sm">Receba orientações claras sobre como buscar ajuda profissional adequada.</p>
            </div>
          </div>

          <a 
            href="https://sites.google.com/view/triagemteaia/portugu%C3%AAs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-sky-500 text-white px-8 py-5 rounded-2xl font-bold text-xl hover:bg-sky-600 transition-all shadow-xl shadow-sky-200 hover:-translate-y-1 active:scale-95 w-full md:w-auto"
          >
            Iniciar Triagem Agora
            <ArrowRight size={24} />
          </a>
          
          <p className="mt-6 text-sm text-slate-500">
            * Esta ferramenta não substitui o diagnóstico médico profissional.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
