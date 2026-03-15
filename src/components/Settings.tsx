import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import {
  User,
  Mail,
  Crown,
  LogOut,
  ChevronRight,
  ShieldCheck,
  IdCard,
  Calendar,
  Save,
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

import { UserProfile } from '../types';

export default function Settings({
  userProfile,
  isAdmin,
  isVip,
  isDeveloper,
  onNavigate
}: {
  userProfile: UserProfile | null,
  isAdmin?: boolean,
  isVip?: boolean,
  isDeveloper?: boolean,
  onNavigate: (tab: string) => void
}) {
  const { t } = useTranslation();
  const user = auth.currentUser;
  
  const [name, setName] = useState(userProfile?.displayName || user?.displayName || '');
  const [state, setState] = useState(userProfile?.state || '');
  const [city, setCity] = useState(userProfile?.city || '');

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.displayName || user?.displayName || '');
      setState(userProfile.state || '');
      setCity(userProfile.city || '');
    }
  }, [userProfile, user]);

  const handleSave = async () => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid), {
      displayName: name,
      state,
      city
    });
    alert('Perfil salvo com sucesso!');
  };

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6 pb-24"
    >
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h2>
          <LanguageSelector />
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.name')}</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.state')}</label>
              <input 
                type="text" 
                value={state} 
                onChange={(e) => setState(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.city')}</label>
              <input 
                type="text" 
                value={city} 
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200"
              />
            </div>
          </div>
          <button 
            onClick={handleSave}
            className="w-full bg-sky-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {t('settings.save')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Crown size={20} className={isVip ? 'text-amber-500' : 'text-gray-400'} />
          {t('settings.vipStatus')}
        </h3>
        
        <div className="flex gap-2 mb-4">
            {isAdmin && <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">Admin</span>}
            {isDeveloper && <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded">Developer</span>}
            {isVip && <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">VIP</span>}
        </div>
        
        <div className={`p-4 rounded-2xl flex items-center justify-between ${isVip ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50 border border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isVip ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 text-gray-500'}`}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900">{isVip ? t('settings.vipMember') : t('settings.freePlan')}</p>
              <p className="text-sm text-gray-500">{isVip ? t('settings.accessFull') : t('settings.accessLimited')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <IdCard size={20} className="text-brand-primary" />
          Carteirinha Digital
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Acesse sua identificação digital profissional para suporte e emergências.
        </p>
        <button 
          onClick={() => onNavigate('sos')}
          className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border border-slate-200 transition-all"
        >
          <IdCard size={20} />
          Ver Minha Carteirinha
        </button>
      </div>

      <div className="pt-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-5 rounded-3xl flex items-center justify-center gap-3 transition-all active:scale-95 border border-red-100 shadow-sm"
        >
          <LogOut size={24} />
          {t('auth.logout')}
        </button>
      </div>
    </motion.div>
  );
}
