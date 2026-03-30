import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { useTranslation } from 'react-i18next';
import { doc, updateDoc, collection, query, where, getDocs, setDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { locations } from '../lib/locations';

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { t, i18n } = useTranslation();
  const region = i18n.language === 'en' ? 'US' : i18n.language === 'es' ? 'LATAM' : 'BR';
  
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const regionData = locations[region as keyof typeof locations];

  useEffect(() => {
    setSelectedCountry('');
    setSelectedState('');
    setSelectedCity('');
  }, [region]);

  const handleSave = async () => {
    if (!selectedState || !selectedCity || !auth.currentUser) {
      console.warn('[Onboarding] Missing data for save:', { selectedState, selectedCity, user: auth.currentUser?.uid });
      return;
    }
    setLoading(true);
    setErrorMsg('');
    
    try {
      console.log('[Onboarding] Saving state/city for user:', auth.currentUser.uid);
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        state: selectedState,
        city: selectedCity,
        region: region,
        updatedAt: serverTimestamp()
      });
      await setDoc(doc(db, 'public_profiles', auth.currentUser.uid), {
        state: selectedState,
        city: selectedCity,
        region: region
      }, { merge: true }).catch(e => console.error('Error updating public profile:', e));

      // Criar tópicos de comunidade se não existirem
      const topicsRef = collection(db, 'topics');
      
      const ensureTopic = async (title: string, locationValue: string, type: 'state' | 'city') => {
        const q = query(
          topicsRef, 
          where('titulo', '==', title), 
          where(type === 'state' ? 'state' : 'city', '==', locationValue)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          console.log(`[Onboarding] Creating new topic: ${title}`);
          await addDoc(topicsRef, {
            titulo: title,
            state: type === 'state' ? locationValue : selectedState,
            city: type === 'city' ? locationValue : '',
            type: type,
            author: t('onboarding.system'),
            createdAt: serverTimestamp()
          });
        }
      };

      await ensureTopic(`${t('onboarding.community')} ${selectedState}`, selectedState, 'state');
      await ensureTopic(`${t('onboarding.community')} ${selectedCity}`, selectedCity, 'city');
      
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
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold mb-6">{t('onboarding.welcome')}</h2>
        
        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
            {errorMsg}
          </div>
        )}

        {region === 'LATAM' && 'countries' in regionData && (
          <select 
            className="w-full p-4 mb-4 rounded-xl border border-gray-200"
            onChange={(e) => { setSelectedCountry(e.target.value); setSelectedState(''); setSelectedCity(''); }}
            value={selectedCountry}
          >
            <option value="">{t('onboarding.selectCountry')}</option>
            {(regionData as any).countries.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        )}

        <select 
          className="w-full p-4 mb-4 rounded-xl border border-gray-200"
          disabled={region === 'LATAM' && !selectedCountry}
          onChange={(e) => { setSelectedState(e.target.value); setSelectedCity(''); }}
          value={selectedState}
        >
          <option value="">{t('onboarding.selectState')}</option>
          {region === 'BR' && 'states' in regionData && Array.isArray(regionData.states) && regionData.states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          {region === 'US' && 'states' in regionData && Array.isArray(regionData.states) && regionData.states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          {region === 'LATAM' && selectedCountry && 'states' in regionData && !Array.isArray(regionData.states) && (regionData.states as any)[selectedCountry]?.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <select 
          className="w-full p-4 mb-6 rounded-xl border border-gray-200"
          disabled={!selectedState}
          onChange={(e) => setSelectedCity(e.target.value)}
          value={selectedCity}
        >
          <option value="">{t('onboarding.selectCity')}</option>
          {selectedState && 'cities' in regionData && (regionData.cities as any)[selectedState]?.map((c: any) => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>

        <button 
          onClick={handleSave}
          disabled={!selectedState || !selectedCity || loading}
          className="w-full bg-sky-500 text-white font-bold py-4 rounded-xl"
        >
          {loading ? '...' : t('onboarding.button')}
        </button>
      </div>
    </div>
  );
}
