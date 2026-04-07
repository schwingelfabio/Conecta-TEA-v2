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

const AUTISM_VIDEOS: { [key: string]: { videoId: string, title: string }[] } = {
  pt: [
    { videoId: 'TW2Y33Tqja8', title: 'Sinais de Autismo em Bebês' },
    { videoId: 'tNuM5SI_UxE', title: 'Como lidar com crises de autismo' },
    { videoId: 'bQ9HwhO9voc', title: 'A importância da rotina' },
    { videoId: 'nVtBctQhXwI', title: 'Dicas de comunicação' },
    { videoId: 'oM5pUsG6p0s', title: 'Autismo e seletividade alimentar' },
    { videoId: 'A3855OOeM_4', title: 'Brincadeiras inclusivas' },
    { videoId: 'AKFKCj9hM_Q', title: 'Direitos do autista' },
    { videoId: 'lKkbO2ABKL4', title: 'Autismo na escola' },
    { videoId: '9bZkp7q19f0', title: 'Entendendo o espectro' },
    { videoId: '3JZ_D3ELwOQ', title: 'Terapias e intervenções' },
    { videoId: 'V-_O7nl0Ii0', title: 'Apoio aos pais e cuidadores' },
    { videoId: 'C0DPdy98e4c', title: 'Mitos e verdades sobre o autismo' },
  ],
  en: [
    { videoId: 'TW2Y33Tqja8', title: 'Signs of Autism in Babies' },
    { videoId: 'tNuM5SI_UxE', title: 'How to deal with autism meltdowns' },
    { videoId: 'bQ9HwhO9voc', title: 'The importance of routine' },
    { videoId: 'nVtBctQhXwI', title: 'Communication tips' },
    { videoId: 'oM5pUsG6p0s', title: 'Autism and picky eating' },
    { videoId: 'A3855OOeM_4', title: 'Inclusive play' },
    { videoId: 'AKFKCj9hM_Q', title: 'Autism rights' },
    { videoId: 'lKkbO2ABKL4', title: 'Autism at school' },
    { videoId: '9bZkp7q19f0', title: 'Understanding the spectrum' },
    { videoId: '3JZ_D3ELwOQ', title: 'Therapies and interventions' },
    { videoId: 'V-_O7nl0Ii0', title: 'Support for parents and caregivers' },
    { videoId: 'C0DPdy98e4c', title: 'Myths and truths about autism' },
  ],
  es: [
    { videoId: 'TW2Y33Tqja8', title: 'Señales de Autismo en Bebés' },
    { videoId: 'tNuM5SI_UxE', title: 'Cómo lidiar con crisis de autismo' },
    { videoId: 'bQ9HwhO9voc', title: 'La importancia de la rutina' },
    { videoId: 'nVtBctQhXwI', title: 'Consejos de comunicación' },
    { videoId: 'oM5pUsG6p0s', title: 'Autismo y selectividad alimentaria' },
    { videoId: 'A3855OOeM_4', title: 'Juegos inclusivos' },
    { videoId: 'AKFKCj9hM_Q', title: 'Derechos del autista' },
    { videoId: 'lKkbO2ABKL4', title: 'Autismo en la escuela' },
    { videoId: '9bZkp7q19f0', title: 'Entendiendo el espectro' },
    { videoId: '3JZ_D3ELwOQ', title: 'Terapias e intervenciones' },
    { videoId: 'V-_O7nl0Ii0', title: 'Apoyo a padres y cuidadores' },
    { videoId: 'C0DPdy98e4c', title: 'Mitos y verdades sobre el autismo' },
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
              createdAt: serverTimestamp()
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
