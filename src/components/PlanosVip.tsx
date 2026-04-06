import React from 'react';
import { Crown, Check, Heart, Zap } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useTranslation } from 'react-i18next';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import PayPalSubscriptionButton from './PayPalSubscriptionButton';
import { analytics } from '../services/logger';

const PAYPAL_CLIENT_ID = "ASX2fdt9OoW_vzYFtOU18lrGbkLSsR_mIxrVB2tjswOG7W5ZayY9Df39wW-TVGNo0jQia67yGMPgq4uf";

export default function PlanosVip({ isVip }: { isVip?: boolean }) {
  const { t, i18n } = useTranslation();
  const currency = i18n.language === 'en' ? 'USD $' : i18n.language === 'es' ? 'EUR €' : 'R$';
  const priceMonthly = i18n.language === 'en' ? '3.99' : i18n.language === 'es' ? '3.49' : '19,90';
  const priceAnnual = i18n.language === 'en' ? '39.99' : i18n.language === 'es' ? '34.99' : '199,00';

  const handleCheckout = (url: string, planType: 'monthly' | 'annual') => {
    if (planType === 'monthly') {
      analytics.trackEvent('vip_monthly_click');
    } else {
      analytics.trackEvent('vip_annual_click');
    }

    const user = auth.currentUser;
    if (!user) {
      alert(t('vip.loginToSubscribe'));
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, components: "buttons", intent: "subscription", vault: true }}>
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
            <Crown className="text-amber-500" size={32} />
            {t('vip.title')}
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {t('vip.supportText')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-sky-100 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col">
            <h3 className="text-xl font-bold mb-2">{t('vip.monthlyPlan')}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-gray-900">{currency} {priceMonthly}</span>
              <span className="text-gray-500">{t('vip.perMonth')}</span>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center gap-3 text-gray-700">
                <Check className="text-green-500" size={20} />
                {t('vip.vipBadge')}
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <Check className="text-green-500" size={20} />
                {t('vip.exclusiveVideos')}
              </li>
            </ul>

            <button
              onClick={() => handleCheckout('https://pag.ae/81AiqTpHL', 'monthly')}
              disabled={isVip}
              className={`w-full font-bold py-4 rounded-2xl transition-all shadow-md active:scale-95 mb-4 ${
                isVip
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-sky-500 hover:bg-sky-600 text-white'
              }`}
            >
              {isVip ? t('vip.activePlan') : t('vip.subscribeMonthly')}
            </button>

            {!isVip && (
              <div className="mt-2 border-t border-gray-100 pt-4">
                <p className="text-xs text-center text-gray-500 mb-2 font-medium uppercase tracking-wider">{t('vip.internationalPayment')}</p>
                <PayPalSubscriptionButton 
                  planId="P-0K872661S76999138NGZQ4WA" 
                  planType="monthly" 
                  shape="pill" 
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-md border-2 border-amber-200 hover:shadow-lg transition-shadow relative overflow-hidden flex flex-col scale-105 z-10">
            <div className="absolute top-0 right-0 bg-amber-500 text-white px-4 py-1 rounded-bl-2xl text-xs font-bold uppercase tracking-wider">
              {t('vip.bestValue')}
            </div>

            <h3 className="text-xl font-bold mb-2">{t('vip.annualPlan')}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-gray-900">{currency} {priceAnnual}</span>
              <span className="text-gray-500">{t('vip.perYear')}</span>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-center gap-3 text-gray-700">
                <Check className="text-green-500" size={20} />
                {t('vip.allMonthlyFeatures')}
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <Check className="text-green-500" size={20} />
                {t('vip.save2Months')}
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <Check className="text-green-500" size={20} />
                {t('vip.earlyAccess')}
              </li>
            </ul>

            <button
              onClick={() => handleCheckout('https://pag.ae/81AirzxhL', 'annual')}
              disabled={isVip}
              className={`w-full font-bold py-4 rounded-2xl transition-all shadow-md active:scale-95 mb-4 ${
                isVip
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              {isVip ? t('vip.activePlan') : t('vip.subscribeAnnual')}
            </button>

            {!isVip && (
              <div className="mt-2 border-t border-gray-100 pt-4">
                <p className="text-xs text-center text-gray-500 mb-2 font-medium uppercase tracking-wider">{t('vip.internationalPayment')}</p>
                <PayPalSubscriptionButton 
                  planId="P-3XH87175TR6744440NGZQ6WY" 
                  planType="annual" 
                  shape="rect" 
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
