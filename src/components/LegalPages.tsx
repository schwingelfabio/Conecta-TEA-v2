import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, MapPin, Shield, FileText } from 'lucide-react';

interface LegalPageProps {
  onBack: () => void;
}

export const TermosDeUso: React.FC<LegalPageProps> = ({ onBack }) => (
  <LegalLayout title="Termos de Uso" icon={<FileText size={32} />} onBack={onBack}>
    <div className="prose prose-slate max-w-none">
      <p>Bem-vindo à Conecta TEA. Ao acessar nossa plataforma, você concorda com estes termos de uso.</p>
      
      <h3>1. Aceitação dos Termos</h3>
      <p>Ao criar uma conta e utilizar a plataforma Conecta TEA, você concorda em cumprir e ser regido por estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.</p>
      
      <h3>2. Uso da Plataforma</h3>
      <p>A Conecta TEA é uma rede de apoio e informação. Você concorda em usar a plataforma apenas para fins lícitos e de maneira que não infrinja os direitos de, ou restrinja ou iniba o uso e aproveitamento da plataforma por qualquer terceiro.</p>
      
      <h3>3. Conteúdo do Usuário</h3>
      <p>Você é o único responsável por qualquer conteúdo que publicar na plataforma. A Conecta TEA reserva-se o direito de remover qualquer conteúdo que viole nossas diretrizes de comunidade, incluindo discurso de ódio, desinformação ou conteúdo inadequado.</p>
      
      <h3>4. Assinaturas VIP</h3>
      <p>Os planos VIP oferecem acesso a recursos exclusivos. Os pagamentos são processados de forma segura via PagSeguro. O cancelamento pode ser feito a qualquer momento, mas não haverá reembolso de períodos já pagos.</p>
      
      <h3>5. Isenção de Responsabilidade Médica</h3>
      <p>O conteúdo fornecido na Conecta TEA, incluindo respostas da nossa Inteligência Artificial, tem fins puramente informativos e educacionais. <strong>Não substitui aconselhamento, diagnóstico ou tratamento médico profissional.</strong> Sempre procure o conselho de seu médico ou outro profissional de saúde qualificado com qualquer dúvida que possa ter sobre uma condição médica.</p>
    </div>
  </LegalLayout>
);

export const Privacidade: React.FC<LegalPageProps> = ({ onBack }) => (
  <LegalLayout title="Política de Privacidade" icon={<Shield size={32} />} onBack={onBack}>
    <div className="prose prose-slate max-w-none">
      <p>A sua privacidade é importante para nós. Esta política explica como coletamos, usamos e protegemos suas informações pessoais.</p>
      
      <h3>1. Informações que Coletamos</h3>
      <p>Coletamos informações que você nos fornece diretamente, como nome, endereço de e-mail e informações de perfil quando você cria uma conta. Também coletamos dados sobre como você interage com a plataforma.</p>
      
      <h3>2. Como Usamos suas Informações</h3>
      <p>Utilizamos suas informações para fornecer, manter e melhorar nossos serviços, processar transações, enviar comunicações relacionadas ao serviço e personalizar sua experiência na plataforma.</p>
      
      <h3>3. Compartilhamento de Informações</h3>
      <p>Não vendemos suas informações pessoais a terceiros. Podemos compartilhar informações com prestadores de serviços confiáveis (como processadores de pagamento) que nos auxiliam na operação da plataforma, sempre sob estritos acordos de confidencialidade.</p>
      
      <h3>4. Segurança dos Dados</h3>
      <p>Implementamos medidas de segurança técnicas e organizacionais apropriadas para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.</p>
      
      <h3>5. Seus Direitos</h3>
      <p>Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento através das configurações da sua conta ou entrando em contato conosco.</p>
    </div>
  </LegalLayout>
);

export const Contato: React.FC<LegalPageProps> = ({ onBack }) => (
  <LegalLayout title="Fale Conosco" icon={<Mail size={32} />} onBack={onBack}>
    <div className="max-w-2xl mx-auto">
      <p className="text-slate-600 mb-8 text-center">
        Estamos aqui para ajudar. Se você tiver dúvidas, sugestões ou precisar de suporte, entre em contato conosco através dos canais abaixo.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center text-center border border-slate-100">
          <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mb-4">
            <Mail size={24} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">E-mail</h3>
          <p className="text-slate-500 text-sm mb-4">Para suporte geral e dúvidas sobre a plataforma.</p>
          <a href="mailto:fabiopalacioschwingel@gmail.com" className="text-brand-primary font-semibold hover:underline">
            fabiopalacioschwingel@gmail.com
          </a>
        </div>
        
        <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center text-center border border-slate-100">
          <div className="w-12 h-12 bg-brand-secondary/10 text-brand-secondary rounded-full flex items-center justify-center mb-4">
            <MapPin size={24} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Localização</h3>
          <p className="text-slate-500 text-sm mb-4">Nossa equipe atua de forma remota em todo o Brasil.</p>
          <span className="text-slate-700 font-medium">
            Brasil
          </span>
        </div>
      </div>
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
