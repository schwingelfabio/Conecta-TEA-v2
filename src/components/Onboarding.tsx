import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { useTranslation } from 'react-i18next';
import { doc, updateDoc, collection, query, where, getDocs, setDoc, serverTimestamp, addDoc } from 'firebase/firestore';

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { t } = useTranslation();
  const [states, setStates] = useState<{ id: number, sigla: string, nome: string }[]>([]);
  const [cities, setCities] = useState<{ id: number, nome: string }[]>([]);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(res => res.json())
      .then(data => setStates(data));
  }, []);

  useEffect(() => {
    if (selectedState) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios?orderBy=nome`)
        .then(res => res.json())
        .then(data => setCities(data));
    }
  }, [selectedState]);

  const handleSave = async () => {
    if (!selectedState || !selectedCity || !auth.currentUser) {
      console.warn('[Onboarding] Missing data for save:', { selectedState, selectedCity, user: auth.currentUser?.uid });
      return;
    }
    setLoading(true);
    
    try {
      console.log('[Onboarding] Saving state/city for user:', auth.currentUser.uid);
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        state: selectedState,
        city: selectedCity,
        updatedAt: serverTimestamp()
      });
      await setDoc(doc(db, 'public_profiles', auth.currentUser.uid), {
        state: selectedState,
        city: selectedCity
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
      alert(`${t('onboarding.saveError')}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold mb-6">{t('onboarding.welcome')}</h2>
        
        <select 
          className="w-full p-4 mb-4 rounded-xl border border-gray-200"
          onChange={(e) => setSelectedState(e.target.value)}
        >
          <option value="">{t('onboarding.selectState')}</option>
          {states.map(s => <option key={s.id} value={s.sigla}>{s.nome}</option>)}
        </select>

        <select 
          className="w-full p-4 mb-6 rounded-xl border border-gray-200"
          disabled={!selectedState}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">{t('onboarding.selectCity')}</option>
          {cities.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
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
