import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Loader2 } from 'lucide-react';
import { auth, googleProvider } from '../lib/firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { useTranslation } from 'react-i18next';

interface AuthFormProps {
  onSuccess: () => void;
}

function getFriendlyErrorMessage(err: any, t: any): string {
  const code = err?.code || '';

  switch (code) {
    case 'auth/popup-closed-by-user':
      return t('auth.errors.popupClosed');
    case 'auth/popup-blocked':
      return t('auth.errors.popupBlocked');
    case 'auth/invalid-email':
      return t('auth.errors.invalidEmail');
    case 'auth/user-not-found':
      return t('auth.errors.userNotFound');
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return t('auth.errors.wrongPassword');
    case 'auth/email-already-in-use':
      return t('auth.errors.emailAlreadyInUse');
    case 'auth/weak-password':
      return t('auth.errors.weakPassword');
    case 'auth/too-many-requests':
      return t('auth.errors.tooManyRequests');
    case 'auth/missing-phone-number':
      return t('auth.errors.missingPhone');
    case 'auth/invalid-phone-number':
      return t('auth.errors.invalidPhone');
    case 'auth/code-expired':
      return t('auth.errors.codeExpired');
    case 'auth/invalid-verification-code':
      return t('auth.errors.invalidCode');
    default:
      return t('auth.errors.default');
  }
}

export default function AuthForm({ onSuccess }: AuthFormProps) {
  const { t } = useTranslation();
  const [method, setMethod] = useState<'google' | 'email' | 'phone'>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    try {
      // @ts-ignore
      if (!window.recaptchaVerifier) {
        // @ts-ignore
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {}
        });
      }
    } catch (err) {
      console.error('Erro ao inicializar reCAPTCHA:', err);
    }
  }, []);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithPopup(auth, googleProvider);
      onSuccess();
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err, t));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }

      onSuccess();
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err, t));
    } finally {
      setLoading(false);
    }
  };

  const handleSendSMS = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      const formattedPhone = phone.startsWith('+') ? phone : `+55${phone.replace(/\D/g, '')}`;
      // @ts-ignore
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err, t));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;

    try {
      setLoading(true);
      setError(null);
      await confirmationResult.confirm(verificationCode);
      onSuccess();
    } catch (err: any) {
      setError(getFriendlyErrorMessage(err, t));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
        {t('auth.welcome')}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm text-center">
          {error}
        </div>
      )}

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 mb-6 disabled:opacity-50"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="w-6 h-6"
        />
        {loading && method === 'google' ? <Loader2 className="animate-spin" size={18} /> : null}
        {t('auth.google')}
      </button>

      <div className="relative flex items-center py-2 mb-6">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink-0 mx-4 text-gray-400 text-sm font-medium">{t('auth.orContinue')}</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
        <button
          onClick={() => {
            setMethod('phone');
            setConfirmationResult(null);
            setError(null);
          }}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${method === 'phone' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <div className="flex items-center justify-center gap-2">
            <Phone size={16} />
            {t('auth.phone')}
          </div>
        </button>

        <button
          onClick={() => {
            setMethod('email');
            setConfirmationResult(null);
            setError(null);
          }}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${method === 'email' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          <div className="flex items-center justify-center gap-2">
            <Mail size={16} />
            {t('auth.email')}
          </div>
        </button>
      </div>

      {method === 'phone' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {!confirmationResult ? (
            <form onSubmit={handleSendSMS} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.phoneLabel')}
                </label>
                <input
                  type="tel"
                  placeholder={t('auth.phonePlaceholder')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !phone}
                className="w-full bg-sky-500 text-white font-bold py-4 rounded-xl hover:bg-sky-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : t('auth.sendSms')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.codeLabel')}
                </label>
                <input
                  type="text"
                  placeholder={t('auth.codePlaceholder')}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-center tracking-widest text-xl"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || verificationCode.length < 6}
                className="w-full bg-sky-500 text-white font-bold py-4 rounded-xl hover:bg-sky-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : t('auth.verifyCode')}
              </button>
            </form>
          )}
          <div id="recaptcha-container"></div>
        </motion.div>
      )}

      {method === 'email' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.email')}</label>
              <input
                type="email"
                placeholder={t('auth.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.passwordLabel')}</label>
              <input
                type="password"
                placeholder={t('auth.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-sky-500 text-white font-bold py-4 rounded-xl hover:bg-sky-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (isSignUp ? t('auth.createAccount') : t('auth.login'))}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-sky-600 hover:underline font-medium"
              >
                {isSignUp ? t('auth.alreadyHaveAccount') : t('auth.noAccount')}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}
