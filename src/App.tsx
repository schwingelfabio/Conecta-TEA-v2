import React, { useState, useEffect, Suspense, lazy, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Heart,
  Brain,
  Camera
} from 'lucide-react';
const HomeInfoPage = lazy(() => import('./components/HomeInfoPage'));
const SofiaTheoSpace = lazy(() => import('./components/SofiaTheoSpace'));
const Feed = lazy(() => import('./components/Feed'));
const SosPage = lazy(() => import('./components/SosPage'));
const EmergencyPage = lazy(() => import('./components/EmergencyPage'));
const LandingPage = lazy(() => import('./components/LandingPage'));
const TriagemTeaIa = lazy(() => import('./components/TriagemTeaIa'));
const SofiaIA = lazy(() => import('./components/SofiaIA').then(module => ({ default: module.SofiaIA })));
const TermosDeUso = lazy(() => import('./components/LegalPages').then(module => ({ default: module.TermosDeUso })));
const Privacidade = lazy(() => import('./components/LegalPages').then(module => ({ default: module.Privacidade })));
const Contato = lazy(() => import('./components/LegalPages').then(module => ({ default: module.Contato })));
const Sobre = lazy(() => import('./components/LegalPages').then(module => ({ default: module.Sobre })));
const BlogPage = lazy(() => import('./components/BlogPage'));
const AuthForm = lazy(() => import('./components/AuthForm'));
import Onboarding from './components/OnboardingModal';
import EmotionalOverlay from './components/EmotionalOverlay';
import FloatingSupportButton from './components/FloatingSupportButton';
import LanguageSelectorModal from './components/LanguageSelectorModal';
import MediaUpload from './components/MediaUpload';
import { UserProfile } from './types';
import { auth, db } from './lib/firebase';
import { signOut, onAuthStateChanged, User as FirebaseUser, signInAnonymously } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs, serverTimestamp, getDocFromServer } from 'firebase/firestore';
import { checkIsAdmin } from './lib/admin';
import DonationPage from './components/DonationPage';
import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from './components/ErrorBoundary';
import Avatar from './components/Avatar';
import BackButton from './components/BackButton';
import Logo from './components/Logo';


export default function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'home' | 'feed' | 'triagem' | 'carteirinha' | 'sofia_theo' | 'termos' | 'privacidade' | 'contato' | 'sobre'>('home');
  const [blogSlug, setBlogSlug] = useState<string | null>(null);
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
  const [showEmotionalOverlay, setShowEmotionalOverlay] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [connError, setConnError] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        console.log('[App] Testing Firebase connection...');
        await getDocFromServer(doc(db, 'test_connection', 'ping'));
        console.log('[App] Firebase connection SUCCESS');
      } catch (error) {
        console.warn("Firebase connection test warning:", error);
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    if (isGuest && !localStorage.getItem('emotional_overlay_shown')) {
      setShowEmotionalOverlay(true);
      localStorage.setItem('emotional_overlay_shown', 'true');
    }
  }, [isGuest]);

  useEffect(() => {
    if (navRef.current) {
      const activeElement = navRef.current.querySelector(`[data-tab="${activeTab}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTab]);

  useEffect(() => {
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam && ['home', 'feed', 'triagem', 'carteirinha', 'sofia_theo'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }

    if (path === '/apoie-o-projeto' || path === '/apoie-o-projeto/') {
      setActiveTab('home');
      setLoading(false);
      // Let it continue so auth checks run, but we already set the tab
    }

    if (path === '/sobre' || path === '/sobre/') {
      setActiveTab('sobre');
      setLoading(false);
    }
    if (path === '/contato' || path === '/contato/') {
      setActiveTab('contato');
      setLoading(false);
    }
    if (path === '/politica-de-privacidade' || path === '/politica-de-privacidade/') {
      setActiveTab('privacidade');
      setLoading(false);
    }
    if (path === '/termos-de-uso' || path === '/termos-de-uso/') {
      setActiveTab('termos');
      setLoading(false);
    }

    if (path.startsWith('/blog/')) {
      const slug = path.split('/blog/')[1]?.replace(/\/$/, '');
      if (slug) {
        setBlogSlug(slug);
        setLoading(false);
      }
    }

    if (path.startsWith('/emergencia/')) {
      const userId = path.split('/emergencia/')[1];
      if (userId) {
        setEmergencyUserId(userId);
        setLoading(false);
        return;
      }
    }

    const authTimeout = setTimeout(() => {
      setAuthReady(prev => {
        if (!prev) {
          console.warn('[App] Auth timeout reached, forcing authReady to true.');
          setLoading(false);
          return true;
        }
        return prev;
      });
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      clearTimeout(authTimeout);
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
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout fetching user profile')), 3000)
          );
          const userDoc = await Promise.race([getDoc(userDocRef), timeoutPromise]) as any;
          
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

            if (!u.isAnonymous && (!data.state || !data.city || !data.region)) {
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
            if (!u.isAnonymous) {
              setShowOnboarding(true);
            }
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
          if (!u.isAnonymous) {
            setShowOnboarding(true);
          }
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

  const handleGuestLogin = async (targetTab?: 'feed' | 'triagem' | any) => {
    if (targetTab) {
      setActiveTab(targetTab);
    }
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout signing in anonymously')), 3000)
      );
      await Promise.race([signInAnonymously(auth), timeoutPromise]);
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      // Fallback guest session if Firebase Auth is blocked or fails
      const fallbackUid = 'guest_' + Math.random().toString(36).substring(2, 15);
      setUser({ uid: fallbackUid, isAnonymous: true, email: '' } as any);
      setIsGuest(true);
      setUserProfile({
        uid: fallbackUid,
        displayName: 'Visitante',
        role: 'parent',
        isVip: false,
        city: '',
        state: ''
      } as any);
      setAuthReady(true);
      setLoading(false);
    }
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
      case 'home':
        return (
          <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}>
            <HomeInfoPage onNavigate={(tab) => setActiveTab(tab as any)} />
          </Suspense>
        );
      case 'feed':
        return (
          <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}>
            <Feed userProfile={userProfile} isAdmin={isAdmin} isVip={isVip} authReady={authReady} isGuest={isGuest} />
          </Suspense>
        );
      case 'triagem':
        return (
          <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}>
            <TriagemTeaIa />
          </Suspense>
        );
      case 'carteirinha':
        return (
          <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}>
            <SosPage userProfile={userProfile} authReady={authReady} onLoginClick={() => setIsGuest(false)} onNavigate={(tab) => setActiveTab(tab as any)} isGuest={isGuest} isAdmin={isAdmin} isVip={isVip} initialSection="card" />
          </Suspense>
        );
      case 'sofia_theo':
        return (
          <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}>
            <SofiaTheoSpace />
          </Suspense>
        );
      case 'termos':
        return <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}><TermosDeUso onBack={() => { window.history.pushState({}, '', '/'); setActiveTab('home'); }} /></Suspense>;
      case 'privacidade':
        return <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}><Privacidade onBack={() => { window.history.pushState({}, '', '/'); setActiveTab('home'); }} /></Suspense>;
      case 'contato':
        return <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}><Contato onBack={() => { window.history.pushState({}, '', '/'); setActiveTab('home'); }} /></Suspense>;
      case 'sobre':
        return <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}><Sobre onBack={() => { window.history.pushState({}, '', '/'); setActiveTab('home'); }} /></Suspense>;
      default:
        return (
          <Suspense fallback={<div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div></div>}>
            <HomeInfoPage onNavigate={(tab) => setActiveTab(tab as any)} />
          </Suspense>
        );
    }
  };

  // connError checking removed

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

  if (blogSlug) {
    return (
      <ErrorBoundary fullScreen={true}>
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white font-sans text-gray-900">
           <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" /></div>}>
             <BlogPage slug={blogSlug} onBack={() => { setBlogSlug(null); setActiveTab('feed'); window.history.pushState({}, '', '/'); }} />
           </Suspense>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary fullScreen={true}>
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white font-sans text-gray-900">
        {showEmotionalOverlay && <EmotionalOverlay onComplete={() => setShowEmotionalOverlay(false)} />}
        {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
        {(user || isGuest) && (
          <>
            <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
              <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('feed')}>
                  <Logo size="sm" showText={false} className="w-10 h-10 border border-slate-100 rounded-xl shrink-0" />
                  <div className="hidden sm:flex flex-col items-start justify-center">
                    <h1 className="text-xl font-black tracking-tight text-[#0F2F4A] leading-none">
                      Conecta TEA <span className="text-[#0EA5E9]">IA</span>
                    </h1>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-0.5">
                      Guardião Familiar
                    </span>
                  </div>
                </div>

                <div ref={navRef} className="flex items-center gap-1 sm:gap-4 overflow-x-auto no-scrollbar">
                  <button data-tab="home" onClick={() => setActiveTab('home')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shrink-0 ${activeTab === 'home' ? 'bg-sky-100 text-[#0EA5E9] font-bold' : 'hover:bg-gray-100 text-gray-650 font-semibold'}`}>
                    <Home size={20} />
                    <span className="hidden sm:inline">{t('nav.home')}</span>
                  </button>
                  <button data-tab="feed" onClick={() => setActiveTab('feed')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shrink-0 ${activeTab === 'feed' ? 'bg-sky-100 text-sky-700 font-bold' : 'hover:bg-gray-100 text-gray-600 font-medium'}`}>
                    <Users size={20} />
                    <span className="hidden sm:inline">{t('nav.feed')}</span>
                  </button>
                  <button data-tab="triagem" onClick={() => setActiveTab('triagem')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shrink-0 ${activeTab === 'triagem' ? 'bg-sky-100 text-sky-700 font-bold' : 'hover:bg-gray-100 text-gray-600 font-medium'}`}>
                    <Brain size={20} />
                    <span className="hidden sm:inline">{t('nav.triagem')}</span>
                  </button>
                  <button data-tab="carteirinha" onClick={() => setActiveTab('carteirinha')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shrink-0 ${activeTab === 'carteirinha' ? 'bg-sky-100 text-sky-700 font-bold' : 'hover:bg-gray-100 text-gray-600 font-medium'}`}>
                    <IdCard size={20} />
                    <span className="hidden sm:inline">{t('nav.carteirinha')}</span>
                  </button>
                  <button data-tab="sofia_theo" onClick={() => setActiveTab('sofia_theo')} className={`p-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all shrink-0 ${activeTab === 'sofia_theo' ? 'bg-sky-100 text-sky-700 font-bold' : 'hover:bg-gray-100 text-gray-600 font-medium'}`}>
                    <MessageCircle size={20} />
                    <span className="hidden sm:inline">{t('nav.sofia_theo')}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-sky-100 overflow-hidden transition-all hover:border-sky-300">
                    <Avatar 
                      src={userProfile?.photoURL || user?.photoURL} 
                      name={userProfile?.displayName || user?.displayName || "Visitante"} 
                      size="md" 
                      className="w-full h-full border-none shadow-none"
                    />
                  </div>
                  <button onClick={handleLogout} className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            </nav>
          </>
        )}

        <main className={(!user && !isGuest) ? '' : 'max-w-5xl mx-auto px-4 py-8'}>
          <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" /></div>}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {(!user && !isGuest && !['apoie', 'termos', 'privacidade', 'sobre', 'contato'].includes(activeTab)) ? (
                  <LandingPage 
                    onLogin={handleLoginSuccess} 
                    onShowTerms={() => setActiveTab('termos')} 
                    onGuestLogin={handleGuestLogin} 
                    onNavigate={(path, tab) => {
                      window.history.pushState({}, '', path);
                      if (tab === 'blog') {
                        const slug = path.split('/blog/')[1]?.replace(/\/$/, '');
                        if (slug) {
                          setBlogSlug(slug);
                        }
                      } else {
                        setActiveTab(tab as any);
                      }
                    }}
                  />
                ) : (
                  renderContent()
                )}
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </main>

        {!user && !isGuest && showAuth && (
          <AuthForm onSuccess={() => setShowAuth(false)} />
        )}
      </div>
    </ErrorBoundary>
  );
}
