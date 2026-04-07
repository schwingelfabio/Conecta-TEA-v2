import React from 'react';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function FloatingSupportButton({ onClick }: { onClick: () => void }) {
  const { i18n } = useTranslation();
  
  const labels: Record<string, string> = {
    pt: "💙 Apoiar famílias",
    en: "💙 Support families",
    es: "💙 Apoyar familias"
  };

  const lang = (i18n.language || 'pt').split('-')[0] as 'pt' | 'en' | 'es';
  const label = labels[lang] || labels.pt;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-6 py-3 bg-sky-500 text-white rounded-full font-bold shadow-lg shadow-sky-500/30 hover:bg-sky-600 transition-all active:scale-95"
    >
      <Heart size={20} className="fill-white" />
      {label}
    </button>
  );
}
