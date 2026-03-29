import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import fs from "fs";

// Load config
const firebaseConfig = JSON.parse(fs.readFileSync(new URL("./firebase-applet-config.json", import.meta.url), "utf-8"));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

const posts = [
  // Histórias Emocionais
  {
    content: "Hoje ele me olhou nos olhos e sorriu por 5 segundos inteiros. Pode parecer pouco para o mundo, mas para mim foi o universo inteiro. Celebrem as pequenas vitórias! 💙✨ #Autismo #MaternidadeAtipica #PequenasVitorias",
    topic: "conquistas",
    authorName: "Mãe Atípica",
  },
  {
    content: "O diagnóstico assusta no início. Lembro de chorar muito, não por ele, mas pelo medo do desconhecido. Hoje, 3 anos depois, vejo que foi apenas o começo de uma jornada linda de muito aprendizado. Vocês também sentiram isso? 🧩❤️ #DiagnosticoTEA #FamiliaAtipica",
    topic: "geral",
    authorName: "Pai de um menino incrível",
  },
  {
    content: "Primeiro dia de aula sem choro! A adaptação escolar é um desafio gigante, mas com paciência e a escola certa, as coisas se encaixam. Muito orgulho da minha pequena! 🎒👧 #InclusaoEscolar #AutismoInfantil",
    topic: "conquistas",
    authorName: "Mãe de uma guerreira",
  },
  {
    content: "A exaustão bate forte às vezes. Noites sem dormir, crises que não entendemos logo de cara... Mas aí vem um abraço apertado do nada e tudo faz sentido. Força para nós, famílias! 💪💙 #MaternidadeReal #TEA",
    topic: "geral",
    authorName: "Família Atípica",
  },
  {
    content: "Hoje fomos ao parquinho e, pela primeira vez, ele dividiu o brinquedo com outra criança. Meu coração quase explodiu de alegria. Cada passo no tempo deles é perfeito. 🎠🧩 #DesenvolvimentoInfantil #AutismoBrasil",
    topic: "conquistas",
    authorName: "Mãe Coruja",
  },
  {
    content: "Ouvir a primeira palavra aos 4 anos foi a música mais linda que já escutei. Nunca percam a esperança, o tempo deles é único e precioso. 🗣️🎶 #Fonoaudiologia #AutismoNaoVerbal",
    topic: "conquistas",
    authorName: "Mãe de um príncipe",
  },
  {
    content: "Às vezes, o silêncio também é comunicação. Aprendi a ler os olhares, os gestos e as respirações do meu filho. O amor não precisa de palavras para ser sentido. 💙🤫 #ComunicacaoAlternativa #AmorIncondicional",
    topic: "geral",
    authorName: "Pai Atípico",
  },
  {
    content: "Fomos ao supermercado e conseguimos fazer as compras sem crise sensorial! O uso do abafador de ruídos mudou nossas vidas. Pequenos ajustes fazem toda a diferença. 🛒🎧 #IntegracaoSensorial #Autismo",
    topic: "conquistas",
    authorName: "Mãe Prática",
  },
  {
    content: "Hoje é um dia difícil. A regressão assusta e dói. Mas sei que é uma fase e que amanhã é um novo dia para recomeçar. Um abraço virtual para quem também está num dia difícil. 🫂🌧️ #MaternidadeAtipica #ApoioMuo",
    topic: "geral",
    authorName: "Mãe Real",
  },
  {
    content: "Ver meu filho brincando com o irmão mais novo me enche de esperança. A interação social é um desafio, mas o amor de irmão supera barreiras. 👦👶💙 #IrmaosAtipicos #FamiliaTEA",
    topic: "conquistas",
    authorName: "Mãe de Dois",
  },

  // Dicas Práticas
  {
    content: "Dica de ouro: antecipação! Antes de sair de casa, mostro fotos do lugar para onde vamos e explico o que vai acontecer. Isso reduziu as crises de ansiedade em 80%. Como vocês fazem por aí? 🗓️📸 #RotinaTEA #DicasAutismo",
    topic: "duvidas",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Para quem tem dificuldade com o corte de cabelo: tentem usar uma maquininha silenciosa e façam o corte em casa, num ambiente seguro, assistindo ao desenho favorito. Aqui funcionou super bem! ✂️📺 #SensibilidadeSensorial #DicasPraticas",
    topic: "geral",
    authorName: "Pai Criativo",
  },
  {
    content: "Seletividade alimentar é um desafio diário. Começamos a brincar com a comida fora do horário da refeição, sem pressão para comer. Só tocar e cheirar já é um avanço! 🥦🍎 #SeletividadeAlimentar #Autismo",
    topic: "duvidas",
    authorName: "Mãe Nutritiva",
  },
  {
    content: "Uso de quadros de rotina visual mudou a dinâmica da nossa casa. Saber o que vem depois traz muita segurança para eles. Vocês usam imagens ou fotos reais? 🖼️📅 #RotinaVisual #TEABrasil",
    topic: "duvidas",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Dica para o desfralde: não comparem! O tempo da criança atípica pode ser diferente. Começamos deixando o penico no banheiro e lendo livrinhos sobre o tema. Paciência é a chave. 🚽📖 #DesfraldeTEA #Desenvolvimento",
    topic: "geral",
    authorName: "Mãe Paciente",
  },
  {
    content: "Roupas sem etiquetas e com tecidos macios são essenciais para quem tem sensibilidade tátil. Alguém tem indicação de marcas que vendem roupas sensoriais acessíveis? 👕🏷️ #SensibilidadeTatil #DicasTEA",
    topic: "duvidas",
    authorName: "Mãe em Busca",
  },
  {
    content: "Para ajudar na regulação emocional, criamos o 'cantinho da calma' no quarto. Uma cabaninha escura com almofadas, luzes suaves e fones de ouvido. É o refúgio perfeito! ⛺🧘‍♂️ #RegulacaoEmocional #Autismo",
    topic: "geral",
    authorName: "Pai Protetor",
  },
  {
    content: "Na hora da crise, menos é mais. Menos fala, menos toque, menos estímulo visual. Apenas presença e segurança. O que mais ajuda o filho de vocês a se acalmar? 🤫💙 #CriseSensorial #ApoioTEA",
    topic: "duvidas",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Brincadeiras com água, areia ou massinha são ótimas para integração sensorial. Deixem a sujeira rolar, o benefício para o desenvolvimento vale a pena! 💧🏖️ #BrincarSensorial #TerapiaOcupacional",
    topic: "geral",
    authorName: "Mãe Brincante",
  },
  {
    content: "Dica de viagem: entrem em contato com a companhia aérea ou hotel antes e expliquem as necessidades do seu filho. Muitos lugares já oferecem atendimento prioritário e adaptações. ✈️🏨 #ViagemAtipica #Inclusao",
    topic: "geral",
    authorName: "Família Viajante",
  },

  // Conteúdo Educativo
  {
    content: "Você sabia? O autismo é um espectro porque as características e necessidades de suporte variam imensamente de pessoa para pessoa. Não existem dois autistas iguais! 🌈🧩 #ConscientizacaoTEA #EspectroAutista",
    topic: "noticias",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Ecolalia não é apenas 'repetir palavras sem sentido'. Muitas vezes é uma forma de comunicação, de regulação ou de processamento de informações. Valide a ecolalia do seu filho! 🗣️🔄 #Ecolalia #FonoaudiologiaTEA",
    topic: "noticias",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Stims (comportamentos autoestimulatórios) como balançar as mãos (flapping) ou o corpo são ferramentas importantes de regulação emocional e sensorial. Não os proíba, a menos que sejam lesivos. 👐💙 #Stimming #AutismoRespeito",
    topic: "noticias",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "A Lei Berenice Piana (Lei 12.764/12) garante os direitos dos autistas no Brasil, incluindo acesso à educação, saúde e mercado de trabalho. Conhecer nossos direitos é o primeiro passo para exigi-los! ⚖️📜 #DireitosDoAutista #LeiBerenicePiana",
    topic: "noticias",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Hiperfoco é uma característica comum no TEA. É um interesse intenso e profundo por um assunto específico. Use o hiperfoco a favor do aprendizado e da conexão com seu filho! 🦖🚂 #Hiperfoco #AutismoInfantil",
    topic: "noticias",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Meltdown (crise) não é birra! A birra tem um objetivo (conseguir algo), o meltdown é uma sobrecarga sensorial ou emocional onde a criança perde o controle. A abordagem precisa ser de acolhimento, não de punição. 🧠🛑 #Meltdown #Neurodiversidade",
    topic: "noticias",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Comunicação Aumentativa e Alternativa (CAA) não impede a fala! Pelo contrário, estudos mostram que o uso de CAA pode estimular o desenvolvimento da linguagem verbal. 📱💬 #CAA #ComunicacaoAlternativa",
    topic: "noticias",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "O Cordão de Girassol é um símbolo internacional para identificar pessoas com deficiências ocultas, como o autismo. Ele ajuda a sinalizar a necessidade de suporte ou paciência em locais públicos. 🌻🎗️ #CordaoDeGirassol #Inclusao",
    topic: "noticias",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Intervenção precoce é fundamental! Quanto mais cedo a criança receber os estímulos adequados (fono, TO, psicologia), melhores serão as oportunidades de desenvolvimento. Não espere para ver. ⏳🧠 #IntervencaoPrecoce #DesenvolvimentoInfantil",
    topic: "noticias",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Neurodiversidade é o conceito de que diferenças neurológicas (como autismo, TDAH) são variações naturais do cérebro humano, não doenças a serem curadas. Respeito e aceitação sempre! 🧠🌍 #Neurodiversidade #Aceitacao",
    topic: "noticias",
    authorName: "Comunidade Conecta TEA",
  },

  // Perguntas de Engajamento
  {
    content: "Qual foi a maior conquista do seu filho(a) nesta semana? Vamos celebrar juntos nos comentários! 🎉👇 #ConquistasTEA #ComunidadeAtipica",
    topic: "conquistas",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Se você pudesse dar um conselho para uma mãe ou pai que acabou de receber o diagnóstico de TEA, qual seria? Deixe sua mensagem de apoio aqui. ❤️📝 #ApoioMutuo #DiagnosticoAutismo",
    topic: "geral",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Qual é o hiperfoco atual do seu filho(a)? Aqui em casa estamos na fase dos dinossauros (de novo!). 🦖🦕 Conta pra gente! #HiperfocoTEA #MaternidadeAtipica",
    topic: "geral",
    authorName: "Mãe Curiosa",
  },
  {
    content: "Como vocês lidam com os olhares e julgamentos em locais públicos durante uma crise? Compartilhem suas estratégias para mantermos a calma. 🧘‍♀️👀 #MaternidadeReal #AutismoNaPratica",
    topic: "duvidas",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Qual é o brinquedo ou atividade que nunca falha na hora de acalmar seu pequeno(a)? Precisando de ideias novas por aqui! 🧩🎨 #DicasBrincadeiras #RegulacaoSensorial",
    topic: "duvidas",
    authorName: "Pai em Busca de Dicas",
  },
  {
    content: "Vocês têm rede de apoio? Quem é a pessoa que mais te ajuda na jornada atípica? Marque ela aqui para agradecer! 🥰🤝 #RedeDeApoio #FamiliaAtipica",
    topic: "geral",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Qual foi o maior desafio que vocês enfrentaram na inclusão escolar e como superaram? A troca de experiências ajuda muito! 🏫📚 #InclusaoEscolar #AutismoNaEscola",
    topic: "duvidas",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "O que vocês fazem para cuidar da própria saúde mental? Cuidar de quem cuida é essencial! Deixem dicas de autocuidado. ☕🛀 #Autocuidado #MaeAtipica",
    topic: "geral",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Qual música ou desenho seu filho(a) pede para repetir 100 vezes por dia? Aqui é a galinha pintadinha! 🐔🎶 #RotinaTEA #MaternidadeComHumor",
    topic: "geral",
    authorName: "Mãe Cansada mas Feliz",
  },
  {
    content: "Descreva seu filho(a) em 3 palavras! Vou começar: Carinhoso, observador e fã de trens. Sua vez! 🚂💙 #MeuMundoAzul #AutismoAmor",
    topic: "geral",
    authorName: "Comunidade Conecta TEA",
  },

  // Mensagens Motivacionais
  {
    content: "Você é a melhor mãe/pai que o seu filho poderia ter. Não duvide da sua força, mesmo nos dias mais difíceis. Você está fazendo um trabalho incrível! 💪❤️ #MaternidadeAtipica #Forca",
    topic: "geral",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "O progresso não é linear. Haverá dias de avanços gigantes e dias de regressão. Respire fundo, acolha o momento e lembre-se de que o amor é a base de tudo. 📈📉💙 #DesenvolvimentoTEA #Paciencia",
    topic: "geral",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Não compare o capítulo 1 do seu filho com o capítulo 10 do filho de outra pessoa. Cada criança tem seu próprio tempo e sua própria luz. Brilhem no tempo de vocês! ✨🕰️ #SemComparacoes #Autismo",
    topic: "geral",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Atrás de cada criança atípica que vence barreiras, existe uma família que lutou bravamente por ela. Orgulhe-se da sua jornada! 🛡️👨‍👩‍👦 #FamiliaGuerreira #OrgulhoAtipico",
    topic: "conquistas",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Cansar é humano, desistir não é uma opção. Tire um tempo para você, recarregue as energias e volte mais forte. Cuidar de você é cuidar do seu filho. 🔋🛌 #Autocuidado #SaudeMental",
    topic: "geral",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "O autismo não define o limite do seu filho, apenas mostra que o caminho para o sucesso pode ser diferente. Acredite no potencial dele! 🚀🌟 #PotencialInfinito #Neurodiversidade",
    topic: "geral",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Pequenos passos ainda são passos. Celebre cada nova palavra, cada novo olhar, cada nova tentativa. O amor transforma! 👣💙 #PequenosPassos #AmorQueTransforma",
    topic: "conquistas",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Você não está sozinho(a). Somos uma comunidade de milhares de famílias vivendo os mesmos desafios e alegrias. Segure nossa mão! 🤝🌍 #RedeDeApoio #ConectaTEA",
    topic: "geral",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "A sociedade precisa aprender mais com nossos filhos do que nossos filhos precisam se adaptar à sociedade. O mundo precisa de mais empatia e diversidade. 🌍🧩 #Empatia #InclusaoDeVerdade",
    topic: "geral",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Um dia de cada vez. Uma vitória de cada vez. Um sorriso de cada vez. Respire, você está indo muito bem. 🌸🧘‍♀️ #UmDiaDeCadaVez #MaternidadeReal",
    topic: "geral",
    authorName: "Comunidade Conecta TEA",
  },
  // Mais 10 posts mistos para completar 50
  {
    content: "Alguém já tentou usar óleos essenciais para ajudar no sono? Meu filho acorda 3 vezes por noite e estamos exaustos. Aceito dicas! 😴🌿 #SonoInfantil #DicasTEA",
    topic: "duvidas",
    authorName: "Mãe Zumbi",
  },
  {
    content: "Hoje foi dia de fono e a terapeuta elogiou muito a evolução dele na imitação de sons de animais! O trabalho em equipe entre família e terapeutas é fundamental. 🐄🦆 #Fonoaudiologia #Desenvolvimento",
    topic: "conquistas",
    authorName: "Pai Orgulhoso",
  },
  {
    content: "A seletividade alimentar não é 'frescura'. É uma dificuldade real de processar texturas, cheiros e sabores. Respeite o tempo e os limites da criança. 🚫🥦 #SeletividadeAlimentar #Respeito",
    topic: "noticias",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Qual é a atividade favorita do seu filho(a) no final de semana? Aqui adoramos ir ao parque bem cedinho quando está vazio. 🌳☀️ #FimDeSemanaAtipico #Rotina",
    topic: "geral",
    authorName: "Mãe Natureza",
  },
  {
    content: "Lembrete do dia: A jornada é longa e cheia de altos e baixos, mas você é o porto seguro do seu filho. O seu abraço cura tudo. 🫂❤️ #AmorDeMae #PortoSeguro",
    topic: "geral",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Dica de ouro: usem temporizadores visuais (como ampulhetas ou apps) para ajudar na transição de atividades. Isso diminui muito a ansiedade de 'ter que parar de brincar'. ⏳📱 #Transicoes #DicasPraticas",
    topic: "duvidas",
    authorName: "Pai Organizado",
  },
  {
    content: "Hoje ele conseguiu amarrar o próprio sapato! Foram meses de treino na Terapia Ocupacional e em casa. Celebrem cada pequena autonomia! 👟🎉 #TerapiaOcupacional #AutonomiaInfantil",
    topic: "conquistas",
    authorName: "Mãe de um Rapazinho",
  },
  {
    content: "O que vocês fazem quando a bateria social de vocês acaba, mas a do filho está em 100%? Socorro! 😂🔋 #MaternidadeReal #HumorAtipico",
    topic: "geral",
    authorName: "Mãe Cansada",
  },
  {
    content: "A inclusão começa em casa, ensinando nossos filhos neurotípicos a respeitarem e acolherem as diferenças. Como vocês abordam o tema com os irmãos? 👦👧 #Inclusao #Irmaos",
    topic: "duvidas",
    authorName: "Comunidade Conecta TEA",
  },
  {
    content: "Não deixe que o diagnóstico apague a criança que existe ali. Antes de ser autista, ele é uma criança que ama brincar, rir e ser amada. 🎈💙 #CriancaSendoCrianca #AutismoAmor",
    topic: "geral",
    authorName: "Comunidade Conecta TEA",
  }
];

async function seed() {
  console.log("Iniciando inserção de 50 posts via Client SDK...");
  
  const formattedPosts = posts.map(post => ({
    ...post,
    text: post.content,
    userId: "system-seed",
    authorId: "system-seed",
    mediaType: "text",
    state: "SP",
    city: "São Paulo",
    location: "São Paulo, SP",
    likes: Math.floor(Math.random() * 50),
    comments: Math.floor(Math.random() * 10),
    isPinned: false
  }));

  try {
    const postsRef = collection(db, 'posts');
    let count = 0;
    for (const post of formattedPosts) {
      await addDoc(postsRef, {
        ...post,
        timestamp: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      count++;
    }
    console.log(`Sucesso! ${count} posts foram inseridos no Firestore.`);
  } catch (error) {
    console.error("Erro ao inserir posts:", error);
  }
}

seed().catch(console.error);
