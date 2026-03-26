import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp, runTransaction, getDocFromServer } from 'firebase/firestore';
import { UserProfile, SosCard } from '../types';
import { motion } from 'framer-motion';
import { Activity, Printer, Save, Edit2, Phone, MapPin, AlertTriangle, HeartPulse, ShieldAlert, ShieldCheck, IdCard, Crown, Download, MessageCircle, X, Camera } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useTranslation } from 'react-i18next';
import { toPng } from 'html-to-image';
import { useRef } from 'react';
import Avatar from './Avatar';

interface SosPageProps {
  userProfile: UserProfile | null;
  authReady?: boolean;
  onLoginClick?: () => void;
  onNavigate?: (tab: string) => void;
  isGuest?: boolean;
  isAdmin?: boolean;
  isVip?: boolean;
  initialSection?: 'card' | 'tools';
}

const SosPage: React.FC<SosPageProps> = ({ userProfile, authReady, onLoginClick, onNavigate, isGuest, isAdmin, isVip, initialSection = 'card' }) => {
  const { t, i18n } = useTranslation();
  const effectiveVip = Boolean(isVip || isAdmin);
  const [sosCard, setSosCard] = useState<SosCard | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBackendReady, setIsBackendReady] = useState(true);
  const [activeSosTool, setActiveSosTool] = useState<string | null>(null);
  const qrRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    childName: '',
    birthDate: '',
    bloodType: '',
    allergies: '',
    observations: '',
    contact1Name: '',
    contact1Phone: '',
    contact2Name: '',
    contact2Phone: '',
    homeAddress: '',
    workAddress: '',
    city: '',
    state: '',
    responsibleName: '',
    emergencyNote: ''
  });

  useEffect(() => {
    console.log('[CARD] load start');
    const fetchSosCard = async () => {
      // Check backend readiness for saving
      try {
        await getDocFromServer(doc(db, 'meta', 'counters'));
        setIsBackendReady(true);
      } catch (err) {
        console.warn("Backend not ready for saving:", err);
        setIsBackendReady(false);
      }

      if (!authReady) {
        console.log('[SosPage] Auth not ready yet...');
        return;
      }

      if (!userProfile) {
        console.log('[SosPage] No user profile, stopping fetch');
        setLoading(false);
        return;
      }
      
      console.log('[SosPage] Fetching SOS card for user:', userProfile.uid);
      try {
        setError(null);
        const q = query(collection(db, 'sos_cards'), where('userId', '==', userProfile.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docData = querySnapshot.docs[0];
          const data = { id: docData.id, ...docData.data() } as SosCard;
          console.log('[CARD] load success:', data.id);
          setSosCard(data);
          setFormData({
            childName: data.childName || '',
            birthDate: data.birthDate || '',
            bloodType: data.bloodType || '',
            allergies: data.allergies || '',
            observations: data.observations || '',
            contact1Name: data.contact1Name || '',
            contact1Phone: data.contact1Phone || '',
            contact2Name: data.contact2Name || '',
            contact2Phone: data.contact2Phone || '',
            homeAddress: data.homeAddress || '',
            workAddress: data.workAddress || '',
            city: data.city || userProfile.city || '',
            state: data.state || userProfile.state || '',
            responsibleName: data.responsibleName || userProfile.displayName || '',
            emergencyNote: data.emergencyNote || ''
          });
        } else {
          console.log('[CARD] load success: no card found, initializing with profile data');
          setFormData(prev => ({
            ...prev,
            childName: userProfile.displayName || '',
            city: userProfile.city || '',
            state: userProfile.state || '',
            responsibleName: userProfile.displayName || ''
          }));
          setIsEditing(true);
        }
      } catch (err) {
        console.error("[CARD] load failure:", err);
        setError("A funcionalidade estará disponível em breve.");
      } finally {
        setLoading(false);
      }
    };

    fetchSosCard();
  }, [userProfile, authReady]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;
    console.log('[CARD] save payload:', formData);
    setSaving(true);

    try {
      const counterRef = doc(db, 'meta', 'counters');
      
      if (sosCard?.id) {
        // Update
        if (!sosCard.officialId) {
          console.log('[ID] existing card missing officialId, generating via transaction...');
          const result = await runTransaction(db, async (transaction) => {
            const counterDoc = await transaction.get(counterRef);
            let nextId = 1;
            if (counterDoc.exists()) {
              nextId = (counterDoc.data().nextCardId || 0) + 1;
            }
            const officialId = `CTEA-${String(nextId).padStart(6, '0')}`;
            
            const cardRef = doc(db, 'sos_cards', sosCard.id!);
            const updatePayload = { ...formData, officialId, updatedAt: serverTimestamp() };
            transaction.update(cardRef, updatePayload);
            transaction.set(counterRef, { nextCardId: nextId }, { merge: true });
            return { officialId, ...updatePayload };
          });
          setSosCard({ ...sosCard, ...result } as SosCard);
          console.log('[ID] generated and saved for existing card:', result.officialId);
        } else {
          console.log('[ID] existing officialId reused:', sosCard.officialId);
          const cardRef = doc(db, 'sos_cards', sosCard.id);
          await updateDoc(cardRef, { ...formData, updatedAt: serverTimestamp() });
          setSosCard({ ...sosCard, ...formData });
        }
        console.log('[CARD] save success (update)');
      } else {
        // Create
        console.log('[ID] generation start');
        const result = await runTransaction(db, async (transaction) => {
          const counterDoc = await transaction.get(counterRef);
          let nextId = 1;
          if (counterDoc.exists()) {
            nextId = (counterDoc.data().nextCardId || 0) + 1;
          }
          const officialId = `CTEA-${String(nextId).padStart(6, '0')}`;
          console.log('[ID] next counter value:', nextId);
          console.log('[ID] generated officialId:', officialId);
          
          const newCardRef = doc(collection(db, 'sos_cards'));
          const newCard = {
            userId: userProfile.uid,
            ...formData,
            officialId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          };
          transaction.set(newCardRef, newCard);
          transaction.set(counterRef, { nextCardId: nextId }, { merge: true });
          return { id: newCardRef.id, ...newCard };
        });
        setSosCard(result as SosCard);
        console.log('[ID] save success:', result.officialId);
        console.log('[CARD] save success (create):', result.id);
      }
      setIsEditing(false);
    } catch (error: any) {
      console.error("[CARD] save failure:", error);
      setError("A funcionalidade estará disponível em breve.");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadQR = async () => {
    if (qrRef.current === null) return;
    
    try {
      const dataUrl = await toPng(qrRef.current, { cacheBust: true, backgroundColor: '#ffffff', pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `QR-SOS-${sosCard?.childName || 'Card'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error downloading QR code:', err);
    }
  };

  if (!authReady || loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!userProfile) {
    console.log('[SosPage] Rendering restricted access (no profile)');
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="w-24 h-24 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={48} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">{t('sos.restrictedTitle')}</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          {t('sos.loginRequired')}
        </p>
        <button 
          onClick={onLoginClick}
          className="px-8 py-4 bg-brand-primary text-white rounded-full font-bold hover:bg-brand-secondary transition-all shadow-lg"
        >
          {t('sos.loginButton')}
        </button>
      </div>
    );
  }

  // Removed VIP restriction check to allow all authenticated users
  console.log('[SOS] Access granted to authenticated user');

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={48} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">{t('sos.connectionError')}</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg"
        >
          {t('sos.tryAgain')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shadow-inner">
            <ShieldAlert size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">SOS & Identidade</h1>
            <p className="text-slate-500 font-medium mt-1">Recursos de emergência e carteirinha digital</p>
          </div>
        </div>
        <div className="hidden md:flex space-x-3">
          <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-bold">
            <Edit2 size={18} />
            <span>Editar Dados</span>
          </button>
          <button onClick={handlePrint} className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md">
            <Printer size={18} />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* SOS Sensorial Section */}
      {!isEditing && initialSection === 'tools' && (
        <div className="mb-12 print:hidden">
          <div className="bg-red-50 border border-red-100 rounded-3xl p-6 md:p-8 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Activity size={24} className="text-red-500" />
                <h2 className="text-2xl font-black text-red-900">SOS Sensorial</h2>
              </div>
              <p className="text-red-700 mb-6 max-w-2xl font-medium">
                Acesso rápido a ferramentas de regulação e comunicação para momentos de crise ou sobrecarga sensorial.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <button onClick={() => setActiveSosTool('public')} className="bg-white p-4 rounded-2xl shadow-sm border border-red-100 hover:border-red-300 hover:shadow-md transition-all text-left group">
                  <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <AlertTriangle size={20} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">Crise em Público</h3>
                  <p className="text-xs text-slate-500">Texto de apoio para mostrar a terceiros</p>
                </button>
                <button onClick={() => setActiveSosTool('noise')} className="bg-white p-4 rounded-2xl shadow-sm border border-red-100 hover:border-red-300 hover:shadow-md transition-all text-left group">
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Activity size={20} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">Ambiente Barulhento</h3>
                  <p className="text-xs text-slate-500">Sons calmantes e ruído branco</p>
                </button>
                <button onClick={() => setActiveSosTool('communication')} className="bg-white p-4 rounded-2xl shadow-sm border border-red-100 hover:border-red-300 hover:shadow-md transition-all text-left group">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <MessageCircle size={20} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">Comunicação Alternativa</h3>
                  <p className="text-xs text-slate-500">Cartões de necessidades básicas</p>
                </button>
                <button onClick={() => setActiveSosTool('regulation')} className="bg-white p-4 rounded-2xl shadow-sm border border-red-100 hover:border-red-300 hover:shadow-md transition-all text-left group">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <HeartPulse size={20} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">Regulação Emocional</h3>
                  <p className="text-xs text-slate-500">Exercícios de respiração guiada</p>
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-red-200 opacity-20 rounded-full blur-3xl"></div>
          </div>
        </div>
      )}

      {/* SOS Tool Modal */}
      {activeSosTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-[2rem] p-6 md:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
          >
            <button 
              onClick={() => setActiveSosTool(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>

            {activeSosTool === 'public' && (
              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle size={40} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight">Aviso Importante</h2>
                <div className="bg-red-50 p-6 rounded-2xl border border-red-100 mb-6">
                  <p className="text-xl md:text-2xl font-bold text-red-700 leading-relaxed">
                    Esta pessoa é autista e está passando por uma sobrecarga sensorial ou crise.
                  </p>
                </div>
                <ul className="text-left space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 font-bold text-sm mt-0.5">1</div>
                    <p className="text-slate-700 font-medium">Por favor, dê espaço e evite aglomerações.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 font-bold text-sm mt-0.5">2</div>
                    <p className="text-slate-700 font-medium">Evite barulhos altos, luzes fortes ou contato físico.</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 font-bold text-sm mt-0.5">3</div>
                    <p className="text-slate-700 font-medium">Não faça perguntas no momento. Ela está acompanhada e segura.</p>
                  </li>
                </ul>
                <p className="text-slate-500 font-medium">Agradecemos a sua compreensão e empatia.</p>
              </div>
            )}

            {activeSosTool === 'noise' && (
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Activity size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-4">Ambiente Barulhento</h2>
                <p className="text-slate-600 mb-8">Utilize ruído branco ou sons da natureza para abafar sons externos e ajudar na regulação.</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition-colors flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Activity size={24} className="text-slate-700" />
                    </div>
                    <span className="font-bold text-slate-700">Ruído Branco</span>
                  </button>
                  <button className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition-colors flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Activity size={24} className="text-blue-500" />
                    </div>
                    <span className="font-bold text-slate-700">Som de Chuva</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-6 italic">* Funcionalidade de áudio em desenvolvimento</p>
              </div>
            )}

            {activeSosTool === 'communication' && (
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-6">Comunicação Alternativa</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-6 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-2xl transition-colors flex flex-col items-center justify-center gap-2 h-32">
                    <span className="text-4xl">💧</span>
                    <span className="font-bold text-blue-900">Água</span>
                  </button>
                  <button className="p-6 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-2xl transition-colors flex flex-col items-center justify-center gap-2 h-32">
                    <span className="text-4xl">🚽</span>
                    <span className="font-bold text-amber-900">Banheiro</span>
                  </button>
                  <button className="p-6 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-2xl transition-colors flex flex-col items-center justify-center gap-2 h-32">
                    <span className="text-4xl">🥪</span>
                    <span className="font-bold text-emerald-900">Comida</span>
                  </button>
                  <button className="p-6 bg-red-50 hover:bg-red-100 border border-red-200 rounded-2xl transition-colors flex flex-col items-center justify-center gap-2 h-32">
                    <span className="text-4xl">🛑</span>
                    <span className="font-bold text-red-900">Parar / Sair</span>
                  </button>
                </div>
              </div>
            )}

            {activeSosTool === 'regulation' && (
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HeartPulse size={40} />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-4">Respiração Guiada</h2>
                <p className="text-slate-600 mb-8">Acompanhe o círculo para regular a respiração.</p>
                
                <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.5, 1.5, 1],
                      opacity: [0.5, 1, 1, 0.5]
                    }}
                    transition={{ 
                      duration: 8,
                      repeat: Infinity,
                      times: [0, 0.4, 0.6, 1],
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 bg-emerald-200 rounded-full"
                  />
                  <div className="relative z-10 w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <HeartPulse size={32} className="text-white" />
                  </div>
                </div>
                
                <div className="flex justify-between text-sm font-bold text-slate-500 max-w-xs mx-auto">
                  <span>Inspire (4s)</span>
                  <span>Segure (2s)</span>
                  <span>Expire (4s)</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {isEditing ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 print:hidden"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('sos.setupTitle')}</h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">{t('sos.sections.child')}</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('sos.fields.childName')}</label>
                <input required type="text" name="childName" value={formData.childName} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('sos.fields.birthDate')}</label>
                <input required type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('sos.fields.city')}</label>
                <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('sos.fields.state')}</label>
                <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('sos.fields.bloodType')}</label>
                <input type="text" name="bloodType" placeholder={t('sos.placeholders.bloodType')} value={formData.bloodType} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('sos.fields.allergies')}</label>
                <input type="text" name="allergies" placeholder={t('sos.placeholders.allergies')} value={formData.allergies} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('sos.fields.observations')}</label>
                <textarea name="observations" placeholder={t('sos.placeholders.observations')} value={formData.observations} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none min-h-[80px]" />
              </div>

              <div className="space-y-4 md:col-span-2 mt-4">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">{t('sos.sections.responsible')}</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('sos.fields.responsibleName')}</label>
                <input required type="text" name="responsibleName" value={formData.responsibleName} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('sos.fields.emergencyPhone')}</label>
                <input required type="tel" name="contact1Phone" placeholder={t('sos.placeholders.phone')} value={formData.contact1Phone} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('sos.fields.emergencyNote')}</label>
                <textarea name="emergencyNote" placeholder={t('sos.placeholders.emergencyNote')} value={formData.emergencyNote} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none min-h-[80px]" />
              </div>

              <div className="space-y-4 md:col-span-2 mt-4">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">{t('sos.sections.additional')}</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('sos.fields.contact2Name')}</label>
                <input type="text" name="contact2Name" value={formData.contact2Name} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('sos.fields.contact2Phone')}</label>
                <input type="tel" name="contact2Phone" placeholder={t('sos.placeholders.phone')} value={formData.contact2Phone} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('sos.fields.homeAddress')}</label>
                <input type="text" name="homeAddress" value={formData.homeAddress} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none" />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-slate-100">
              {sosCard && (
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors">
                  {t('sos.cancel')}
                </button>
              )}
              <button 
                type="submit" 
                disabled={saving || !isBackendReady} 
                className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <Save size={20} />
                <span>{saving ? t('sos.saving') : t('sos.save')}</span>
              </button>
            </div>
            {!isBackendReady && (
              <p className="text-center text-amber-600 text-sm font-bold mt-4">
                A funcionalidade estará disponível em breve.
              </p>
            )}
            {error && (
              <p className="text-center text-red-600 text-sm font-bold mt-4">
                {error}
              </p>
            )}
          </form>
        </motion.div>
      ) : initialSection === 'card' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          {/* Professional Card View */}
          <div className="max-w-2xl mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 print:shadow-none print:border-2 print:border-slate-200 print:m-0">
            {/* Header with Branding */}
            <div className="bg-gradient-to-r from-brand-primary to-brand-secondary p-8 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                  <HeartPulse size={28} className="text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight leading-none">Conecta TEA</h2>
                  <p className="text-white/80 text-xs font-bold uppercase tracking-widest mt-1">{t('sos.subtitle')}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {t('sos.officialId')}
                </span>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Column: Data */}
              <div className="md:col-span-8 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('sos.labels.childName')}</h3>
                    <p className="text-3xl font-black text-slate-900 leading-tight">{sosCard?.childName || userProfile.displayName}</p>
                  </div>
                  <div className="shrink-0">
                    <Avatar 
                      src={userProfile.photoURL} 
                      name={sosCard?.childName || userProfile.displayName} 
                      size="xl" 
                      className="rounded-2xl border-4 border-slate-50 shadow-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('sos.labels.birthDate')}</h3>
                    <p className="text-lg font-bold text-slate-800">
                      {sosCard?.birthDate ? new Date(sosCard.birthDate).toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : i18n.language === 'es' ? 'es-ES' : 'en-US') : '-'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('sos.labels.bloodType')}</h3>
                    <p className="text-lg font-bold text-brand-primary">{sosCard?.bloodType || t('sos.notInformed')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('sos.labels.cityState')}</h3>
                    <p className="text-lg font-bold text-slate-800">{sosCard?.city} / {sosCard?.state}</p>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('sos.labels.responsible')}</h3>
                    <p className="text-lg font-bold text-slate-800 flex items-center gap-1">
                      {sosCard?.responsibleName}
                      {effectiveVip && <Crown size={14} className="text-amber-500" />}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-2 mb-2 text-slate-400">
                    <AlertTriangle size={14} />
                    <h3 className="text-[10px] font-black uppercase tracking-widest">{t('sos.labels.observations')}</h3>
                  </div>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {sosCard?.observations || t('sos.noObservations')}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{t('sos.labels.emergencyContact')}</h3>
                  <div className="flex items-center justify-between bg-brand-primary/5 p-4 rounded-2xl border border-brand-primary/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center">
                        <Phone size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{sosCard?.contact1Name || sosCard?.responsibleName}</p>
                        <p className="text-sm font-bold text-brand-primary">{sosCard?.contact1Phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: QR Code & Branding */}
              <div className="md:col-span-4 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-8 md:pt-0 md:pl-8">
                <div className="text-center mb-6">
                  <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-1">{t('sos.immediateSupport')}</p>
                  <p className="text-[9px] text-slate-400 leading-tight">{t('sos.scanInstructions')}</p>
                </div>
                
                <div className="bg-white p-4 rounded-3xl shadow-lg border border-slate-100 relative group" ref={qrRef}>
                  {sosCard?.id ? (
                    <QRCode 
                      value={`${window.location.origin}/emergencia/${sosCard.id}`} 
                      size={160}
                      level="H"
                      className="relative z-10"
                    />
                  ) : (
                    <div className="w-[160px] h-[160px] bg-slate-50 flex items-center justify-center text-slate-300 italic text-[10px] text-center px-4">
                      {t('sos.qrPending')}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-brand-primary/5 rounded-3xl -m-2 -z-0" />
                </div>

                {sosCard?.id && (
                  <button 
                    onClick={handleDownloadQR}
                    className="mt-4 flex items-center space-x-2 text-[10px] font-black text-brand-primary uppercase tracking-widest hover:opacity-70 transition-opacity print:hidden"
                  >
                    <Download size={12} />
                    <span>{t('sos.downloadQR')}</span>
                  </button>
                )}

                <div className="mt-8 text-center">
                  <div className="flex flex-col items-center justify-center mb-2">
                    <div className="flex items-center space-x-1 mb-1">
                      <ShieldAlert size={12} className="text-brand-primary" />
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('sos.officialIdLabel')}</span>
                    </div>
                    <p className="text-sm font-black text-slate-900 font-mono tracking-tighter">
                      {sosCard?.officialId || t('sos.processing')}
                    </p>
                  </div>
                  <p className="text-[7px] text-slate-300 font-mono opacity-50">REF: {sosCard?.id?.toUpperCase()}</p>
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="bg-slate-50 border-t border-slate-100 p-4 text-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                {t('sos.crisisNotice')}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4 print:hidden">
            <p className="text-slate-400 text-sm italic">
              {t('sos.presentationNotice')}
            </p>
            <div className="flex space-x-4">
              <button onClick={() => setIsEditing(true)} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">
                {t('sos.edit')}
              </button>
              {onNavigate && (
                <button 
                  onClick={() => onNavigate('settings')} 
                  className="px-6 py-2 text-sky-600 font-bold hover:bg-sky-50 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Edit2 size={16} />
                  {t('nav.profile')}
                </button>
              )}
              <button onClick={handlePrint} className="px-8 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
                {t('sos.print')}
              </button>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            @media print {
              body * {
                visibility: hidden;
              }
              .print\\:hidden {
                display: none !important;
              }
              .max-w-2xl {
                visibility: visible;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 100%;
                max-width: 800px;
              }
              .max-w-2xl * {
                visibility: visible;
              }
              @page {
                size: landscape;
                margin: 0;
              }
            }
          `}} />
        </motion.div>
      ) : null}
    </div>
  );
};

export default SosPage;
