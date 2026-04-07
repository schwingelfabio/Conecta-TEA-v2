import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle, Loader2, X, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  startAfter, 
  QueryDocumentSnapshot, 
  DocumentData 
} from 'firebase/firestore';

interface Video {
  id: string;
  videoId: string;
  url: string;
  title: string;
  thumbnail: string;
  createdAt: any;
  description: string;
  duration: string;
  category: string;
  tags?: string[];
}

export default function VideoGallery() {
  const { t } = useTranslation();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videosWatched, setVideosWatched] = useState(0);
  const [showCTA, setShowCTA] = useState(false);

  const fallbackVideos: Video[] = [
    { id: 'fallback-1', videoId: 'TW2Y33Tqja8', url: 'https://youtube.com/watch?v=TW2Y33Tqja8', title: 'Sinais de Autismo em Bebês', thumbnail: 'https://img.youtube.com/vi/TW2Y33Tqja8/hqdefault.jpg', createdAt: new Date(), description: 'Entenda os primeiros sinais.', duration: '2:30', category: 'Dicas' },
    { id: 'fallback-2', videoId: 'tNuM5SI_UxE', url: 'https://youtube.com/watch?v=tNuM5SI_UxE', title: 'Como lidar com crises de autismo', thumbnail: 'https://img.youtube.com/vi/tNuM5SI_UxE/hqdefault.jpg', createdAt: new Date(), description: 'Estratégias práticas para acalmar.', duration: '3:00', category: 'Cenários Reais' },
    { id: 'fallback-3', videoId: 'bQ9HwhO9voc', url: 'https://youtube.com/watch?v=bQ9HwhO9voc', title: 'A importância da rotina', thumbnail: 'https://img.youtube.com/vi/bQ9HwhO9voc/hqdefault.jpg', createdAt: new Date(), description: 'Por que a rotina importa no TEA.', duration: '1:45', category: 'Dicas' },
  ];

  const fetchVideos = async (isLoadMore = false) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout fetching videos')), 5000)
    );

    try {
      let q = query(
        collection(db, 'videos'),
        orderBy('createdAt', 'desc'),
        limit(6)
      );

      if (isLoadMore && lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      const snapshot = await Promise.race([getDocs(q), timeoutPromise]) as any;
      const fetchedVideos = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      })) as Video[];

      if (isLoadMore) {
        setVideos(prev => [...prev, ...fetchedVideos]);
      } else {
        setVideos(fetchedVideos.length > 0 ? fetchedVideos : fallbackVideos);
      }

      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === 6);
    } catch (error) {
      console.error('Erro ao buscar vídeos:', error);
      if (!isLoadMore) {
        setVideos(fallbackVideos);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleCloseVideo = () => {
    const newCount = videosWatched + 1;
    setVideosWatched(newCount);
    if (newCount >= 2) {
      setShowCTA(true);
    }
    setSelectedVideo(null);
  };

  function getEmbedUrl(videoId: string) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="animate-spin text-sky-500" size={40} />
      </div>
    );
  }

  return (
    <section className="px-4">
      <div className="flex items-center space-x-3 mb-8">
        <PlayCircle className="text-brand-secondary" size={32} />
        <h2 className="text-2xl font-bold text-slate-900">{t('videos.exclusiveVideos')}</h2>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-500">{t('videos.noVideos')}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <motion.div
                key={video.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden group cursor-pointer flex flex-col"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative aspect-video bg-slate-100">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-brand-secondary shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play size={24} fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-md">
                    {video.duration}
                  </div>
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                      {video.category}
                    </span>
                    {video.tags?.map(tag => (
                      <span key={tag} className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-bold text-slate-900 line-clamp-2 mb-2">{video.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-3">{video.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => fetchVideos(true)}
                disabled={loadingMore}
                className="px-8 py-3 bg-white border border-slate-200 rounded-full font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loadingMore ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  t('videos.loadMore')
                )}
              </button>
            </div>
          )}
          
          <div className="mt-16 text-center space-y-4">
            <p className="text-slate-500 text-sm">{t('videos.cta.microEmotional')}</p>
            <div className="flex justify-center gap-4 text-xs text-slate-400 font-bold uppercase tracking-widest">
              <span>{t('videos.cta.trustElement')}</span>
              <span>•</span>
              <span>Built with purpose</span>
              <span>•</span>
              <span>Growing community</span>
            </div>
          </div>
        </>
      )}

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseVideo}
                className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              {showCTA ? (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white p-8 text-center">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('videos.cta.emotionalMessage')}</h3>
                  <div className="flex flex-col gap-3 w-full max-w-xs">
                    <button className="w-full py-3 bg-brand-primary text-white rounded-full font-bold hover:bg-brand-primary/90 transition-colors">{t('videos.cta.supportButton')}</button>
                    <button className="w-full py-3 bg-brand-secondary text-white rounded-full font-bold hover:bg-brand-secondary/90 transition-colors">{t('videos.cta.vipButton')}</button>
                    <button className="w-full py-3 bg-slate-100 text-slate-700 rounded-full font-bold hover:bg-slate-200 transition-colors">{t('videos.cta.shareButton')}</button>
                  </div>
                  <p className="mt-6 text-sm text-slate-500">{t('videos.cta.microEmotional')}</p>
                </div>
              ) : (
                <iframe
                  src={getEmbedUrl(selectedVideo.videoId)}
                  title={selectedVideo.title}
                  width="100%"
                  height="100%"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
