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
  Map as MapIcon,
  PlayCircle,
  HeartHandshake
} from 'lucide-react';
import Feed from './components/Feed';
import AreaVip from './components/AreaVip';
import NetworkMap from './components/NetworkMap';
import Settings from './components/Settings';
import SosPage from './components/SosPage';
import EmergencyPage from './components/EmergencyPage';
import LandingPage from './components/LandingPage';
import VideosPage from './components/VideosPage';
import AcolheTEA from './components/AcolheTEA';
import { SofiaIA } from './components/SofiaIA';
import { TermosDeUso, Privacidade, Contato } from './components/LegalPages';
import AuthForm from './components/AuthForm';
import Onboarding from './components/Onboarding';
import { UserProfile } from './types';
import { auth, db } from './lib/firebase';
import { signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { checkIsAdmin } from './lib/admin';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from './components/ErrorBoundary';
import Avatar from './components/Avatar';

export default function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'feed' | 'vip' | 'settings' | 'sos' | 'termos' | 'privacidade' | 'contato' | 'map' | 'videos' | 'acolhe' | 'sofia'>('feed');
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
  const [isGuest, setIsGuest] = useState(false);
  const [isAcolheUrgent, setIsAcolheUrgent] = useState(false);

  useEffect(() => {
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
        return;
      }

      setUser(u);
      const rawEmail = u.email || '';
      const normalizedEmail = rawEmail.toLowerCase().trim();
      console.log('[AUTH] raw email:', rawEmail);
      console.log('[AUTH] normalized email:', normalizedEmail);

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

        console.log(`[AUTH] derived roles: isAdmin=${adminStatus}, isVip=${vipStatus}, isDeveloper=${developerStatus}`);

        const userDocRef = doc(db, 'users', u.uid);
        
        try {
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data() as UserProfile;
            console.log('[App/Auth] User profile found in Firestore');
            setUserProfile(data);
            
            // Merge with Firestore roles if not hardcoded
            if (normalizedEmail !== 'fabiopalacioschwingel@gmail.com' && normalizedEmail !== 'fabiparadox2@gmail.com') {
              adminStatus = data.role === 'admin';
              vipStatus = data.isVip === true || data.role === 'admin';
              developerStatus = false;
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
              phoneNumber: u.phoneNumber || '',
              displayName: u.displayName || 'Usuário',
              photoURL: u.photoURL || '',
              isVip: vipStatus,
              role: adminStatus ? 'admin' : 'parent',
              createdAt: serverTimestamp(),
              city: '',
              state: ''
            };
            setUserProfile(initialData as any);
            // Disparar setDoc em background para não travar a UI
            setDoc(userDocRef, initialData, { merge: true }).catch(err => {
              console.error('[App/Auth] Error creating profile in background:', err);
            });
          }
        } catch (err) {
          console.error('[App/Auth] Error fetching user profile, using fallback:', err);
          setShowOnboarding(true);
          const fallbackData = {
            uid: u.uid,
            email: normalizedEmail,
            phoneNumber: u.phoneNumber || '',
            displayName: u.displayName || 'Usuário',
            photoURL: u.photoURL || '',
            isVip: vipStatus,
            role: adminStatus ? 'admin' : 'parent',
            createdAt: serverTimestamp(),
            city: '',
            state: ''
          };
          setUserProfile(fallbackData as any);
          setDoc(userDocRef, fallbackData, { merge: true }).catch(e => console.error(e));
        }

        setIsAdmin(adminStatus);
        setIsVip(vipStatus);
        setIsDeveloper(developerStatus);
        console.log(`[AUTH] derived roles applied: isAdmin=${adminStatus}, isVip=${vipStatus}, isDeveloper=${developerStatus}`);
      } catch (err) {
        console.error('[App/Auth] Error in auth flow:', err);
      } finally {
        setAuthReady(true);
        setLoading(false);
        console.log('[App/Auth] Auth is now READY');
      }
    });

    return () => {
      unsubscribe();
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

  const handleLoginSuccess = () => {
    console.log('[App] Login success triggered');
    // The onAuthStateChanged listener will handle the state update
  };

  const handleLogout = () => {
    setIsGuest(false);
    signOut(auth);
  };

  const renderContent = () => {
    console.log('[ACCESS] Rendering content for tab:', activeTab, { authReady, isAdmin, isVip, isGuest });
    
    if (!authReady) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
        </div>
      );
    }

    switch (activeTab) {
      case 'feed':
        return <Feed userProfile={userProfile} isAdmin={isAdmin} isVip={isVip} authReady={authReady} isGuest={isGuest} />;
      case 'vip':
        console.log('[ACCESS] VIP requested. Decision:', { authReady, isVip });
        return <AreaVip isAdmin={isAdmin} isVip={isVip} authReady={authReady} onNavigate={(tab) => setActiveTab(tab as any)} isGuest={isGuest} />;
      case 'map':
        return <NetworkMap />;
      case 'videos':
        return <VideosPage />;
      case 'sofia':
        return <SofiaIA />;
      case 'acolhe':
        return <AcolheTEA isDirectEntry={!user && !isGuest} isUrgent={isAcolheUrgent} onRequireLogin={(!user || isGuest) ? () => { setIsGuest(false); setActiveTab('feed'); } : undefined} />;
      case 'settings':
        return <Settings userProfile={userProfile} isAdmin={isAdmin} isVip={isVip} isDeveloper={isDeveloper} onNavigate={(tab) => setActiveTab(tab as any)} isGuest={isGuest} />;
      case 'sos':
        console.log('[ACCESS] SOS requested. Decision:', { authReady, user: !!user });
        return <SosPage userProfile={userProfile} authReady={authReady} onLoginClick={() => setIsGuest(false)} onNavigate={(tab) => setActiveTab(tab as any)} isGuest={isGuest} isAdmin={isAdmin} isVip={isVip} />;
      case 'termos':
        return <TermosDeUso onBack={() => setActiveTab('settings')} />;
      case 'privacidade':
        return <Privacidade onBack={() => setActiveTab('settings')} />;
      case 'contato':
        return <Contato onBack={() => setActiveTab('settings')} />;
      default:
        return <Feed userProfile={userProfile} isAdmin={isAdmin} isVip={isVip} isGuest={isGuest} />;
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
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white font-sans text-gray-900">
        {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
        {(user || isGuest) && activeTab !== 'acolhe' && (
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

              <div className="flex items-center gap-1 sm:gap-4 overflow-x-auto no-scrollbar">
                <button onClick={() => setActiveTab('feed')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shrink-0 ${activeTab === 'feed' ? 'bg-sky-100 text-sky-700 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <Home size={20} />
                  <span className="hidden sm:inline">{t('nav.feed')}</span>
                </button>
                <button onClick={() => setActiveTab('sos')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shrink-0 ${activeTab === 'sos' ? 'bg-red-100 text-red-700 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <ShieldCheck size={20} />
                  <span className="hidden sm:inline">{t('nav.sos')}</span>
                </button>
                <button onClick={() => setActiveTab('map')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shrink-0 ${activeTab === 'map' ? 'bg-emerald-100 text-emerald-700 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <MapIcon size={20} />
                  <span className="hidden sm:inline">{t('nav.map')}</span>
                </button>
                <button onClick={() => setActiveTab('videos')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shrink-0 ${activeTab === 'videos' ? 'bg-purple-100 text-purple-700 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <PlayCircle size={20} />
                  <span className="hidden sm:inline">{t('nav.videos')}</span>
                </button>
                <button onClick={() => setActiveTab('sofia')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shrink-0 ${(activeTab as string) === 'sofia' ? 'bg-sky-100 text-sky-700 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <MessageCircle size={20} />
                  <span className="hidden sm:inline">Sofia IA</span>
                </button>
                <button onClick={() => setActiveTab('acolhe')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shrink-0 ${(activeTab as string) === 'acolhe' ? 'bg-rose-100 text-rose-700 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <HeartHandshake size={20} />
                  <span className="hidden sm:inline">Acolhe TEA</span>
                </button>
                <button onClick={() => setActiveTab('vip')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shrink-0 ${activeTab === 'vip' ? 'bg-amber-100 text-amber-700 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <Crown size={20} />
                  <span className="hidden sm:inline">{t('nav.vip')}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {isGuest ? (
                  <button onClick={() => setIsGuest(false)} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-sky-500 text-white rounded-full font-bold text-xs sm:text-sm hover:bg-sky-600 transition-colors">
                    {t('nav.createAccount')}
                  </button>
                ) : (
                  <button onClick={() => setActiveTab('settings')} className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 overflow-hidden transition-all ${activeTab === 'settings' ? 'border-sky-500' : 'border-sky-100'}`}>
                    <Avatar 
                      src={userProfile?.photoURL || user?.photoURL} 
                      name={userProfile?.displayName || user?.displayName} 
                      size="md" 
                      className="w-full h-full border-none shadow-none"
                    />
                  </button>
                )}
                <button onClick={handleLogout} className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </nav>
        )}

        <main className={(!user && !isGuest && activeTab !== 'acolhe') ? '' : 'max-w-5xl mx-auto px-4 py-8'}>
          {(!user && !isGuest && activeTab !== 'acolhe') ? (
            <LandingPage 
              onLogin={handleLoginSuccess} 
              onShowTerms={() => setActiveTab('termos')} 
              onGuestLogin={() => setIsGuest(true)} 
              onOpenAcolhe={(urgent) => { setIsAcolheUrgent(urgent); setActiveTab('acolhe'); }} 
            />
          ) : (
            renderContent()
          )}
        </main>

        {!user && !isGuest && showAuth && (
          <AuthForm onSuccess={() => setShowAuth(false)} />
        )}
      </div>
    </ErrorBoundary>
  );
}
