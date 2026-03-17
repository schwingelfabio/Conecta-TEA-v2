import React, { useEffect } from 'react';
import VideoGallery from './VideoGallery';
import { PlayCircle } from 'lucide-react';
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
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center text-sky-600">
            <PlayCircle size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{t('videos.galleryTitle')}</h1>
            <p className="text-slate-500">{t('videos.gallerySubtitle')}</p>
          </div>
        </div>
      </div>
      
      <VideoGallery />
    </div>
  );
}
