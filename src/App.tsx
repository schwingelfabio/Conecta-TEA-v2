import React, { useState, useEffect } from 'react';
import {
  Home,
  User,
  Crown,
  LogOut,
  LogIn,
  Users,
  MessageCircle,
  ShieldCheck,
  FileText,
  Shield,
  Mail,
  Map as MapIcon
} from 'lucide-react';
import Feed from './components/Feed';
import AreaVip from './components/AreaVip';
import NetworkMap from './components/NetworkMap';
import Settings from './components/Settings';
import SosPage from './components/SosPage';
import EmergencyPage from './components/EmergencyPage';
import LandingPage from './components/LandingPage';
import { TermosDeUso, Privacidade, Contato } from './components/LegalPages';
import AiAssistant from './components/AiAssistant';
import AuthForm from './components/AuthForm';
import Onboarding from './components/Onboarding';
import { UserProfile } from './types';
import { auth, googleProvider, db } from './lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { checkIsAdmin } from './lib/admin';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'feed' | 'vip' | 'settings' | 'sos' | 'termos' | 'privacidade' | 'contato' | 'map'>('feed');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVip, setIsVip] = useState(false);
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [emergencyUserId, setEmergencyUserId] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Timeout fallback to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 5000); // 5 seconds max loading

    const path = window.location.pathname;
    if (path.startsWith('/emergencia/')) {
      const userId = path.split('/emergencia/')[1];
      if (userId) {
        setEmergencyUserId(userId);
        setLoading(false);
        return;
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      console.log('[App/Auth] onAuthStateChanged fired. User:', u?.email || 'null');
      
      // Reset states while fetching
      if (!u) {
        console.log('[App/Auth] No user detected, clearing state');
        setUser(null);
        setUserProfile(null);
        setIsAdmin(false);
        setIsVip(false);
        setIsDeveloper(false);
        setAuthReady(true);
        setLoading(false);
        clearTimeout(loadingTimeout);
        return;
      }

      setUser(u);
      const rawEmail = u.email || '';
      const normalizedEmail = rawEmail.toLowerCase().trim();
      console.log('[VIP] logged email:', rawEmail);
      console.log('[VIP] normalized email:', normalizedEmail);

      try {
        // 1. Force Roles (Issue A)
        let adminStatus = false;
        let vipStatus = false;
        let developerStatus = false;

        if (normalizedEmail === 'fabiopalacioschwingel@gmail.com') {
          adminStatus = true;
          vipStatus = true;
          developerStatus = true;
        } else if (normalizedEmail === 'fabiparadox2@gmail.com') {
          adminStatus = false;
          vipStatus = true;
          developerStatus = false;
        }

        console.log(`[VIP] derived flags for ${normalizedEmail}: isAdmin=${adminStatus}, isVip=${vipStatus}, isDeveloper=${developerStatus}`);

        const userDocRef = doc(db, 'users', u.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;
          console.log('[App/Auth] User profile found in Firestore');
          setUserProfile(data);
          
          // Merge with Firestore roles if not hardcoded
          if (normalizedEmail !== 'fabiopalacioschwingel@gmail.com' && normalizedEmail !== 'fabiparadox2@gmail.com') {
            adminStatus = data.role === 'admin';
            vipStatus = data.isVip || adminStatus;
          }

          if (!data.state || !data.city) {
            console.log('[App/Auth] User missing state/city, showing onboarding');
            setShowOnboarding(true);
          } else {
            setShowOnboarding(false);
          }
        } else {
          console.log('[App/Auth] New user, creating profile and showing onboarding');
          setShowOnboarding(true);
          const initialData = {
            uid: u.uid,
            email: normalizedEmail,
            displayName: u.displayName || 'Usuário',
            photoURL: u.photoURL || '',
            isVip: vipStatus,
            role: adminStatus ? 'admin' : 'parent',
            createdAt: serverTimestamp()
          };
          await setDoc(userDocRef, initialData, { merge: true });
          setUserProfile(initialData as any);
        }

        setIsAdmin(adminStatus);
        setIsVip(vipStatus);
        setIsDeveloper(developerStatus);
        console.log(`[VIP] Final derived flags: isAdmin=${adminStatus}, isVip=${vipStatus}, isDeveloper=${developerStatus}`);

        // Setup real-time listener
        const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            console.log('[App/Auth] User profile snapshot update');
            setUserProfile(data);
            
            // Re-apply forced roles on every snapshot to ensure consistency
            if (normalizedEmail === 'fabiopalacioschwingel@gmail.com') {
              setIsAdmin(true);
              setIsVip(true);
              setIsDeveloper(true);
            } else if (normalizedEmail === 'fabiparadox2@gmail.com') {
              setIsAdmin(false);
              setIsVip(true);
              setIsDeveloper(false);
            } else {
              setIsAdmin(data.role === 'admin');
              setIsVip(data.isVip || data.role === 'admin');
              setIsDeveloper(false);
            }
          }
        }, (err) => {
          console.error('[App/Auth] Snapshot error:', err);
        });

        (window as any)._unsubscribeUser = unsubscribeUser;
      } catch (err) {
        console.error('[App/Auth] Error in auth flow:', err);
      } finally {
        setAuthReady(true);
        setLoading(false);
        console.log('[App/Auth] Auth is now READY');
        clearTimeout(loadingTimeout);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(loadingTimeout);
      if ((window as any)._unsubscribeUser) {
        (window as any)._unsubscribeUser();
      }
    };
  }, []);

  useEffect(() => {
    console.log('[App/State] Current Global State:', {
      authReady,
      userEmail: user?.email,
      hasProfile: !!userProfile,
      isAdmin,
      isVip,
      isDeveloper,
      showOnboarding
    });
  }, [authReady, user, userProfile, isAdmin, isVip, isDeveloper, showOnboarding]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Erro ao fazer login', error);
    }
  };

  const handleLogout = () => signOut(auth);

  const renderContent = () => {
    console.log('[ACCESS] Rendering content for tab:', activeTab, { authReady, isAdmin, isVip });
    
    if (!authReady) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
        </div>
      );
    }

    switch (activeTab) {
      case 'feed':
        return <Feed userProfile={userProfile} isAdmin={isAdmin} isVip={isVip} authReady={authReady} />;
      case 'vip':
        console.log('[ACCESS] VIP requested. Decision:', { authReady, isVip });
        return <AreaVip isAdmin={isAdmin} isVip={isVip} authReady={authReady} onNavigate={(tab) => setActiveTab(tab as any)} />;
      case 'map':
        return <NetworkMap />;
      case 'settings':
        return <Settings isAdmin={isAdmin} isVip={isVip} isDeveloper={isDeveloper} onNavigate={(tab) => setActiveTab(tab as any)} />;
      case 'sos':
        console.log('[ACCESS] SOS requested. Decision:', { authReady, user: !!user });
        return <SosPage userProfile={userProfile} authReady={authReady} onLoginClick={handleLogin} />;
      case 'termos':
        return <TermosDeUso onBack={() => setActiveTab('settings')} />;
      case 'privacidade':
        return <Privacidade onBack={() => setActiveTab('settings')} />;
      case 'contato':
        return <Contato onBack={() => setActiveTab('settings')} />;
      default:
        return <Feed userProfile={userProfile} isAdmin={isAdmin} isVip={isVip} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-sky-500 rounded-[2rem] flex items-center justify-center text-white mb-6 animate-bounce shadow-xl shadow-sky-100">
            <Users size={48} />
          </div>
        </div>
      </div>
    );
  }

  if (emergencyUserId) {
    return <EmergencyPage id={emergencyUserId} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white font-sans text-gray-900">
      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
      {user && (
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('feed')}>
              <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white shadow-sm">
                <Users size={24} />
              </div>
              <h1 className="text-xl font-bold tracking-tight hidden sm:block">
                Conecta <span className="text-sky-500">TEA</span>
              </h1>
            </div>

            <div className="flex items-center gap-1 sm:gap-4">
              <button onClick={() => setActiveTab('feed')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all ${activeTab === 'feed' ? 'bg-sky-100 text-sky-700 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}>
                <Home size={20} />
                <span className="hidden sm:inline">{t('nav.feed')}</span>
              </button>
              <button onClick={() => setActiveTab('sos')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all ${activeTab === 'sos' ? 'bg-red-100 text-red-700 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}>
                <ShieldCheck size={20} />
                <span className="hidden sm:inline">{t('nav.sos')}</span>
              </button>
              <button onClick={() => setActiveTab('map')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all ${activeTab === 'map' ? 'bg-emerald-100 text-emerald-700 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}>
                <MapIcon size={20} />
                <span className="hidden sm:inline">{t('nav.map')}</span>
              </button>
              <button onClick={() => setActiveTab('vip')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all ${activeTab === 'vip' ? 'bg-amber-100 text-amber-700 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}>
                <Crown size={20} />
                <span className="hidden sm:inline">{t('nav.vip')}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setActiveTab('settings')} className={`w-10 h-10 rounded-full border-2 overflow-hidden hidden sm:block transition-all ${activeTab === 'settings' ? 'border-sky-500' : 'border-sky-100'}`}>
                {user.photoURL ? <img src={user.photoURL} alt="Perfil" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-sky-100 text-sky-600 font-bold">{user.displayName?.charAt(0) || 'U'}</div>}
              </button>
              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </nav>
      )}

      <main className={!user ? '' : 'max-w-5xl mx-auto px-4 py-8'}>
        {!user ? (
          <LandingPage onLogin={handleLogin} onShowTerms={() => setActiveTab('termos')} />
        ) : (
          renderContent()
        )}
      </main>

      {user && <AiAssistant />}
      
      {!user && showAuth && (
        <AuthForm onSuccess={() => setShowAuth(false)} />
      )}
    </div>
  );
}
