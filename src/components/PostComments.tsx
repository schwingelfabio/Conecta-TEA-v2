import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, query, orderBy, getDocs, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { UserProfile, Comment } from '../types';
import { Send, MessageSquare } from 'lucide-react';
import Avatar from './Avatar';

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
    const fetchComments = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'posts', postId, 'comments'),
          orderBy('timestamp', 'asc')
        );
        const snapshot = await getDocs(q);
        const commentsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Comment[];
        setComments(commentsData);
      } catch (err) {
        console.error('Error fetching comments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !userProfile || isGuest) return;

    const commentText = newComment.trim();
    setNewComment(''); // Clear input immediately

    // Create optimistic comment
    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      postId,
      authorId: userProfile.uid,
      authorName: userProfile.displayName,
      authorPhoto: userProfile.photoURL,
      text: commentText,
      timestamp: new Date() as any,
    };

    // Optimistically update local state
    setComments(prev => [...prev, optimisticComment]);

    try {
      const newCommentData = {
        postId,
        authorId: userProfile.uid,
        authorName: userProfile.displayName,
        authorPhoto: userProfile.photoURL,
        text: commentText,
        timestamp: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'posts', postId, 'comments'), newCommentData);

      await updateDoc(doc(db, 'posts', postId), {
        commentsCount: increment(1)
      });

      // Update the temporary ID with the real one
      setComments(prev => prev.map(c => c.id === optimisticComment.id ? { ...c, id: docRef.id } : c));

    } catch (err) {
      console.error('Error adding comment:', err);
      // Revert optimistic update on error
      setComments(prev => prev.filter(c => c.id !== optimisticComment.id));
      setNewComment(commentText); // Restore input text
      alert('Não foi possível enviar o comentário. Tente novamente.');
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
            <Avatar src={comment.authorPhoto} name={comment.authorName} size="sm" />
            <div className="bg-slate-50 p-3 rounded-2xl flex-1">
              <p className="font-bold text-xs text-slate-900">{comment.authorName}</p>
              <p className="text-sm text-slate-700">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>

      {!isGuest && userProfile && (
        <form onSubmit={handleAddComment} className="flex items-center space-x-2">
          <Avatar src={userProfile.photoURL} name={userProfile.displayName} size="sm" />
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
