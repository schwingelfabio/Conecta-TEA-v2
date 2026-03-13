import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { doc, updateDoc, collection, query, where, getDocs, setDoc, serverTimestamp, addDoc } from 'firebase/firestore';

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
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
    if (!selectedState || !selectedCity || !auth.currentUser) return;
    setLoading(true);
    
    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        state: selectedState,
        city: selectedCity
      });

      // Criar tópicos gerais
      const topicsRef = collection(db, 'topics');
      
      const createTopic = async (title: string, location: string) => {
        const q = query(topicsRef, where('titulo', '==', title), where('cidade', '==', location));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
          await addDoc(topicsRef, {
            titulo: title,
            cidade: location,
            autor: 'Sistema',
            createdAt: serverTimestamp()
          });
        }
      };

      await createTopic(`Tópico Geral - ${selectedState}`, selectedState);
      await createTopic(`Tópico Geral - ${selectedCity}`, selectedCity);
    } catch (err) {
      console.error("Error saving onboarding:", err);
    }

    setLoading(false);
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold mb-6">Bem-vindo! Para começar, onde você mora?</h2>
        
        <select 
          className="w-full p-4 mb-4 rounded-xl border border-gray-200"
          onChange={(e) => setSelectedState(e.target.value)}
        >
          <option value="">Selecione o Estado</option>
          {states.map(s => <option key={s.id} value={s.sigla}>{s.nome}</option>)}
        </select>

        <select 
          className="w-full p-4 mb-6 rounded-xl border border-gray-200"
          disabled={!selectedState}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">Selecione a Cidade</option>
          {cities.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
        </select>

        <button 
          onClick={handleSave}
          disabled={!selectedState || !selectedCity || loading}
          className="w-full bg-sky-500 text-white font-bold py-4 rounded-xl"
        >
          {loading ? 'Salvando...' : 'Salvar e Continuar'}
        </button>
      </div>
    </div>
  );
}
