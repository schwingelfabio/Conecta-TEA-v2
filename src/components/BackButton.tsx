import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
}

export default function BackButton({ onClick, className = '' }: BackButtonProps) {
  const { t } = useTranslation();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else {
      window.history.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`flex items-center gap-2 text-gray-600 hover:text-sky-600 transition-colors ${className}`}
    >
      <ArrowLeft size={20} />
      <span>{t('common.back')}</span>
    </button>
  );
}
