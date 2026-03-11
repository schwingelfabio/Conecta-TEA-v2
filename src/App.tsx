import React, { useState, useEffect } from 'react';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { UserProfile } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Shield, 
  Settings as SettingsIcon, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Heart,
  Brain,
  Activity,
  Video,
  Lock
} from 'lucide-react';

// Components
import LandingPage from './components/LandingPage';
import AuthForm from './components/AuthForm';
import Feed from './components/Feed';
import PlanosVip from './components/PlanosVip';
import AreaVip from './components/AreaVip';
import SosPage from './components/SosPage';
import EmergencyPage from './components/EmergencyPage';
import AiAssistant from './components/AiAssistant';
import { TermosDeUso, Privacidade, Contato } from './components/LegalPages';

type Page = 'home' | 'feed' | 'vip' | 'settings' | 'sos' | 'log' | 'videos' | 'termos' | 'privacidade' | 'contato';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [emergencyId, setEmergencyId] = useState<string | null>(null);

  useEffect(() => {
    // Check for emergency route
    const path = window.location.pathname;
    if (path.startsWith('/emergencia/')) {
      const id = path.split('/')[2];
      if (id) {
        setEmergencyId(id);
        setLoading(false);
        return;
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Real-time listener for user profile
        const userRef = doc(db, 'users', firebaseUser.uid);
        const unsubProfile = onSnapshot(userRef, async (docSnap) => {
          if (docSnap.exists()) {
            const profileData = docSnap.data() as UserProfile;
            
            // Auto-assign roles based on email
            let needsUpdate = false;
            let updates: any = {};
            
            if (firebaseUser.email === 'fabiopalacioschwingel@gmail.com' && profileData.role !== 'admin') {
              updates.role = 'admin';
              updates.isVip = true;
              needsUpdate = true;
            }
            if (firebaseUser.email === 'fabiparadox2@gmail.com' && !profileData.isVip) {
              updates.isVip = true;
              needsUpdate = true;
            }
            
            if (needsUpdate) {
              await updateDoc(userRef, updates);
            } else {
              setUserProfile(profileData);
            }
          }
        });
        setCurrentPage('feed');
        return () => unsubProfile();
      } else {
        setUserProfile(null);
        setCurrentPage('home');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setIsMenuOpen(false);
  };

  if (emergencyId) {
    return <EmergencyPage id={emergencyId} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-brand-primary rounded-full animate-spin" />
          <p className="text-slate-400 font-serif font-bold text-xl animate-pulse">Conecta TEA</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    if (!user) {
      switch (currentPage) {
        case 'termos': return <TermosDeUso onBack={() => setCurrentPage('home')} />;
        case 'privacidade': return <Privacidade onBack={() => setCurrentPage('home')} />;
        case 'contato': return <Contato onBack={() => setCurrentPage('home')} />;
        default: return <LandingPage onStart={() => setShowAuth(true)} onNavigate={setCurrentPage} />;
      }
    }

    // VIP Protection Wrapper
    const requireVip = (Component: React.ReactNode) => {
      if (userProfile?.isVip || userProfile?.role === 'admin') {
        return Component;
      }
      return (
        <div className="max-w-2xl mx-auto py-20 px-4 text-center">
          <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={48} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">Conteúdo Exclusivo VIP</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            Este recurso é reservado para assinantes VIP. Assine agora para desbloquear acesso total a ferramentas avançadas e conteúdos exclusivos.
          </p>
          <button 
            onClick={() => setCurrentPage('vip')}
            className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg"
          >
            Conhecer Planos VIP
          </button>
        </div>
      );
    };

    switch (currentPage) {
      case 'feed': return <Feed userProfile={userProfile} />;
      case 'vip': return <AreaVip userProfile={userProfile} />;
      case 'sos': return <SosPage userProfile={userProfile} />;
      case 'log': return requireVip(<PlaceholderPage title="Diário de Bordo" icon={<Heart size={48} />} />);
      case 'videos': return requireVip(<PlaceholderPage title="Galeria de Vídeos" icon={<Video size={48} />} />);
      case 'settings': return <PlaceholderPage title="Configurações" icon={<SettingsIcon size={48} />} />;
      case 'termos': return <TermosDeUso onBack={() => setCurrentPage('feed')} />;
      case 'privacidade': return <Privacidade onBack={() => setCurrentPage('feed')} />;
      case 'contato': return <Contato onBack={() => setCurrentPage('feed')} />;
      default: return <Feed userProfile={userProfile} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      {user && (
        <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <button 
                onClick={() => setCurrentPage('feed')}
                className="text-2xl font-serif font-bold text-slate-900 flex items-center space-x-2"
              >
                <span className="text-brand-primary italic">Conecta</span>
                <span>TEA</span>
              </button>

              <div className="hidden md:flex items-center space-x-1">
                <NavButton 
                  active={currentPage === 'feed'} 
                  onClick={() => setCurrentPage('feed')} 
                  icon={<Home size={20} />} 
                  label="Feed" 
                />
                <NavButton 
                  active={currentPage === 'sos'} 
                  onClick={() => setCurrentPage('sos')} 
                  icon={<Activity size={20} />} 
                  label="SOS" 
                />
                <NavButton 
                  active={currentPage === 'log'} 
                  onClick={() => setCurrentPage('log')} 
                  icon={<Heart size={20} />} 
                  label="Diário" 
                />
                <NavButton 
                  active={currentPage === 'vip'} 
                  onClick={() => setCurrentPage('vip')} 
                  icon={<Shield size={20} />} 
                  label="VIP" 
                  highlight
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
                <Bell size={22} />
                <div className="absolute top-2 right-2 w-2 h-2 bg-brand-secondary rounded-full border-2 border-white" />
              </button>
              
              <div className="hidden md:flex items-center space-x-3 pl-4 border-l border-slate-100">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{userProfile?.displayName}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                    {userProfile?.isVip ? 'Membro VIP' : 'Membro Gratuito'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="w-10 h-10 rounded-full border-2 border-slate-100 overflow-hidden hover:border-brand-primary transition-all"
                >
                  <img 
                    src={userProfile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.uid}`} 
                    alt="Profile" 
                  />
                </button>
              </div>

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-slate-600"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-40 bg-white md:hidden pt-20 px-6"
          >
            <div className="space-y-6">
              <MobileNavButton onClick={() => {setCurrentPage('feed'); setIsMenuOpen(false)}} icon={<Home />} label="Início" />
              <MobileNavButton onClick={() => {setCurrentPage('sos'); setIsMenuOpen(false)}} icon={<Activity />} label="SOS Sensorial" />
              <MobileNavButton onClick={() => {setCurrentPage('log'); setIsMenuOpen(false)}} icon={<Heart />} label="Diário de Bordo" />
              <MobileNavButton onClick={() => {setCurrentPage('vip'); setIsMenuOpen(false)}} icon={<Shield />} label="Área VIP" highlight />
              <MobileNavButton onClick={() => {setCurrentPage('settings'); setIsMenuOpen(false)}} icon={<SettingsIcon />} label="Configurações" />
              <hr className="border-slate-100" />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-4 p-4 text-red-500 font-bold"
              >
                <LogOut />
                <span>Sair da Conta</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`${user ? 'pt-4 pb-24' : ''}`}>
        {renderPage()}
      </main>

      {/* AI Assistant */}
      {user && <AiAssistant />}

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuth && (
          <AuthForm 
            onSuccess={() => setShowAuth(false)} 
            onClose={() => setShowAuth(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; highlight?: boolean }> = ({ active, onClick, icon, label, highlight }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
      active 
        ? highlight ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'bg-slate-900 text-white' 
        : highlight ? 'text-brand-primary hover:bg-brand-primary/10' : 'text-slate-500 hover:bg-slate-50'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const MobileNavButton: React.FC<{ onClick: () => void; icon: React.ReactNode; label: string; highlight?: boolean }> = ({ onClick, icon, label, highlight }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-4 p-4 rounded-2xl text-lg font-bold ${
      highlight ? 'bg-brand-primary/10 text-brand-primary' : 'text-slate-700'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const PlaceholderPage: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => (
  <div className="max-w-4xl mx-auto py-20 px-4 text-center">
    <div className="w-24 h-24 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
      {icon}
    </div>
    <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">{title}</h2>
    <p className="text-slate-500 max-w-md mx-auto">
      Este recurso está sendo reconstruído para oferecer a melhor experiência possível. 
      Em breve você terá acesso completo a esta funcionalidade.
    </p>
    <button 
      onClick={() => window.location.reload()}
      className="mt-8 px-6 py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all"
    >
      Voltar ao Feed
    </button>
  </div>
);

export default App;
