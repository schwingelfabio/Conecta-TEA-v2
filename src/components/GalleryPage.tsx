import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';

export default function GalleryPage() {
  const { t } = useTranslation();
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackMedia = [
    { id: 'f1', type: 'image', url: 'https://images.unsplash.com/photo-1594495894542-a4e17074284c?auto=format&fit=crop&w=800&q=80', caption: 'Inclusão é o caminho', tags: ['autismo', 'inclusão'] },
    { id: 'f2', type: 'image', url: 'https://images.unsplash.com/photo-1536640712247-c575b13c3662?auto=format&fit=crop&w=800&q=80', caption: 'Aprendizado constante', tags: ['educação', 'tea'] },
  ];

  useEffect(() => {
    const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMedia(data.length > 0 ? data : fallbackMedia);
      setLoading(false);
    }, (error) => {
      console.error("Gallery onSnapshot error:", error);
      setMedia(fallbackMedia);
      setLoading(false);
    });
    
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
        if (media.length === 0) setMedia(fallbackMedia);
      }
    }, 5000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">{t('nav.gallery')}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {media.map((item) => (
          <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
            {item.type === 'video' ? (
              <video src={item.url} className="w-full rounded-lg" controls />
            ) : (
              <img src={item.url} className="w-full rounded-lg" alt={item.caption} referrerPolicy="no-referrer" />
            )}
            <p className="mt-2 text-sm font-medium">{item.caption || ''}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {(item.tags || []).map((tag: string) => (
                <span key={tag} className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">#{tag}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
