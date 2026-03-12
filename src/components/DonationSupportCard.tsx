import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function DonationSupportCard() {
  const { t, i18n } = useTranslation();

  // Only show in English and Spanish
  if (i18n.language === 'pt' || i18n.language === 'pt-BR') {
    return null;
  }

  const donationUrl = "https://www.paypal.com/donate/?hosted_button_id=QFNBCLB7HH3QE";

  const handleDonate = () => {
    window.open(donationUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-gradient-to-br from-sky-50 to-purple-50 rounded-3xl p-8 shadow-sm border border-sky-100 max-w-4xl mx-auto my-8">
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl mb-4">
            <Heart size={24} className="fill-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {t('donation.title')}
          </h3>
          <p className="text-gray-600 mb-6 text-lg">
            {t('donation.description')}
          </p>
          <button
            onClick={handleDonate}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-md active:scale-95 w-full md:w-auto"
          >
            {t('donation.button')}
          </button>
        </div>
        
        <div className="flex flex-col items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <QRCode value={donationUrl} size={120} className="mb-3" />
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
            {t('donation.scanToDonate')}
          </span>
        </div>
      </div>
    </div>
  );
}
