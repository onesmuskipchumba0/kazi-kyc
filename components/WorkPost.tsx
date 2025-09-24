"use client";
import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share, MapPin, Clock, Star } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Comments from "./Comments";

interface WorkPostProps {
  id: string;
  title: string;
  description: string;
  imageURL: string[];
  likes: number;
  comments: number;
  shares: number;
  created_at: string;
  userId: string; // Add userId to props
  author?: {
    name: string;
    profession: string;
    avatar?: string;
    rating: number;
    location: string;
  };
}

export default function WorkPost({ 
  id,
  title,
  description,
  imageURL = [],
  likes = 0,
  comments = 0,
  shares = 0,
  created_at,
  userId,
  author = {
    name: "Anonymous",
    profession: "Professional",
    rating: 0,
    location: "Remote"
  }
}: WorkPostProps) {
  const timeAgo = new Date(created_at).toLocaleDateString();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);
  const [commentsCount, setCommentsCount] = useState(comments);
  const [showComments, setShowComments] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUser(data.user);
    });

    // Check if current user has liked this post
    if (currentUser) {
      checkIfLiked();
    }
  }, [currentUser, id]);

  const checkIfLiked = async () => {
    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', currentUser?.id)
      .single();

    setIsLiked(!!data);
  };

  const handleLike = async () => {
    if (!currentUser) return;

    if (isLiked) {
      // Unlike
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', id)
        .eq('user_id', currentUser.id);

      await supabase.rpc('decrement_likes', { post_id: id });
      setLikesCount(prev => prev - 1);
    } else {
      // Like
      await supabase
        .from('likes')
        .insert({
          post_id: id,
          user_id: currentUser.id
        });

      await supabase.rpc('increment_likes', { post_id: id });
      setLikesCount(prev => prev + 1);
    }

    setIsLiked(!isLiked);
  };

  const handleShare = async () => {
    // Increment share count
    await supabase.rpc('increment_shares', { post_id: id });
  };

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200">
      <div className="card-body">
        {/* Author Info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="avatar">
            <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {author.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="rounded-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-primary text-primary-content font-bold text-xl">
                  {author.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold">{author.name}</h4>
            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">{author.profession}</span>
            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {author.location}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {author.rating}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-lg border rounded-md px-2 mb-2 w-fit">{title}</h3>
        <p className="mb-4">{description}</p>

        {/* Images */}
        {imageURL && imageURL.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {imageURL.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Post image ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 mt-4 border-t pt-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-sm px-2 py-1 rounded hover:bg-gray-100 transition ${isLiked ? 'text-red-500' : 'text-gray-700'}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likesCount}</span>
          </button>
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 text-sm text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{commentsCount}</span>
          </button>
          <button 
            onClick={handleShare}
            className="flex items-center gap-1 text-sm text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition"
          >
            <Share className="w-4 h-4" />
            <span>{shares}</span>
          </button>
        </div>

        {/* Comments Section */}
        <Comments postId={id} isOpen={showComments} />
      </div>
    </div>
  );
}