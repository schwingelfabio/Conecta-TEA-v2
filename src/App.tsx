import React, { useState, useEffect, Suspense, lazy } from 'react';
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
  HeartHandshake,
  IdCard,
  AlertTriangle,
  Video,
  Brain
} from 'lucide-react';
const Feed = lazy(() => import('./components/Feed'));
const AreaVip = lazy(() => import('./components/AreaVip'));
const NetworkMap = lazy(() => import('./components/NetworkMap'));
const Settings = lazy(() => import('./components/Settings'));
const SosPage = lazy(() => import('./components/SosPage'));
const EmergencyPage = lazy(() => import('./components/EmergencyPage'));
const LandingPage = lazy(() => import('./components/LandingPage'));
const VideosPage = lazy(() => import('./components/VideosPage'));
const TriagemTeaIa = lazy(() => import('./components/TriagemTeaIa'));
const SofiaIA = lazy(() => import('./components/SofiaIA').then(module => ({ default: module.SofiaIA })));
const TermosDeUso = lazy(() => import('./components/LegalPages').then(module => ({ default: module.TermosDeUso })));
const Privacidade = lazy(() => import('./components/LegalPages').then(module => ({ default: module.Privacidade })));
const Contato = lazy(() => import('./components/LegalPages').then(module => ({ default: module.Contato })));
const AuthForm = lazy(() => import('./components/AuthForm'));
const Onboarding = lazy(() => import('./components/Onboarding'));
const MordomoDashboard = lazy(() => import('./components/MordomoDashboard'));
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
  const [activeTab, setActiveTab] = useState<'feed' | 'vip' | 'settings' | 'sos' | 'termos' | 'privacidade' | 'contato' | 'map' | 'videos' | 'sofia' | 'carteirinha' | 'triagem' | 'mordomo'>('feed');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isVip, setIsVip] = useState(false);
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);
  const [emergencyUserId, setEmergencyUserId] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

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
      setIsGuest(u.isAnonymous);
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

            // Sync public profile
            const publicData = {
              uid: u.uid,
              displayName: data.displayName || u.displayName || 'Usuário',
              photoURL: data.photoURL || u.photoURL || '',
              isVip: vipStatus,
              role: adminStatus ? 'admin' : (data.role || 'parent'),
              city: data.city || '',
              state: data.state || ''
            };
            setDoc(doc(db, 'public_profiles', u.uid), publicData, { merge: true }).catch(e => console.error(e));
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
            const publicData = {
              uid: u.uid,
              displayName: u.displayName || 'Usuário',
              photoURL: u.photoURL || '',
              isVip: vipStatus,
              role: adminStatus ? 'admin' : 'parent',
              city: '',
              state: ''
            };
            setUserProfile(initialData as any);
            // Disparar setDoc em background para não travar a UI
            setDoc(userDocRef, initialData, { merge: true }).catch(err => {
              console.error('[App/Auth] Error creating profile in background:', err);
            });
            setDoc(doc(db, 'public_profiles', u.uid), publicData, { merge: true }).catch(e => console.error(e));
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
          const publicFallbackData = {
            uid: u.uid,
            displayName: u.displayName || 'Usuário',
            photoURL: u.photoURL || '',
            isVip: vipStatus,
            role: adminStatus ? 'admin' : 'parent',
            city: '',
            state: ''
          };
          setUserProfile(fallbackData as any);
          setDoc(userDocRef, fallbackData, { merge: true }).catch(e => console.error(e));
          setDoc(doc(db, 'public_profiles', u.uid), publicFallbackData, { merge: true }).catch(e => console.error(e));
        }

        setIsAdmin(adminStatus);
        setIsSuperAdmin(normalizedEmail === 'fabiopalacioschwingel@gmail.com');
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
        return <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}><Feed userProfile={userProfile} isAdmin={isAdmin} isVip={isVip} authReady={authReady} isGuest={isGuest} /></Suspense>;
      case 'sofia':
        return <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}><SofiaIA /></Suspense>;
      case 'videos':
        return <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}><VideosPage /></Suspense>;
      case 'triagem':
        return <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}><TriagemTeaIa /></Suspense>;
      case 'vip':
        return <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}><AreaVip isAdmin={isAdmin} isVip={isVip} authReady={authReady} onNavigate={(tab) => setActiveTab(tab as any)} isGuest={isGuest} /></Suspense>;
      case 'settings':
        return <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}><Settings userProfile={userProfile} isAdmin={isAdmin} isVip={isVip} isDeveloper={isDeveloper} onNavigate={(tab) => setActiveTab(tab as any)} isGuest={isGuest} /></Suspense>;
      case 'carteirinha':
        return <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}><SosPage userProfile={userProfile} authReady={authReady} onLoginClick={() => setIsGuest(false)} onNavigate={(tab) => setActiveTab(tab as any)} isGuest={isGuest} isAdmin={isAdmin} isVip={isVip} initialSection="card" /></Suspense>;
      case 'sos':
        return <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}><SosPage userProfile={userProfile} authReady={authReady} onLoginClick={() => setIsGuest(false)} onNavigate={(tab) => setActiveTab(tab as any)} isGuest={isGuest} isAdmin={isAdmin} isVip={isVip} initialSection="tools" /></Suspense>;
      case 'termos':
        return <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}><TermosDeUso onBack={() => setActiveTab('settings')} /></Suspense>;
      case 'privacidade':
        return <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}><Privacidade onBack={() => setActiveTab('settings')} /></Suspense>;
      case 'contato':
        return <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}><Contato onBack={() => setActiveTab('settings')} /></Suspense>;
      case 'mordomo':
        return isSuperAdmin ? <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}><MordomoDashboard /></Suspense> : <Feed userProfile={userProfile} isAdmin={isAdmin} isVip={isVip} isGuest={isGuest} />;
      default:
        return <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}><Feed userProfile={userProfile} isAdmin={isAdmin} isVip={isVip} isGuest={isGuest} /></Suspense>;
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
        {(user || isGuest) && (
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
                <button onClick={() => setActiveTab('settings')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shrink-0 ${activeTab === 'settings' ? 'bg-sky-100 text-sky-700 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <User size={20} />
                  <span className="hidden sm:inline">{t('nav.profile')}</span>
                </button>
                <button onClick={() => setActiveTab('carteirinha')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shrink-0 ${activeTab === 'carteirinha' ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <IdCard size={20} />
                  <span className="hidden sm:inline">{t('nav.sos')}</span>
                </button>
                <button onClick={() => setActiveTab('sos')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shrink-0 ${activeTab === 'sos' ? 'bg-red-100 text-red-700 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <AlertTriangle size={20} />
                  <span className="hidden sm:inline">SOS</span>
                </button>
                <button onClick={() => setActiveTab('feed')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shrink-0 ${activeTab === 'feed' ? 'bg-sky-100 text-sky-700 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <Home size={20} />
                  <span className="hidden sm:inline">{t('nav.communities')}</span>
                </button>
                <button onClick={() => setActiveTab('sofia')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shrink-0 ${(activeTab as string) === 'sofia' ? 'bg-sky-100 text-sky-700 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <MessageCircle size={20} />
                  <span className="hidden sm:inline">Sofia IA</span>
                </button>
                <button onClick={() => setActiveTab('videos')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shrink-0 ${(activeTab as string) === 'videos' ? 'bg-sky-100 text-sky-700 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <Video size={20} />
                  <span className="hidden sm:inline">{t('nav.videos')}</span>
                </button>
                <button onClick={() => setActiveTab('triagem')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shrink-0 ${(activeTab as string) === 'triagem' ? 'bg-sky-100 text-sky-700 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <Brain size={20} />
                  <span className="hidden sm:inline">{t('nav.triagem')}</span>
                </button>
                <button onClick={() => setActiveTab('vip')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shrink-0 ${(activeTab as string) === 'vip' ? 'bg-amber-100 text-amber-700 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}>
                  <Crown size={20} />
                  <span className="hidden sm:inline">{t('nav.vip')}</span>
                </button>
                {isSuperAdmin && (
                  <button onClick={() => setActiveTab('mordomo')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shrink-0 ${(activeTab as string) === 'mordomo' ? 'bg-indigo-100 text-indigo-700 font-bold' : 'hover:bg-gray-100 text-gray-600'}`}>
                    <ShieldCheck size={20} />
                    <span className="hidden sm:inline">Mordomo IA</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {isGuest ? (
                  <button onClick={() => setIsGuest(false)} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-sky-500 text-white rounded-full font-bold text-xs sm:text-sm hover:bg-sky-600 transition-colors">
                    {t('nav.createAccount')}
                  </button>
                ) : (
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 overflow-hidden transition-all ${activeTab === 'settings' ? 'border-sky-500' : 'border-sky-100'}`}>
                    <Avatar 
                      src={userProfile?.photoURL || user?.photoURL} 
                      name={userProfile?.displayName || user?.displayName} 
                      size="md" 
                      className="w-full h-full border-none shadow-none"
                    />
                  </div>
                )}
                <button onClick={handleLogout} className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </nav>
        )}

        <main className={(!user && !isGuest) ? '' : 'max-w-5xl mx-auto px-4 py-8'}>
          <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" /></div>}>
            {(!user && !isGuest) ? (
              <LandingPage 
                onLogin={handleLoginSuccess} 
                onShowTerms={() => setActiveTab('termos')} 
                onGuestLogin={() => setIsGuest(true)} 
                onOpenAcolhe={() => setActiveTab('sofia')} 
              />
            ) : (
              renderContent()
            )}
          </Suspense>
        </main>

        {!user && !isGuest && showAuth && (
          <AuthForm onSuccess={() => setShowAuth(false)} />
        )}
      </div>
    </ErrorBoundary>
  );
}
