import React, { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import {
  User,
  Mail,
  Crown,
  LogOut,
  ChevronRight,
  ShieldCheck,
  IdCard,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Settings({
  isAdmin,
  isVip: isVipProp,
  onNavigate
}: {
  isAdmin?: boolean,
  isVip?: boolean,
  onNavigate: (tab: string) => void
}) {
  const [isVip, setIsVip] = useState(isVipProp || isAdmin || false);
  const [loading, setLoading] = useState(isVipProp === undefined && isAdmin === undefined);
  const user = auth.currentUser;

  useEffect(() => {
    if (isVipProp !== undefined || isAdmin !== undefined) {
      setIsVip(Boolean(isVipProp || isAdmin));
      setLoading(false);
      return;
    }

    async function fetchUserStatus() {
      if (!user) {
        setIsVip(false);
        setLoading(false);
        return;
      }

      const normalizedEmail = user.email?.toLowerCase().trim();
      const adminEmails = [
        'fabiopalacioschwingel@gmail.com',
        'fabiparadox2@gmail.com'
      ];

      try {
        if (normalizedEmail && adminEmails.includes(normalizedEmail)) {
          setIsVip(true);
          setLoading(false);
          return;
        }

        if (normalizedEmail) {
          const adminDoc = await getDoc(doc(db, 'admins', normalizedEmail));
          if (adminDoc.exists()) {
            setIsVip(true);
            setLoading(false);
            return;
          }
        }

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setIsVip(Boolean(userDoc.data().isVip));
        } else {
          setIsVip(false);
        }
      } catch (error) {
        console.error('Erro ao buscar status do usuário:', error);
        setIsVip(false);
      } finally {
        setLoading(false);
      }
    }

    fetchUserStatus();
  }, [user, isVipProp, isAdmin]);

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6 pb-24"
    >
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="w-24 h-24 bg-sky-100 rounded-full mx-auto mb-4 border-4 border-white shadow-md overflow-hidden">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sky-500 text-3xl font-bold">
              {user?.displayName?.charAt(0) || 'U'}
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-900">{user?.displayName || 'Usuário'}</h2>

        <p className="text-gray-500 flex items-center justify-center gap-2 mt-1">
          <Mail size={16} />
          {user?.email}
        </p>

        <button className="mt-6 w-full bg-sky-100 hover:bg-sky-200 text-sky-700 font-bold py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2">
          <User size={20} />
          Editar Perfil
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('ciptea')}
          className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:border-sky-200 transition-all group"
        >
          <div className="bg-sky-50 p-4 rounded-2xl text-sky-500 group-hover:scale-110 transition-transform">
            <IdCard size={32} />
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-900">Minha Carteirinha</p>
            <p className="text-xs text-gray-400">CIPTEA Digital</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('diario')}
          className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:border-indigo-200 transition-all group"
        >
          <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-500 group-hover:scale-110 transition-transform">
            <Calendar size={32} />
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-900">Diário de Bordo</p>
            <p className="text-xs text-gray-400">Registro Diário</p>
          </div>
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Crown size={20} className={isVip ? 'text-amber-500' : 'text-gray-400'} />
          Status da Conta
        </h3>

        <div className={`p-4 rounded-2xl flex items-center justify-between ${isVip ? 'bg-amber-50 border border-amber-100' : 'bg-gray-50 border border-gray-100'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isVip ? 'bg-amber-100 text-amber-600' : 'bg-gray-200 text-gray-500'}`}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900">{isVip ? 'Membro VIP' : 'Plano Gratuito'}</p>
              <p className="text-sm text-gray-500">{isVip ? 'Acesso total liberado' : 'Acesso limitado ao feed'}</p>
            </div>
          </div>

          {!isVip && (
            <button className="text-sky-600 font-bold text-sm hover:underline">
              Ver Planos
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Mail size={20} className="text-sky-500" />
          Suporte e Ajuda
        </h3>

        <a
          href="mailto:fabiopalacioschwingel@gmail.com"
          className="w-full bg-sky-50 hover:bg-sky-100 text-sky-700 p-4 rounded-2xl flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="bg-sky-100 p-2 rounded-full">
              <Mail size={24} />
            </div>
            <div className="text-left">
              <p className="font-bold">Suporte Conecta TEA</p>
              <p className="text-sm opacity-80">fabiopalacioschwingel@gmail.com</p>
            </div>
          </div>
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </a>

        <button
          onClick={() => onNavigate('termos')}
          className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 p-4 rounded-2xl flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="bg-gray-200 p-2 rounded-full">
              <ShieldCheck size={24} className="text-gray-600" />
            </div>
            <div className="text-left">
              <p className="font-bold">Termos de Uso e Privacidade</p>
              <p className="text-sm opacity-80">Leia nossos termos</p>
            </div>
          </div>
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="pt-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-5 rounded-3xl flex items-center justify-center gap-3 transition-all active:scale-95 border border-red-100 shadow-sm"
        >
          <LogOut size={24} />
          Sair da Conta
        </button>

        <p className="text-center text-gray-400 text-xs mt-6">
          Conecta TEA v1.0.0 • Feito com carinho para o Brasil
        </p>
      </div>
    </motion.div>
  );
}
