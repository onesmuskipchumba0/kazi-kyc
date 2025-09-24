import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Send } from 'lucide-react';
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

interface CommentsProps {
    postId: string;
    isOpen: boolean;
}

export default function Comments({ postId, isOpen }: CommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const { supabaseUser: currentUser } = useSupabaseUser();

    useEffect(() => {
        if (isOpen) {
            fetchComments();
        }
    }, [postId, isOpen]);

    const fetchComments = async () => {
        const { data: commentsData, error } = await supabase
            .from('comments')
            .select(`
                *,
                user:user(
                    public_id,
                    firstName,
                    lastName,
                    avatarUrl
                )
            `)
            .eq('post_id', postId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching comments:', error);
            return;
        }

        setComments(commentsData || []);
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentUser) {
            console.log('Please sign in to comment');
            return;
        }

        if (!newComment.trim()) {
            console.log('Comment is empty');
            return;
        }

        console.log('Attempting to add comment with:', {
            currentUser,
            postId,
            comment: newComment.trim()
        });
        
        if (!currentUser?.public_id) {
            console.error('No public_id found for user');
            return;
        }

        const { error } = await supabase
            .from('comments')
            .insert({
                post_id: postId,
                user_id: currentUser.public_id,
                comment: newComment.trim()
            });

        if (error) {
            console.error('Error adding comment:', error);
            return;
        }

        try {
            // Update comments count in posts table
            const { error: incrementError } = await supabase.rpc('increment_comments', { 
                post_id: postId 
            });
            
            if (incrementError) {
                console.error('Error incrementing comments:', incrementError);
                // Continue even if increment fails - at least the comment was added
            }

            setNewComment('');
            await fetchComments();
        } catch (error) {
            console.error('Error in comment process:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="mt-4 border-t pt-4">
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
                                    {comment.user ? `${comment.user.firstName} ${comment.user.lastName}` : 'Unknown User'}
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
    );
}
