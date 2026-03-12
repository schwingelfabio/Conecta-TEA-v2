import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Users, MapPin, MessageCircle, ArrowLeft, Share2, Copy, Check, TrendingUp } from 'lucide-react';

interface CityPageProps {
  city: string;
  state: string;
  onBack: () => void;
}

export default function CityPage({ city, state, onBack }: CityPageProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    posts: 0
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchCityData() {
      try {
        // Fetch users in city
        const usersQuery = query(
          collection(db, 'users'),
          where('city', '==', city),
          where('state', '==', state)
        );
        const usersSnapshot = await getDocs(usersQuery);
        
        // Fetch posts in city
        const postsQuery = query(
          collection(db, 'posts'),
          where('city', '==', city),
          where('state', '==', state)
        );
        const postsSnapshot = await getDocs(postsQuery);

        setStats({
          users: usersSnapshot.size,
          posts: postsSnapshot.size
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching city data:", error);
        setLoading(false);
      }
    }

    fetchCityData();
  }, [city, state]);

  const shareUrl = `${window.location.origin}?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`;
  const shareText = t('map.shareText', { city });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(t('map.communityOf') + ' ' + city)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-sky-500 mb-4 animate-pulse">
          <MapPin size={32} />
        </div>
        <p className="text-gray-500 font-medium">{t('map.loading')}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium transition-colors"
      >
        <ArrowLeft size={20} />
        {t('map.backToMap')}
      </button>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center">
              <MapPin size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{city}</h2>
              <p className="text-gray-500 font-medium">{state}</p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl inline-flex font-medium">
            <TrendingUp size={18} />
            {t('map.growing')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mb-3">
            <Users size={24} />
          </div>
          <span className="text-3xl font-bold text-gray-900">{stats.users}</span>
          <span className="text-sm text-gray-500 font-medium uppercase tracking-wider mt-1">{t('map.connectedFamilies')}</span>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3">
            <MessageCircle size={24} />
          </div>
          <span className="text-3xl font-bold text-gray-900">{stats.posts}</span>
          <span className="text-sm text-gray-500 font-medium uppercase tracking-wider mt-1">{t('map.postsShared')}</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
            <Share2 size={20} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{t('map.shareTitle')}</h3>
        </div>
        
        <p className="text-gray-600 mb-6">{shareText}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <a 
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            <span className="font-medium text-sm">WhatsApp</span>
          </a>
          
          <a 
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 transition-colors"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            <span className="font-medium text-sm">Facebook</span>
          </a>

          <a 
            href={shareLinks.email}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <span className="font-medium text-sm">Email</span>
          </a>

          <button 
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-sky-50 text-sky-600 hover:bg-sky-100 transition-colors"
          >
            {copied ? <Check size={24} /> : <Copy size={24} />}
            <span className="font-medium text-sm">{copied ? t('map.linkCopied') : t('map.copyLink')}</span>
          </button>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-xl flex items-center justify-between border border-gray-100">
          <span className="text-sm text-gray-500 truncate mr-4">{shareUrl}</span>
          <button 
            onClick={handleCopyLink}
            className="text-sky-600 font-medium text-sm whitespace-nowrap hover:text-sky-700"
          >
            {copied ? t('map.linkCopied') : t('map.copyLink')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
