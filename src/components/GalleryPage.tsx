import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { db } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';

export default function GalleryPage() {
  const { t } = useTranslation();
  const [media, setMedia] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMedia(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">{t('nav.gallery')}</h2>
      <div className="grid grid-cols-2 gap-4">
        {media.map((item) => (
          <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
            {item.type === 'video' ? (
              <video src={item.url} className="w-full rounded-lg" controls />
            ) : (
              <img src={item.url} className="w-full rounded-lg" alt={item.caption} />
            )}
            <p className="mt-2 text-sm font-medium">{item.caption}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {item.tags.map((tag: string) => (
                <span key={tag} className="text-xs bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">#{tag}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
