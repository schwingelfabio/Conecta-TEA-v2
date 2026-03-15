import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
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
  updateDoc
} from 'firebase/firestore';
import { Post, UserProfile } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
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
  Crown
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
import ReactMarkdown from 'react-markdown';
import ActiveCommunities from './ActiveCommunities';
import { useTranslation } from 'react-i18next';

interface FeedProps {
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isVip: boolean;
  authReady?: boolean;
  isGuest?: boolean;
}

const Feed: React.FC<FeedProps> = ({ userProfile, isAdmin, isVip, authReady, isGuest }) => {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [topic, setTopic] = useState<string>('geral');
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(t('feed.loading'));
  const [generatingNews, setGeneratingNews] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

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

  useEffect(() => {
    if (topic === 'noticias' && posts.length === 0 && !loading && !generatingNews && !generationError) {
      handleGenerateNews();
    }
  }, [topic, posts.length, loading, generatingNews, generationError]);

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

    const payload = {
      text: newPost,
      content: newPost,
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
      setNewPost('');
      // Refresh feed immediately
      await fetchPosts();
    } catch (err: any) {
      console.error("[Feed/Post] FAILED to save post:", err);
      alert(`Erro ao publicar post: ${err.message || 'Erro desconhecido'}`);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Tem certeza que deseja apagar este post?')) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
      } catch (err) {
        console.error("Error deleting post:", err);
      }
    }
  };

  const handleGenerateNews = async () => {
    console.log('[News] generation started. authReady:', authReady);
    if (!authReady) {
      console.warn('[News] Cannot generate news: auth not ready');
      return;
    }
    setGeneratingNews(true);
    setGenerationError(null);
    
    const controller = new AbortController();
    const genTimeout = setTimeout(() => {
      controller.abort();
      console.warn('[News] handleGenerateNews fetch timeout');
    }, 20000);

    try {
      const res = await fetch('/api/trigger-news', { signal: controller.signal });
      
      if (!res.ok) {
        // Parse returned JSON and show exact error
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.error || `Erro HTTP: ${res.status}`;
        
        if (
          res.status === 429 || 
          errorMessage.includes('429') || 
          errorMessage.includes('RESOURCE_EXHAUSTED') || 
          errorMessage.toLowerCase().includes('quota')
        ) {
          throw new Error('As notícias estão temporariamente indisponíveis por limite da API. Tente novamente mais tarde.');
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await res.json().catch(() => ({}));
      if (data.skipped) {
        console.log('[News] handleGenerateNews skipped:', data.reason);
        setGenerationError('Já existe uma notícia recente. Atualize novamente mais tarde.');
        return;
      }
      
      console.log('[News] handleGenerateNews API success');
      // After success, re-fetch posts
      await fetchPosts();
    } catch (err: any) {
      console.error("[News] handleGenerateNews failed:", err);
      setGenerationError(err.name === 'AbortError' ? 'A geração demorou muito. Tente novamente.' : err.message);
    } finally {
      clearTimeout(genTimeout);
      setGeneratingNews(false);
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

  const topics = [
    { id: 'geral', label: 'Geral', icon: <Tag size={16} /> },
    { id: 'cidade', label: 'Minha Cidade', icon: <MapPin size={16} /> },
    { id: 'estado', label: 'Meu Estado', icon: <MapPin size={16} /> },
    { id: 'noticias', label: 'Notícias', icon: <Sparkles size={16} /> },
    { id: 'duvidas', label: 'Dúvidas', icon: <MessageCircle size={16} /> },
    { id: 'conquistas', label: 'Conquistas', icon: <Heart size={16} /> },
    { id: 'eventos', label: 'Eventos', icon: <MapPin size={16} /> },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Admin Panel */}
      {isAdmin && (
        <div className="bg-slate-900 rounded-3xl p-6 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center space-x-2">
              <Shield size={20} className="text-brand-primary" />
              <span>Painel do Administrador</span>
            </h3>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={handleGenerateNews}
              disabled={generatingNews}
              className="bg-brand-primary hover:bg-brand-primary/90 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              {generatingNews ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
              <span>Gerar Notícia IA Agora</span>
            </button>
          </div>
        </div>
      )}

      <ActiveCommunities />

      {/* Post Creation */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-8 relative">
        {isGuest && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 rounded-3xl flex items-center justify-center">
            <div className="bg-white px-6 py-3 rounded-full shadow-lg border border-sky-100 flex items-center gap-3">
              <span className="text-sky-800 font-medium">Crie uma conta para publicar</span>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-sky-500 text-white px-4 py-1.5 rounded-full text-sm font-bold hover:bg-sky-600 transition-colors"
              >
                Criar Conta
              </button>
            </div>
          </div>
        )}
        <div className="flex items-start space-x-4">
          <img 
            src={userProfile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.uid || 'guest'}`} 
            alt="Avatar" 
            className="w-12 h-12 rounded-full border-2 border-slate-50"
          />
          <form onSubmit={handlePost} className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              disabled={isGuest}
              placeholder="O que está acontecendo na sua jornada?"
              className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none min-h-[120px] transition-all"
            />
            <div className="mt-4 flex items-center justify-between">
              <div className="flex space-x-2">
                {/* Topic Selector */}
                <select 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={isGuest}
                  className="bg-slate-50 text-slate-600 text-sm px-3 py-2 rounded-xl border-none focus:ring-0 cursor-pointer"
                >
                  {topics.map(t => (
                    (t.id !== 'noticias' || isAdmin) && (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    )
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={!newPost.trim() || isGuest}
                className="bg-brand-primary text-white px-6 py-2 rounded-full font-semibold flex items-center space-x-2 hover:bg-brand-primary/90 transition-all disabled:opacity-50"
              >
                <span>{t('feed.post')}</span>
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        <div className="p-2 bg-white rounded-xl border border-slate-100 text-slate-400">
          <Filter size={18} />
        </div>
        <button
          onClick={handleShareCommunity}
          className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-brand-primary text-white hover:bg-brand-primary/90 transition-all shadow-md"
        >
          <Share2 size={16} />
          <span>Compartilhar Comunidade</span>
        </button>
        {topics.map(t => (
          <button
            key={t.id}
            onClick={() => setTopic(t.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
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

      {/* Post List */}
      <div className="space-y-6">
        {loading ? (
          <LogoLoader />
        ) : (
          <AnimatePresence mode="popLayout">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={post.authorPhoto} 
                        alt={post.authorName} 
                        className="w-10 h-10 rounded-full"
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
                    <ReactMarkdown>{post.text}</ReactMarkdown>
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

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center space-x-6">
                      <button className="flex items-center space-x-2 text-slate-400 hover:text-brand-secondary transition-colors group">
                        <Heart size={20} className="group-hover:fill-brand-secondary" />
                        <span className="text-sm font-medium">{post.likes?.length || 0}</span>
                      </button>
                      <button className="flex items-center space-x-2 text-slate-400 hover:text-brand-primary transition-colors">
                        <MessageCircle size={20} />
                        <span className="text-sm font-medium">{post.commentsCount || 0}</span>
                      </button>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!loading && posts.length > 0 && hasMore && (
          <div className="flex justify-center py-8">
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
              {loadingMore && (
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                />
              )}
            </button>
          </div>
        )}

        {!loading && posts.length > 0 && !hasMore && (
          <p className="text-center text-slate-400 py-4">{t('feed.endOfFeed')}</p>
        )}

        {!loading && posts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 shadow-inner"
          >
            {topic === 'noticias' && (generatingNews || generationError) ? (
              <div className="space-y-6 px-6">
                {generatingNews ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center">
                        <Sparkles size={40} className="text-brand-primary animate-pulse" />
                      </div>
                      <div className="absolute -top-1 -right-1">
                        <Loader2 size={24} className="text-brand-secondary animate-spin" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900">Gerando Notícias com IA</h3>
                      <p className="text-slate-500 max-w-xs mx-auto">Estamos buscando as informações mais recentes e relevantes sobre autismo para você.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                      <RefreshCw size={40} className="text-red-400" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-slate-900">Ops! Algo deu errado</h3>
                      <p className="text-red-500 max-w-xs mx-auto">{generationError}</p>
                    </div>
                    <button 
                      onClick={handleGenerateNews} 
                      className="bg-brand-primary text-white px-8 py-3 rounded-full font-bold hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20 active:scale-95"
                    >
                      Tentar novamente
                    </button>
                  </div>
                )}
              </div>
            ) : (
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
                    {topic === 'noticias' ? t('feed.noNews') : 'Silêncio por aqui...'}
                  </h3>
                  <p className="text-slate-500 max-w-xs mx-auto">
                    {topic === 'noticias' 
                      ? 'Ainda não temos notícias para este tópico. Que tal voltar mais tarde?' 
                      : 'Parece que ainda não há posts neste tópico. Seja a primeira pessoa a quebrar o gelo!'}
                  </p>
                </div>
                {topic !== 'noticias' && (
                  <button 
                    onClick={() => document.querySelector('textarea')?.focus()}
                    className="text-brand-primary font-bold hover:underline flex items-center space-x-2"
                  >
                    <span>Começar uma conversa</span>
                    <Send size={16} />
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Feed;
