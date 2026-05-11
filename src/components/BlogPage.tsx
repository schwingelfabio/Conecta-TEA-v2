import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface BlogPageProps {
  slug: string;
  onBack: () => void;
}

const articles: Record<string, { title: string, content: React.ReactNode }> = {
  'o-que-e-autismo': {
    title: 'O que é o autismo?',
    content: (
      <div className="prose prose-slate max-w-none">
        <p>O Transtorno do Espectro Autista (TEA) é uma condição do desenvolvimento neurológico que afeta a comunicação, o comportamento e a interação social.</p>
        <p>Cada criança com autismo é única. Algumas podem apresentar dificuldades na fala, enquanto outras têm sensibilidade a sons, luzes ou mudanças na rotina.</p>
        <p>O diagnóstico precoce é fundamental para que a criança receba o suporte adequado. Por isso, é importante observar sinais desde cedo e buscar orientação profissional.</p>
        <p>Com acompanhamento correto, a criança pode desenvolver habilidades importantes e ter uma vida com mais autonomia.</p>
      </div>
    )
  },
  'como-identificar-sinais-de-tea': {
    title: 'Como identificar sinais de TEA',
    content: (
      <div className="prose prose-slate max-w-none">
        <p>Alguns sinais podem indicar a necessidade de avaliação:</p>
        <ul>
          <li>Dificuldade de contato visual</li>
          <li>Atraso na fala</li>
          <li>Repetição de movimentos</li>
          <li>Resistência a mudanças</li>
        </ul>
        <p>Esses sinais não confirmam o diagnóstico, mas indicam que a criança pode precisar de acompanhamento.</p>
        <p>Quanto antes a família buscar orientação, melhores são os resultados no desenvolvimento.</p>
      </div>
    )
  },
  'rotina-para-criancas-com-tea': {
    title: 'Importância da rotina no autismo',
    content: (
      <div className="prose prose-slate max-w-none">
        <p>A rotina é essencial para crianças com TEA. Ela ajuda a reduzir ansiedade e melhora o comportamento.</p>
        <p>Quando a criança sabe o que vai acontecer, ela se sente mais segura. Isso diminui crises e facilita a adaptação em ambientes diferentes.</p>
        <p>Ferramentas visuais, como histórias e imagens, são muito eficazes nesse processo.</p>
      </div>
    )
  }
};

export default function BlogPage({ slug, onBack }: BlogPageProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const article = articles[slug];

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Artigo não encontrado</h1>
        <button onClick={onBack} className="text-brand-primary hover:underline">Voltar</button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-12 px-4 bg-white min-h-screen"
    >
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-slate-500 hover:text-brand-primary transition-colors mb-8"
      >
        <ArrowLeft size={20} />
        <span>Voltar</span>
      </button>
      
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 mt-4">
        <h1 className="text-3xl md:text-5xl font-serif font-black text-slate-900 mb-8 leading-tight">
          {article.title}
        </h1>
        {article.content}
      </div>
    </motion.div>
  );
}
