import React, { useState } from 'react';
import { auth, googleProvider, db } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, LogIn, UserPlus, Chrome, AlertCircle, X } from 'lucide-react';

interface AuthFormProps {
  onSuccess: () => void;
  onClose: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const isAdmin = user.email === 'fabiopalacioschwingel@gmail.com';
        
        if (isAdmin) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.role !== 'admin' || !data.isVip) {
              await setDoc(doc(db, 'users', user.uid), {
                ...data,
                role: 'admin',
                isVip: true
              });
            }
          }
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await updateProfile(user, { displayName: name });
        
        const isAdmin = user.email === 'fabiopalacioschwingel@gmail.com';
        
        // Create user profile in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: name,
          isVip: isAdmin,
          createdAt: new Date(),
          role: isAdmin ? 'admin' : 'parent'
        });
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Ocorreu um erro na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const isAdmin = user.email === 'fabiopalacioschwingel@gmail.com';
      
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          isVip: isAdmin,
          createdAt: new Date(),
          role: isAdmin ? 'admin' : 'parent'
        });
      } else if (isAdmin) {
        // Ensure admin fields are set if they login and already exist but missing fields
        const data = userDoc.data();
        if (data.role !== 'admin' || !data.isVip) {
          await setDoc(doc(db, 'users', user.uid), {
            ...data,
            role: 'admin',
            isVip: true
          });
        }
      }
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao entrar com Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">
              {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
            </h2>
            <p className="text-slate-500">
              {isLogin ? 'Acesse sua rede de apoio' : 'Junte-se à nossa comunidade'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start space-x-3 text-red-600 text-sm"
              >
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Nome completo"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="email"
                placeholder="E-mail"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="password"
                placeholder="Senha"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold flex items-center justify-center space-x-2 hover:bg-slate-800 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                  <span>{isLogin ? 'Entrar' : 'Cadastrar'}</span>
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-400">ou continue com</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-semibold flex items-center justify-center space-x-3 hover:bg-slate-50 transition-all"
          >
            <Chrome size={20} className="text-brand-primary" />
            <span>Google</span>
          </button>

          <p className="mt-8 text-center text-slate-500">
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 font-bold text-brand-primary hover:underline"
            >
              {isLogin ? 'Cadastre-se' : 'Faça login'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthForm;
