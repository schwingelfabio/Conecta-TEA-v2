import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, MapPin, Shield, FileText, Info } from 'lucide-react';

interface LegalPageProps {
  onBack: () => void;
}

export const TermosDeUso: React.FC<LegalPageProps> = ({ onBack }) => (
  <LegalLayout title="Termos de Uso" icon={<FileText size={32} />} onBack={onBack}>
    <div className="prose prose-slate max-w-none">
      <p>Ao acessar o Conecta TEA, você concorda em utilizar o conteúdo de forma responsável.</p>
      
      <p>As informações disponibilizadas não substituem orientação médica profissional. O uso da plataforma é de responsabilidade do usuário.</p>
    </div>
  </LegalLayout>
);

export const Privacidade: React.FC<LegalPageProps> = ({ onBack }) => (
  <LegalLayout title="Política de Privacidade" icon={<Shield size={32} />} onBack={onBack}>
    <div className="prose prose-slate max-w-none">
      <p>Sua privacidade é importante para nós. Coletamos apenas informações necessárias para melhorar a experiência do usuário.</p>
      
      <p>Os dados não são compartilhados com terceiros sem consentimento. Utilizamos ferramentas seguras para proteger todas as informações.</p>
      
      <p>Ao utilizar o site, você concorda com nossa política de uso de dados.</p>
    </div>
  </LegalLayout>
);

export const Contato: React.FC<LegalPageProps> = ({ onBack }) => (
  <LegalLayout title="Fale Conosco" icon={<Mail size={32} />} onBack={onBack}>
    <div className="max-w-2xl mx-auto">
      <p className="text-slate-600 mb-8 text-center text-lg leading-relaxed">
        Se você deseja entrar em contato conosco, utilize os canais abaixo:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center text-center border border-slate-100 shadow-sm transition hover:shadow-md">
          <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mb-4">
            <Mail size={24} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Email</h3>
          <p className="text-slate-500 text-sm mb-4">Estamos disponíveis para dúvidas, sugestões e parcerias.</p>
          <a href="mailto:fabiopalacioschwingel@gmail.com" className="text-brand-primary font-semibold hover:underline">
            fabiopalacioschwingel@gmail.com
          </a>
        </div>
        
        <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center text-center border border-slate-100 shadow-sm transition hover:shadow-md">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <MapPin size={24} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Cidade</h3>
          <p className="text-slate-500 text-sm mb-4">Base de operações do nosso projeto.</p>
          <span className="text-slate-700 font-medium border-t border-slate-200 mt-2 pt-2 block w-full">
            Parobé/RS
          </span>
        </div>
      </div>
    </div>
  </LegalLayout>
);

export const Sobre: React.FC<LegalPageProps> = ({ onBack }) => (
  <LegalLayout title="Sobre Nós" icon={<Info size={32} />} onBack={onBack}>
    <div className="prose prose-slate max-w-none">
      <p>O Conecta TEA é um projeto criado com o objetivo de apoiar famílias de crianças com autismo através de tecnologia e informação acessível.</p>
      
      <p>A iniciativa surgiu da necessidade real de oferecer orientação clara para pais que muitas vezes não sabem por onde começar. Utilizando inteligência artificial e conteúdos educativos, o projeto busca facilitar o entendimento do TEA no dia a dia.</p>
      
      <p>Nosso compromisso é oferecer ferramentas que realmente ajudem, respeitando cada família e cada criança.</p>
    </div>
  </LegalLayout>
);

const LegalLayout: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; onBack: () => void }> = ({ title, icon, children, onBack }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-4xl mx-auto py-12 px-4"
  >
    <button 
      onClick={onBack}
      className="flex items-center space-x-2 text-slate-500 hover:text-brand-primary transition-colors mb-8"
    >
      <ArrowLeft size={20} />
      <span>Voltar</span>
    </button>
    
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12">
      <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-slate-100">
        <div className="p-4 bg-slate-50 rounded-2xl text-brand-primary">
          {icon}
        </div>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">{title}</h1>
      </div>
      
      <div className="text-slate-700 leading-relaxed">
        {children}
      </div>
    </div>
  </motion.div>
);
