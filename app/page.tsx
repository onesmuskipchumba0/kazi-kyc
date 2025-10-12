'use client';
import { useEffect, useState } from "react";
import { PlusCircle, TrendingUp, MapPin, Star, MessageCircle, UserPlus } from "lucide-react"
import WorkPost  from "@/components/WorkPost"
import { recentPosts } from "@/app/api/home/homePage"
import { useUser } from "@clerk/nextjs"
import { useUsers, useRecentPosts } from "@/lib/homepage/homeStore";
import PostComponent from "@/components/PostComponent";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { useUserStore } from "@/lib/user/UserStore";
import { useRouter } from "next/navigation";

interface Person {
  public_id: string;
  name: string;
  avatarUrl: string | null;
  location: string | null;
  coreSkills: string[] | null;
  experience: string | null;
  connectionStatus?: 'connected' | 'pending' | 'none';
}

export default function HomePage() {
  const router = useRouter();
  const user = useUserStore((state) => state.user)
  const fetchUser = useUserStore((state) => state.fetchUser)
  const posts = useRecentPosts((state) => state.posts)
  const fetchPosts = useRecentPosts((state) => state.fetchPosts)
  const { supabaseUser, loading } = useSupabaseUser();
  const [discoverPeople, setDiscoverPeople] = useState<Person[]>([]);
  const [peopleLoading, setPeopleLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts()
    fetchUser()
    fetchCurrentUser();
  }, [fetchPosts, fetchUser])

  useEffect(() => {
    if (currentUserId) {
      fetchDiscoverPeople();
    }
  }, [currentUserId]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/user");
      if (response.ok) {
        const userData = await response.json();
        setCurrentUserId(userData.user?.public_id || null);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const fetchDiscoverPeople = async () => {
    try {
      setPeopleLoading(true);
      const response = await fetch(`/api/network?type=discover&userId=${currentUserId}`);
      
      if (response.ok) {
        const data = await response.json();
        let usersArray: Person[] = [];

        if (Array.isArray(data)) {
          // For discover people, we'll show a limited set (3-4 people)
          const limitedData = data.slice(0, 4);
          
          usersArray = await Promise.all(
            limitedData.map(async (user: any) => {
              // Check connection status for each user
              const isConnected = await checkConnectionStatus(user.public_id);
              const hasPending = await checkPendingRequest(user.public_id);
              
              let connectionStatus: 'connected' | 'pending' | 'none' = 'none';
              if (isConnected) {
                connectionStatus = 'connected';
              } else if (hasPending) {
                connectionStatus = 'pending';
              }
              
              return {
                public_id: user.public_id,
                name: user.name,
                avatarUrl: user.avatarUrl,
                location: user.location,
                coreSkills: user.coreSkills,
                experience: user.experience,
                connectionStatus,
              } as Person;
            })
          );
        }

        setDiscoverPeople(usersArray);
      }
    } catch (error) {
      console.error("Error fetching discover people:", error);
      setDiscoverPeople([]);
    } finally {
      setPeopleLoading(false);
    }
  };

  const checkConnectionStatus = async (userId: string): Promise<boolean> => {
    if (!currentUserId) return false;
    
    try {
      const response = await fetch(`/api/network?type=network&userId=${currentUserId}`);
      if (response.ok) {
        const connections = await response.json();
        return connections.some((connection: any) => 
          (connection.user_id === currentUserId && connection.target_user_id === userId) ||
          (connection.user_id === userId && connection.target_user_id === currentUserId)
        );
      }
    } catch (error) {
      console.error("Error checking connection status:", error);
    }
    return false;
  };

  const checkPendingRequest = async (userId: string): Promise<boolean> => {
    if (!currentUserId) return false;
    
    try {
      const response = await fetch(`/api/network?type=requests&userId=${currentUserId}`);
      if (response.ok) {
        const requests = await response.json();
        return requests.some((request: any) => 
          request.user_id === userId
        );
      }
    } catch (error) {
      console.error("Error checking pending requests:", error);
    }
    return false;
  };

  const handleConnect = async (targetUserId: string) => {
    if (!currentUserId) {
      return;
    }

    try {
      const requestBody = {
        currentUserId: currentUserId,
        targetUserId: targetUserId,
      };

      const response = await fetch("/api/network", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        // Refresh the discover people list
        fetchDiscoverPeople();
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
    }
  };

  const handleMessage = (targetUserId: string) => {
    router.push(`/messages?user=${targetUserId}`);
  };

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

  // Skeleton for people cards
  const PeopleSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="card bg-base-100 shadow-sm border border-base-200 animate-pulse">
          <div className="card-body p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-base-300"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-base-300 rounded w-3/4"></div>
                <div className="h-3 bg-base-300 rounded w-1/2"></div>
                <div className="h-3 bg-base-300 rounded w-2/3"></div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <div className="h-8 bg-base-300 rounded flex-1"></div>
              <div className="h-8 bg-base-300 rounded flex-1"></div>
            </div>
          </div>
        </div>
      ))}
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
            {/* Discover People Card */}
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Discover People</h2>
                  <button 
                    onClick={() => router.push('/network')}
                    className="text-sm text-primary hover:underline"
                  >
                    View All
                  </button>
                </div>
                
                {peopleLoading ? (
                  <PeopleSkeleton />
                ) : discoverPeople.length > 0 ? (
                  <div className="space-y-4">
                    {discoverPeople.map((person) => (
                      <div key={person.public_id} className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                        <div className="flex-shrink-0">
                          {person.avatarUrl ? (
                            <div className="avatar">
                              <div className="w-10 h-10 rounded-full">
                                <img
                                  src={person.avatarUrl}
                                  alt={person.name}
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="avatar placeholder">
                              <div className="bg-neutral text-neutral-content rounded-full w-10">
                                <span className="text-sm">{person.name?.charAt(0) || "U"}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{person.name}</h3>
                          <div className="flex items-center text-xs text-base-content/60 mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="truncate">{person.location || "Not specified"}</span>
                          </div>
                          {person.experience && (
                            <div className="flex items-center text-xs text-base-content/70 mt-1">
                              <Star className="w-3 h-3 text-yellow-500 mr-1" />
                              <span className="truncate">{person.experience}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-1">
                          {person.connectionStatus === 'connected' ? (
                            <button
                              disabled
                              className="btn btn-success btn-xs cursor-not-allowed"
                              title="Already Connected"
                            >
                              <Star className="w-3 h-3" />
                            </button>
                          ) : person.connectionStatus === 'pending' ? (
                            <button
                              disabled
                              className="btn btn-warning btn-xs cursor-not-allowed"
                              title="Request Sent"
                            >
                              <UserPlus className="w-3 h-3" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleConnect(person.public_id)}
                              className="btn btn-primary btn-xs"
                              title="Connect"
                            >
                              <UserPlus className="w-3 h-3" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleMessage(person.public_id)}
                            className="btn btn-outline btn-xs"
                            title="Message"
                          >
                            <MessageCircle className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-base-content/60">
                    <p className="text-sm">No people to discover right now</p>
                    <button 
                      onClick={() => router.push('/network')}
                      className="btn btn-link btn-sm text-primary"
                    >
                      Browse Network
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Quick Stats Card */}
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body p-6">
                <div className="border-b border-base-200 pb-4 mb-4">
                  <h2 className="text-lg font-semibold">Quick Stats</h2>
                </div>
                <div className="space-y-4">
                  
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