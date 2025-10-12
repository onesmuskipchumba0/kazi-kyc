'use client';
import { useEffect } from "react";
import { PlusCircle, TrendingUp } from "lucide-react"
import WorkPost  from "@/components/WorkPost"
import PeopleAround from "@/components/PeopleAround"
import { recentPosts } from "@/app/api/home/homePage"
import { useUser } from "@clerk/nextjs"
import { useUsers, useRecentPosts } from "@/lib/homepage/homeStore";
import PostComponent from "@/components/PostComponent";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { useUserStore } from "@/lib/user/UserStore";

export default function HomePage() {
  const user = useUserStore((state) => state.user)
  const fetchUser = useUserStore((state) => state.fetchUser)
  const posts = useRecentPosts((state) => state.posts)
  const fetchPosts = useRecentPosts((state) => state.fetchPosts)
  const { supabaseUser, loading } = useSupabaseUser();

  useEffect(()=>{
    fetchPosts()
    fetchUser()
  },[fetchPosts, fetchUser])

  // Transform user data to match WorkPost author prop with rating and jobsCompleted
  const transformUserToAuthor = (user: any) => {
    if (!user) return undefined;
    
    return {
      name: user.name || `${user.firstName} ${user.lastName}` || 'Unknown User',
      profession: user.profileType || 'Worker',
      avatarUrl: user.avatarUrl || '/default-avatar.png',
      rating: user.rating || 4.5, // Default rating if not provided
      location: user.location || 'Unknown Location',
      jobsCompleted: user.jobsCompleted || 0 // Default to 0 if not provided
    };
  };

  // Get actual stats from user data or use defaults
  const getUserStats = () => {
    if (!user) {
      return {
        profileViews: 127,
        jobsCompleted: 18,
        rating: 4.8,
        earnings: 45200
      };
    }

    return {
      profileViews: user.profileViews || 127,
      jobsCompleted: user.jobsCompleted || 0,
      rating: user.rating || 4.5,
      earnings: user.earnings || 0
    };
  };

  const userStats = getUserStats();

  if(!user) console.log("user not found")

  // Skeleton component for loading posts
  const WorkPostSkeleton = () => (
    <div className="card bg-base-100 shadow-sm border border-base-200 animate-pulse">
      <div className="card-body">
        {/* Author Info Skeleton */}
        <div className="flex items-center gap-4 mb-4">
          <div className="avatar">
            <div className="w-12 h-12 rounded-full bg-base-300 ring ring-base-200 ring-offset-base-100 ring-offset-2"></div>
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-base-300 rounded w-1/3"></div>
            <div className="h-3 bg-base-300 rounded w-1/4"></div>
            <div className="flex items-center gap-4 mt-1">
              <div className="h-3 bg-base-300 rounded w-1/6"></div>
              <div className="h-3 bg-base-300 rounded w-1/6"></div>
              <div className="h-3 bg-base-300 rounded w-1/6"></div>
            </div>
          </div>
        </div>

        {/* Title Skeleton */}
        <div className="h-5 bg-base-300 rounded w-3/4 mb-3"></div>
        
        {/* Content Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-base-300 rounded w-full"></div>
          <div className="h-4 bg-base-300 rounded w-5/6"></div>
          <div className="h-4 bg-base-300 rounded w-4/6"></div>
        </div>

        {/* Image Skeleton */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="w-full h-48 bg-base-300 rounded-lg"></div>
          <div className="w-full h-48 bg-base-300 rounded-lg"></div>
        </div>

        {/* Actions Skeleton */}
        <div className="flex items-center gap-4 mt-4 border-t pt-4">
          <div className="h-8 bg-base-300 rounded w-16"></div>
          <div className="h-8 bg-base-300 rounded w-16"></div>
          <div className="h-8 bg-base-300 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 py-6 min-h-screen justify-center items-center w-full">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div>
            <h1 className="text-2xl font-bold">
              {loading ? (
                <div className="h-7 bg-base-300 rounded w-48 animate-pulse"></div>
              ) : (
                `Welcome back, ${supabaseUser?.firstName || 'User'}!`
              )}
            </h1>
            {/* Fixed: Use div instead of p to avoid nesting issues */}
            <div className="text-base-content/60">
              {loading ? (
                <div className="h-4 bg-base-300 rounded w-64 animate-pulse mt-1"></div>
              ) : (
                "Here's what's happening in your network"
              )}
            </div>
          </div>
          
          {/* Trigger post modal */}
          {loading ? (
            <div className="h-10 bg-base-300 rounded w-32 animate-pulse"></div>
          ) : supabaseUser ? (
            <>
              <label
                htmlFor="my_post_modal"
                className="btn btn-primary btn-sm md:btn-md flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Share Work
              </label>
              <PostComponent userId={supabaseUser.public_id} modalId="my_post_modal" />
            </>
          ) : (
            <p>No supabaseUser with email found</p>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Work Updates Card */}
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold">Recent Work Updates</h2>
                </div>
                <p className="text-base-content/60">See what fellow workers are accomplishing</p>
              </div>
            </div>

            {/* Work Posts */}
            <div className="space-y-6">
              {posts.length === 0 ? (
                // Show skeleton when loading or no posts
                <>
                  <WorkPostSkeleton />
                  <WorkPostSkeleton />
                  <WorkPostSkeleton />
                </>
              ) : (
                posts.map((post) => (
                  <WorkPost 
                    key={post.id}
                    id={Number(post.id)}
                    title={post.title}
                    description={post.description}
                    imageURL={post.imageURL}
                    likes={post.likes}
                    shares={post.shares}
                    created_at={post.created_at}
                    author={transformUserToAuthor(user)} // Use transformed user data
                  />
                ))
              )}
            </div>

            {/* Load More Button */}
            {posts.length > 0 && (
              <div className="text-center pt-4">
                <button className="btn btn-outline">
                  Load More Posts
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Takes 1 column on large screens */}
          <div className="space-y-6">
            <PeopleAround />
            
            {/* Quick Stats Card */}
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-6">
                <div className="border-b border-base-200 pb-4 mb-4">
                  <h2 className="text-lg font-semibold">Quick Stats</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/60">Profile Views</span>
                    <span className="font-semibold">
                      {loading ? (
                        <div className="h-4 bg-base-300 rounded w-12 animate-pulse"></div>
                      ) : (
                        userStats.profileViews
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/60">Jobs Completed</span>
                    <span className="font-semibold">
                      {loading ? (
                        <div className="h-4 bg-base-300 rounded w-8 animate-pulse"></div>
                      ) : (
                        userStats.jobsCompleted
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/60">Rating</span>
                    <span className="font-semibold">
                      {loading ? (
                        <div className="h-4 bg-base-300 rounded w-16 animate-pulse"></div>
                      ) : (
                        `${userStats.rating} ⭐`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/60">Earnings (This Month)</span>
                    <span className="font-semibold">
                      {loading ? (
                        <div className="h-4 bg-base-300 rounded w-20 animate-pulse"></div>
                      ) : (
                        `KES ${userStats.earnings.toLocaleString()}`
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}