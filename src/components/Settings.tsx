import React, { useState, useEffect, useCallback } from 'react';
import { auth, db, storage } from '../lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { signOut, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import LocationSelectorGlobal from './LocationSelectorGlobal';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrorHandler';
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
  MapPin,
  Edit2,
  Camera,
  X,
  Loader2,
  Settings as SettingsIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';
import Avatar from './Avatar';

import { UserProfile } from '../types';

export default function Settings({
  userProfile,
  isAdmin,
  isVip,
  isDeveloper,
  onNavigate,
  isGuest
}: {
  userProfile: UserProfile | null,
  isAdmin?: boolean,
  isVip?: boolean,
  isDeveloper?: boolean,
  onNavigate: (tab: string) => void,
  isGuest?: boolean
}) {
  const { t } = useTranslation();
  const user = auth.currentUser;
  
  const [name, setName] = useState(userProfile?.displayName || user?.displayName || '');
  const [firstName, setFirstName] = useState(userProfile?.firstName || '');
  const [lastName, setLastName] = useState(userProfile?.lastName || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phoneNumber || '');
  const [photoURL, setPhotoURL] = useState(userProfile?.photoURL || user?.photoURL || '');
  const [state, setState] = useState(userProfile?.state || '');
  const [city, setCity] = useState(userProfile?.city || '');
  const [region, setRegion] = useState(userProfile?.region || '');
  const [googleResult, setGoogleResult] = useState(userProfile?.google_result || false);
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [role, setRole] = useState(userProfile?.role || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleLocationChange = useCallback((data: { state: string; city: string; region: string; google_result: boolean }) => {
    setState(data.state);
    setCity(data.city);
    setRegion(data.region);
    setGoogleResult(data.google_result);
  }, []);

  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const effectiveVip = Boolean(isVip || isAdmin);

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.displayName || user?.displayName || '');
      setFirstName(userProfile.firstName || '');
      setLastName(userProfile.lastName || '');
      setAddress(userProfile.address || '');
      setPhoneNumber(userProfile.phoneNumber || '');
      setPhotoURL(userProfile.photoURL || user?.photoURL || '');
      setState(userProfile.state || '');
      setCity(userProfile.city || '');
      setRegion(userProfile.region || '');
      setGoogleResult(userProfile.google_result || false);
      setBio(userProfile.bio || '');
      setRole(userProfile.role || '');
    }
  }, [userProfile, user]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showMessage(t('settings.photoTooLarge') || 'A foto deve ter menos de 5MB', 'error');
      return;
    }

    setIsUploading(true);
    try {
      if (!storage) {
        throw new Error('Firebase Storage is not available. Please contact support.');
      }
      const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Update Firebase Auth
      await updateProfile(user, { photoURL: downloadURL });
      
      // Update Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        photoURL: downloadURL,
        updatedAt: serverTimestamp()
      });
      await updateDoc(doc(db, 'public_profiles', user.uid), {
        photoURL: downloadURL
      }).catch(e => console.error('Error updating public profile photo:', e));

      setPhotoURL(downloadURL);
      showMessage(t('settings.photoSuccess') || 'Foto atualizada com sucesso!', 'success');
    } catch (error) {
      console.error('Error uploading photo:', error);
      showMessage(t('settings.uploadError') || 'Erro ao enviar foto. Verifique sua conexão.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    
    if (!firstName.trim() || !lastName.trim() || !state.trim() || !city.trim() || !role.trim()) {
      showMessage(t('settings.fillRequired') || 'Por favor, preencha todos os campos obrigatórios (Nome, Sobrenome, Estado, Cidade e Perfil).', 'error');
      return;
    }

    setIsSaving(true);
    try {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          displayName: `${firstName} ${lastName}`.trim() || name,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          address: address.trim(),
          phoneNumber: phoneNumber.trim(),
          photoURL,
          state: state.trim(),
          city: city.trim(),
          region,
          google_result: googleResult,
          bio: bio.trim(),
          role
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `users/${user.uid}`);
      }

      try {
        await updateDoc(doc(db, 'public_profiles', user.uid), {
          displayName: `${firstName} ${lastName}`.trim() || name,
          photoURL,
          state: state.trim(),
          city: city.trim(),
          region,
          google_result: googleResult,
          role
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `public_profiles/${user.uid}`);
      }
      setIsEditing(false);
      showMessage(t('settings.profileSaved'), 'success');
    } catch (error) {
      console.error(error);
      showMessage(t('settings.saveError') || 'Erro ao salvar perfil', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      showMessage(t('settings.passwordResetSent'), 'success');
    } catch (error) {
      console.error(error);
      showMessage(t('settings.passwordResetError'), 'error');
    }
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
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl font-bold border text-center ${
            message.type === 'success' 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
              : 'bg-red-50 text-red-700 border-red-100'
          }`}
        >
          {message.text}
        </motion.div>
      )}

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h2>
          <div className="flex items-center gap-2">
            {!isGuest && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-sky-50 text-sky-600 rounded-xl hover:bg-sky-100 transition-colors flex items-center gap-2 px-4 font-bold"
              >
                <Edit2 size={18} />
                {t('common.edit')}
              </button>
            )}
            {isEditing && (
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2 px-4 font-bold"
              >
                <X size={18} />
                {t('common.cancel')}
              </button>
            )}
            <LanguageSelector />
          </div>
        </div>

        {!isGuest && (
          <div className="flex items-center gap-6 mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 relative group">
            <div className="relative">
              <div className="relative">
                <Avatar 
                  src={photoURL} 
                  name={firstName ? `${firstName} ${lastName}` : name} 
                  size="xl" 
                  className={isUploading ? 'opacity-50' : ''}
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="text-sky-500 animate-spin" size={32} />
                  </div>
                )}
              </div>
              {isEditing && storage && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 p-2 bg-sky-500 text-white rounded-full shadow-lg hover:bg-sky-600 transition-all transform hover:scale-110 disabled:opacity-50"
                >
                  <Camera size={16} />
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {firstName ? `${firstName} ${lastName}` : (name || 'Usuário')}
                {effectiveVip && <Crown size={20} className="text-amber-500" />}
              </h3>
              <p className="text-gray-500 mb-1">{user?.email || user?.phoneNumber}</p>
              {userProfile?.role && (
                <span className="inline-block px-3 py-1 bg-sky-100 text-sky-700 text-xs font-bold rounded-full uppercase tracking-wider">
                  {t(`settings.roles.${userProfile.role}`)}
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          {!isEditing ? (
            <div className="space-y-4">
              {userProfile?.bio && (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Bio</p>
                  <p className="text-gray-700 italic">"{userProfile.bio}"</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">{t('settings.name')}</p>
                  <p className="text-gray-900 font-bold">{firstName} {lastName}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">{t('settings.phone') || 'Telefone'}</p>
                  <p className="text-gray-900 font-bold">{phoneNumber || t('common.notInformed') || 'Não informado'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">{t('map.locationTitle') || 'Localização'}</p>
                  <p className="text-gray-900 font-bold">{city}, {state}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">{t('settings.address') || 'Endereço'}</p>
                  <p className="text-gray-900 font-bold">{address || t('common.notInformed') || 'Não informado'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.name')}</label>
                  <input 
                    type="text" 
                    value={firstName} 
                    placeholder={t('settings.firstNamePlaceholder') || 'Nome'}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.lastName') || 'Sobrenome'}</label>
                  <input 
                    type="text" 
                    value={lastName} 
                    placeholder={t('settings.lastNamePlaceholder') || 'Sobrenome'}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.iAm')}</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all bg-white"
                >
                  <option value="">{t('settings.rolePlaceholder')}</option>
                  <option value="parent">{t('settings.roles.parent')}</option>
                  <option value="professional">{t('settings.roles.professional')}</option>
                  <option value="autistic">{t('settings.roles.autistic')}</option>
                  <option value="other">{t('settings.roles.other')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.bio')}</label>
                <textarea 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder={t('settings.bioPlaceholder')}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.address') || 'Endereço'}</label>
                <input 
                  type="text" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.phone') || 'Telefone'}</label>
                <input 
                  type="tel" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('map.locationTitle') || 'Localização'}</label>
                <LocationSelectorGlobal 
                  initialState={state}
                  initialCity={city}
                  initialRegion={region}
                  onChange={handleLocationChange}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-100 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-200 transition-all"
                >
                  {t('common.cancel')}
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-[2] bg-sky-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-sky-600 transition-all shadow-lg shadow-sky-100 disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={20} />
                      {t('settings.save')}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {!isEditing && (
            <button 
              onClick={handlePasswordReset}
              disabled={isGuest}
              className="w-full bg-slate-50 text-slate-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-100 transition-all border border-slate-200 disabled:opacity-50"
            >
              <Mail size={20} />
              {t('settings.recoverPassword') || 'Recuperar Senha'}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Crown size={20} className={effectiveVip ? 'text-amber-500' : 'text-gray-400'} />
          {t('settings.vipStatus')}
        </h3>
        
        <div className="flex gap-2 mb-4">
            {isAdmin && <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">Admin</span>}
            {isDeveloper && <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded">Developer</span>}
            {effectiveVip && <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">VIP</span>}
        </div>
        
        <div className={`p-4 rounded-2xl flex items-center justify-between ${effectiveVip ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50 border border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${effectiveVip ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 text-gray-500'}`}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900">{effectiveVip ? t('settings.vipMember') : t('settings.freePlan')}</p>
              <p className="text-sm text-gray-500">{effectiveVip ? t('settings.accessFull') : t('settings.accessLimited')}</p>
            </div>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <SettingsIcon size={20} className="text-indigo-500" />
            Admin Controls
          </h3>
          <button 
            onClick={() => onNavigate('ai-engine')}
            className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border border-indigo-100 transition-all"
          >
            <SettingsIcon size={20} />
            AI Content Engine
          </button>
          <button 
            onClick={() => onNavigate('admin-engagement')}
            className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border border-purple-100 transition-all mt-2"
          >
            <SettingsIcon size={20} />
            Engagement Engine
          </button>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <IdCard size={20} className="text-brand-primary" />
          {t('settings.digitalId') || 'Carteirinha Digital'}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {t('settings.digitalIdDesc') || 'Acesse sua identificação digital profissional para suporte e emergências.'}
        </p>
        <button 
          onClick={() => onNavigate('sos')}
          className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 border border-slate-200 transition-all"
        >
          <IdCard size={20} />
          {t('settings.viewId') || 'Ver Minha Carteirinha'}
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
