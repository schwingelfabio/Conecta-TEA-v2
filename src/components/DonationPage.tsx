import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Heart, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const DonationPage = () => {
  const { i18n } = useTranslation();
  return (
    <div className="min-h-screen bg-sky-50 pb-20">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-80 w-full overflow-hidden"
      >
        <img
          src="https://picsum.photos/seed/victoria/800/600"
          alt="Victória"
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sky-950/80 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl font-bold tracking-tight">Make a Real Difference Today</h1>
          <p className="mt-2 text-sky-100">Support a child with autism and help transform her future</p>
        </div>
      </motion.div>

      {/* Story Block */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        className="px-6 py-8 text-center"
      >
        <p className="text-lg leading-relaxed text-sky-900">
          Victória is the reason behind everything we built. Her journey inspires Conecta TEA and Triagem TEA IA. Every contribution helps continue her development and support other families.
        </p>
      </motion.div>

      {/* Donation Area */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        className="px-6"
      >
        <div className="rounded-2xl bg-white p-6 shadow-xl shadow-sky-100 border border-sky-100">
          {React.createElement('stripe-buy-button', {
            'buy-button-id': "buy_btn_1TGRepJoBWafcL0qbT2pOLpH",
            'publishable-key': "pk_live_51TFiJBJoBWafcL0qGp8gLIvB2t0wN8G4RsIXhxOfQurbrfGJqQmVOrve2bljMVwfLUP17WV1o5xAfNU3UUaiO09M00rjKTixzM"
          } as any)}
          <p className="mt-4 text-center text-sm text-sky-600">Even $5 makes a difference</p>
        </div>
      </motion.div>

      {/* QR Code */}
      {i18n.language === 'en' && (
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 flex flex-col items-center px-6"
        >
          <div className="relative rounded-2xl bg-white p-4 shadow-lg">
            <motion.div 
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-2xl border-2 border-emerald-300 opacity-50" 
            />
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://donate.stripe.com/cNi00k7E59XMdE47L52wU00" 
              alt="QR Code" 
              className="h-32 w-32" 
              referrerPolicy="no-referrer" 
            />
          </div>
          <p className="mt-4 font-medium text-sky-900">Scan to donate instantly</p>
        </motion.div>
      )}

      {/* Trust Section */}
      <div className="mt-12 grid grid-cols-1 gap-4 px-6">
        {[
          { icon: ShieldCheck, text: "Secure payments via Stripe" },
          { icon: Heart, text: "Supporting real families" },
          { icon: Users, text: "100% transparent purpose" },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
            <item.icon className="h-6 w-6 text-emerald-500" />
            <span className="text-sky-900">{item.text}</span>
          </div>
        ))}
      </div>

      {/* Impact Message */}
      <div className="mt-12 px-6 text-center">
        <p className="text-lg font-medium text-sky-900">
          {i18n.language === 'en' ? 'Each contribution helps a family right now.' : i18n.language === 'es' ? 'Cada contribución ayuda a una familia ahora mismo.' : 'Cada contribuição ajuda uma família agora.'}
        </p>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-sky-50/80 backdrop-blur-sm">
        <button 
          onClick={() => window.open(i18n.language === 'en' ? 'https://buy.stripe.com/28E9AU1fH3zobvWfdx2wU01' : 'https://buy.stripe.com/cNi9AU4rT5HwfMc3uP2wU05', '_blank')}
          className="w-full rounded-full bg-sky-600 py-4 font-bold text-white shadow-lg shadow-sky-200 transition-transform active:scale-95"
        >
          {i18n.language === 'en' ? 'Support Now' : 'Apoiar Agora'}
        </button>
      </div>
    </div>
  );
};

export default DonationPage;
