import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, MapPin, Shield, FileText, Info } from 'lucide-react';

interface LegalPageProps {
  onBack: () => void;
}

export const TermosDeUso: React.FC<LegalPageProps> = ({ onBack }) => (
  <LegalLayout title="Termos de Uso" icon={<FileText size={32} />} onBack={onBack}>
    <div className="prose prose-slate max-w-none">
      <p>Bem-vindo à Conecta TEA. Ao utilizar nosso site, aplicativos associados e ferramentas interativas (como a Sofia IA e a Triagem TEA IA), você expressamente concorda com os seguintes Termos de Uso. Leia-os com atenção, pois eles definem as regras, os direitos e os deveres ao utilizar nossa plataforma. Sua permanência no site implica na aceitação incondicional e irrevogável deste documento e das demais políticas da empresa.</p>
      
      <h3>1. Aceitação dos Termos e Modificações</h3>
      <p>Ao criar uma conta ou simplesmente navegar na plataforma Conecta TEA, você concorda em cumprir e ser regido por estes Termos de Uso. A Conecta TEA se reserva o direito de alterar, modificar, atualizar ou remover partes deste termo a qualquer momento, sem aviso prévio, cabendo ao usuário a responsabilidade de verificar essa página periodicamente. O uso contínuo da plataforma após alterações significa que você as aceita.</p>
      
      <h3>2. Finalidade da Plataforma e Isenção de Responsabilidade Médica</h3>
      <p>A plataforma Conecta TEA, incluindo nosso projeto de "Triagem TEA IA" e nosso assistente virtual (Sofia IA), tem como objetivo exclusivo o suporte psicopedagógico, emocional, informativo e educacional para famílias de indivíduos no Transtorno do Espectro Autista. <strong>Em nenhuma hipótese nossos serviços, textos, ou respostas substituem o aconselhamento, diagnóstico, laudo ou tratamento médico profissional e de saúde mental.</strong> Se suspeitar de uma condição médica, você deve consultar um profissional especializado.</p>
      
      <h3>3. Conduta e Conteúdo do Usuário</h3>
      <p>Você é o único e exclusivo responsável pelo conteúdo (textos, imagens, comentários) que publicar, carregar ou compartilhar. Ao participar de nossa comunidade, você se compromete a manter um ambiente acolhedor e respeitoso. A Conecta TEA reserva-se o direito soberano de apagar, editar ou moderar qualquer conteúdo que viole nossas diretrizes (como discurso de ódio, assédio, promoção de medicamentos, desinformação, apologia ao crime ou material com direitos autorais não autorizados). Infratores poderão ter a conta suspensa ou banida.</p>
      
      <h3>4. Propriedade Intelectual</h3>
      <p>Todo o conteúdo, marcas, imagens (incluindo o livro Sofia e Theo), software e arquitetura do Conecta TEA são de propriedade da plataforma, protegidos pelas leis de propriedade intelectual vigentes. Nenhuma parte da plataforma poderá ser copiada, reproduzida, republicada ou vendida sem autorização expressa.</p>

      <h3>5. Assinaturas e Planos VIP</h3>
      <p>Oferecemos funcionalidades extras sob assinaturas ou cobranças pontuais. O fornecimento de dados para pagamentos será gerenciado exclusivamente por provedores de terceiros (como Stripe ou Kiwify), garantindo sua segurança. Não retemos números de cartão de crédito. É possível cancelar assinaturas a qualquer momento; contudo, meses parcialmente vigentes não serão objeto de estorno ou devolução após prestação do serviço ou liberação do acesso.</p>
    </div>
  </LegalLayout>
);

export const Privacidade: React.FC<LegalPageProps> = ({ onBack }) => (
  <LegalLayout title="Política de Privacidade" icon={<Shield size={32} />} onBack={onBack}>
    <div className="prose prose-slate max-w-none">
      <p>A Conecta TEA respeita a sua privacidade. Esta política explica em detalhes como coletamos, usamos, armazenamos e protegemos suas informações pessoais ao utilizar nossa plataforma, reforçando nosso compromisso com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018) e oferecendo transparência total.</p>
      
      <h3>1. Coleta de Informações</h3>
      <p>Ao se cadastrar ou navegar na Conecta TEA, coletamos as seguintes categorias de informações:</p>
      <ul>
        <li><strong>Informações Fornecidas Voluntariamente:</strong> Como seu nome, endereço de e-mail, foto de perfil, localização aproximada (cidade/estado) e informações prestadas durante interações no chat e avaliações sensoriais.</li>
        <li><strong>Informações Coletadas Automaticamente:</strong> Durante a navegação, utilizamos cookies e tecnologias semelhantes para identificar tipo de dispositivo, endereço de IP, histórico de acessos (logs) e fluxo de cliques dentro do nosso site, visando melhorar o funcionamento da plataforma.</li>
      </ul>
      
      <h3>2. Uso das Informações (Nosso Propósito)</h3>
      <p>As informações são estritamente usadas para finalidades lícitas, necessárias para a operação da nossa rede. Utilizamos seus dados para apresentar conteúdo personalizado (como a Triagem TEA IA), gerenciar sua experiência nas comunidades de usuários, produzir métricas estatísticas anônimas de uso e comunicação técnica via e-mail ou mensagens.</p>
      
      <h3>3. O Que Não Fazemos (Privacidade dos Menores)</h3>
      <p>Levamos a integridade infanto-juvenil a sério. Não coletamos intencionalmente informações médicas restritas de identidade das crianças. Todas as discussões sobre o comportamento de dependentes devem preservar nomes completos da criança sempre que possível. Somente os responsáveis legais devem abrir cadastro na plataforma. Além disso, <strong>nunca vendemos seus dados, base de e-mails ou interações pessoais</strong> para indústrias, corretores de dados (data brokers) ou quaisquer terceiros com fins abusivos de propaganda.</p>
      
      <h3>4. Compartilhamento Seguro com Parceiros</h3>
      <p>No decorrer da operação do site, podemos compartilhar dados minimizados com infraestrutura técnica robusta, tais como provedores de nuvem (ex.: Firebase, Google Cloud), que abrigam fisicamente nossa estrutura, sob os mais altos escrutínios de segurança cibernética.</p>
      
      <h3>5. Retenção e Direitos do Titular (LGPD)</h3>
      <p>Retemos seus dados pelo período da vigência do seu cadastro. Como titular dos dados, você pode em qualquer momento solicitar: visão integral dos seus dados, correção, anonimização, bloqueio de comunicações não essenciais ou exclusão integral da sua conta, exercendo seu direito ao esquecimento, excetuando dados exigidos por órgãos legais, contábeis ou de resolução de litígios. Você pode enviar a requisição por e-mail.</p>
    </div>
  </LegalLayout>
);

export const Contato: React.FC<LegalPageProps> = ({ onBack }) => (
  <LegalLayout title="Fale Conosco" icon={<Mail size={32} />} onBack={onBack}>
    <div className="max-w-2xl mx-auto">
      <p className="text-slate-600 mb-8 text-center text-lg leading-relaxed">
        Na Conecta TEA, nós prezamos pela proximidade e ouvidos muito atentos à nossa comunidade. Se você é mãe, pai, parceiro comercial ou apenas tem uma sugestão engenhosa para melhorar a plataforma, nós estamos de portas sempre abertas. Este é o seu espaço de contato direto com a central administrativa da plataforma.
      </p>
      <p className="text-slate-600 mb-8 text-center">
        Compreendemos que a rotina típica da família TEA é incansável. Por isso, nossa equipe procura responder qualquer e-mail no prazo máximo útil de 24 a 48 horas (respeitando escalas não feriadas). Seja para elogiar, resolver falhas de acesso, solicitar parcerias com APAEs ou sugerir inclusões de bibliografia infantil, nosso e-mail oficial é a base central de comunicação.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center text-center border border-slate-100 shadow-sm transition hover:shadow-md">
          <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mb-4">
            <Mail size={24} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Canal Direto por E-mail</h3>
          <p className="text-slate-500 text-sm mb-4">Aberto para suporte geral, relatar instabilidades de IA, resolução sobre assinaturas e sugestões.</p>
          <a href="mailto:fabiopalacioschwingel@gmail.com" className="text-brand-primary font-semibold hover:underline">
            fabiopalacioschwingel@gmail.com
          </a>
        </div>
        
        <div className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center text-center border border-slate-100 shadow-sm transition hover:shadow-md">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <MapPin size={24} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Escritório Digital e Origem</h3>
          <p className="text-slate-500 text-sm mb-4">Somos uma equipe vibrante baseada no Rio Grande do Sul (Parobé) com servidores espalhados pelo Brasil.</p>
          <span className="text-slate-700 font-medium border-t border-slate-200 mt-2 pt-2 block w-full">
            Parobé, RS - Brasil
          </span>
        </div>
      </div>
    </div>
  </LegalLayout>
);

export const Sobre: React.FC<LegalPageProps> = ({ onBack }) => (
  <LegalLayout title="Sobre Nós" icon={<Info size={32} />} onBack={onBack}>
    <div className="prose prose-slate max-w-none">
      <p>A Conecta TEA nasceu da história de uma família enfrentando os mesmos desafios, dúvidas e vitórias que milhares de lares no mundo. Mais especificamente, ela nasceu quando uma semente chamada Victória revelou ao mundo e aos seus pais que o amor pode se manifestar de formas plurais, atípicas e profundamente grandiosas. Fundada por Fábio Palacio Schwingel no interior do Rio Grande do Sul, na cidade de Parobé, a Conecta TEA não é apenas uma plataforma de tecnologia: ela é um farol virtual projetado para ser exatamente a bússola que tanto fez falta no primeiro dia em que escutamos a palavra "autismo".</p>
      
      <h2>Nossa Missão como "Guardião Digital"</h2>
      <p>Nossa missão fundamental é ser a âncora e a estrutura de apoio para mães e pais desde o primeiríssimo sinal de atipicidade. Sabemos que o diagnóstico clínico demora. Sabemos o quanto médicos, laudos e intervenções assustam e drenam energia na busca por caminhos certos, gerando aquela clássica neblina de medo. Diante disso, nossa missão é democratizar a informação empática através de uma rede segura, dotada com o que há de melhor em tecnologia, como as inteligências artificiais conversacionais afetuosas (Sofia TEA IA), para estar segurando a sua mão quando mais ninguém puder.</p>

      <h2>O Que Nos Move: Valores e Crenças Humanas</h2>
      <p>Sustentamos toda a estrutura do site (desde as diretrizes de código aos materiais que desenhamos) sob fortes alicerces:</p>
      <ul>
        <li><strong>Ausência de Julgamento (Rede de Segurança):</strong> Pais exaustos precisam de escuta, não de pessoas lhes apontando o dedo ou os julgando enquanto amparam crises em supermercados ou perdem noites em claro. Na nossa plataforma, ninguém anda sozinho, as dores são abraçadas e as emoções são validadas de forma gentil.</li>
        <li><strong>Uso Responsável da Tecnologia:</strong> Nenhuma IA, nenhum software poderá jamais tirar o lugar da medicina, do psicólogo e do neuropediatra. Nós acreditamos na junção: o profissional na clínica faz o suporte estrutural médico; e nós, como plataforma assistiva, completamos nos 99% do período da semana em que as famílias estão vivendo sua realidade em casa.</li>
        <li><strong>Privacidade Inviolável e Ética Plena:</strong> Sabendo das fragilidades e medos das vulnerabilidades da neurodivergência infantil, nossos dados e conexões seguem códigos impenetráveis de conduta perante políticas nacionais de privacidade, preservando a inocência e o futuro de meninas e meninos envolvidos nas jornadas narradas.</li>
      </ul>

      <h2>A Visão de Comunidade: Do Regional ao Global</h2>
      <p>Enquanto muitos recursos focam num indivíduo autista apartado da família, nossa crença é focar na "Família TEA" - todos entram na rede. Nossos primeiros passos integram leis nacionais (como Lei Brasileira de Inclusão) e até iniciativas locais como o programa TEAcolhe, e buscamos interligar grupos físicos de estado para estado, município a município. O objetivo é criar a maior aglomeração unida para apoiar projetos, conscientizar vizinhos de maneira sutil, e permitir visões de qualidade mais elevada nas vidas destas famílias.</p>

      <h2>Agradecimento da Família Conecta</h2>
      <p>Desejamos que cada livro entregue aqui, cada ferramenta de carteirinha de identificação usada ou mesmo cada artigo do blog lido na madrugada silenciosa possa tirar um peso dos seus ombros. Nós compreendemos a montanha-russa em que vocês se encontram. Hoje, o site pertence a vocês. Naveguem, conectem-se e aproveitem a jornada com carinho.</p>
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
