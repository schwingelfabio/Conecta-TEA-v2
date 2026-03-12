import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Brain, ShieldCheck, ArrowRight, Star, MapPin } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onNavigate: (page: 'termos' | 'privacidade' | 'contato') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onNavigate }) => {
  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 flex flex-col items-center justify-center text-center px-4">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-brand-primary rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-secondary rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center space-x-2 bg-brand-primary/10 text-brand-primary px-4 py-2 rounded-full mb-8">
            <Star size={16} className="fill-brand-primary" />
            <span className="text-sm font-semibold uppercase tracking-wider">A maior rede de apoio autista do Brasil</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-slate-900 mb-6 leading-tight">
            Conecta <span className="text-brand-primary italic">TEA</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Uma plataforma dedicada a unir famílias, profissionais e comunidades locais. 
            Transformando a jornada do autismo através de tecnologia, afeto e informação.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onStart}
              className="group relative px-8 py-4 bg-slate-900 text-white rounded-full font-semibold text-lg overflow-hidden transition-all hover:pr-12"
            >
              <span className="relative z-10">Começar Agora</span>
              <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all" size={20} />
            </button>
            <a
              href="https://sites.google.com/view/triagemteaia/portugu%C3%AAs"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-full font-semibold text-lg hover:bg-slate-50 transition-all"
            >
              ACESSE TRIAGEM TEA IA
            </a>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">Recursos Pensados para Você</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Tudo o que você precisa para uma jornada mais conectada e informada.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Users className="text-brand-primary" size={32} />}
              title="Comunidades Locais"
              description="Conecte-se com famílias e profissionais da sua própria cidade. Troque experiências e encontre apoio perto de você."
            />
            <FeatureCard
              icon={<ShieldCheck className="text-brand-accent" size={32} />}
              title="Área VIP Exclusiva"
              description="Acesso a conteúdos premium, mentorias e recursos especializados para potencializar o desenvolvimento."
            />
            <FeatureCard
              icon={<Brain className="text-brand-secondary" size={32} />}
              title="IA de Apoio"
              description="Utilize nossa tecnologia de inteligência artificial para auxiliar no processo de triagem e acompanhamento."
            />
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-5xl font-serif font-bold mb-6 leading-tight">Juntos somos mais fortes.</h2>
            <p className="text-xl text-slate-600 mb-8">
              Acreditamos que a informação e a conexão são as chaves para um futuro melhor. 
              Nossa plataforma foi construída por quem entende os desafios e as belezas do autismo.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <MapPin size={20} />
                </div>
                <span className="font-medium text-slate-700">Presença em todo o Brasil</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                  <Heart size={20} />
                </div>
                <span className="font-medium text-slate-700">Comunidade acolhedora e segura</span>
              </div>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl rotate-3">
              <img 
                src="https://picsum.photos/seed/autism-support/800/800" 
                alt="Comunidade Conecta TEA" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl -rotate-3 border border-slate-100">
              <div className="flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => (
                    <img 
                      key={i}
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} 
                      className="w-10 h-10 rounded-full border-2 border-white"
                      alt="User"
                    />
                  ))}
                </div>
                <div>
                  <p className="font-bold text-slate-900">+5.000</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Membros Ativos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">© 2026 Conecta TEA. Todos os direitos reservados.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <button onClick={() => onNavigate('termos')} className="text-slate-400 hover:text-brand-primary transition-colors">Termos de Uso</button>
            <button onClick={() => onNavigate('privacidade')} className="text-slate-400 hover:text-brand-primary transition-colors">Privacidade</button>
            <button onClick={() => onNavigate('contato')} className="text-slate-400 hover:text-brand-primary transition-colors">Contato</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100 card-hover"
  >
    <div className="mb-6">{icon}</div>
    <h3 className="text-2xl font-serif font-bold mb-4">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </motion.div>
);

export default LandingPage;
