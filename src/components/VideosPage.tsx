import React, { useEffect } from 'react';
import VideoGallery from './VideoGallery';
import { PlayCircle, Sparkles, Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const SHORTS_VIDEOS = [
  { videoId: 'TW2Y33Tqja8', title: 'Dicas de Autismo 1' },
  { videoId: 'tNuM5SI_UxE', title: 'Dicas de Autismo 2' },
  { videoId: 'bQ9HwhO9voc', title: 'Dicas de Autismo 3' },
  { videoId: 'nVtBctQhXwI', title: 'Dicas de Autismo 4' },
  { videoId: 'oM5pUsG6p0s', title: 'Dicas de Autismo 5' },
  { videoId: 'A3855OOeM_4', title: 'Dicas de Autismo 6' },
  { videoId: 'AKFKCj9hM_Q', title: 'Dicas de Autismo 7' },
  { videoId: 'lKkbO2ABKL4', title: 'Dicas de Autismo 8' },
];

const ADMIN_EMAIL = 'fabiopalacioschwingel@gmail.com';

export default function VideosPage() {
  const { t } = useTranslation();
  useEffect(() => {
    const seedVideos = async (userEmail: string) => {
      if (userEmail !== ADMIN_EMAIL) return;

      console.log('Iniciando semeadura de vídeos...');
      
      for (const video of SHORTS_VIDEOS) {
        try {
          const q = query(collection(db, 'videos'), where('videoId', '==', video.videoId));
          const snapshot = await getDocs(q);
          
          if (snapshot.empty) {
            await addDoc(collection(db, 'videos'), {
              videoId: video.videoId,
              url: `https://youtube.com/shorts/${video.videoId}`,
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

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email) {
        seedVideos(user.email);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-8 pb-24">
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[3rem] p-8 md:p-12 shadow-xl shadow-indigo-200 relative overflow-hidden text-white">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6">
              <Sparkles size={18} className="text-amber-300" />
              <span className="text-sm font-bold uppercase tracking-wider text-white">Conteúdo Exclusivo</span>
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
