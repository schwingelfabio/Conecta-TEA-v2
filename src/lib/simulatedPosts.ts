import { Post } from '../types';

const names = [
  "Maria Silva", "John Smith", "Elena Rodriguez", "Ana Costa", "David Chen",
  "Sarah Johnson", "Carlos Mendes", "Laura Martinez", "James Wilson", "Sofia Garcia",
  "Robert Taylor", "Emma Brown", "Michael Davis", "Olivia Miller", "William Moore",
  "Isabella Anderson", "Richard Thomas", "Sophia Jackson", "Joseph White", "Mia Harris",
  "Charles Martin", "Amelia Thompson", "Thomas Garcia", "Harper Martinez", "Christopher Robinson",
  "Evelyn Clark", "Daniel Rodriguez", "Abigail Lewis", "Matthew Lee", "Emily Walker",
  "Anthony Hall", "Elizabeth Allen", "Mark Young", "Avery Hernandez", "Donald King",
  "Ella Wright", "Steven Lopez", "Chloe Hill", "Paul Scott", "Victoria Green",
  "Andrew Adams", "Grace Baker", "Joshua Gonzalez", "Zoey Nelson", "Kenneth Carter",
  "Penelope Mitchell", "Kevin Perez", "Riley Roberts", "Brian Turner", "Layla Phillips"
];

const locations = [
  "São Paulo, BR", "New York, US", "Madrid, ES", "Lisbon, PT", "London, UK",
  "Toronto, CA", "Sydney, AU", "Mexico City, MX", "Buenos Aires, AR", "Berlin, DE",
  "Paris, FR", "Rome, IT", "Tokyo, JP", "Seoul, KR", "Mumbai, IN",
  "Rio de Janeiro, BR", "Los Angeles, US", "Barcelona, ES", "Porto, PT", "Manchester, UK"
];

const avatars = [
  "https://i.pravatar.cc/150?u=1", "https://i.pravatar.cc/150?u=2", "https://i.pravatar.cc/150?u=3",
  "https://i.pravatar.cc/150?u=4", "https://i.pravatar.cc/150?u=5", "https://i.pravatar.cc/150?u=6",
  "https://i.pravatar.cc/150?u=7", "https://i.pravatar.cc/150?u=8", "https://i.pravatar.cc/150?u=9"
];

const topics: Post['topic'][] = ['geral', 'duvidas', 'conquistas', 'eventos'];

const templates = [
  {
    pt: { title: "Notei algo diferente...", text: "Meu filho evita contato visual às vezes. Não sei se é normal. Alguém já passou por isso?", tip: "Dica: O diagnóstico precoce pode fazer muita diferença." },
    en: { title: "I noticed something different...", text: "My child avoids eye contact sometimes. I don't know if it's normal. Has anyone experienced this?", tip: "Tip: Early diagnosis can make a big difference." },
    es: { title: "Noté algo diferente...", text: "Mi hijo evita el contacto visual a veces. No sé si es normal. ¿Alguien ha pasado por esto?", tip: "Consejo: El diagnóstico temprano puede hacer una gran diferencia." }
  },
  {
    pt: { title: "Pequeno progresso hoje ❤️", text: "Hoje meu filho respondeu quando chamei o nome dele. Pode parecer pequeno, mas significou tudo.", tip: "Celebre cada pequena vitória!" },
    en: { title: "Small progress today ❤️", text: "Today my son responded when I called his name. It may seem small, but it meant everything.", tip: "Celebrate every small victory!" },
    es: { title: "Pequeño progreso hoy ❤️", text: "Hoy mi hijo respondió cuando lo llamé por su nombre. Puede parecer pequeño, pero significó todo.", tip: "¡Celebra cada pequeña victoria!" }
  },
  {
    pt: { title: "Dicas de comunicação", text: "Começamos a usar cartões com imagens e a comunicação melhorou muito em casa. Recomendo tentar!", tip: "Comunicação alternativa ajuda muito." },
    en: { title: "Communication tips", text: "We started using picture cards and communication has improved a lot at home. I recommend trying it!", tip: "Alternative communication helps a lot." },
    es: { title: "Consejos de comunicación", text: "Empezamos a usar tarjetas con imágenes y la comunicación ha mejorado mucho en casa. ¡Recomiendo intentarlo!", tip: "La comunicación alternativa ayuda mucho." }
  },
  {
    pt: { title: "Desafios na escola", text: "A adaptação escolar está sendo muito difícil. Ele chora todos os dias na entrada. Como vocês lidam com isso?", tip: "Rotinas visuais podem ajudar na transição." },
    en: { title: "School challenges", text: "School adaptation is being very difficult. He cries every day at the entrance. How do you deal with this?", tip: "Visual routines can help with the transition." },
    es: { title: "Desafíos en la escuela", text: "La adaptación escolar está siendo muy difícil. Llora todos los días en la entrada. ¿Cómo lidian con esto?", tip: "Las rutinas visuales pueden ayudar en la transición." }
  },
  {
    pt: { title: "Sobrecarga sensorial", text: "Fomos ao shopping e a crise veio forte por causa do barulho. Preciso de dicas de abafadores de ruído.", tip: "Fones com cancelamento de ruído são ótimos investimentos." },
    en: { title: "Sensory overload", text: "We went to the mall and the meltdown was strong because of the noise. I need tips for noise-canceling earmuffs.", tip: "Noise-canceling headphones are great investments." },
    es: { title: "Sobrecarga sensorial", text: "Fuimos al centro comercial y la crisis fue fuerte por el ruido. Necesito consejos sobre protectores auditivos.", tip: "Los auriculares con cancelación de ruido son excelentes inversiones." }
  },
  {
    pt: { title: "Rotina do sono", text: "As noites têm sido muito difíceis. Ele acorda várias vezes e demora a voltar a dormir. Alguém tem alguma dica?", tip: "Higiene do sono e luzes fracas ajudam a relaxar." },
    en: { title: "Sleep routine", text: "Nights have been very difficult. He wakes up several times and takes a long time to go back to sleep. Does anyone have any tips?", tip: "Sleep hygiene and dim lights help to relax." },
    es: { title: "Rutina de sueño", text: "Las noches han sido muy difíciles. Se despierta varias veces y tarda en volver a dormir. ¿Alguien tiene algún consejo?", tip: "La higiene del sueño y las luces tenues ayudan a relajarse." }
  },
  {
    pt: { title: "Primeira palavra!", text: "Depois de meses de terapia, ouvimos a primeira palavra hoje! Estamos chorando de alegria.", tip: "A terapia fonoaudiológica é fundamental." },
    en: { title: "First word!", text: "After months of therapy, we heard the first word today! We are crying with joy.", tip: "Speech therapy is fundamental." },
    es: { title: "¡Primera palabra!", text: "¡Después de meses de terapia, escuchamos la primera palabra hoy! Estamos llorando de alegría.", tip: "La terapia del habla es fundamental." }
  },
  {
    pt: { title: "Cansaço extremo", text: "Tem dias que a exaustão física e mental bate muito forte. Só queria desabafar com quem entende.", tip: "Lembre-se de cuidar de si mesma também." },
    en: { title: "Extreme tiredness", text: "There are days when physical and mental exhaustion hits very hard. I just wanted to vent to those who understand.", tip: "Remember to take care of yourself too." },
    es: { title: "Cansancio extremo", text: "Hay días en que el agotamiento físico y mental golpea muy fuerte. Solo quería desahogarme con quienes entienden.", tip: "Recuerda cuidarte a ti misma también." }
  },
  {
    pt: { title: "Seletividade alimentar", text: "Meu filho só aceita comer alimentos secos e de cor clara. Como introduzir novas texturas?", tip: "Apresente novos alimentos sem forçar, brincando com eles." },
    en: { title: "Picky eating", text: "My child only accepts dry and light-colored foods. How to introduce new textures?", tip: "Introduce new foods without forcing, playing with them." },
    es: { title: "Selectividad alimentaria", text: "Mi hijo solo acepta alimentos secos y de color claro. ¿Cómo introducir nuevas texturas?", tip: "Presenta nuevos alimentos sin forzar, jugando con ellos." }
  },
  {
    pt: { title: "Amizades e inclusão", text: "Fico com o coração apertado quando vejo ele brincando sozinho no parquinho. Como ajudar na socialização?", tip: "Grupos de habilidades sociais podem ser muito benéficos." },
    en: { title: "Friendships and inclusion", text: "My heart aches when I see him playing alone at the playground. How to help with socialization?", tip: "Social skills groups can be very beneficial." },
    es: { title: "Amistades e inclusión", text: "Se me encoge el corazón cuando lo veo jugando solo en el parque. ¿Cómo ayudar en la socialización?", tip: "Los grupos de habilidades sociales pueden ser muy beneficiosos." }
  },
  {
    pt: { title: "Diagnóstico recente", text: "Recebemos o diagnóstico ontem. Estou me sentindo perdida e com medo do futuro. Por onde começar?", tip: "Respire fundo. Busque informação de qualidade e uma rede de apoio." },
    en: { title: "Recent diagnosis", text: "We received the diagnosis yesterday. I'm feeling lost and afraid of the future. Where to start?", tip: "Take a deep breath. Seek quality information and a support network." },
    es: { title: "Diagnóstico reciente", text: "Recibimos el diagnóstico ayer. Me siento perdida y con miedo al futuro. ¿Por dónde empezar?", tip: "Respira hondo. Busca información de calidad y una red de apoyo." }
  },
  {
    pt: { title: "Ecolalia", text: "Ele repete frases de desenhos o dia todo. A fono disse que é uma forma de comunicação, mas às vezes é exaustivo.", tip: "Tente entrar na brincadeira e expandir as frases que ele repete." },
    en: { title: "Echolalia", text: "He repeats phrases from cartoons all day. The speech therapist said it's a form of communication, but sometimes it's exhausting.", tip: "Try to join the play and expand the phrases he repeats." },
    es: { title: "Ecolalia", text: "Repite frases de dibujos animados todo el día. La terapeuta dijo que es una forma de comunicación, pero a veces es agotador.", tip: "Intenta unirte al juego y expandir las frases que repite." }
  },
  {
    pt: { title: "Desfralde", text: "Estamos tentando o desfralde há meses sem sucesso. Ele tem pavor do vaso sanitário. Dicas?", tip: "Use redutores de assento e crie uma rotina visual para o banheiro." },
    en: { title: "Potty training", text: "We've been trying potty training for months without success. He is terrified of the toilet. Tips?", tip: "Use seat reducers and create a visual routine for the bathroom." },
    es: { title: "Control de esfínteres", text: "Llevamos meses intentando el control de esfínteres sin éxito. Le aterra el inodoro. ¿Consejos?", tip: "Usa reductores de asiento y crea una rutina visual para el baño." }
  },
  {
    pt: { title: "Apoio da família", text: "É tão difícil quando a própria família não entende e acha que é 'falta de limite'. Como lidar?", tip: "A educação é o melhor caminho. Compartilhe materiais sobre autismo com eles." },
    en: { title: "Family support", text: "It's so hard when your own family doesn't understand and thinks it's 'lack of discipline'. How to deal with it?", tip: "Education is the best way. Share materials about autism with them." },
    es: { title: "Apoyo de la familia", text: "Es tan difícil cuando tu propia familia no entiende y piensa que es 'falta de disciplina'. ¿Cómo lidiar con eso?", tip: "La educación es el mejor camino. Comparte materiales sobre autismo con ellos." }
  },
  {
    pt: { title: "Cortar o cabelo", text: "Ir ao cabeleireiro é sempre um pesadelo. Muita crise sensorial. Alguém conhece profissionais inclusivos?", tip: "Procure cabeleireiros que atendam em domicílio ou em horários mais calmos." },
    en: { title: "Haircut", text: "Going to the hairdresser is always a nightmare. Lots of sensory meltdowns. Does anyone know inclusive professionals?", tip: "Look for hairdressers who do home visits or during quieter hours." },
    es: { title: "Corte de pelo", text: "Ir a la peluquería siempre es una pesadilla. Muchas crisis sensoriales. ¿Alguien conoce profesionales inclusivos?", tip: "Busca peluqueros que atiendan a domicilio o en horarios más tranquilos." }
  },
  {
    pt: { title: "Estereotipias", text: "O 'flapping' de mãos aumentou muito essa semana. Acho que ele está ansioso com a mudança de escola.", tip: "Estereotipias ajudam na regulação. Observe os gatilhos de ansiedade." },
    en: { title: "Stimming", text: "Hand flapping has increased a lot this week. I think he's anxious about changing schools.", tip: "Stimming helps with regulation. Observe anxiety triggers." },
    es: { title: "Estereotipias", text: "El aleteo de manos ha aumentado mucho esta semana. Creo que está ansioso por el cambio de escuela.", tip: "Las estereotipias ayudan en la regulación. Observa los desencadenantes de ansiedad." }
  },
  {
    pt: { title: "Direitos e laudos", text: "Finalmente conseguimos o laudo definitivo! Agora vamos dar entrada nos benefícios. Foi uma luta.", tip: "Conhecer os direitos é fundamental para garantir o acesso a terapias." },
    en: { title: "Rights and reports", text: "We finally got the definitive report! Now we are going to apply for benefits. It was a struggle.", tip: "Knowing your rights is fundamental to ensure access to therapies." },
    es: { title: "Derechos e informes", text: "¡Finalmente obtuvimos el informe definitivo! Ahora vamos a solicitar los beneficios. Fue una lucha.", tip: "Conocer los derechos es fundamental para garantizar el acceso a terapias." }
  },
  {
    pt: { title: "Brincar funcional", text: "Ele só enfileira os carrinhos, não faz o 'vrum vrum'. Como estimular o brincar imaginativo?", tip: "Modele a brincadeira. Sente-se junto e mostre como fazer, sem forçar." },
    en: { title: "Functional play", text: "He only lines up the cars, doesn't do the 'vroom vroom'. How to stimulate imaginative play?", tip: "Model the play. Sit together and show how to do it, without forcing." },
    es: { title: "Juego funcional", text: "Solo alinea los autos, no hace el 'vrum vrum'. ¿Cómo estimular el juego imaginativo?", tip: "Modela el juego. Siéntate junto a él y muéstrale cómo hacerlo, sin forzar." }
  },
  {
    pt: { title: "Culpa materna", text: "Às vezes perco a paciência e depois me sinto a pior mãe do mundo. É muito pesado.", tip: "Você é humana. Peça desculpas, respire e recomece. Não se culpe tanto." },
    en: { title: "Mom guilt", text: "Sometimes I lose my patience and then feel like the worst mom in the world. It's very heavy.", tip: "You are human. Apologize, breathe, and start over. Don't blame yourself so much." },
    es: { title: "Culpa materna", text: "A veces pierdo la paciencia y luego me siento la peor madre del mundo. Es muy pesado.", tip: "Eres humana. Pide disculpas, respira y empieza de nuevo. No te culpes tanto." }
  },
  {
    pt: { title: "Terapia Ocupacional", text: "A TO tem feito milagres pela regulação sensorial dele. Recomendo muito para quem está em dúvida.", tip: "A Integração Sensorial é uma abordagem incrível para o TEA." },
    en: { title: "Occupational Therapy", text: "OT has worked miracles for his sensory regulation. I highly recommend it to anyone in doubt.", tip: "Sensory Integration is an amazing approach for ASD." },
    es: { title: "Terapia Ocupacional", text: "La TO ha hecho milagros por su regulación sensorial. La recomiendo mucho a quienes tengan dudas.", tip: "La Integración Sensorial es un enfoque increíble para el TEA." }
  },
  {
    pt: { title: "Hiperfoco", text: "O hiperfoco da vez são dinossauros. Ele sabe o nome de todos! É impressionante a memória.", tip: "Use o hiperfoco para ensinar novas habilidades e matérias escolares." },
    en: { title: "Hyperfocus", text: "The current hyperfocus is dinosaurs. He knows all their names! The memory is impressive.", tip: "Use hyperfocus to teach new skills and school subjects." },
    es: { title: "Hiperfoco", text: "El hiperfoco actual son los dinosaurios. ¡Sabe los nombres de todos! La memoria es impresionante.", tip: "Usa el hiperfoco para enseñar nuevas habilidades y materias escolares." }
  },
  {
    pt: { title: "Medo de barulhos", text: "Liquidificador, aspirador, secador... tudo é motivo de pânico. Como dessensibilizar?", tip: "Apresente os sons gradualmente, de longe, associados a algo positivo." },
    en: { title: "Fear of noises", text: "Blender, vacuum cleaner, hair dryer... everything is a reason for panic. How to desensitize?", tip: "Introduce sounds gradually, from a distance, associated with something positive." },
    es: { title: "Miedo a los ruidos", text: "Licuadora, aspiradora, secador de pelo... todo es motivo de pánico. ¿Cómo desensibilizar?", tip: "Presenta los sonidos gradualmente, desde lejos, asociados a algo positivo." }
  },
  {
    pt: { title: "Irmãos", text: "Como vocês lidam com a atenção dividida com os irmãos neurotípicos? Sinto que deixo a desejar.", tip: "Reserve um tempo exclusivo, mesmo que curto, para cada filho." },
    en: { title: "Siblings", text: "How do you deal with divided attention with neurotypical siblings? I feel like I'm falling short.", tip: "Set aside exclusive time, even if short, for each child." },
    es: { title: "Hermanos", text: "¿Cómo lidian con la atención dividida con los hermanos neurotípicos? Siento que me quedo corta.", tip: "Reserva un tiempo exclusivo, aunque sea corto, para cada hijo." }
  },
  {
    pt: { title: "Independência", text: "Hoje ele conseguiu amarrar o sapato sozinho pela primeira vez! 10 anos de idade e muita persistência.", tip: "Cada criança tem seu tempo. A persistência é a chave." },
    en: { title: "Independence", text: "Today he managed to tie his shoes by himself for the first time! 10 years old and a lot of persistence.", tip: "Every child has their own time. Persistence is key." },
    es: { title: "Independencia", text: "¡Hoy logró atarse los zapatos solo por primera vez! 10 años y mucha persistencia.", tip: "Cada niño tiene su propio tiempo. La persistencia es la clave." }
  },
  {
    pt: { title: "Olhares na rua", text: "Ainda sofro muito com os olhares de julgamento quando ele tem uma crise em público. Como ignorar?", tip: "Foque no seu filho. A opinião de estranhos não importa naquele momento." },
    en: { title: "Stares in public", text: "I still suffer a lot from judgmental stares when he has a meltdown in public. How to ignore it?", tip: "Focus on your child. The opinion of strangers doesn't matter at that moment." },
    es: { title: "Miradas en la calle", text: "Todavía sufro mucho con las miradas de juicio cuando tiene una crisis en público. ¿Cómo ignorarlo?", tip: "Concéntrate en tu hijo. La opinión de los extraños no importa en ese momento." }
  },
  {
    pt: { title: "Comunicação Aumentativa", text: "Iniciamos o uso de um tablet com aplicativo de CAA. Ele está adorando poder 'falar' o que quer.", tip: "A CAA não impede a fala, ela dá voz e diminui a frustração." },
    en: { title: "Augmentative Communication", text: "We started using a tablet with an AAC app. He's loving being able to 'say' what he wants.", tip: "AAC doesn't prevent speech, it gives a voice and reduces frustration." },
    es: { title: "Comunicación Aumentativa", text: "Comenzamos a usar una tableta con una aplicación de CAA. Le encanta poder 'decir' lo que quiere.", tip: "La CAA no impide el habla, da voz y reduce la frustración." }
  },
  {
    pt: { title: "Agressividade", text: "As crises têm evoluído para agressividade (mordidas e tapas). Estou com marcas nos braços. Ajuda!", tip: "Busque entender o que antecede a crise. A agressividade é comunicação de algo que não vai bem." },
    en: { title: "Aggressiveness", text: "Meltdowns have evolved into aggressiveness (biting and hitting). I have marks on my arms. Help!", tip: "Try to understand what precedes the meltdown. Aggressiveness is communication of something wrong." },
    es: { title: "Agresividad", text: "Las crisis han evolucionado hacia la agresividad (mordiscos y bofetadas). Tengo marcas en los brazos. ¡Ayuda!", tip: "Busca entender qué precede a la crisis. La agresividad es comunicación de algo que no va bien." }
  },
  {
    pt: { title: "Festa de aniversário", text: "Como organizar uma festa que seja agradável para ele e não um gatilho de crises?", tip: "Festas menores, sem música alta e com atividades que ele goste são ideais." },
    en: { title: "Birthday party", text: "How to organize a party that is pleasant for him and not a trigger for meltdowns?", tip: "Smaller parties, without loud music and with activities he likes are ideal." },
    es: { title: "Fiesta de cumpleaños", text: "¿Cómo organizar una fiesta que sea agradable para él y no un desencadenante de crisis?", tip: "Las fiestas más pequeñas, sin música alta y con actividades que le gusten son ideales." }
  },
  {
    pt: { title: "Medicamentos", text: "O neuro sugeriu iniciar medicação para ansiedade. Tenho muito receio. Qual a experiência de vocês?", tip: "A medicação, quando bem indicada, pode melhorar muito a qualidade de vida." },
    en: { title: "Medications", text: "The neurologist suggested starting medication for anxiety. I'm very afraid. What is your experience?", tip: "Medication, when well indicated, can greatly improve quality of life." },
    es: { title: "Medicamentos", text: "El neurólogo sugirió iniciar medicación para la ansiedad. Tengo mucho miedo. ¿Cuál es su experiencia?", tip: "La medicación, cuando está bien indicada, puede mejorar mucho la calidad de vida." }
  },
  {
    pt: { title: "Fuga", text: "Ele tem o hábito de sair correndo (fuga) em lugares abertos. É desesperador. Uso pulseira de identificação.", tip: "Pulseiras e crachás de identificação com contato são essenciais para a segurança." },
    en: { title: "Elopement", text: "He has a habit of running away (elopement) in open places. It's desperate. I use an ID bracelet.", tip: "ID bracelets and badges with contact info are essential for safety." },
    es: { title: "Fuga", text: "Tiene el hábito de salir corriendo (fuga) en lugares abiertos. Es desesperante. Uso una pulsera de identificación.", tip: "Las pulseras y credenciales de identificación con contacto son esenciales para la seguridad." }
  },
  {
    pt: { title: "Transições", text: "Mudar de uma atividade para outra é sempre motivo de choro. Como suavizar essas transições?", tip: "Avisos prévios (faltam 5 minutos) e cronômetros visuais ajudam muito." },
    en: { title: "Transitions", text: "Changing from one activity to another is always a reason for crying. How to smooth these transitions?", tip: "Advance warnings (5 minutes left) and visual timers help a lot." },
    es: { title: "Transiciones", text: "Cambiar de una actividad a otra siempre es motivo de llanto. ¿Cómo suavizar estas transiciones?", tip: "Los avisos previos (faltan 5 minutos) y los temporizadores visuales ayudan mucho." }
  },
  {
    pt: { title: "Puberdade", text: "As mudanças hormonais estão deixando ele muito agitado. Alguém passando por essa fase?", tip: "A puberdade é um desafio extra. Diálogo e acompanhamento médico são importantes." },
    en: { title: "Puberty", text: "Hormonal changes are making him very agitated. Anyone going through this phase?", tip: "Puberty is an extra challenge. Dialogue and medical follow-up are important." },
    es: { title: "Pubertad", text: "Los cambios hormonales lo están dejando muy agitado. ¿Alguien pasando por esta fase?", tip: "La pubertad es un desafío extra. El diálogo y el seguimiento médico son importantes." }
  },
  {
    pt: { title: "Cão de assistência", text: "Estamos pensando em treinar um cão de assistência para ajudar nas crises. Alguém tem?", tip: "Cães de assistência podem oferecer suporte emocional e segurança incríveis." },
    en: { title: "Service dog", text: "We are thinking about training a service dog to help with meltdowns. Does anyone have one?", tip: "Service dogs can offer incredible emotional support and safety." },
    es: { title: "Perro de asistencia", text: "Estamos pensando en entrenar un perro de asistencia para ayudar en las crisis. ¿Alguien tiene uno?", tip: "Los perros de asistencia pueden ofrecer un apoyo emocional y seguridad increíbles." }
  },
  {
    pt: { title: "Viagem de avião", text: "Vamos fazer nossa primeira viagem de avião. Dicas para evitar sobrecarga no aeroporto?", tip: "Solicite o cordão de girassol e atendimento prioritário com a companhia aérea." },
    en: { title: "Airplane trip", text: "We are going on our first airplane trip. Tips to avoid overload at the airport?", tip: "Request the sunflower lanyard and priority service with the airline." },
    es: { title: "Viaje en avión", text: "Vamos a hacer nuestro primer viaje en avión. ¿Consejos para evitar la sobrecarga en el aeropuerto?", tip: "Solicita el cordón de girasol y atención prioritaria con la aerolínea." }
  },
  {
    pt: { title: "Contato visual", text: "Ele não olha nos olhos, mas percebo que presta atenção em tudo. Parei de cobrar isso.", tip: "Ouvir não exige contato visual. Respeitar o conforto deles é o mais importante." },
    en: { title: "Eye contact", text: "He doesn't look in the eyes, but I notice he pays attention to everything. I stopped demanding it.", tip: "Listening doesn't require eye contact. Respecting their comfort is the most important thing." },
    es: { title: "Contacto visual", text: "No mira a los ojos, pero noto que presta atención a todo. Dejé de exigirlo.", tip: "Escuchar no requiere contacto visual. Respetar su comodidad es lo más importante." }
  },
  {
    pt: { title: "Escola regular x Especial", text: "Dúvida cruel: manter na inclusão (que está falha) ou ir para uma escola especial?", tip: "Avalie o que traz mais bem-estar e desenvolvimento para o seu filho no momento." },
    en: { title: "Mainstream vs Special school", text: "Cruel doubt: keep in inclusion (which is failing) or go to a special school?", tip: "Evaluate what brings more well-being and development for your child right now." },
    es: { title: "Escuela regular vs Especial", text: "Duda cruel: ¿mantener en inclusión (que está fallando) o ir a una escuela especial?", tip: "Evalúa qué aporta más bienestar y desarrollo para tu hijo en este momento." }
  },
  {
    pt: { title: "Autocuidado", text: "Hoje tirei 1 hora só para mim. Fui tomar um café sozinha. Parece pouco, mas recarregou as baterias.", tip: "Cuidar de quem cuida é essencial. Não negligencie sua saúde mental." },
    en: { title: "Self-care", text: "Today I took 1 hour just for myself. I went to have a coffee alone. Seems little, but recharged the batteries.", tip: "Caring for the caregiver is essential. Don't neglect your mental health." },
    es: { title: "Autocuidado", text: "Hoy me tomé 1 hora solo para mí. Fui a tomar un café sola. Parece poco, pero recargó las baterías.", tip: "Cuidar a quien cuida es esencial. No descuides tu salud mental." }
  },
  {
    pt: { title: "Andar na ponta dos pés", text: "Ele anda muito na ponta dos pés. A fisio recomendou alguns exercícios. Mais alguém?", tip: "A marcha em pontas pode ter causas sensoriais ou motoras. Acompanhamento é importante." },
    en: { title: "Toe walking", text: "He walks on his toes a lot. The PT recommended some exercises. Anyone else?", tip: "Toe walking can have sensory or motor causes. Follow-up is important." },
    es: { title: "Caminar de puntillas", text: "Camina mucho de puntillas. El fisio recomendó algunos ejercicios. ¿Alguien más?", tip: "Caminar de puntillas puede tener causas sensoriales o motoras. El seguimiento es importante." }
  },
  {
    pt: { title: "Roupas com etiqueta", text: "Tive que cortar as etiquetas de todas as roupas. A sensibilidade tátil dele é imensa.", tip: "Roupas sem costura e tecidos de algodão macio costumam ser mais tolerados." },
    en: { title: "Clothes with tags", text: "I had to cut the tags off all clothes. His tactile sensitivity is immense.", tip: "Seamless clothes and soft cotton fabrics are usually better tolerated." },
    es: { title: "Ropa con etiquetas", text: "Tuve que cortar las etiquetas de toda la ropa. Su sensibilidad táctil es inmensa.", tip: "La ropa sin costuras y las telas de algodón suave suelen ser más toleradas." }
  },
  {
    pt: { title: "Música como terapia", text: "Descobrimos que a música acalma ele instantaneamente durante uma crise. Qual a playlist de vocês?", tip: "A musicoterapia é uma ferramenta poderosa para regulação emocional." },
    en: { title: "Music as therapy", text: "We discovered that music calms him instantly during a meltdown. What's your playlist?", tip: "Music therapy is a powerful tool for emotional regulation." },
    es: { title: "Música como terapia", text: "Descubrimos que la música lo calma instantáneamente durante una crisis. ¿Cuál es su lista de reproducción?", tip: "La musicoterapia es una herramienta poderosa para la regulación emocional." }
  },
  {
    pt: { title: "Dificuldade em perder", text: "Jogos de tabuleiro sempre terminam em choro se ele não ganha. Como trabalhar a frustração?", tip: "Ensine que perder faz parte do jogo. Comece com jogos colaborativos." },
    en: { title: "Difficulty losing", text: "Board games always end in tears if he doesn't win. How to work on frustration?", tip: "Teach that losing is part of the game. Start with collaborative games." },
    es: { title: "Dificultad para perder", text: "Los juegos de mesa siempre terminan en llanto si no gana. ¿Cómo trabajar la frustración?", tip: "Enseña que perder es parte del juego. Comienza con juegos colaborativos." }
  },
  {
    pt: { title: "Abraços apertados", text: "Ele adora ser 'esmagado' (abraços bem fortes). Ajuda muito a organizar o corpo dele.", tip: "A pressão profunda (propriocepção) é muito organizadora para muitos autistas." },
    en: { title: "Tight hugs", text: "He loves being 'squished' (very tight hugs). It helps a lot to organize his body.", tip: "Deep pressure (proprioception) is very organizing for many autistic people." },
    es: { title: "Abrazos apretados", text: "Le encanta ser 'aplastado' (abrazos muy fuertes). Ayuda mucho a organizar su cuerpo.", tip: "La presión profunda (propiocepción) es muy organizadora para muchos autistas." }
  },
  {
    pt: { title: "Desfralde noturno", text: "O desfralde diurno foi okay, mas o noturno parece impossível. Ele tem sono muito pesado.", tip: "Não tenha pressa. O controle noturno depende de maturidade neurológica." },
    en: { title: "Nighttime potty training", text: "Daytime potty training was okay, but nighttime seems impossible. He is a very heavy sleeper.", tip: "Don't rush. Nighttime control depends on neurological maturity." },
    es: { title: "Control de esfínteres nocturno", text: "El control diurno estuvo bien, pero el nocturno parece imposible. Tiene un sueño muy pesado.", tip: "No tengas prisa. El control nocturno depende de la madurez neurológica." }
  },
  {
    pt: { title: "Interesses restritos", text: "Só quer falar sobre trens. Como inserir outros assuntos nas conversas?", tip: "Use os trens como ponte para outros assuntos (ex: para onde o trem viaja?)." },
    en: { title: "Restricted interests", text: "Only wants to talk about trains. How to insert other subjects in conversations?", tip: "Use trains as a bridge to other subjects (e.g., where does the train travel to?)." },
    es: { title: "Intereses restringidos", text: "Solo quiere hablar de trenes. ¿Cómo insertar otros temas en las conversaciones?", tip: "Usa los trenes como puente hacia otros temas (ej: ¿a dónde viaja el tren?)." }
  },
  {
    pt: { title: "Ir ao dentista", text: "Encontramos uma odontopediatra maravilhosa que atendeu ele no chão da sala de espera!", tip: "Profissionais empáticos e flexíveis fazem toda a diferença no atendimento." },
    en: { title: "Going to the dentist", text: "We found a wonderful pediatric dentist who treated him on the waiting room floor!", tip: "Empathetic and flexible professionals make all the difference in care." },
    es: { title: "Ir al dentista", text: "¡Encontramos una odontopediatra maravillosa que lo atendió en el piso de la sala de espera!", tip: "Los profesionales empáticos y flexibles hacen toda la diferencia en la atención." }
  },
  {
    pt: { title: "Compreensão literal", text: "Falei 'está chovendo canivetes' e ele ficou apavorado procurando as facas caindo do céu. Risos.", tip: "Evite metáforas e ironias. A comunicação direta e clara é sempre melhor." },
    en: { title: "Literal understanding", text: "I said 'it's raining cats and dogs' and he was terrified looking for animals falling from the sky. Laughs.", tip: "Avoid metaphors and irony. Direct and clear communication is always better." },
    es: { title: "Comprensión literal", text: "Dije 'llueve a cántaros' y se aterrorizó buscando los cántaros cayendo del cielo. Risas.", tip: "Evita metáforas e ironías. La comunicación directa y clara siempre es mejor." }
  },
  {
    pt: { title: "Apego a objetos", text: "Ele não larga uma colher de pau específica. Leva para a escola, para dormir... normal?", tip: "Objetos de apego trazem segurança e previsibilidade. É comum e reconfortante." },
    en: { title: "Attachment to objects", text: "He won't let go of a specific wooden spoon. Takes it to school, to sleep... normal?", tip: "Attachment objects bring security and predictability. It's common and comforting." },
    es: { title: "Apego a objetos", text: "No suelta una cuchara de madera específica. La lleva a la escuela, a dormir... ¿normal?", tip: "Los objetos de apego brindan seguridad y previsibilidad. Es común y reconfortante." }
  },
  {
    pt: { title: "Mudança de rotina", text: "As férias escolares desorganizaram tudo. Ele está muito irritado sem a rotina da escola.", tip: "Tente criar um quadro de rotina visual para as férias em casa também." },
    en: { title: "Routine change", text: "School holidays disorganized everything. He is very irritable without the school routine.", tip: "Try to create a visual routine board for the holidays at home too." },
    es: { title: "Cambio de rutina", text: "Las vacaciones escolares desorganizaron todo. Está muy irritable sin la rutina de la escuela.", tip: "Intenta crear un tablero de rutina visual para las vacaciones en casa también." }
  },
  {
    pt: { title: "Orgulho", text: "Hoje na apresentação da escola ele não tapou os ouvidos e ficou até o final. Muito orgulho!", tip: "Pequenos passos para os outros são saltos gigantescos para nós." },
    en: { title: "Pride", text: "Today at the school presentation he didn't cover his ears and stayed until the end. Very proud!", tip: "Small steps for others are giant leaps for us." },
    es: { title: "Orgullo", text: "Hoy en la presentación de la escuela no se tapó los oídos y se quedó hasta el final. ¡Mucho orgullo!", tip: "Pequeños pasos para otros son saltos gigantescos para nosotros." }
  },
  {
    pt: { title: "Rede de apoio", text: "Encontrar esse grupo me fez ver que não estou sozinha. Obrigada por compartilharem tanto.", tip: "A troca de experiências entre famílias é uma das melhores terapias." },
    en: { title: "Support network", text: "Finding this group made me see that I'm not alone. Thank you for sharing so much.", tip: "The exchange of experiences between families is one of the best therapies." },
    es: { title: "Red de apoyo", text: "Encontrar este grupo me hizo ver que no estoy sola. Gracias por compartir tanto.", tip: "El intercambio de experiencias entre familias es una de las mejores terapias." }
  }
];

export const generateSimulatedPosts = (): Post[] => {
  const posts: Post[] = [];
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const template = templates[i % templates.length];
    const name = names[i % names.length];
    const location = locations[i % locations.length];
    const avatar = avatars[i % avatars.length];
    const topic = topics[i % topics.length];
    
    // Randomize time between now and 7 days ago
    const timeOffset = Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000);
    const postDate = new Date(now.getTime() - timeOffset);
    
    // Random likes and comments
    const likesCount = Math.floor(Math.random() * 50) + 1;
    const commentsCount = Math.floor(Math.random() * 20);
    const likes = Array(likesCount).fill('simulated-like');

    posts.push({
      id: `simulated-post-${i}`,
      text: template.pt.text, // default
      content: `**${template.pt.title}**\n\n${template.pt.text}\n\n*${template.pt.tip}*`,
      text_pt: `**${template.pt.title}**\n\n${template.pt.text}\n\n*${template.pt.tip}*`,
      text_en: `**${template.en.title}**\n\n${template.en.text}\n\n*${template.en.tip}*`,
      text_es: `**${template.es.title}**\n\n${template.es.text}\n\n*${template.es.tip}*`,
      authorId: `simulated-author-${i}`,
      userId: `simulated-author-${i}`,
      authorName: name,
      authorPhoto: avatar,
      mediaType: 'text',
      topic: topic,
      state: location.split(', ')[1],
      city: location.split(', ')[0],
      location: location,
      timestamp: postDate,
      createdAt: postDate,
      isVip: Math.random() > 0.8,
      isGlobal: true,
      likes: likes,
      commentsCount: commentsCount
    });
  }

  // Shuffle posts
  return posts.sort(() => Math.random() - 0.5);
};
