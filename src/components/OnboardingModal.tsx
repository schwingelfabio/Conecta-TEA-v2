import React, { useState } from 'react';
import { db, auth } from '../lib/firebase';
import { useTranslation } from 'react-i18next';
import { doc, updateDoc, collection, query, where, getDocs, setDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import LocationSelectorGlobal from './LocationSelectorGlobal';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrorHandler';

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { t } = useTranslation();
  
  const [locationData, setLocationData] = useState({ state: '', city: '', region: '', google_result: false });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async () => {
    if (!locationData.state || !locationData.city || !auth.currentUser) {
      console.warn('[Onboarding] Missing data for save:', { locationData, user: auth.currentUser?.uid });
      return;
    }
    setLoading(true);
    setErrorMsg('');
    
    try {
      console.log('[Onboarding] Saving state/city for user:', auth.currentUser.uid);
      const userRef = doc(db, 'users', auth.currentUser.uid);
      try {
        await updateDoc(userRef, {
          state: locationData.state,
          city: locationData.city,
          region: locationData.region,
          google_result: locationData.google_result,
          updatedAt: serverTimestamp()
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.UPDATE, `users/${auth.currentUser.uid}`);
      }

      try {
        await setDoc(doc(db, 'public_profiles', auth.currentUser.uid), {
          state: locationData.state,
          city: locationData.city,
          region: locationData.region,
          google_result: locationData.google_result
        }, { merge: true });
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `public_profiles/${auth.currentUser.uid}`);
      }

      // Criar tópicos de comunidade se não existirem
      const topicsRef = collection(db, 'topics');
      
      const ensureTopic = async (title: string, locationValue: string, type: 'state' | 'city') => {
        const q = query(
          topicsRef, 
          where('titulo', '==', title), 
          where(type === 'state' ? 'state' : 'city', '==', locationValue)
        );
        let snapshot;
        try {
          snapshot = await getDocs(q);
        } catch (e) {
          handleFirestoreError(e, OperationType.GET, 'topics');
        }

        if (snapshot && snapshot.empty) {
          console.log(`[Onboarding] Creating new topic: ${title}`);
          try {
            await addDoc(topicsRef, {
              titulo: title,
              state: type === 'state' ? locationValue : locationData.state,
              city: type === 'city' ? locationValue : '',
              type: type,
              author: t('onboarding.system'),
              createdAt: serverTimestamp()
            });
          } catch (e) {
            handleFirestoreError(e, OperationType.CREATE, 'topics');
          }
        }
      };

      await ensureTopic(`${t('onboarding.community')} ${locationData.state}`, locationData.state, 'state');
      await ensureTopic(`${t('onboarding.community')} ${locationData.city}`, locationData.city, 'city');
      
      console.log('[Onboarding] Save success');
      onComplete();
    } catch (err: any) {
      console.error("[Onboarding] Error saving onboarding:", err);
      setErrorMsg(`${t('onboarding.saveError')}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold mb-6">{t('onboarding.welcome')}</h2>
        
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
            {errorMsg}
          </div>
        )}

        <div className="mb-8">
          <LocationSelectorGlobal onChange={setLocationData} />
        </div>

        <button 
          onClick={handleSave}
          disabled={!locationData.state || !locationData.city || loading}
          className="w-full bg-sky-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all disabled:opacity-50 disabled:shadow-none"
        >
          {loading ? t('common.loading') : t('onboarding.button')}
        </button>
      </div>
    </div>
  );
}
