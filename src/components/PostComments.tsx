import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { UserProfile, Comment } from '../types';
import { Send, MessageSquare } from 'lucide-react';

interface PostCommentsProps {
  postId: string;
  userProfile: UserProfile | null;
  isGuest?: boolean;
}

const PostComments: React.FC<PostCommentsProps> = ({ postId, userProfile, isGuest }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'posts', postId, 'comments'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(commentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [postId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userProfile || isGuest) return;

    try {
      await addDoc(collection(db, 'posts', postId, 'comments'), {
        postId,
        authorId: userProfile.uid,
        authorName: userProfile.displayName,
        authorPhoto: userProfile.photoURL,
        text: newComment.trim(),
        timestamp: serverTimestamp()
      });

      await updateDoc(doc(db, 'posts', postId), {
        commentsCount: increment(1)
      });

      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
        <MessageSquare size={18} />
        Comentários ({comments.length})
      </h4>
      
      <div className="space-y-4 mb-4">
        {comments.map(comment => (
          <div key={comment.id} className="flex space-x-3">
            <img src={comment.authorPhoto || ''} alt={comment.authorName} className="w-8 h-8 rounded-full" />
            <div className="bg-slate-50 p-3 rounded-2xl flex-1">
              <p className="font-bold text-xs text-slate-900">{comment.authorName}</p>
              <p className="text-sm text-slate-700">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

      {!isGuest && userProfile && (
        <form onSubmit={handleAddComment} className="flex items-center space-x-2">
          <img src={userProfile.photoURL || ''} alt={userProfile.displayName} className="w-8 h-8 rounded-full" />
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escreva um comentário..."
            className="flex-1 bg-slate-50 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-brand-primary"
          />
          <button type="submit" disabled={!newComment.trim()} className="text-brand-primary disabled:text-slate-300">
            <Send size={20} />
          </button>
        </form>
      )}
    </div>
  );
};

export default PostComments;
