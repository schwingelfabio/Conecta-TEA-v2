import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { UserProfile, SosCard } from '../types';
import { motion } from 'framer-motion';
import { Activity, Printer, Save, Edit2, Phone, MapPin, AlertTriangle, HeartPulse } from 'lucide-react';
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
    workAddress: ''
  });

  useEffect(() => {
    console.log('[SOS] authReady:', authReady, '[SOS] userProfile:', !!userProfile);
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
          console.log('[SOS] Card found:', data.id);
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
            workAddress: data.workAddress || ''
          });
        } else {
          console.log('[SOS] No card found, entering edit mode');
          setIsEditing(true);
        }
      } catch (err) {
        console.error("Error fetching SOS card:", err);
        setError("Ocorreu um erro de rede ao carregar os dados. Tente novamente mais tarde.");
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
    setSaving(true);

    try {
      if (sosCard?.id) {
        // Update
        const cardRef = doc(db, 'sos_cards', sosCard.id);
        await updateDoc(cardRef, { ...formData });
        setSosCard({ ...sosCard, ...formData });
      } else {
        // Create
        const newCard = {
          userId: userProfile.uid,
          ...formData,
          createdAt: serverTimestamp()
        };
        const docRef = await addDoc(collection(db, 'sos_cards'), newCard);
        setSosCard({ id: docRef.id, ...newCard } as SosCard);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving SOS card:", error);
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
        <div className="w-10 h-10 border-4 border-slate-200 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!userProfile) {
    console.log('[SosPage] Rendering restricted access (no profile)');
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={48} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Acesso Restrito</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          Você precisa fazer login para acessar a Carteirinha SOS.
        </p>
        <button 
          onClick={onLoginClick}
          className="px-8 py-4 bg-red-500 text-white rounded-full font-bold hover:bg-red-600 transition-all shadow-lg"
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
      <div className="flex items-center space-x-4 mb-8 print:hidden">
        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center">
          <Activity size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">SOS Sensorial</h1>
          <p className="text-slate-500">Carteirinha de Identificação e Emergência</p>
        </div>
      </div>

      {isEditing ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 print:hidden"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Preencher Dados da Carteirinha</h2>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Dados da Criança</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input required type="text" name="childName" value={formData.childName} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data de Nascimento</label>
                <input required type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo Sanguíneo</label>
                <input type="text" name="bloodType" placeholder="Ex: O+" value={formData.bloodType} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alergias / Medicação Contínua</label>
                <input type="text" name="allergies" placeholder="Ex: Alergia a dipirona, uso de Risperidona" value={formData.allergies} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Observações Importantes</label>
                <textarea name="observations" placeholder="Ex: Não verbal, sensibilidade auditiva, não gosta de toque físico" value={formData.observations} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 outline-none min-h-[100px]" />
              </div>

              <div className="space-y-4 md:col-span-2 mt-4">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Contatos de Emergência</h3>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Responsável 1 (Nome)</label>
                <input required type="text" name="contact1Name" value={formData.contact1Name} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Responsável 1 (WhatsApp)</label>
                <input required type="tel" name="contact1Phone" placeholder="(00) 00000-0000" value={formData.contact1Phone} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Responsável 2 (Nome)</label>
                <input type="text" name="contact2Name" value={formData.contact2Name} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Responsável 2 (WhatsApp)</label>
                <input type="tel" name="contact2Phone" placeholder="(00) 00000-0000" value={formData.contact2Phone} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 outline-none" />
              </div>

              <div className="space-y-4 md:col-span-2 mt-4">
                <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Endereços</h3>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Endereço Residencial</label>
                <input type="text" name="homeAddress" value={formData.homeAddress} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Endereço do Trabalho (Opcional)</label>
                <input type="text" name="workAddress" value={formData.workAddress} onChange={handleInputChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500/20 outline-none" />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-slate-100">
              {sosCard && (
                <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors">
                  Cancelar
                </button>
              )}
              <button type="submit" disabled={saving} className="px-8 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors flex items-center space-x-2 disabled:opacity-50">
                <Save size={20} />
                <span>{saving ? 'Salvando...' : 'Salvar Carteirinha'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="flex justify-between items-center print:hidden">
            <button onClick={() => setIsEditing(true)} className="flex items-center space-x-2 text-slate-600 hover:text-brand-primary font-medium transition-colors">
              <Edit2 size={18} />
              <span>Editar Dados</span>
            </button>
            <button onClick={handlePrint} className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-2 rounded-full font-bold hover:bg-slate-800 transition-colors">
              <Printer size={18} />
              <span>Imprimir / Salvar PDF</span>
            </button>
          </div>

          {/* Carteirinha Visual */}
          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-red-100 print:shadow-none print:border-2 print:border-black print:m-0">
            {/* Header */}
            <div className="bg-red-500 text-white p-6 text-center relative">
              <div className="absolute top-4 left-4 opacity-20">
                <HeartPulse size={64} />
              </div>
              <h2 className="text-3xl font-black tracking-wider uppercase mb-1 relative z-10">Alerta Médico</h2>
              <p className="text-red-100 font-medium tracking-widest uppercase text-sm relative z-10">Carteirinha de Identificação TEA</p>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column: Data */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nome da Criança</h3>
                  <p className="text-2xl font-bold text-slate-900">{sosCard?.childName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nascimento</h3>
                    <p className="text-lg font-semibold text-slate-800">
                      {sosCard?.birthDate ? new Date(sosCard.birthDate).toLocaleDateString('pt-BR') : '-'}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tipo Sanguíneo</h3>
                    <p className="text-lg font-semibold text-red-500">{sosCard?.bloodType || 'Não informado'}</p>
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                  <div className="flex items-center space-x-2 mb-2 text-red-600">
                    <AlertTriangle size={18} />
                    <h3 className="font-bold uppercase tracking-wider text-sm">Alergias / Medicação</h3>
                  </div>
                  <p className="text-slate-800 font-medium">{sosCard?.allergies || 'Nenhuma informada'}</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Observações Importantes</h3>
                  <p className="text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {sosCard?.observations || 'Nenhuma observação'}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Contatos de Emergência</h3>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{sosCard?.contact1Name}</p>
                      <p className="text-sm text-slate-600">{sosCard?.contact1Phone}</p>
                    </div>
                  </div>
                  {sosCard?.contact2Name && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{sosCard?.contact2Name}</p>
                        <p className="text-sm text-slate-600">{sosCard?.contact2Phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: QR Code */}
              <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-6">
                <div className="text-center mb-4">
                  <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Em caso de emergência</p>
                  <p className="text-[10px] text-slate-500 leading-tight">Conecta TEA: Escaneie este QR code se for emergência.</p>
                </div>
                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-200">
                  <QRCode 
                    value={`${window.location.origin}/emergencia/${sosCard?.id}`} 
                    size={140}
                    level="H"
                  />
                </div>
                <p className="text-[9px] text-slate-400 mt-4 text-center">
                  ID: {sosCard?.id}
                </p>
              </div>
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
                left: 0;
                top: 0;
                width: 100%;
              }
              .max-w-2xl * {
                visibility: visible;
              }
            }
          `}} />
        </motion.div>
      )}
    </div>
  );
};

export default SosPage;
