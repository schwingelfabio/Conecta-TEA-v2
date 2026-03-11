import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { SosCard } from '../types';
import { motion } from 'framer-motion';
import { AlertTriangle, Phone, MapPin, HeartPulse, ShieldAlert, FileText } from 'lucide-react';

interface EmergencyPageProps {
  id: string;
}

const EmergencyPage: React.FC<EmergencyPageProps> = ({ id }) => {
  const [sosCard, setSosCard] = useState<SosCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSosCard = async () => {
      try {
        const docRef = doc(db, 'sos_cards', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setSosCard({ id: docSnap.id, ...docSnap.data() } as SosCard);
        } else {
          setError('Carteirinha não encontrada. Verifique se o QR Code ou link está correto.');
        }
      } catch (err) {
        console.error("Error fetching SOS card:", err);
        setError('Erro ao carregar os dados. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSosCard();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-red-600 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-red-400 border-t-white rounded-full animate-spin mb-6" />
        <p className="text-white font-bold text-xl tracking-widest uppercase animate-pulse">Carregando Alerta...</p>
      </div>
    );
  }

  if (error || !sosCard) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
        <ShieldAlert size={64} className="text-red-500 mb-6" />
        <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-wider">Erro</h1>
        <p className="text-slate-400 max-w-md">{error}</p>
      </div>
    );
  }

  const formatWhatsAppLink = (phone: string) => {
    const numericPhone = phone.replace(/\D/g, '');
    return `https://wa.me/55${numericPhone}`;
  };

  return (
    <div className="min-h-screen bg-red-600 font-sans">
      {/* Header Alerta */}
      <div className="bg-red-700 text-white p-8 text-center shadow-lg relative overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
        >
          <HeartPulse size={200} />
        </motion.div>
        
        <div className="relative z-10">
          <AlertTriangle size={48} className="mx-auto mb-4 text-yellow-400" />
          <h1 className="text-4xl md:text-6xl font-black tracking-widest uppercase mb-2">Alerta Médico</h1>
          <p className="text-xl md:text-2xl font-bold text-red-200 uppercase tracking-widest">Emergência</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-6">
        {/* Dados da Criança */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl"
        >
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Nome da Criança</h2>
          <p className="text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">{sosCard.childName}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Nascimento</h3>
              <p className="text-xl font-bold text-slate-800">
                {sosCard.birthDate ? new Date(sosCard.birthDate).toLocaleDateString('pt-BR') : '-'}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
              <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Tipo Sanguíneo</h3>
              <p className="text-3xl font-black text-red-600">{sosCard.bloodType || 'N/I'}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-amber-50 p-6 rounded-2xl border-l-4 border-amber-500">
              <div className="flex items-center space-x-3 mb-3 text-amber-700">
                <AlertTriangle size={24} />
                <h3 className="font-black uppercase tracking-widest text-lg">Alergias / Medicação</h3>
              </div>
              <p className="text-xl font-bold text-slate-800 leading-relaxed">
                {sosCard.allergies || 'Nenhuma informada'}
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-500">
              <div className="flex items-center space-x-3 mb-3 text-blue-700">
                <FileText size={24} />
                <h3 className="font-black uppercase tracking-widest text-lg">Observações Importantes</h3>
              </div>
              <p className="text-xl font-bold text-slate-800 leading-relaxed">
                {sosCard.observations || 'Nenhuma observação'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Contatos */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl"
        >
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center space-x-3">
            <Phone className="text-green-500" size={28} />
            <span>Ligar Agora</span>
          </h2>

          <div className="space-y-4">
            <a 
              href={`tel:${sosCard.contact1Phone.replace(/\D/g, '')}`}
              className="flex items-center justify-between bg-green-50 hover:bg-green-100 p-4 md:p-6 rounded-2xl border border-green-200 transition-colors group"
            >
              <div>
                <p className="text-sm font-bold text-green-600 uppercase tracking-wider mb-1">Responsável 1</p>
                <p className="text-2xl font-black text-slate-900">{sosCard.contact1Name}</p>
                <p className="text-lg font-bold text-slate-600">{sosCard.contact1Phone}</p>
              </div>
              <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Phone size={32} />
              </div>
            </a>

            {sosCard.contact2Name && (
              <a 
                href={`tel:${sosCard.contact2Phone.replace(/\D/g, '')}`}
                className="flex items-center justify-between bg-green-50 hover:bg-green-100 p-4 md:p-6 rounded-2xl border border-green-200 transition-colors group"
              >
                <div>
                  <p className="text-sm font-bold text-green-600 uppercase tracking-wider mb-1">Responsável 2</p>
                  <p className="text-2xl font-black text-slate-900">{sosCard.contact2Name}</p>
                  <p className="text-lg font-bold text-slate-600">{sosCard.contact2Phone}</p>
                </div>
                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Phone size={32} />
                </div>
              </a>
            )}
          </div>
        </motion.div>

        {/* Endereços */}
        {(sosCard.homeAddress || sosCard.workAddress) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl"
          >
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center space-x-3">
              <MapPin className="text-slate-400" size={28} />
              <span>Endereços</span>
            </h2>

            <div className="space-y-6">
              {sosCard.homeAddress && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Residência</h3>
                  <p className="text-lg font-bold text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {sosCard.homeAddress}
                  </p>
                </div>
              )}
              {sosCard.workAddress && (
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Trabalho</h3>
                  <p className="text-lg font-bold text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {sosCard.workAddress}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EmergencyPage;
