import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  where
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
  Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface FeedProps {
  userProfile: UserProfile | null;
}

const Feed: React.FC<FeedProps> = ({ userProfile }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [topic, setTopic] = useState<string>('geral');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(
      collection(db, 'posts'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    if (topic !== 'geral') {
      q = query(
        collection(db, 'posts'),
        where('topic', '==', topic),
        orderBy('timestamp', 'desc'),
        limit(50)
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Post[];
      setPosts(fetchedPosts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [topic]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !userProfile) return;

    try {
      await addDoc(collection(db, 'posts'), {
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
        isVip: userProfile.isVip,
        isGlobal: true
      });
      setNewPost('');
    } catch (err) {
      console.error("Error adding post:", err);
    }
  };

  const topics = [
    { id: 'geral', label: 'Geral', icon: <Tag size={16} /> },
    { id: 'noticias', label: 'Notícias', icon: <Sparkles size={16} /> },
    { id: 'duvidas', label: 'Dúvidas', icon: <MessageCircle size={16} /> },
    { id: 'conquistas', label: 'Conquistas', icon: <Heart size={16} /> },
    { id: 'eventos', label: 'Eventos', icon: <MapPin size={16} /> },
  ];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Post Creation */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-8">
        <div className="flex items-start space-x-4">
          <img 
            src={userProfile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.uid}`} 
            alt="Avatar" 
            className="w-12 h-12 rounded-full border-2 border-slate-50"
          />
          <form onSubmit={handlePost} className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="O que está acontecendo na sua jornada?"
              className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-primary/20 outline-none resize-none min-h-[120px] transition-all"
            />
            <div className="mt-4 flex items-center justify-between">
              <div className="flex space-x-2">
                {/* Topic Selector */}
                <select 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="bg-slate-50 text-slate-600 text-sm px-3 py-2 rounded-xl border-none focus:ring-0 cursor-pointer"
                >
                  {topics.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={!newPost.trim()}
                className="bg-brand-primary text-white px-6 py-2 rounded-full font-semibold flex items-center space-x-2 hover:bg-brand-primary/90 transition-all disabled:opacity-50"
              >
                <span>Postar</span>
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
          <div className="flex flex-col items-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-primary rounded-full animate-spin" />
            <p className="text-slate-400 font-medium">Carregando feed...</p>
          </div>
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
                          <h4 className="font-bold text-slate-900">{post.authorName}</h4>
                          {post.isVip && (
                            <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">VIP</span>
                          )}
                          {post.authorId === 'ai-bot' && (
                            <span className="bg-brand-primary/10 text-brand-primary text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">IA</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 flex items-center space-x-1">
                          <MapPin size={10} />
                          <span>{post.location}</span>
                          <span>•</span>
                          <span>{post.timestamp?.toDate().toLocaleDateString('pt-BR')}</span>
                        </p>
                      </div>
                    </div>
                    <button className="text-slate-300 hover:text-slate-600 transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
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

        {!loading && posts.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <MessageCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhum post ainda</h3>
            <p className="text-slate-500">Seja o primeiro a compartilhar algo com a comunidade!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
