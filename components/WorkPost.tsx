"use client";
import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share, MapPin, Clock, Star } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Comments from "./Comments";
import { useUser } from "@clerk/clerk-react";

interface WorkPostProps {
  id: number;
  title: string;
  description: string;
  imageURL: string[];
  likes: number;
  shares: number;
  created_at: string;
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
  shares = 0,
  created_at,
  author = {
    name: "Anonymous",
    profession: "Professional",
    rating: 0,
    location: "Remote",
  },
}: WorkPostProps) {
  const timeAgo = new Date(created_at).toLocaleDateString();

  const [likesCount, setLikesCount] = useState(likes);
  const [sharesCount, setSharesCount] = useState(shares);
  const [isLiked, setIsLiked] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [userPublicId, setUserPublicId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use Clerk's useUser hook to get the authenticated user
  const { user: clerkUser, isSignedIn, isLoaded: clerkLoaded } = useUser();

  useEffect(() => {
    const fetchUserAndCounts = async () => {
      try {
        setIsLoading(true);
        
        console.log("Clerk user state:", { clerkUser, isSignedIn, clerkLoaded });

        // Wait for Clerk to load
        if (!clerkLoaded) {
          console.log("Clerk still loading...");
          return;
        }

        if (isSignedIn && clerkUser) {
          console.log("Clerk user found:", clerkUser.id, clerkUser.fullName);
          
          // Try to fetch the user's public_id from the user table
          await tryUserLookup(clerkUser);
        } else {
          console.log("No signed in user detected");
          setUserPublicId(null);
        }

        // Fetch initial counts
        await fetchLikesAndSharesCount();
        
        // Fetch initial comments count
        const { count } = await supabase
          .from("comments")
          .select("*", { count: "exact", head: true })
          .eq("post_id", id);
        setCommentsCount(count || 0);

      } catch (err) {
        console.error("Error in fetchUserAndCounts:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndCounts();
  }, [id, clerkUser, isSignedIn, clerkLoaded]);

  // Try different methods to find the user, create if doesn't exist
  const tryUserLookup = async (user: any) => {
    try {
      // Method 1: Look for email match
      if (user.primaryEmailAddress?.emailAddress) {
        const { data: emailData, error: emailError } = await supabase
          .from("user")
          .select("public_id")
          .eq("email", user.primaryEmailAddress.emailAddress)
          .single();

        if (!emailError && emailData) {
          setUserPublicId(emailData.public_id);
          console.log("Found user via email");
          return;
        }
      }

      // Method 2: Look for the user by their Clerk ID stored in a different field
      const { data: userData, error } = await supabase
        .from("user")
        .select("public_id")
        .eq("id", user.id) // Assuming the user table stores Clerk ID in the 'id' field
        .single();

      if (!error && userData) {
        setUserPublicId(userData.public_id);
        console.log("Found user via id field");
        return;
      }

      // Method 3: Create user if doesn't exist
      console.log("User not found, creating new user record");
      await createUserIfNotExists(user);

    } catch (err) {
      console.error("Error in user lookup:", err);
      // Still try to create user as fallback
      await createUserIfNotExists(user);
    }
  };

  // Create user record if it doesn't exist
  const createUserIfNotExists = async (user: any) => {
    try {
      const userData = {
        email: user.primaryEmailAddress?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log("Attempting to create user:", userData);

      const { data, error } = await supabase
        .from("user")
        .upsert(userData, { 
          onConflict: 'id',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating user:", error);
        // If creation fails, still set the public_id to allow functionality
        setUserPublicId(user.id);
      } else {
        console.log("User created successfully:", data);
        setUserPublicId(data.public_id);
      }
    } catch (err) {
      console.error("Error in createUserIfNotExists:", err);
      // Fallback: use Clerk ID as public_id
      setUserPublicId(user.id);
    }
  };

  // Check user interactions when userPublicId is available
  useEffect(() => {
    if (userPublicId && isSignedIn) {
      checkUserInteractions(userPublicId);
    } else {
      // Reset interactions if user is not signed in
      setIsLiked(false);
      setIsShared(false);
    }
  }, [userPublicId, id, isSignedIn]);

  // Fetch likes and shares counts from junction tables
  const fetchLikesAndSharesCount = async () => {
    try {
      // Fetch likes count
      const { count: likesCount, error: likesError } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", id);

      if (likesError) {
        console.error("Error fetching likes count:", likesError);
      } else {
        setLikesCount(likesCount || 0);
      }

      // Fetch shares count
      const { count: sharesCount, error: sharesError } = await supabase
        .from("shares")
        .select("*", { count: "exact", head: true })
        .eq("post_id", id);

      if (sharesError) {
        console.error("Error fetching shares count:", sharesError);
      } else {
        setSharesCount(sharesCount || 0);
      }
    } catch (err) {
      console.error("Error fetching counts:", err);
    }
  };

  // Check if user already liked or shared
  const checkUserInteractions = async (publicId: string) => {
    try {
      // Check if user already liked
      const { data: likeData, error: likeError } = await supabase
        .from("likes")
        .select("id")
        .eq("post_id", id)
        .eq("user_id", publicId)
        .single();

      if (likeError && likeError.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error("Error checking likes:", likeError);
      }
      setIsLiked(!!likeData);

      // Check if user already shared
      const { data: shareData, error: shareError } = await supabase
        .from("shares")
        .select("id")
        .eq("post_id", id)
        .eq("user_id", publicId)
        .single();

      if (shareError && shareError.code !== 'PGRST116') {
        console.error("Error checking shares:", shareError);
      }
      setIsShared(!!shareData);

    } catch (err) {
      console.error("Error checking user interactions:", err);
    }
  };

  // Handle Likes
  const handleLike = async () => {
    // If still loading, wait
    if (isLoading || !clerkLoaded) {
      console.log("Still loading...");
      return;
    }

    // If no user is signed in, show message
    if (!isSignedIn || !userPublicId) {
      console.log("User not signed in");
      alert("Please sign in to like posts");
      return;
    }

    try {
      // Debug: Check current auth state
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Supabase auth user:", user);
      console.log("UserPublicId:", userPublicId);
      
      if (isLiked) {
        // Unlike: Remove from likes table
        const { error: likeError } = await supabase
          .from("likes")
          .delete()
          .eq("post_id", id)
          .eq("user_id", userPublicId);

        if (likeError) {
          console.error("Remove like error:", likeError);
          if (likeError.code === '42501') {
            alert("Permission denied. Please check your account permissions.");
          }
          return;
        }

        setLikesCount(prev => Math.max(0, prev - 1));
        setIsLiked(false);
        console.log("Like removed successfully");
      } else {
        
        const { data, error: likeError } = await supabase
          .from("likes")
          .insert({ 
            post_id: id, 
            user_id: userPublicId 
          })
          .select();

        if (likeError) {
          console.error("Insert like error:", likeError);
          console.error("Error details:", {
            code: likeError.code,
            message: likeError.message,
            details: likeError.details,
            hint: likeError.hint
          });
          
          if (likeError.code === '42501') {
            alert("Permission denied. Your account may not have permission to like posts. Please contact support.");
          } else {
            alert(`Error: ${likeError.message}`);
          }
          return;
        }

        console.log("Like insert result:", data);
        setLikesCount(prev => prev + 1);
        setIsLiked(true);
        console.log("Like added successfully");
      }
    } catch (err) {
      console.error("Unexpected like error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  // Handle Shares
  const handleShare = async () => {
    if (isLoading || !clerkLoaded) return;

    if (!isSignedIn || !userPublicId) {
      alert("Please sign in to share posts");
      return;
    }

    try {
      if (isShared) {
        // Unshare: Remove from shares table
        const { error: shareError } = await supabase
          .from("shares")
          .delete()
          .eq("post_id", id)
          .eq("user_id", userPublicId);

        if (shareError) {
          console.error("Remove share error:", shareError);
          if (shareError.code === '42501') {
            alert("Permission denied. Please check your account permissions.");
          }
          return;
        }

        setSharesCount(prev => Math.max(0, prev - 1));
        setIsShared(false);
      } else {
        // Share: Insert into shares table
        const { error: shareError } = await supabase
          .from("shares")
          .insert({ 
            post_id: id, 
            user_id: userPublicId 
          });

        if (shareError) {
          console.error("Insert share error:", shareError);
          if (shareError.code === '42501') {
            alert("Permission denied. Your account may not have permission to share posts. Please contact support.");
          }
          return;
        }

        setSharesCount(prev => prev + 1);
        setIsShared(true);
      }
    } catch (err) {
      console.error("Unexpected share error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  if (isLoading || !clerkLoaded) {
    return (
      <div className="card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body">
          <div className="flex justify-center items-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-sm border border-base-200">
      <div className="card-body">
        {/* Author Info */}
        <div className="flex items-center gap-4 mb-4">
          <div className="avatar">
            <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              {author.avatar ? (
                <img src={author.avatar} alt={author.name} className="rounded-full" />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-primary text-primary-content font-bold text-xl">
                  {author.name.split(" ").map(n => n[0]).join("")}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold">{author.name}</h4>
            <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
              {author.profession}
            </span>
            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {author.location}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {author.rating}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {timeAgo}
              </div>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <h3 className="text-lg border rounded-md px-2 mb-2 w-fit">{title}</h3>
        <p className="mb-4">{description}</p>

        {/* Images */}
        {imageURL.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {imageURL.map((url, idx) => (
              <img key={idx} src={url} alt={`Post image ${idx + 1}`} className="w-full h-48 object-cover rounded-lg" />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 mt-4 border-t pt-4">
          <button
            onClick={handleLike}
            disabled={isLoading}
            className={`btn btn-sm flex items-center gap-2 ${
              isLiked ? "btn-error" : "btn-outline"
            } ${isLoading ? "loading" : ""}`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{likesCount}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-sm text-gray-700 px-3 py-2 rounded hover:bg-gray-100 transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{commentsCount}</span>
          </button>

          <button
            onClick={handleShare}
            disabled={isLoading}
            className={`flex items-center gap-2 text-sm px-3 py-2 rounded transition ${
              isShared ? "text-blue-500 bg-blue-50" : "text-gray-700 hover:bg-gray-100"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <Share className="w-4 h-4" />
            <span>{sharesCount}</span>
          </button>
        </div>

        {!isSignedIn && (
          <div className="text-xs text-warning mt-2 bg-warning/10 p-2 rounded">
            💡 Please sign in to like or share posts
          </div>
        )}

        {/* Comments Section */}
        <Comments postId={id} isOpen={showComments} setCommentsCount={setCommentsCount} />
      </div>
    </div>
  );
}