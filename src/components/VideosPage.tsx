import React, { useEffect } from 'react';
import VideoGallery from './VideoGallery';
import { PlayCircle, Sparkles, Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';

const AUTISM_VIDEOS: { [key: string]: { videoId: string, title: string, description: string, duration: string, category: string, tags?: string[] }[] } = {
  pt: [
    { videoId: 'TW2Y33Tqja8', title: 'Sinais de Autismo em Bebês', description: 'Entenda os primeiros sinais.', duration: '2:30', category: 'Dicas' },
    { videoId: 'tNuM5SI_UxE', title: 'Como lidar com crises de autismo', description: 'Estratégias práticas para acalmar.', duration: '3:00', category: 'Cenários Reais' },
    { videoId: 'bQ9HwhO9voc', title: 'A importância da rotina', description: 'Por que a rotina importa no TEA.', duration: '1:45', category: 'Dicas' },
    { videoId: 'nVtBctQhXwI', title: 'Dicas de comunicação', description: 'Formas simples de se conectar.', duration: '2:15', category: 'Dicas Rápidas' },
    { videoId: 'oM5pUsG6p0s', title: 'Autismo e seletividade alimentar', description: 'Dicas para o momento da refeição.', duration: '2:45', category: 'Dicas' },
    { videoId: 'A3855OOeM_4', title: 'Brincadeiras inclusivas', description: 'Como incentivar brincadeiras sociais.', duration: '2:00', category: 'Dicas' },
    { videoId: 'AKFKCj9hM_Q', title: 'Direitos do autista', description: 'Conheça seus direitos.', duration: '1:30', category: 'Dicas' },
    { videoId: 'lKkbO2ABKL4', title: 'Autismo na escola', description: 'Navegando pelos desafios escolares.', duration: '2:50', category: 'Cenários Reais' },
    { videoId: '9bZkp7q19f0', title: 'Entendendo o espectro', description: 'O que significa TEA?', duration: '3:00', category: 'Dicas' },
    { videoId: '3JZ_D3ELwOQ', title: 'Terapias e intervenções', description: 'Visão geral das opções de terapia.', duration: '2:20', category: 'Dicas' },
    { videoId: 'V-_O7nl0Ii0', title: 'Apoio aos pais e cuidadores', description: 'Você não está sozinho.', duration: '1:50', category: 'Apoio Emocional' },
    { videoId: 'C0DPdy98e4c', title: 'Mitos e verdades sobre o autismo', description: 'Esclarecendo equívocos.', duration: '2:10', category: 'Dicas' },
  ],
  en: [
    { videoId: 'TW2Y33Tqja8', title: 'Signs of Autism in Babies', description: 'Understand the early signs.', duration: '2:30', category: 'Practical Tips', tags: ['New'] },
    { videoId: 'tNuM5SI_UxE', title: 'How to deal with autism meltdowns', description: 'Practical strategies for calm.', duration: '3:00', category: 'Real-Life Scenarios', tags: ['Trending'] },
    { videoId: 'bQ9HwhO9voc', title: 'The importance of routine', description: 'Why routine matters for ASD.', duration: '1:45', category: 'Practical Tips' },
    { videoId: 'nVtBctQhXwI', title: 'Communication tips', description: 'Simple ways to connect.', duration: '2:15', category: 'Quick Hacks', tags: ['Most Helpful'] },
    { videoId: 'oM5pUsG6p0s', title: 'Autism and picky eating', description: 'Tips for mealtime success.', duration: '2:45', category: 'Practical Tips' },
    { videoId: 'A3855OOeM_4', title: 'Inclusive play', description: 'How to encourage social play.', duration: '2:00', category: 'Practical Tips' },
    { videoId: 'AKFKCj9hM_Q', title: 'Autism rights', description: 'Know your rights.', duration: '1:30', category: 'Practical Tips' },
    { videoId: 'lKkbO2ABKL4', title: 'Autism at school', description: 'Navigating school challenges.', duration: '2:50', category: 'Real-Life Scenarios' },
    { videoId: '9bZkp7q19f0', title: 'Understanding the spectrum', description: 'What does ASD mean?', duration: '3:00', category: 'Practical Tips' },
    { videoId: '3JZ_D3ELwOQ', title: 'Therapies and interventions', description: 'Overview of therapy options.', duration: '2:20', category: 'Practical Tips' },
    { videoId: 'V-_O7nl0Ii0', title: 'Support for parents and caregivers', description: 'You are not alone.', duration: '1:50', category: 'Emotional Support', tags: ['Trending'] },
    { videoId: 'C0DPdy98e4c', title: 'Myths and truths about autism', description: 'Clearing up misconceptions.', duration: '2:10', category: 'Practical Tips' },
    { videoId: 'TW2Y33Tqja8', title: 'Sensory overload tips', description: 'Managing sensory input.', duration: '2:00', category: 'Quick Hacks', tags: ['Most Helpful'] },
    { videoId: 'tNuM5SI_UxE', title: 'Building confidence', description: 'Empowering your child.', duration: '1:40', category: 'Emotional Support' },
    { videoId: 'bQ9HwhO9voc', title: 'Public meltdowns', description: 'Stay calm in public.', duration: '2:30', category: 'Real-Life Scenarios', tags: ['Trending'] },
    { videoId: 'nVtBctQhXwI', title: 'Eye contact hacks', description: 'Small tips for connection.', duration: '1:00', category: 'Quick Hacks', tags: ['New'] },
    { videoId: 'oM5pUsG6p0s', title: 'Sleep routine success', description: 'Better nights for everyone.', duration: '2:20', category: 'Practical Tips' },
    { videoId: 'A3855OOeM_4', title: 'Celebrating small wins', description: 'Why every win matters.', duration: '1:15', category: 'Emotional Support', tags: ['Most Helpful'] },
    { videoId: 'AKFKCj9hM_Q', title: 'Sibling support', description: 'Helping neurotypical siblings.', duration: '2:00', category: 'Real-Life Scenarios' },
    { videoId: 'lKkbO2ABKL4', title: 'Visual schedules', description: 'Using visual aids.', duration: '1:50', category: 'Quick Hacks' },
    { videoId: '9bZkp7q19f0', title: 'Understanding stimming', description: 'Why do they stim?', duration: '2:10', category: 'Practical Tips' },
    { videoId: '3JZ_D3ELwOQ', title: 'Self-care for parents', description: 'Don\'t forget yourself.', duration: '1:30', category: 'Emotional Support', tags: ['Trending'] },
    { videoId: 'V-_O7nl0Ii0', title: 'Inclusive birthday parties', description: 'Fun for everyone.', duration: '2:00', category: 'Real-Life Scenarios' },
    { videoId: 'C0DPdy98e4c', title: 'Managing anxiety', description: 'Calming techniques.', duration: '2:40', category: 'Practical Tips' },
    { videoId: 'TW2Y33Tqja8', title: 'Positive reinforcement', description: 'How to praise effectively.', duration: '1:50', category: 'Quick Hacks' },
    { videoId: 'tNuM5SI_UxE', title: 'Communication apps', description: 'Tools for non-verbal kids.', duration: '2:30', category: 'Practical Tips' },
    { videoId: 'bQ9HwhO9voc', title: 'Dealing with transitions', description: 'Making changes easier.', duration: '2:00', category: 'Real-Life Scenarios' },
    { videoId: 'nVtBctQhXwI', title: 'Autism and puberty', description: 'Navigating changes.', duration: '2:50', category: 'Real-Life Scenarios' },
    { videoId: 'oM5pUsG6p0s', title: 'Service dogs for autism', description: 'How they can help.', duration: '2:15', category: 'Practical Tips' },
    { videoId: 'A3855OOeM_4', title: 'Airplane travel tips', description: 'Stress-free flying.', duration: '2:30', category: 'Real-Life Scenarios', tags: ['New'] },
  ],
  es: [
    { videoId: 'TW2Y33Tqja8', title: 'Señales de Autismo en Bebés', description: 'Entienda las primeras señales.', duration: '2:30', category: 'Consejos' },
    { videoId: 'tNuM5SI_UxE', title: 'Cómo lidiar con crisis de autismo', description: 'Estrategias prácticas para calmar.', duration: '3:00', category: 'Escenarios Reales' },
    { videoId: 'bQ9HwhO9voc', title: 'La importancia de la rutina', description: 'Por qué la rutina importa en TEA.', duration: '1:45', category: 'Consejos' },
    { videoId: 'nVtBctQhXwI', title: 'Consejos de comunicación', description: 'Formas simples de conectar.', duration: '2:15', category: 'Consejos Rápidos' },
    { videoId: 'oM5pUsG6p0s', title: 'Autismo y selectividad alimentaria', description: 'Consejos para el momento de la comida.', duration: '2:45', category: 'Consejos' },
    { videoId: 'A3855OOeM_4', title: 'Juegos inclusivos', description: 'Cómo fomentar juegos sociales.', duration: '2:00', category: 'Consejos' },
    { videoId: 'AKFKCj9hM_Q', title: 'Derechos del autista', description: 'Conozca sus derechos.', duration: '1:30', category: 'Consejos' },
    { videoId: 'lKkbO2ABKL4', title: 'Autismo en la escuela', description: 'Navegando por los desafíos escolares.', duration: '2:50', category: 'Escenarios Reales' },
    { videoId: '9bZkp7q19f0', title: 'Entendiendo el espectro', description: '¿Qué significa TEA?', duration: '3:00', category: 'Consejos' },
    { videoId: '3JZ_D3ELwOQ', title: 'Terapias e intervenciones', description: 'Visión general de las opciones de terapia.', duration: '2:20', category: 'Consejos' },
    { videoId: 'V-_O7nl0Ii0', title: 'Apoyo a padres y cuidadores', description: 'No estás solo.', duration: '1:50', category: 'Apoyo Emocional' },
    { videoId: 'C0DPdy98e4c', title: 'Mitos y verdades sobre el autismo', description: 'Aclarando conceptos erróneos.', duration: '2:10', category: 'Consejos' },
  ]
};

export default function VideosPage() {
  const { t, i18n } = useTranslation();
  const videos = AUTISM_VIDEOS[i18n.language] || AUTISM_VIDEOS.pt;

  useEffect(() => {
    const seedVideos = async () => {
      console.log('Iniciando semeadura de vídeos...');
      
      for (const video of videos) {
        try {
          const q = query(collection(db, 'videos'), where('videoId', '==', video.videoId));
          const snapshot = await getDocs(q);
          
          if (snapshot.empty) {
            await addDoc(collection(db, 'videos'), {
              videoId: video.videoId,
              url: `https://youtube.com/watch?v=${video.videoId}`,
              title: video.title,
              thumbnail: `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`,
              createdAt: serverTimestamp(),
              description: video.description,
              duration: video.duration,
              category: video.category,
              tags: video.tags || []
            });
            console.log(`Vídeo adicionado: ${video.videoId}`);
          } else {
            console.log(`Vídeo já existe: ${video.videoId}`);
          }
        } catch (error) {
          console.error(`Erro ao adicionar vídeo ${video.videoId}:`, error);
        }
      }
    };

    seedVideos();
  }, [i18n.language]);

  return (
    <div className="space-y-8 pb-24">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-8 md:p-12 shadow-xl shadow-indigo-200 relative overflow-hidden text-white">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6">
              <Sparkles size={18} className="text-amber-300" />
              <span className="text-sm font-bold uppercase tracking-wider text-white">{t('videos.exclusiveVideos')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              {t('videos.galleryTitle')}
            </h1>
            <p className="text-indigo-100 text-lg md:text-xl leading-relaxed">
              {t('videos.gallerySubtitle')}
            </p>
          </div>
          <div className="hidden md:flex w-32 h-32 bg-white/10 rounded-full items-center justify-center backdrop-blur-md border border-white/20 shrink-0">
            <Video size={64} className="text-white opacity-80" />
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-400/30 rounded-full blur-3xl"></div>
      </div>
      
      <VideoGallery />
    </div>
  );
}
