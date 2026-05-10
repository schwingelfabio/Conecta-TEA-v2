import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface BlogPageProps {
  slug: string;
  onBack: () => void;
}

const articles: Record<string, { title: string, content: React.ReactNode }> = {
  'o-que-e-autismo': {
    title: 'O que é Autismo (TEA): Compreendendo o Espectro',
    content: (
      <div className="prose prose-slate max-w-none">
        <p>O Transtorno do Espectro Autista (TEA) é uma condição do desenvolvimento neurológico caracterizada por diferenças na comunicação social, na interação social e por padrões de comportamentos, interesses ou atividades restritos e repetitivos. O termo "espectro" destaca a incrível diversidade de como o autismo se manifesta: não existem duas pessoas autistas iguais.</p>
        
        <h2>A Natureza do Espectro</h2>
        <p>Compreender o autismo exige olhar além de estereótipos. O espectro não é linear (do "menos" para o "mais" autista), mas sim como um painel de equalizador de som. Uma pessoa pode ter habilidades avançadas em determinadas áreas, como matemática, memória visual ou música, enquanto enfrenta desafios significativos em outras, como comunicação verbal ou regulação sensorial. Isso significa que as necessidades de suporte variam imensamente.</p>
        
        <h2>Sinais e Características Principais</h2>
        <p>Embora as características variem, a maioria das pessoas no espectro apresenta algumas destas características:</p>
        <ul>
          <li><strong>Comunicação e Interação Social:</strong> Dificuldade em compreender regras sociais implícitas, manter contato visual consistente (que pode ser desconfortável e até doloroso para alguns), entender sarcasmo, expressões faciais ou nuances na linguagem. Algumas pessoas podem ser não falantes ou ter atraso na fala, enquanto outras têm vocabulário rico, mas dificuldade na troca de turnos em uma conversa.</li>
          <li><strong>Comportamentos Repetitivos e Interesses Restritos:</strong> Movimentos motores estereotipados (conhecidos como <i>stimming</i> ou autoestimulação, como balançar o corpo, agitar as mãos ou repetir palavras — ecolalia), forte adesão a rotinas e resistência a mudanças, além de interesses profundos e altamente focados em tópicos específicos.</li>
          <li><strong>Processamento Sensorial:</strong> Muitas pessoas com TEA têm diferenças no processamento sensorial (hipersensibilidade ou hipossensibilidade). Ambientes com muito barulho, luzes fortes ou certas texturas de roupas podem causar sobrecarga sensorial, que frequentemente leva a crises (meltdowns) ou retraimento (shutdowns).</li>
        </ul>

        <h2>Causas e Prevalência</h2>
        <p>A ciência ainda investiga as causas exatas do autismo, mas o consenso médico aponta para uma combinação de fatores genéticos e ambientais. Não há uma única "causa" para o autismo. Além disso, as taxas de diagnóstico têm aumentado significativamente. Esse aumento deve-se, em grande parte, à maior conscientização médica e pública, aos critérios diagnósticos mais amplos e melhor compreensão de que o autismo se manifesta de forma diferente em meninas e mulheres, que historicamente foram subdiagnosticadas.</p>
        
        <h2>Abordagem da Neurodiversidade</h2>
        <p>O paradigma da neurodiversidade propõe que o autismo não é uma "doença a ser curada", mas sim uma variação natural do cérebro humano. Como toda variação, traz consigo forças únicas — como atenção aos detalhes, honestidade, pensamento lógico rígido e criatividade — junto com desafios que requerem suporte, acomodações e respeito da sociedade. Intervenções terapêuticas (como fonoaudiologia, terapia ocupacional e psicologia) não buscam "normalizar" o autista, mas sim ajudá-lo a desenvolver habilidades para navegar no mundo, comunicar-se de forma eficaz e ter qualidade de vida.</p>
        
        <h2>Apoio e Compreensão da Família</h2>
        <p>O papel da família e da comunidade é vital. O diagnóstico, muitas vezes, traz insegurança, mas é o primeiro passo para obter as ferramentas e os apoios adequados. A comunicação aberta, o amor, a aceitação e o uso constante de adaptações — como antecipação de rotinas e respeito ao tempo do indivíduo — fazem toda a diferença para o desenvolvimento saudável e feliz de uma pessoa com TEA. O Connecta TEA está aqui justamente para segurar essa mão e trilhar esse caminho junto com cada família, conectando histórias, vivências e muito afeto.</p>
      </div>
    )
  },
  'como-identificar-sinais-de-tea': {
    title: 'Como Identificar Sinais de TEA em Crianças: O Que os Pais Precisam Saber',
    content: (
      <div className="prose prose-slate max-w-none">
        <p>Identificar os primeiros sinais do Transtorno do Espectro Autista (TEA) pode ser um momento de Muitas dúvidas para mães, pais e cuidadores. O desenvolvimento infantil não é uma corrida exata onde todas as crianças atingem os mesmos marcos no mesmo dia. No entanto, existem padrões de alerta que, quando observados cedo, podem abrir caminho para intervenções precoces que transformam a qualidade de vida da criança e da família ao longo dos anos.</p>
        
        <h2>Por Que a Intervenção Precoce é Fundamental?</h2>
        <p>O cérebro de bebês e crianças pequenas possui uma incrível capacidade de adaptação, conhecida como neuroplasticidade. Começar terapias e acompanhamento adequado nos primeiros anos (ou mesmo meses) de vida ajuda a desenvolver as áreas da comunicação, socialização e regulação emocional que precisam de suporte, reduzindo frustrações futuras. O objetivo de identificar não é rotular, mas sim garantir ajuda.</p>
        
        <h2>Os Sinais Precoces a Partir dos Primeiros Meses</h2>
        <p>Os sinais do TEA podem ser notados, muitas vezes, a partir do primeiro ano de vida. Contudo, em alguns casos, as características ficam mais óbvias a partir dos 18 ou 24 meses, à medida que a demanda social aumenta. Preste atenção aos seguintes pontos:</p>
        
        <h3>1. Contato Visual e Sorriso Social</h3>
        <p>Normalmente, bebês começam a sorrir de volta e fazer contato visual constante. Um possível sinal de TEA é o bebê que parece evadir o olhar durante a alimentação ou brincadeiras, ou apresentar o que os médicos chamam de "olhar vazio" e a falta de reatividade ao sorriso social de quem interage.</p>

        <h3>2. O Atender pelo Próprio Nome</h3>
        <p>Por volta de 10 a 12 meses, a maioria das crianças já responde, virando a cabeça ou olhando quando chamada pelo nome. Se a criança não respondeu após várias chamadas repetidas, mas reage a sons de interesse (como o comercial favorito na TV ou o som de um papel de bala), isso não é necessariamente surdez, mas sim uma característica de foco auditivo e atenção compartilhada distinta que ocorre no autismo.</p>

        <h3>3. Apontar e a Atenção Compartilhada</h3>
        <p>Uma das fases mais cruciais no desenvolvimento infantil típico é o ato de apontar para mostrar algo de interesse a outra pessoa. Por exemplo, apontar para um passarinho para que os pais vejam o mesmo passarinho e compartilhem o momento (atenção compartilhada). Crianças no espectro muitas vezes não apontam ou pegam na mão do adulto apenas como uma ferramenta para obter o que desejam, sem o aspecto "social" do olhar (o movimento de usar a mão do adulto como se fosse uma extensão da sua própria para abrir uma caixa).</p>

        <h3>4. Brincar Funcional e Estereotipías</h3>
        <p>Observe como a criança brinca. Em vez de rolar um carrinho pelo chão fazendo ruídos imaginativos de motor, a criança talvez prefira girar obsessivamente as rodas do carrinho por longos períodos. Outros sinais incluem enfileirar brinquedos por cor ou tamanho e demonstrar irritação extrema se a ordem for alterada. Pode-se notar também movimentos estereotipados ("flapping" das mãos, andar frequentemente nas pontas dos pés, balançar o tronco).</p>

        <h3>5. Atrasos na Fala e Comunicação e Perda de Habilidades</h3>
        <p>O atraso no balbucio aos 12 meses, a ausência de palavras isoladas aos 16 meses ou a total falta de tentativas de se comunicar verbalmente são sinais de alerta. Um ponto essencial: se a criança desenvolveu palavras, gestos e sorrisos, e em algum momento (geralmente próximo aos dois anos) começa a perdê-los, regredindo no desenvolvimento, um médico deve ser consultado imediatamente.</p>

        <h2>Como a Família Deve Agir?</h2>
        <p>É perfeitamente normal sentir medo ou ansiedade se você observar esses sinais em seu filho(a). Mas lembre-se: conhecimento é poder e amor. A primeira atitude deve ser comunicar essas observações a um neuropediatra ou psiquiatra infantil. Não espere achando que "o tempo da criança vai chegar" ignorando os marcos de atraso. Avaliações multidisciplinares (fonoaudiólogos, terapeutas ocupacionais) são o caminho para compreender e dar suporte a uma criança no espectro. A Conecta TEA fornece apoio aos pais neste exato e desafiador momento de descoberta e de tomada de decisões, abraçando quem mais precisa de direção.</p>
      </div>
    )
  },
  'rotina-para-criancas-com-tea': {
    title: 'A Importância da Rotina e Regulação para Crianças com TEA',
    content: (
      <div className="prose prose-slate max-w-none">
        <p>A estrutura e a previsibilidade muitas vezes funcionam como grandes ancoradouros para crianças com Transtorno do Espectro Autista (TEA). O mundo para uma pessoa autista, na frequência de luzes, de ruídos e até mesmo nas imprevisíveis falas das pessoas ao redor, com muita frequência parece avassalador, ruidoso e assustador. Introduzir rotina não é uma estratégia para controlar a criança, mas sim para libertá-la da contínua tensão do "o que vai acontecer depois".</p>
        
        <h2>A Previsibilidade Como Base de Segurança Mental</h2>
        <p>Para cérebros neuroatípicos que têm certa dificuldade de planejamento e antecipação das ações que ainda não aconteceram, cada transição e surpresa no dia a dia exige um dispêndio massivo de energia cognitiva e emocional. A ansiedade pode surgir não porque o próximo evento é doloroso, mas simplesmente porque ele é <em>desconhecido</em>. Estabelecer rotinas consistentes reduz o fardo cognitivo infantil, aumentando assim o espaço para aprendizado e interações lúdicas significativas.</p>

        <h2>Recursos Visuais: Transformando a Comunicação</h2>
        <p>A imensa maioria de crianças e pessoas com autismo tende a apresentar grande afinidade e facilitação para a aprendizagem visual. Enquanto a orientação auditiva falada some no mesmo segundo em que a palavra termina de vibrar pelo ar, as imagens permanecem. É por isso que quadros de rotinas e recursos visuais funcionam tão bem.</p>
        <ul>
          <li><strong>Cronograma Visual:</strong> Utilize figuras, fotos reais dos cômodos da casa ou pictogramas ilustrando a ordem das atividades: acordar, comer, escovar o dente e brincar. Pode-se usar um sistema de adesivos ou velcro em que a criança retira a foto da atividade quando ela é concluída.</li>
          <li><strong>Mural das Emoções:</strong> Imagens de expressões faciais podem ser aliadas. Dar meios para uma criança entender que quando seu peito aperta ela está "brava" ou "frustrada" pode, com o tempo, reduzir gritos, substituindo-os pelo apontamento para o quadro visual, validando seu sentimento.</li>
          <li><strong>Temporizadores Visuais:</strong> Saber que uma atividade agradável, como assistir a um desenho, está chegando ao fim traz menos sobressalto quando visualizados através de timers, areia da ampulheta ou aplicativos de tempo visual em tablets que diminuem as barras coloridas até zero, ajudando-os a prever o término do momento.</li>
        </ul>

        <h2>Flexibilidade e o Mundo Real</h2>
        <p>Precisamos notar uma linha tênue importantíssima. A previsibilidade não deve se converter em um isolante intolerante com a vida humana típica — que vive mudando. A ideia de rotina é manter bases firmes para quando ocorrem quebras dessas transições, elas não se tornem crises severas de estresse agudo.</p>
        <p>O conceito central reside na <strong>"quebra antecipada"</strong>. Vai chover no dia do parquinho agendado? Em vez de simplesmente não ir, usar um roteiro social pode evitar o pranto descontrolado. Desenhe e fale em frases curtas algo do tipo: "Hoje olhamos pela janela e tem chuva [imagem chuva]. Parquinho está molhado. O que faremos? Vamos fazer uma cabana com lençóis na sala [imagem cabana]." Antecipar os sustos torna seus efeitos infinitamente menores.</p>

        <h2>Cuidados Extras na Sensorialidade</h2>
        <p>Sua rotina estruturada precisará englobar pausas regulares de regulação sensorial (os conhecidos "descompressivos"). O cérebro no TEA sobrecarrega rapidamente em mercados ou parquinhos ruidosos. É vital, dentro da estrutura familiar, que após o supermercado – não aconteça ali imediatamente uma festa barulhenta de aniversário, e sim, uma atividade tátil serena (água na bacia para mão, brinquedos no escuro com lanterninha de luz azul ou descanso e silêncio). A saúde orgânica da criança TEA agradece este balanceamento vital para qualidade de vida.</p>
        
        <h2>Uma Caminhada Aos Poucos</h2>
        <p>Nunca tente instituir dezoito apoios visuais para toda hora do dia de maneira súbita. Apenas cause o hábito visual começando por um ou dois desafios diários prioritários — a hora do banho muitas vezes e a hora de dormir tendem a ser essenciais. Pequenos tijolos montam o castelo dessa família inteira. Uma base estável possibilita que os passos de amanhã ocorram em terrenos muito mais tranquilos.</p>
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
