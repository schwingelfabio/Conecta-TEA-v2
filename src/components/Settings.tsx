import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Shield, LogOut, Mail, Calendar } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

const Settings: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPrivileges = async () => {
      const user = auth.currentUser;
      if (user) {
        const normalizedEmail = user.email?.toLowerCase().trim();
        
        // Verifique admin
        const adminDoc = normalizedEmail ? await getDoc(doc(db, 'admins', normalizedEmail)) : null;
        const isManualAdmin = normalizedEmail === 'fabiopalacioschwingel@gmail.com' || normalizedEmail === 'fabiparadox2@gmail.com';
        const userIsAdmin = adminDoc?.exists() || isManualAdmin;
        
        // Mantenha a verificação de users por uid
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const data = userDoc.data();
        
        setUserData(data);
        setIsAdmin(userIsAdmin || data?.role === 'admin');
      }
      setLoading(false);
    };

    checkPrivileges();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex items-center space-x-4 mb-12">
        <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center">
          <SettingsIcon size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">Configurações</h1>
          <p className="text-slate-500">Gerencie sua conta e preferências</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
          >
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
              <User className="mr-3 text-brand-primary" />
              Perfil
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center font-bold text-xl">
                    {userData?.displayName?.charAt(0) || auth.currentUser?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{userData?.displayName || 'Usuário'}</p>
                    <p className="text-sm text-slate-500 flex items-center">
                      <Mail size={14} className="mr-1" />
                      {auth.currentUser?.email}
                    </p>
                  </div>
                </div>
              </div>

              {isAdmin && (
                <div className="flex items-center p-4 bg-amber-50 border border-amber-100 rounded-2xl text-amber-700">
                  <Shield className="mr-3" size={24} />
                  <div>
                    <p className="font-bold">Privilégios de Administrador</p>
                    <p className="text-sm opacity-80">Você tem acesso total ao sistema.</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
          >
            <h3 className="font-bold text-slate-900 mb-4">Ações da Conta</h3>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-medium transition-colors"
            >
              <LogOut size={18} />
              <span>Sair da Conta</span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
