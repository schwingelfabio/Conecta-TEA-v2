import { Post } from '../types';

const names = [
  "Maria Silva", "John Smith", "Elena Rodriguez", "Ana Costa", "David Chen",
  "Sarah Johnson", "Carlos Mendes", "Laura Martinez", "James Wilson", "Sofia Garcia",
  "Robert Taylor", "Emma Brown", "Michael Davis", "Olivia Miller", "William Moore",
  "Isabella Anderson", "Richard Thomas", "Sophia Jackson", "Joseph White", "Mia Harris",
  "Charles Martin", "Amelia Thompson", "Thomas Garcia", "Harper Martinez", "Christopher Robinson",
  "Evelyn Clark", "Daniel Rodriguez", "Abigail Lewis", "Matthew Lee", "Emily Walker"
];

const topics: Post['topic'][] = ['geral', 'duvidas', 'conquistas', 'eventos'];

const generateContent = (type: 'text' | 'image' | 'video', topic: string, lang: 'pt' | 'en' | 'es') => {
  const contentTemplates = {
    pt: {
      text: [
        { title: "Primeiro contato visual!", body: "Hoje meu filho olhou nos meus olhos pela primeira vez. Chorei de alegria!" },
        { title: "Dica de rotina", body: "Usar quadros visuais ajudou muito na organização do dia a dia aqui em casa." },
        { title: "Desabafo", body: "Às vezes é exaustivo, mas cada pequeno progresso vale a pena." }
      ],
      image: [
        { title: "Apoio visual", body: "Exemplo de rotina visual que usamos." },
        { title: "Frase inspiradora", body: "O amor não precisa de palavras." }
      ],
      video: [
        { title: "Dica de comunicação", body: "Como estimulamos a fala em casa." },
        { title: "Momento sensorial", body: "Brincadeira sensorial que ele adorou." }
      ]
    },
    en: {
      text: [
        { title: "First eye contact!", body: "Today my son looked into my eyes for the first time. I cried with joy!" },
        { title: "Routine tip", body: "Using visual schedules has really helped with our daily organization." },
        { title: "Vent", body: "Sometimes it's exhausting, but every small progress is worth it." }
      ],
      image: [
        { title: "Visual support", body: "Example of a visual routine we use." },
        { title: "Inspiring quote", body: "Love doesn't need words." }
      ],
      video: [
        { title: "Communication tip", body: "How we stimulate speech at home." },
        { title: "Sensory moment", body: "Sensory play he loved." }
      ]
    },
    es: {
      text: [
        { title: "¡Primer contacto visual!", body: "Hoy mi hijo me miró a los ojos por primera vez. ¡Lloré de alegría!" },
        { title: "Consejo de rutina", body: "Usar horarios visuales ha ayudado mucho en nuestra organización diaria." },
        { title: "Desahogo", body: "A veces es agotador, pero cada pequeño progreso vale la pena." }
      ],
      image: [
        { title: "Apoyo visual", body: "Ejemplo de rutina visual que usamos." },
        { title: "Frase inspiradora", body: "El amor no necesita palabras." }
      ],
      video: [
        { title: "Consejo de comunicación", body: "Cómo estimulamos el habla en casa." },
        { title: "Momento sensorial", body: "Juego sensorial que le encantó." }
      ]
    }
  };

  const templates = contentTemplates[lang][type];
  const template = templates[Math.floor(Math.random() * templates.length)];
  return {
    title: template.title,
    body: template.body
  };
};

export const generateSimulatedPosts = (): Post[] => {
  const posts: Post[] = [];
  for (let i = 0; i < 90; i++) {
    const type = i < 50 ? 'text' : (i < 70 ? 'image' : 'video');
    const topic = topics[i % topics.length];
    
    const pt = generateContent(type, topic, 'pt');
    const en = generateContent(type, topic, 'en');
    const es = generateContent(type, topic, 'es');

    posts.push({
      id: `simulated-post-${i}`,
      text: pt.body,
      content: `**${pt.title}**\n\n${pt.body}`,
      text_pt: `**${pt.title}**\n\n${pt.body}`,
      text_en: `**${en.title}**\n\n${en.body}`,
      text_es: `**${es.title}**\n\n${es.body}`,
      authorId: `simulated-${i}`,
      userId: `simulated-${i}`,
      authorName: names[i % names.length],
      authorPhoto: `https://i.pravatar.cc/150?u=${i}`,
      mediaType: type,
      mediaUrl: type !== 'text' ? `https://picsum.photos/seed/${i}/400/300` : undefined,
      topic: topic,
      state: 'Geral',
      city: 'Geral',
      location: 'Global',
      timestamp: new Date(Date.now() - i * 3600000),
      createdAt: new Date(Date.now() - i * 3600000),
      isVip: Math.random() > 0.8,
      isGlobal: true,
      likes: [],
      commentsCount: Math.floor(Math.random() * 20)
    });
  }
  return posts;
};
