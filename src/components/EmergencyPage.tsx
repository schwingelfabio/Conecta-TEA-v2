import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { SosCard } from '../types';
import { motion } from 'framer-motion';
import { AlertTriangle, Phone, MapPin, HeartPulse, ShieldAlert, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface EmergencyPageProps {
  id: string;
}

const EmergencyPage: React.FC<EmergencyPageProps> = ({ id }) => {
  const { t, i18n } = useTranslation();
  const [sosCard, setSosCard] = useState<SosCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[EMERGENCY] page load start, id:', id);
    const fetchSosCard = async () => {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout fetching SOS card')), 5000)
      );
      try {
        const docRef = doc(db, 'sos_cards', id);
        const docSnap = await Promise.race([getDoc(docRef), timeoutPromise]) as any;

        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as SosCard;
          console.log('[EMERGENCY] card found:', data.id);
          setSosCard(data);
        } else {
          console.log('[EMERGENCY] card not found');
          setError(t('emergency.errorDescription'));
        }
      } catch (err) {
        console.error("[EMERGENCY] load failure:", err);
        setError(t('emergency.loadError'));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSosCard();
    }
  }, [id, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mb-6" />
        <p className="text-slate-400 font-bold text-sm tracking-widest uppercase animate-pulse">{t('emergency.loading')}</p>
      </div>
    );
  }

  if (error || !sosCard) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
        <ShieldAlert size={64} className="text-red-500 mb-6" />
        <h1 className="text-3xl font-black text-white mb-4 uppercase tracking-wider">{t('emergency.errorTitle')}</h1>
        <p className="text-slate-400 max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Header Informativo */}
      <div className="bg-white border-b border-slate-200 p-6 text-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-brand-primary text-white rounded-xl flex items-center justify-center">
            <HeartPulse size={24} />
          </div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Conecta TEA</h1>
        </div>
        <p className="text-[10px] font-black text-brand-primary uppercase tracking-widest">{t('emergency.protocol')}</p>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6 mt-4">
        {/* Alerta de Abordagem */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-brand-primary text-white rounded-[2rem] p-8 shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -m-4 opacity-10">
            <ShieldAlert size={160} />
          </div>
          <div className="relative z-10">
            <h2 className="text-sm font-black uppercase tracking-widest mb-4 opacity-80">{t('emergency.attention')}</h2>
            <p className="text-3xl font-black leading-tight mb-6">
              {t('emergency.teaStatement')}
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <div className="mt-1"><ShieldAlert size={18} /></div>
                <p className="text-sm font-bold leading-relaxed">
                  {t('emergency.crisisAdvice')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Nota de Emergência Personalizada */}
        {sosCard.emergencyNote && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-amber-50 border-2 border-amber-200 rounded-[2rem] p-8"
          >
            <h3 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-3">{t('emergency.specificInstruction')}</h3>
            <p className="text-xl font-bold text-amber-900 leading-relaxed italic">
              "{sosCard.emergencyNote}"
            </p>
          </motion.div>
        )}

        {/* Dados de Identificação */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100"
        >
          <div className="mb-8">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('sos.labels.childName')}</h2>
            <p className="text-3xl font-black text-slate-900">{sosCard.childName}</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('sos.labels.birthDate')}</h3>
              <p className="text-lg font-bold text-slate-800">
                {sosCard.birthDate ? new Date(sosCard.birthDate).toLocaleDateString(i18n.language === 'pt' ? 'pt-BR' : i18n.language === 'es' ? 'es-ES' : 'en-US') : '-'}
              </p>
            </div>
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('sos.labels.bloodType')}</h3>
              <p className="text-lg font-bold text-brand-primary">{sosCard.bloodType || t('sos.notInformed')}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('sos.labels.observations')}</h3>
              <p className="text-base font-bold text-slate-700 leading-relaxed">
                {sosCard.observations || t('emergency.noObservations')}
              </p>
            </div>

            {sosCard.allergies && (
              <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                <h3 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">{t('emergency.allergiesMedication')}</h3>
                <p className="text-base font-bold text-red-900 leading-relaxed">
                  {sosCard.allergies}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Contatos de Emergência */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100"
        >
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center space-x-3">
            <Phone className="text-brand-primary" size={24} />
            <span>{t('emergency.contactsTitle')}</span>
          </h2>

          <div className="space-y-4">
            <a 
              href={`tel:${sosCard.contact1Phone.replace(/\D/g, '')}`}
              className="flex items-center justify-between bg-slate-50 hover:bg-slate-100 p-6 rounded-2xl border border-slate-200 transition-all group"
            >
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('sos.labels.responsible')}</p>
                <p className="text-xl font-black text-slate-900">{sosCard.responsibleName || sosCard.contact1Name}</p>
                <p className="text-lg font-bold text-brand-primary">{sosCard.contact1Phone}</p>
              </div>
              <div className="w-14 h-14 bg-brand-primary text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Phone size={24} />
              </div>
            </a>

            {sosCard.contact2Name && (
              <a 
                href={`tel:${sosCard.contact2Phone.replace(/\D/g, '')}`}
                className="flex items-center justify-between bg-slate-50 hover:bg-slate-100 p-6 rounded-2xl border border-slate-200 transition-all group"
              >
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('sos.fields.contact2Name')}</p>
                  <p className="text-xl font-black text-slate-900">{sosCard.contact2Name}</p>
                  <p className="text-lg font-bold text-brand-primary">{sosCard.contact2Phone}</p>
                </div>
                <div className="w-14 h-14 bg-brand-primary text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Phone size={24} />
                </div>
              </a>
            )}
          </div>
        </motion.div>

        {/* Localização */}
        {(sosCard.city || sosCard.state || sosCard.homeAddress) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100"
          >
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center space-x-3">
              <MapPin className="text-slate-400" size={24} />
              <span>{t('emergency.locationTitle')}</span>
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('sos.labels.cityState')}</h3>
                <p className="text-lg font-bold text-slate-800">{sosCard.city} / {sosCard.state}</p>
              </div>
              {sosCard.homeAddress && (
                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('sos.fields.homeAddress')}</h3>
                  <p className="text-base font-bold text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {sosCard.homeAddress}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        <div className="text-center pt-8">
          <div className="flex flex-col items-center justify-center mb-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              {t('sos.officialIdLabel')}
            </p>
            <p className="text-xl font-black text-slate-900 font-mono">
              {sosCard.officialId || '---'}
            </p>
          </div>
          <p className="text-[7px] text-slate-300 font-mono mt-1 opacity-50">REF: {sosCard.id?.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;
