import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp, runTransaction } from 'firebase/firestore';
import { UserProfile, SosCard } from '../types';
import { motion } from 'framer-motion';
import { Activity, Printer, Save, Edit2, Phone, MapPin, AlertTriangle, HeartPulse, ShieldAlert, ShieldCheck, IdCard } from 'lucide-react';
import QRCode from 'react-qr-code';

interface SosPageProps {
  userProfile: UserProfile | null;
  authReady?: boolean;
  onLoginClick?: () => void;
}

const SosPage: React.FC<SosPageProps> = ({ userProfile, authReady, onLoginClick }) => {
  const [sosCard, setSosCard] = useState<SosCard | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        setError("Ocorreu um erro ao carregar os dados. Tente novamente mais tarde.");
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
    } catch (error) {
      console.error("[CARD] save failure:", error);
      console.error("[ID] save failure:", error);
      alert("Erro ao salvar a carteirinha. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
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
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Acesso Restrito</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          Você precisa fazer login para acessar a Carteirinha Digital.
        </p>
        <button 
          onClick={onLoginClick}
          className="px-8 py-4 bg-brand-primary text-white rounded-full font-bold hover:bg-brand-secondary transition-all shadow-lg"
        >
          Fazer Login
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
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Erro de Conexão</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center">
            <Activity size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-serif font-bold text-slate-900">Carteirinha Digital</h1>
            <p className="text-slate-500">Identificação e Suporte Conecta TEA</p>
          </div>
        </div>
        <div className="hidden md:flex space-x-3">
          <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
            <Edit2 size={18} />
            <span>Editar</span>
          </button>
          <button onClick={handlePrint} className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 transition-colors">
            <Printer size={18} />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {isEditing ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 print:hidden"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Configurar Carteirinha</h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Dados da Pessoa com TEA</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input required type="text" name="childName" value={formData.childName} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data de Nascimento</label>
                <input required type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cidade</label>
                <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estado (UF)</label>
                <input required type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo Sanguíneo</label>
                <input type="text" name="bloodType" placeholder="Ex: O+" value={formData.bloodType} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alergias / Medicação</label>
                <input type="text" name="allergies" placeholder="Ex: Alergia a dipirona" value={formData.allergies} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Observações de Suporte</label>
                <textarea name="observations" placeholder="Ex: Sensibilidade auditiva, prefere comunicação visual" value={formData.observations} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none min-h-[80px]" />
              </div>

              <div className="space-y-4 md:col-span-2 mt-4">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Dados do Responsável</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Responsável</label>
                <input required type="text" name="responsibleName" value={formData.responsibleName} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp de Emergência</label>
                <input required type="tel" name="contact1Phone" placeholder="(00) 00000-0000" value={formData.contact1Phone} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Nota de Emergência (Exibida no QR Code)</label>
                <textarea name="emergencyNote" placeholder="Ex: Em caso de crise, por favor fale com calma e não toque sem permissão." value={formData.emergencyNote} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none min-h-[80px]" />
              </div>

              <div className="space-y-4 md:col-span-2 mt-4">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Contatos Adicionais e Endereço</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contato Secundário (Nome)</label>
                <input type="text" name="contact2Name" value={formData.contact2Name} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contato Secundário (Telefone)</label>
                <input type="tel" name="contact2Phone" placeholder="(00) 00000-0000" value={formData.contact2Phone} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Endereço Residencial</label>
                <input type="text" name="homeAddress" value={formData.homeAddress} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 outline-none" />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-slate-100">
              {sosCard && (
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors">
                  Cancelar
                </button>
              )}
              <button type="submit" disabled={saving} className="px-8 py-3 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-secondary transition-colors flex items-center space-x-2 disabled:opacity-50">
                <Save size={20} />
                <span>{saving ? 'Salvando...' : 'Salvar Carteirinha'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
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
                  <p className="text-white/80 text-xs font-bold uppercase tracking-widest mt-1">Carteirinha Digital</p>
                </div>
              </div>
              <div className="text-right">
                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Identificação Oficial
                </span>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Column: Data */}
              <div className="md:col-span-8 space-y-6">
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nome do Portador</h3>
                  <p className="text-3xl font-black text-slate-900 leading-tight">{sosCard?.childName}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nascimento</h3>
                    <p className="text-lg font-bold text-slate-800">
                      {sosCard?.birthDate ? new Date(sosCard.birthDate).toLocaleDateString('pt-BR') : '-'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tipo Sanguíneo</h3>
                    <p className="text-lg font-bold text-brand-primary">{sosCard?.bloodType || 'N/I'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cidade / UF</h3>
                    <p className="text-lg font-bold text-slate-800">{sosCard?.city} / {sosCard?.state}</p>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Responsável</h3>
                    <p className="text-lg font-bold text-slate-800">{sosCard?.responsibleName}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center space-x-2 mb-2 text-slate-400">
                    <AlertTriangle size={14} />
                    <h3 className="text-[10px] font-black uppercase tracking-widest">Observações de Suporte</h3>
                  </div>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    {sosCard?.observations || 'Nenhuma observação cadastrada.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Contato de Emergência</h3>
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
                  <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest mb-1">Suporte Imediato</p>
                  <p className="text-[9px] text-slate-400 leading-tight">Escaneie para ver instruções de abordagem em crise</p>
                </div>
                
                <div className="bg-white p-4 rounded-3xl shadow-lg border border-slate-100 relative group">
                  <QRCode 
                    value={`${window.location.origin}/emergencia/${sosCard?.id}`} 
                    size={160}
                    level="H"
                    className="relative z-10"
                  />
                  <div className="absolute inset-0 bg-brand-primary/5 rounded-3xl -m-2 -z-0" />
                </div>

                <div className="mt-8 text-center">
                  <div className="flex flex-col items-center justify-center mb-2">
                    <div className="flex items-center space-x-1 mb-1">
                      <ShieldAlert size={12} className="text-brand-primary" />
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">ID Oficial Conecta TEA</span>
                    </div>
                    <p className="text-sm font-black text-slate-900 font-mono tracking-tighter">
                      {sosCard?.officialId || 'PROCESSANDO...'}
                    </p>
                  </div>
                  <p className="text-[7px] text-slate-300 font-mono opacity-50">REF: {sosCard?.id?.toUpperCase()}</p>
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="bg-slate-50 border-t border-slate-100 p-4 text-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Em caso de crise: Mantenha a calma, evite toques bruscos e barulhos excessivos.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4 print:hidden">
            <p className="text-slate-400 text-sm italic">
              Esta carteirinha pode ser apresentada em escolas, hospitais e órgãos públicos.
            </p>
            <div className="flex space-x-4">
              <button onClick={() => setIsEditing(true)} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">
                Editar Dados
              </button>
              <button onClick={handlePrint} className="px-8 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">
                Imprimir Carteirinha
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
      )}
    </div>
  );
};

export default SosPage;
