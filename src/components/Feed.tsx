import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { db, auth } from '../lib/firebase';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  addDoc, 
  deleteDoc,
  doc,
  serverTimestamp,
  where,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp
} from 'firebase/firestore';
import { Post, UserProfile } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import PostComments from './PostComments';
import ActiveCommunities from './ActiveCommunities';
import { useInView } from 'react-intersection-observer';
import Avatar from './Avatar';
import { trackEvent } from '../lib/monitoring';
import { 
  Send, 
  MessageCircle, 
  Heart, 
  Share2, 
  MoreHorizontal, 
  Filter, 
  MapPin, 
  Tag,
  Sparkles,
  Trash2,
  RefreshCw,
  Shield,
  Pin,
  Loader2,
  Coffee,
  Users,
  Crown,
  Globe,
  MessageSquare,
  LogIn
} from 'lucide-react';

const LogoLoader = () => (
  <div className="flex flex-col items-center justify-center py-20 space-y-6">
    <div className="relative">
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [1, 0.8, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-24 h-24 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-[2rem] flex items-center justify-center shadow-xl shadow-sky-200/50"
      >
        <Users size={48} className="text-white" />
      </motion.div>
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute -inset-4 border-2 border-dashed border-sky-200 rounded-full"
      />
    </div>
    <div className="text-center space-y-2">
      <h3 className="text-lg font-bold text-slate-900 animate-pulse">Conectando Comunidade...</h3>
      <p className="text-sm text-slate-400">Buscando os melhores posts para você</p>
    </div>
  </div>
);

const PostSkeleton = () => (
  <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 overflow-hidden relative">
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-10 h-10 rounded-full shimmer" />
      <div className="flex-1 space-y-2">
        <div className="h-4 rounded w-1/4 shimmer" />
        <div className="h-3 rounded w-1/3 shimmer" />
      </div>
    </div>
    <div className="space-y-3 mb-6">
      <div className="h-4 rounded w-full shimmer" />
      <div className="h-4 rounded w-5/6 shimmer" />
      <div className="h-4 rounded w-4/6 shimmer" />
    </div>
    <div className="flex justify-between pt-4 border-t border-slate-50">
      <div className="flex space-x-6">
        <div className="h-4 rounded w-12 shimmer" />
        <div className="h-4 rounded w-12 shimmer" />
      </div>
      <div className="h-4 rounded w-8 shimmer" />
    </div>
  </div>
);

interface FeedProps {
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isVip: boolean;
  authReady?: boolean;
  isGuest?: boolean;
}

const Feed: React.FC<FeedProps> = ({ userProfile, isAdmin, isVip, authReady, isGuest }) => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    trackEvent('feed_view');
  }, []);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [topic, setTopic] = useState<string>('geral');
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(t('feed.loading'));
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView && hasMore && !loadingMore && !loading && posts.length > 0) {
      console.log('[Feed] Infinite scroll triggered');
      fetchPosts(true);
    }
  }, [inView, hasMore, loadingMore, loading, posts.length]);

  const togglePinPost = async (postId: string, isPinned: boolean) => {
    try {
      await updateDoc(doc(db, 'posts', postId), { isPinned: !isPinned });
    } catch (err) {
      console.error("Error pinning post:", err);
    }
  };

  const fetchPosts = async (isLoadMore = false) => {
    console.log(`[Feed] fetchPosts started. Topic: ${topic}, isLoadMore: ${isLoadMore}`);
    if (!isLoadMore) {
      setLoading(true);
      setPosts([]);
      setLastVisible(null);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }

    const fetchTimeout = setTimeout(() => {
      if (loading) {
        console.warn('[Feed] fetchPosts timeout reached.');
        setLoading(false);
      }
      if (loadingMore) setLoadingMore(false);
    }, 8000); // 8 seconds safety timeout

    try {
      // 1. Fetch Pinned Posts (only on initial load)
      let pinnedPosts: Post[] = [];
      if (!isLoadMore) {
        let pinnedQuery = query(collection(db, 'posts'), where('isPinned', '==', true));
        
        if (topic === 'cidade') {
          pinnedQuery = query(collection(db, 'posts'), where('isPinned', '==', true), where('city', '==', userProfile?.city || ''));
        } else if (topic === 'estado') {
          pinnedQuery = query(collection(db, 'posts'), where('isPinned', '==', true), where('state', '==', userProfile?.state || ''));
        } else if (topic !== 'geral') {
          pinnedQuery = query(collection(db, 'posts'), where('isPinned', '==', true), where('topic', '==', topic));
        }
        
        const pinnedSnapshot = await getDocs(pinnedQuery);
        pinnedPosts = pinnedSnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) })) as Post[];
        console.log(`[Feed] Pinned posts fetched: ${pinnedPosts.length}`);
      }

      // 2. Fetch Normal Posts (paginated)
      let q;
      
      if (topic === 'cidade') {
          q = query(collection(db, 'posts'), where('city', '==', userProfile?.city || ''), orderBy('timestamp', 'desc'), limit(10));
      } else if (topic === 'estado') {
          q = query(collection(db, 'posts'), where('state', '==', userProfile?.state || ''), orderBy('timestamp', 'desc'), limit(10));
      } else if (topic !== 'geral') {
        q = query(
          collection(db, 'posts'),
          where('topic', '==', topic),
          orderBy('timestamp', 'desc'),
          limit(10)
        );
      } else {
        q = query(
          collection(db, 'posts'),
          orderBy('timestamp', 'desc'),
          limit(10)
        );
      }

      if (isLoadMore && lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      const snapshot = await getDocs(q);
      console.log(`[News] read query result count for topic ${topic}: ${snapshot.size}`);
      
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as any)
      })) as Post[];
      
      console.log(`[Feed] Normal posts fetched: ${fetchedPosts.length}`);

      // Combine and deduplicate (in case a pinned post was also fetched in the normal query)
      const allPosts = [...pinnedPosts, ...fetchedPosts];
      const uniquePosts = allPosts.filter((post, index, self) => 
        index === self.findIndex((p) => p.id === post.id)
      );

      const validPosts = uniquePosts
        .filter(post => (post.text || post.content) && (post.authorId || post.userId) && post.topic)
        .map(post => ({
          ...post,
          authorId: post.authorId || post.userId,
          text: post.text || post.content
        }));
      
      if (isLoadMore) {
        setPosts(prev => [...prev, ...validPosts]);
      } else {
        setPosts(validPosts);
      }
      
      if (validPosts.length === 0 && !isLoadMore) {
        console.log('[Feed] News fetch empty');
      } else {
        console.log(`[Feed] News fetch success. Total posts: ${validPosts.length}`);
      }

      setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
      setHasMore(snapshot.docs.length === 10);
    } catch (err) {
      console.error("[Feed] News fetch failed:", err);
    } finally {
      clearTimeout(fetchTimeout);
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [topic, userProfile]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Feed/Post] Post submit clicked. authReady:', authReady, 'userProfile:', !!userProfile, 'newPost:', !!newPost.trim());
    
    if (isGuest) {
      alert('Crie sua conta para liberar este recurso.');
      return;
    }

    if (!authReady) {
      alert('Aguarde o carregamento do sistema...');
      return;
    }

    if (!newPost.trim()) {
      console.warn('[Feed/Post] Cannot post: empty text');
      return;
    }

    if (!userProfile) {
      console.error('[Feed/Post] CRITICAL: No user profile found even though auth is ready.');
      alert('Erro: Perfil de usuário não encontrado. Tente fazer login novamente.');
      return;
    }

    const postText = newPost;
    setNewPost(''); // Clear immediately for better UX

    let text_en = postText;
    let text_es = postText;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Translate the following text to English and Spanish. Return JSON format: {"en": "...", "es": "..."}. Text: "${postText}"`,
        config: { responseMimeType: "application/json" }
      });
      const translations = JSON.parse(response.text);
      text_en = translations.en;
      text_es = translations.es;
    } catch (e) {
      console.error("Translation failed", e);
    }

    const payload = {
      text: postText,
      content: postText,
      text_pt: postText,
      text_en: text_en,
      text_es: text_es,
      authorId: userProfile.uid,
      userId: userProfile.uid,
      authorName: userProfile.displayName,
      authorPhoto: userProfile.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile.uid}`,
      mediaType: 'text',
      topic: topic === 'geral' ? 'geral' : topic,
      state: userProfile.state || 'Geral',
      city: userProfile.city || 'Geral',
      location: userProfile.city ? `${userProfile.city}, ${userProfile.state}` : 'Brasil',
      timestamp: serverTimestamp(),
      createdAt: serverTimestamp(),
      isVip: userProfile.isVip || isAdmin || isVip,
      isGlobal: true
    };

    console.log('[Feed/Post] Attempting to save payload:', payload);

    try {
      const docRef = await addDoc(collection(db, 'posts'), payload);
      console.log('[Feed/Post] SUCCESS! Doc ID:', docRef.id);
      // Refresh feed immediately
      await fetchPosts();
    } catch (err: any) {
      console.error("[Feed/Post] FAILED to save post:", err);
      setNewPost(postText); // Restore on failure
      alert(`Erro ao publicar post: ${err.message || 'Erro desconhecido'}`);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Tem certeza que deseja apagar este post?')) {
      const postToDelete = posts.find(p => p.id === postId);
      if (!postToDelete) return;

      // Optimistically update UI
      setPosts(prev => prev.filter(p => p.id !== postId));

      try {
        await deleteDoc(doc(db, 'posts', postId));
      } catch (err) {
        console.error("Error deleting post:", err);
        // Revert optimistic update
        setPosts(prev => [postToDelete, ...prev].sort((a, b) => b.timestamp - a.timestamp));
        alert("Não foi possível excluir agora. Tente novamente.");
      }
    }
  };

  const handleShareCommunity = async () => {
    const city = userProfile?.city || 'sua cidade';
    const text = `Participe da comunidade TEA de ${city} no Conecta TEA. Uma rede de apoio para famílias, profissionais e cuidadores. Acesse: https://conecta-tea-liard.vercel.app/`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Conecta TEA',
          text: text,
        });
      } catch (err) {
        console.error('Erro ao compartilhar:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert('Mensagem copiada! Compartilhe com outras famílias da sua cidade.');
      } catch (err) {
        console.error('Erro ao copiar:', err);
      }
    }
  };

  const handleLike = async (postId: string, likes: string[] = []) => {
    if (isGuest) {
      alert('Crie sua conta para curtir posts.');
      return;
    }

    if (!userProfile) return;

    const postRef = doc(db, 'posts', postId);
    const safeLikes = Array.isArray(likes) ? likes : [];
    const isLiked = safeLikes.includes(userProfile.uid);
    const newLikes = isLiked 
      ? safeLikes.filter(id => id !== userProfile.uid)
      : [...safeLikes, userProfile.uid];

    // Optimistically update local state
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, likes: newLikes };
      }
      return p;
    }));

    try {
      await updateDoc(postRef, {
        likes: isLiked ? arrayRemove(userProfile.uid) : arrayUnion(userProfile.uid)
      });
    } catch (err) {
      console.error("Error toggling like:", err);
      // Revert optimistic update
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return { ...p, likes: safeLikes };
        }
        return p;
      }));
    }
  };

  const topics = [
    { id: 'geral', label: 'Geral', icon: <Tag size={16} /> },
    { id: 'cidade', label: 'Minha Cidade', icon: <MapPin size={16} /> },
    { id: 'estado', label: 'Meu Estado', icon: <MapPin size={16} /> },
    { id: 'duvidas', label: 'Dúvidas', icon: <MessageCircle size={16} /> },
    { id: 'conquistas', label: 'Conquistas', icon: <Heart size={16} /> },
    { id: 'eventos', label: 'Eventos', icon: <MapPin size={16} /> },
  ];

  const topicSubtitles: Record<string, string> = {
    geral: 'Tudo o que está rolando na comunidade',
    cidade: 'Conecte-se com famílias perto de você',
    estado: 'Rede de apoio em todo o seu estado',
    duvidas: 'Ninguém sabe tudo. Pergunte aqui!',
    conquistas: 'Cada pequeno passo merece ser celebrado',
    eventos: 'Encontros e atividades inclusivas',
    noticias: 'Comunicados oficiais do Conecta TEA'
  };

  const postSuggestions = [
    "Hoje meu filho conseguiu...",
    "Alguém conhece um bom neuropediatra em...",
    "Dica de atividade sensorial para...",
    "Desabafo do dia: ..."
  ];

  const firstName = userProfile?.displayName?.split(' ')[0] || 'Família';

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Welcome Block */}
      <div className="bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-600 rounded-[2rem] p-8 mb-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-300 opacity-20 rounded-full blur-2xl -ml-10 -mb-10"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black mb-2 tracking-tight">
              Olá, {firstName}! 💙
            </h2>
            <p className="text-sky-100 text-lg max-w-md leading-relaxed">
              {isGuest 
                ? 'Faça parte da nossa comunidade e conecte-se com outras famílias atípicas.' 
                : 'Que bom ter você aqui. Compartilhe suas conquistas, tire dúvidas ou apenas desabafe. Estamos juntos!'}
            </p>
          </div>
          
          <div className="flex flex-row md:flex-col gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
              <Users size={18} className="text-sky-200" />
              <span className="text-sm font-semibold text-white">Comunidade Viva</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
              <Sparkles size={18} className="text-amber-300" />
              <span className="text-sm font-semibold text-white">Rede de Apoio</span>
            </div>
          </div>
        </div>
      </div>

      <ActiveCommunities />

      {/* Post Creation */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 mb-8 relative overflow-hidden">
        {isGuest && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="bg-white px-8 py-6 rounded-3xl shadow-xl border border-sky-100 flex flex-col items-center gap-4 text-center max-w-sm mx-4">
              <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mb-2">
                <LogIn size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">Crie uma conta para publicar</h3>
                <p className="text-slate-500 text-sm">Junte-se à comunidade para interagir, curtir e comentar.</p>
              </div>
              <button 
                onClick={() => window.location.reload()} 
                className="w-full bg-sky-500 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-sky-600 transition-colors shadow-lg shadow-sky-200 mt-2"
              >
                Fazer Login
              </button>
            </div>
          </div>
        )}
        <div className="flex items-start space-x-4">
          <Avatar 
            src={userProfile?.photoURL} 
            name={userProfile?.displayName || 'Usuário'} 
            size="md"
          />
          <form onSubmit={handlePost} className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              disabled={isGuest}
              placeholder="O que está acontecendo na sua jornada?"
              className="w-full p-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none resize-none min-h-[120px] transition-all text-slate-700 placeholder:text-slate-400"
            />
            
            {!newPost && (
              <div className="flex flex-wrap gap-2 mt-3">
                {postSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setNewPost(suggestion)}
                    disabled={isGuest}
                    className="text-xs font-medium bg-sky-50 text-sky-700 px-4 py-2 rounded-full hover:bg-sky-100 transition-colors disabled:opacity-50 border border-sky-100/50 flex items-center gap-1.5"
                  >
                    <MessageSquare size={12} />
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex space-x-2">
                {/* Topic Selector */}
                <div className="relative">
                  <select 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={isGuest}
                    className="appearance-none bg-slate-50 text-slate-600 text-sm font-medium px-4 py-2.5 pr-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {topics.map(t => (
                      (t.id !== 'noticias' || isAdmin) && (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      )
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={!newPost.trim() || isGuest}
                className="bg-sky-500 text-white px-8 py-2.5 rounded-xl font-bold flex items-center space-x-2 hover:bg-sky-600 transition-all disabled:opacity-50 disabled:hover:bg-sky-500 shadow-md shadow-sky-200"
              >
                <span>{t('feed.post')}</span>
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
          <div className="p-2 bg-white rounded-xl border border-slate-100 text-slate-400 shrink-0">
            <Filter size={18} />
          </div>
          <button
            onClick={handleShareCommunity}
            className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-brand-primary text-white hover:bg-brand-primary/90 transition-all shadow-md shrink-0"
          >
            <Share2 size={16} />
            <span>Compartilhar Comunidade</span>
          </button>
          {topics.map(t => (
            <button
              key={t.id}
              onClick={() => setTopic(t.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                topic === t.id 
                  ? 'bg-slate-900 text-white shadow-md' 
                  : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
        <p className="text-sm text-slate-500 font-medium px-2 mt-1">
          {topicSubtitles[topic] || 'Explore a comunidade'}
        </p>
      </div>

      {/* Post List */}
      <div className="space-y-6">
          {loading ? (
            <LogoLoader />
          ) : posts.length > 0 ? (
            <>
              <AnimatePresence mode="popLayout">
                {posts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`bg-white rounded-[2rem] shadow-sm border ${post.isVip ? 'border-amber-300 ring-4 ring-amber-50' : 'border-slate-100'} overflow-hidden hover:shadow-md transition-shadow`}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar 
                            src={post.authorPhoto} 
                            name={post.authorName} 
                            size="md"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-bold text-slate-900 flex items-center gap-1">
                                {post.authorName}
                                {post.isVip && <Crown size={14} className="text-amber-500" />}
                              </h4>
                              {post.isVip && (
                                <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">VIP</span>
                              )}
                              {post.authorId === 'ai-bot' && (
                                <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">IA</span>
                              )}
                              {post.isPinned && (
                                <span className="bg-sky-100 text-sky-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                                  <Pin size={10} />
                                  {t('feed.pin')}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 flex items-center space-x-1">
                              <MapPin size={10} />
                              <span>{post.location}</span>
                              <span>•</span>
                              <span>{post.timestamp?.toDate ? post.timestamp.toDate().toLocaleDateString('pt-BR') : 'Agora'}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isAdmin && (
                            <button 
                              onClick={() => togglePinPost(post.id, !!post.isPinned)}
                              className={`transition-colors p-2 ${post.isPinned ? 'text-sky-600' : 'text-slate-400 hover:text-sky-600'}`}
                              title={post.isPinned ? t('feed.unpinPost') : t('feed.pinPost')}
                            >
                              <Pin size={18} />
                            </button>
                          )}
                          {(isAdmin || userProfile?.uid === post.authorId) && (
                            <button 
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-400 hover:text-red-600 transition-colors p-2"
                              title={t('feed.delete')}
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                          <button className="text-slate-300 hover:text-slate-600 transition-colors">
                            <MoreHorizontal size={20} />
                          </button>
                        </div>
                      </div>

                      <div className="markdown-body text-slate-700 mb-6">
                        <ReactMarkdown>
                          {i18n.language === 'en' ? post.text_en || post.text : 
                           i18n.language === 'es' ? post.text_es || post.text : 
                           post.text_pt || post.text}
                        </ReactMarkdown>
                      </div>

                      {post.mediaUrl && post.mediaType === 'image' && (
                        <div className="mb-6 rounded-2xl overflow-hidden border border-slate-50">
                          <img 
                            src={post.mediaUrl} 
                            alt="Post media" 
                            className="w-full h-auto"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <div className="flex items-center space-x-6">
                            <button 
                              onClick={() => handleLike(post.id, post.likes)}
                              className={`flex items-center space-x-2 transition-colors group ${
                                post.likes && Array.isArray(post.likes) && post.likes.includes(userProfile?.uid || '') 
                                  ? 'text-brand-secondary' 
                                  : 'text-slate-400 hover:text-brand-secondary'
                              }`}
                            >
                              <Heart 
                                size={20} 
                                className={`${post.likes && Array.isArray(post.likes) && post.likes.includes(userProfile?.uid || '') ? 'fill-brand-secondary' : 'group-hover:fill-brand-secondary'}`} 
                              />
                              <span className="text-sm font-medium">{Array.isArray(post.likes) ? post.likes.length : 0}</span>
                            </button>
                            <button 
                            onClick={() => setExpandedComments(expandedComments === post.id ? null : post.id)}
                            className="flex items-center space-x-2 text-slate-400 hover:text-brand-primary transition-colors"
                          >
                            <MessageCircle size={20} />
                            <span className="text-sm font-medium">{post.commentsCount || 0}</span>
                          </button>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600 transition-colors">
                          <Share2 size={20} />
                        </button>
                      </div>

                      <AnimatePresence>
                        {expandedComments === post.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <PostComments postId={post.id} userProfile={userProfile} isGuest={isGuest} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Infinite Scroll Trigger / Load More Button */}
              {hasMore && (
                <div ref={ref} className="flex justify-center py-8">
                  <button
                    onClick={() => fetchPosts(true)}
                    disabled={loadingMore}
                    className={`
                      group relative flex items-center justify-center space-x-3 
                      px-10 py-5 bg-white border border-slate-100 rounded-[2rem] 
                      text-brand-primary font-bold shadow-lg shadow-sky-100/50 hover:shadow-xl 
                      hover:bg-slate-50 transition-all active:scale-95
                      disabled:opacity-70 disabled:active:scale-100 overflow-hidden
                    `}
                  >
                    {loadingMore ? (
                      <>
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 bg-brand-primary rounded-lg flex items-center justify-center"
                        >
                          <Users size={14} className="text-white" />
                        </motion.div>
                        <span className="animate-pulse">{t('feed.loading')}</span>
                      </>
                    ) : (
                      <>
                        <div className="w-6 h-6 bg-brand-primary/10 rounded-lg flex items-center justify-center group-hover:bg-brand-primary group-hover:text-white transition-colors">
                          <Users size={14} />
                        </div>
                        <span>{t('feed.loadMore')}</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {!hasMore && posts.length > 0 && (
                <p className="text-center text-slate-400 py-8">{t('feed.endOfFeed')}</p>
              )}
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-inner"
            >
              <div className="flex flex-col items-center space-y-6 px-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                    <Coffee size={48} />
                  </div>
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-2 -right-2 w-10 h-10 bg-brand-secondary/10 rounded-full flex items-center justify-center text-brand-secondary"
                  >
                    <MessageCircle size={20} />
                  </motion.div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">
                    Silêncio por aqui...
                  </h3>
                  <p className="text-slate-500 max-w-xs mx-auto">
                    Parece que ainda não há posts neste tópico. Seja a primeira pessoa a quebrar o gelo!
                  </p>
                </div>
                <button 
                  onClick={() => document.querySelector('textarea')?.focus()}
                  className="text-brand-primary font-bold hover:underline flex items-center space-x-2"
                >
                  <span>Começar uma conversa</span>
                  <Send size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </div>
    </div>
  );
};

export default Feed;
