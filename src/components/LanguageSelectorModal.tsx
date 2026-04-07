import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LanguageSelectorModal({ onClose }: { onClose: () => void }) {
  const { i18n } = useTranslation();
  const languages = [
    { code: 'pt', name: 'Português' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Globe className="text-sky-500" /> Selecionar Idioma
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
        </div>
        <div className="space-y-2">
          {languages.map((lng) => (
            <button
              key={lng.code}
              onClick={() => changeLanguage(lng.code)}
              className={`w-full p-4 rounded-xl text-left font-semibold transition-all ${i18n.language === lng.code ? 'bg-sky-100 text-sky-700' : 'hover:bg-gray-50 text-slate-700'}`}
            >
              {lng.name}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
