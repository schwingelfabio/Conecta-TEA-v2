import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, PlayCircle, Users, ExternalLink, ArrowRight } from 'lucide-react';
import AdBanner from './AdBanner';
import Logo from './Logo';

export default function ApoieProjetoPage() {
  useEffect(() => {
    document.title = "Apoie o Conecta TEA";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Veja como você pode ajudar a manter o Conecta TEA ativo e ainda descobrir uma nova oportunidade online.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Veja como você pode ajudar a manter o Conecta TEA ativo e ainda descobrir uma nova oportunidade online.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="max-w-2xl mx-auto bg-white min-h-screen shadow-xl relative overflow-hidden">
        
        {/* Background blobs */}
        <div className="absolute top-[-5%] left-[-10%] w-64 h-64 bg-sky-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute top-[20%] right-[-10%] w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute bottom-[10%] left-[20%] w-80 h-80 bg-green-200 rounded-full blur-3xl opacity-20 pointer-events-none" />

        <div className="relative z-10 px-6 py-10 pb-24">
          
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* SEÇÃO 1 — TOPO (EMOCIONAL) */}
            <section className="text-center">
              <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <Heart size={32} className="fill-sky-500" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
                Esse projeto existe <br className="hidden sm:block" />por um motivo…
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                O Conecta TEA nasceu para ajudar famílias que estão perdidas, com dúvidas e sem apoio.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mt-2 font-medium">
                Sabemos como esse momento é difícil. E ninguém deveria passar por isso sozinho.
              </p>
            </section>

            <AdBanner className="my-8" />

            {/* SEÇÃO 2 — TRANSPARÊNCIA */}
            <section className="bg-slate-50 rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100/50 rounded-full blur-2xl -mr-10 -mt-10" />
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3 relative z-10">
                <ShieldCheck className="text-sky-500" size={28} />
                Mas existe um desafio
              </h2>
              <p className="text-slate-600 leading-relaxed relative z-10">
                Manter esse projeto no ar exige tempo, esforço e recursos. 
                Hoje estamos buscando formas simples de continuar ajudando cada vez mais famílias.
              </p>
            </section>

            {/* SEÇÃO 3 — SOLUÇÃO (AFILIADO) */}
            <section className="bg-gradient-to-br from-purple-50 to-white rounded-3xl p-8 border border-purple-100 shadow-sm text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <h2 className="text-2xl font-bold text-purple-900 mb-4 relative z-10">
                Uma forma de ajudar <br className="hidden sm:block"/><span className="text-purple-600 text-lg">(sem custo pra você)</span>
              </h2>
              <p className="text-slate-700 leading-relaxed mb-8 relative z-10">
                Estamos testando uma forma de gerar renda online através de um programa oficial do TikTok. 
                Ao acessar pelo link abaixo, você pode conhecer essa oportunidade — e ao mesmo tempo nos ajudar a manter o projeto ativo.
              </p>
              
              <div className="relative z-10">
                <a 
                  href="https://getstartedtiktok.pxf.io/c/7262565/1359578/16372" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-3 px-8 py-4 bg-purple-600 text-white rounded-2xl font-black text-lg hover:bg-purple-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-purple-200"
                >
                  Conhecer oportunidade
                  <ExternalLink size={20} />
                </a>
                <p className="text-[10px] text-slate-400 mt-4 max-w-xs mx-auto">
                  Este é um link afiliado. Podemos receber uma comissão sem custo adicional para você.
                </p>
              </div>
            </section>

            <AdBanner className="my-8" />

            {/* SEÇÃO 4 — CONEXÃO COM PROPÓSITO */}
            <section className="px-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Users className="text-emerald-500" size={28} />
                Por que isso é importante?
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Cada acesso, cada apoio, cada compartilhamento… nos ajuda a continuar criando soluções como:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: <PlayCircle size={20} className="text-sky-500" />, text: "Triagem TEA IA" },
                  { icon: <Heart size={20} className="text-rose-500" />, text: "Apoio para famílias" },
                  { icon: <ShieldCheck size={20} className="text-emerald-500" />, text: "Conteúdos educativos" },
                  { icon: <Users size={20} className="text-purple-500" />, text: "O mundo da Sofia & Theo" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <span className="font-bold text-slate-700">{item.text}</span>
                  </div>
                ))}
              </div>
              <p className="text-center font-bold text-emerald-600 mt-8">
                Tudo isso existe com um único objetivo: <br/> ajudar quem precisa.
              </p>
            </section>

            <AdBanner className="my-8" />

            {/* SEÇÃO 5 — CHAMADA FINAL */}
            <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden shadow-xl">
              <div className="absolute top-[-50%] left-[-20%] w-64 h-64 bg-sky-500 rounded-full blur-3xl opacity-20 pointer-events-none" />
              <div className="absolute bottom-[-50%] right-[-20%] w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20 pointer-events-none" />
              
              <h2 className="text-2xl sm:text-3xl font-black mb-4 relative z-10">
                Se você chegou até aqui…
              </h2>
              <p className="text-slate-300 leading-relaxed mb-8 relative z-10 font-medium">
                Talvez você também esteja buscando uma forma de mudar sua realidade. 
                Ou talvez só queira ajudar esse projeto a continuar existindo. <br/><br/>
                De qualquer forma, sua ação faz diferença.
              </p>
              
              <a 
                href="https://getstartedtiktok.pxf.io/c/7262565/1359578/16372" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-lg hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10"
              >
                Acessar agora
                <ArrowRight size={20} />
              </a>
            </section>
            
          </motion.div>
        </div>
      </div>
    </div>
  );
}
