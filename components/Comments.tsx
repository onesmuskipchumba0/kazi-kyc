import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Send, ThumbsUp } from 'lucide-react';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  comment: string;
  created_at: string;
  user?: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  };
}

interface PostStats {
  comments: number;
  likes: number;
}

interface CommentsProps {
  postId: string;
  isOpen: boolean;
}

export default function Comments({ postId, isOpen }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [postStats, setPostStats] = useState<PostStats | null>(null);
  const { supabaseUser: currentUser } = useSupabaseUser();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && postId) {
      fetchComments();
      fetchLikes();
    }
  }, [postId, isOpen]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const fetchComments = async () => {
    const { data: commentsData, error, count } = await supabase
      .from('comments')
      .select(
        `
        *,
        user:user(
          public_id,
          firstName,
          lastName,
          avatarUrl
        )
      `,
        { count: 'exact' }
      )
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      return;
    }

    setComments(commentsData || []);
    setPostStats((prev) => ({
      ...(prev || { likes: 0 }),
      comments: count || 0,
    }));
  };

  const fetchLikes = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('likes')
      .eq('id', postId)
      .single();

    if (error) {
      console.error('Error fetching likes:', error);
      return;
    }

    setPostStats((prev) => ({
      ...(prev || { comments: 0 }),
      likes: data.likes,
    }));
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser || !newComment.trim() || !currentUser?.public_id) return;

    // Check if user already commented
    const { data: existingComment, error: checkError } = await supabase
      .from('comments')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', currentUser.public_id)
      .single();

    if (existingComment) {
      setToastMessage('You have already commented on this post');
      return;
    }

    const { error: insertError } = await supabase.from('comments').insert({
      post_id: postId,
      user_id: currentUser.public_id,
      comment: newComment.trim(),
    });

    if (insertError) {
      console.error('Error adding comment:', insertError);
      return;
    }

    setNewComment('');
    await fetchComments();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="alert alert-warning shadow-lg">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      <div className="mt-4 border-t pt-4">
        {/* Post stats */}
        {postStats && (
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
            <span>{postStats.comments} Comments</span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="w-4 h-4" /> {postStats.likes} Likes
            </span>
          </div>
        )}

        {/* Add comment form */}
        {currentUser ? (
          <form onSubmit={handleSubmitComment} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 input input-bordered input-sm"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="btn btn-primary btn-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="alert alert-info mb-4">
            Please sign in to leave a comment.
          </div>
        )}

        {/* Comments list */}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <div className="avatar">
                <div className="w-8 h-8 rounded-full">
                  {comment.user?.avatarUrl ? (
                    <img
                      src={comment.user.avatarUrl}
                      alt={`${comment.user.firstName} ${comment.user.lastName}`}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full bg-primary text-primary-content font-bold">
                      {comment.user?.firstName?.[0]}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">
                    {comment.user
                      ? `${comment.user.firstName} ${comment.user.lastName}`
                      : 'Unknown User'}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm mt-1">{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
