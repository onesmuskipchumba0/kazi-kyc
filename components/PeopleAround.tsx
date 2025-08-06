import { MapPin, Star, MessageCircle } from "lucide-react"

interface PersonProps {
  id: string
  name: string
  profession: string
  avatar?: string
  rating: number
  location: string
  distance: string
  hourlyRate?: string
  isOnline?: boolean
}

const peopleData: PersonProps[] = [
  {
    id: "1",
    name: "Mary Wanjiku",
    profession: "House Help",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1c0?w=40&h=40&fit=crop&crop=face",
    rating: 4.8,
    location: "Westlands",
    distance: "2.1 km",
    hourlyRate: "KES 500/day",
    isOnline: true
  },
  {
    id: "2", 
    name: "David Kiprotich",
    profession: "Watchman",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    rating: 4.6,
    location: "Karen",
    distance: "3.4 km", 
    hourlyRate: "KES 15,000/month",
    isOnline: false
  },
  {
    id: "3",
    name: "Grace Akinyi", 
    profession: "Waiter",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
    rating: 4.9,
    location: "CBD",
    distance: "5.2 km",
    hourlyRate: "KES 800/day",
    isOnline: true
  },
  {
    id: "4",
    name: "Samuel Otieno",
    profession: "Mason",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face", 
    rating: 4.7,
    location: "Kilimani",
    distance: "1.8 km",
    hourlyRate: "KES 1,200/day",
    isOnline: true
  }
]

export default function PeopleAround() {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="mb-4 border-b pb-2 flex items-center gap-2">
        {/* Replace with an icon if you want */}
        <span className="inline-flex items-center justify-center bg-gray-100 rounded-full p-1">
          {/* Example SVG for MapPin */}
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.418 0-8-5.373-8-10A8 8 0 1 1 20 11c0 4.627-3.582 10-8 10z" />
            <circle cx="12" cy="11" r="3" />
          </svg>
        </span>
        <span className="font-semibold text-lg">People Around You</span>
      </div>
      <div className="space-y-4">
        {peopleData.map((person) => (
          <div key={person.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="relative">
              <img
                src={person.avatar}
                alt={person.name}
                className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover"
              />
              {person.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h5 className="font-semibold truncate">{person.name}</h5>
                <span className="border border-gray-300 rounded px-2 py-0.5 text-xs text-gray-700 bg-gray-50">{person.profession}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  {/* Example SVG for Star */}
                  <svg className="w-3 h-3 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/>
                  </svg>
                  {person.rating}
                </div>
                <span>•</span>
                <span>{person.distance}</span>
                <span>•</span>
                <span className="truncate">{person.hourlyRate}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{person.location}</p>
            </div>
            <button className="ml-2 px-2 py-1 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 flex items-center" title="Message">
              {/* Example SVG for MessageCircle */}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>
        ))}
        <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 font-semibold">
          View All Nearby Workers
        </button>
      </div>
    </div>
  )}