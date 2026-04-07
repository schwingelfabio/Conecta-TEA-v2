import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function EmotionalOverlay({ onComplete }: { onComplete: () => void }) {
  const { i18n } = useTranslation();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500); // Wait for fade-out
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const messages: Record<string, string> = {
    pt: "Você não está sozinho(a). 💙\nMilhares de famílias estão passando por isso agora.",
    en: "You are not alone. 💙\nThousands of families are going through this right now.",
    es: "No estás solo(a). 💙\nMiles de familias están pasando por esto ahora."
  };

  const lang = (i18n.language || 'pt').split('-')[0] as 'pt' | 'en' | 'es';
  const message = messages[lang] || messages.pt;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-md p-8 text-center"
        >
          <div className="max-w-md">
            <p className="text-3xl font-black text-slate-900 leading-tight whitespace-pre-line">
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
