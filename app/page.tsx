import { PlusCircle, TrendingUp } from "lucide-react"
import WorkPost  from "@/components/WorkPost"
import PeopleAround from "@/components/PeopleAround"
const recentPosts = [
  {
    id: "1",
    author: {
      name: "Peter Kamau",
      profession: "Mason",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      rating: 4.8,
      location: "Kikuyu"
    },
    content: "Just completed a beautiful stone wall for a client in Runda. The family was very happy with the craftsmanship. Looking for similar projects in the area!",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop"
    ],
    jobType: "Masonry Work",
    timeAgo: "2 hours ago",
    likes: 24,
    comments: 8,
    isLiked: false
  },
  {
    id: "2",
    author: {
      name: "Jane Nyokabi",
      profession: "House Help",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1c0?w=40&h=40&fit=crop&crop=face",
      rating: 4.9,
      location: "Lavington"
    },
    content: "Completed deep cleaning for a 4-bedroom house today. The clients were impressed with attention to detail. Available for similar work this weekend.",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
    ],
    jobType: "House Cleaning",
    timeAgo: "4 hours ago", 
    likes: 18,
    comments: 5,
    isLiked: true
  },
  {
    id: "3",
    author: {
      name: "Michael Odhiambo", 
      profession: "Waiter",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      rating: 4.7,
      location: "Westlands"
    },
    content: "Successfully catered a wedding reception for 200 guests last weekend. The coordination with the kitchen staff was perfect. Ready for more events!",
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop"
    ],
    jobType: "Event Service",
    timeAgo: "6 hours ago",
    likes: 32,
    comments: 12,
    isLiked: false
  },
  {
    id: "4",
    author: {
      name: "Alice Wambui",
      profession: "Watchman",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      rating: 4.6,
      location: "Industrial Area"
    },
    content: "Completed a 6-month security contract for a warehouse facility. Zero security incidents reported. Looking for long-term security positions.",
    jobType: "Security Services",
    timeAgo: "8 hours ago",
    likes: 15,
    comments: 4,
    isLiked: false
  }
]

export default function HomePage() {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1>Welcome back, John!</h1>
            <p className="text-muted-foreground">Here's what's happening in your network</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 transition">
            <PlusCircle className="w-4 h-4" />
            Share Work
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            <div className="mb-6 bg-white rounded-lg shadow p-4">
              <div className="border-b pb-2 mb-2">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <TrendingUp className="w-5 h-5" />
                  Recent Work Updates
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">See what fellow workers are accomplishing</p>
              </div>
            </div>

            <div className="space-y-6">
              {recentPosts.map((post) => (
                <WorkPost key={post.id} {...post} />
              ))}
            </div>

            <div className="text-center mt-8">
              <button className="px-4 py-2 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50 transition">Load More Posts</button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PeopleAround />
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="border-b pb-2 mb-2">
                <div className="text-lg font-semibold">Quick Stats</div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profile Views</span>
                  <span className="font-semibold">127</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jobs Completed</span>
                  <span className="font-semibold">18</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="font-semibold">4.8 ⭐</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Earnings (This Month)</span>
                  <span className="font-semibold">KES 45,200</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}