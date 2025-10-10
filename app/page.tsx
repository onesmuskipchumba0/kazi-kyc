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
  
  if(loading){
    return (
      <div className="flex flex-1 items-center justify-center h-[60vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  return (
    <div className="flex-1 py-6 min-h-screen justify-center items-center w-full">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {supabaseUser?.firstName}!</h1>
            <p className="text-base-content/60">Here's what's happening in your network</p>
          </div>
          
          {/* Trigger post modal */}
          { supabaseUser ?
          <>
            <label
              htmlFor="my_post_modal"
              className="btn btn-primary btn-sm md:btn-md flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Share Work
            </label>
            <PostComponent userId={supabaseUser.public_id} modalId="my_post_modal" />
          </> : <p>No supabaseUser with email found</p>
          }
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
              {posts.map((post) => (
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
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center pt-4">
              <button className="btn btn-outline">
                Load More Posts
              </button>
            </div>
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
                    <span className="font-semibold">{userStats.profileViews}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/60">Jobs Completed</span>
                    <span className="font-semibold">{userStats.jobsCompleted}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/60">Rating</span>
                    <span className="font-semibold">{userStats.rating} ⭐</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-base-content/60">Earnings (This Month)</span>
                    <span className="font-semibold">KES {userStats.earnings.toLocaleString()}</span>
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