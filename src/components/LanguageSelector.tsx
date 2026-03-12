import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  return (
    <div className="flex items-center space-x-2 bg-white rounded-full px-3 py-1 border border-slate-200">
      <Globe size={16} className="text-slate-400" />
      <button
        onClick={() => changeLanguage('pt')}
        className={`text-sm font-medium ${i18n.resolvedLanguage === 'pt' ? 'text-brand-primary' : 'text-slate-500'}`}
      >
        PT
      </button>
      <span className="text-slate-300">|</span>
      <button
        onClick={() => changeLanguage('en')}
        className={`text-sm font-medium ${i18n.resolvedLanguage === 'en' ? 'text-brand-primary' : 'text-slate-500'}`}
      >
        EN
      </button>
      <span className="text-slate-300">|</span>
      <button
        onClick={() => changeLanguage('es')}
        className={`text-sm font-medium ${i18n.resolvedLanguage === 'es' ? 'text-brand-primary' : 'text-slate-500'}`}
      >
        ES
      </button>
    </div>
  );
};

export default LanguageSelector;
