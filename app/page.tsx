'use client';
import { PlusCircle, TrendingUp } from "lucide-react"
import WorkPost  from "@/components/WorkPost"
import PeopleAround from "@/components/PeopleAround"
import { recentPosts } from "@/app/api/homePage"
import { useUser } from "@clerk/nextjs"
import { useUsers, useRecentPosts } from "@/lib/homepage/homeStore";

import { useEffect } from "react";
export default function HomePage() {
  
  const {user, isLoaded} = useUser();
  const posts = useRecentPosts((state) => state.posts)
  const fetchPosts = useRecentPosts((state) => state.fetchPosts)

  useEffect(()=>{fetchPosts()},[fetchPosts])

  if(!user || !isLoaded || posts.length == 0){
    return (
    <div className="flex flex-1 items-center justify-center h-[60vh]">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  )}
  return (
    <div className="flex-1 py-6 min-h-screen justify-center items-center w-full">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.firstName}!</h1>
            <p className="text-base-content/60">Here's what's happening in your network</p>
          </div>
          <button className="btn btn-primary btn-sm md:btn-md">
            <PlusCircle className="w-4 h-4" />
            Share Work
          </button>
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
                <WorkPost key={post.id} {...post} />
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
                  <span className="font-semibold">127</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base-content/60">Jobs Completed</span>
                  <span className="font-semibold">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base-content/60">Rating</span>
                  <span className="font-semibold">4.8 ⭐</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-base-content/60">Earnings (This Month)</span>
                  <span className="font-semibold">KES 45,200</span>
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