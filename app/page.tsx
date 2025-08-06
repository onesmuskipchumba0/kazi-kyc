'use client';
import { PlusCircle, TrendingUp } from "lucide-react"
import WorkPost  from "@/components/WorkPost"
import PeopleAround from "@/components/PeopleAround"
import { recentPosts } from "@/api/homePage"
import { useUser } from "@clerk/nextjs"

export default function HomePage() {
  const {user, isLoaded} = useUser();
  return (
    <div className="flex-1 py-6 pr-6 min-h-screen bg-gray- justify-center items-center w-full">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6 px-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {isLoaded ? user?.firstName : null}!</h1>
            <p className="text-gray-600">Here's what's happening in your network</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg shadow hover:bg-slate-700 transition-colors">
            <PlusCircle className="w-4 h-4" />
            Share Work
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed - Takes 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Work Updates Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Recent Work Updates</h2>
              </div>
              <p className="text-gray-600">See what fellow workers are accomplishing</p>
            </div>

            {/* Work Posts */}
            <div className="space-y-6">
              {recentPosts.map((post) => (
                <WorkPost key={post.id} {...post} />
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center pt-4">
              <button className="px-6 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium">
                Load More Posts
              </button>
            </div>
          </div>

          {/* Sidebar - Takes 1 column on large screens */}
          <div className="space-y-6">
            <PeopleAround />
            
            {/* Quick Stats Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Quick Stats</h2>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profile Views</span>
                  <span className="font-semibold text-gray-900">127</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Jobs Completed</span>
                  <span className="font-semibold text-gray-900">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-semibold text-gray-900">4.8 ⭐</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Earnings (This Month)</span>
                  <span className="font-semibold text-gray-900">KES 45,200</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}