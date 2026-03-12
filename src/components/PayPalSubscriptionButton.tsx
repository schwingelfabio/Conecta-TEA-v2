import React, { useState } from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useTranslation } from 'react-i18next';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface PayPalSubscriptionButtonProps {
  planId: string;
  planType: 'monthly' | 'annual';
  shape: 'pill' | 'rect';
  onSuccess?: () => void;
}

export default function PayPalSubscriptionButton({ planId, planType, shape, onSuccess }: PayPalSubscriptionButtonProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="w-full mt-4">
      {error && (
        <div className="text-red-500 text-sm mb-2 text-center">
          {error}
        </div>
      )}
      <PayPalButtons
        style={{
          shape: shape,
          color: 'blue',
          layout: 'vertical',
          label: 'subscribe',
        }}
        createSubscription={(data, actions) => {
          const user = auth.currentUser;
          if (!user) {
            setError(t('vip.loginToSubscribe'));
            return Promise.reject('Not logged in');
          }
          return actions.subscription.create({
            plan_id: planId,
          });
        }}
        onApprove={async (data, actions) => {
          try {
            const user = auth.currentUser;
            if (!user) return;

            // Save subscription info to Firestore
            await setDoc(doc(db, 'users', user.uid), {
              paypalSubscriptionId: data.subscriptionID,
              vipPlan: planType,
              vipProvider: 'paypal',
              vipStatus: 'active',
              createdAt: new Date().toISOString()
            }, { merge: true });

            alert(t('vip.subscriptionSuccess'));
            if (onSuccess) onSuccess();
          } catch (err) {
            console.error('Error saving subscription:', err);
            setError('Error saving subscription details.');
          }
        }}
        onError={(err) => {
          console.error('PayPal Error:', err);
          setError('PayPal encountered an error. Please try again.');
        }}
      />
    </div>
  );
}
