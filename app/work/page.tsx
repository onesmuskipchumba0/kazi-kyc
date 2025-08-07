"use client";
import React, { useState } from 'react'
import { Calendar, Clock, DollarSign, CheckCircle, XCircle, AlertCircle, MapPin, Star, Eye, MessageSquare, Phone, Briefcase } from "lucide-react"
import { FaArrowDown, FaFilter } from 'react-icons/fa'
import { FaFilterCircleXmark } from 'react-icons/fa6'
interface JobApplication {
  id: string
  title: string
  employer: {
    name: string
    avatar?: string
    rating: number
  }
  category: string
  location: string
  appliedDate: string
  status: "pending" | "reviewed" | "interview" | "accepted" | "rejected"
  payRate: string
  payType: "hourly" | "daily" | "monthly" | "project"
}

interface ActiveJob {
  id: string
  title: string
  employer: {
    name: string
    avatar?: string
    rating: number
    phone: string
  }
  category: string
  location: string
  startDate: string
  endDate?: string
  payRate: string
  payType: "hourly" | "daily" | "monthly" | "project"
  progress: number
  description: string
  status: "in-progress" | "completed" | "paused"
}

interface CompletedJob {
  id: string
  title: string
  employer: {
    name: string
    avatar?: string
    rating: number
  }
  category: string
  location: string
  completedDate: string
  payRate: string
  payType: "hourly" | "daily" | "monthly" | "project"
  duration: string
  earnings: number
  rating?: number
}

const locations = ["All Locations", "Westlands", "kilimani", "Chepkoilel", "Eldoret", "Nakuru", "Karen"]
const jobApplications: JobApplication[] = [
  {
    id: "1",
    title: "House Manager Position",
    employer: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1c0?w=40&h=40&fit=crop&crop=face",
      rating: 4.9
    },
    category: "House Help",
    location: "Karen, Nairobi",
    appliedDate: "2 days ago",
    status: "interview",
    payRate: "KES 35,000",
    payType: "monthly"
  },
  {
    id: "2",
    title: "Stone Wall Construction",
    employer: {
      name: "David Kiplagat",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      rating: 4.7
    },
    category: "Masonry",
    location: "Runda, Nairobi",
    appliedDate: "4 days ago", 
    status: "pending",
    payRate: "KES 2,500",
    payType: "daily"
  },
  {
    id: "3",
    title: "Night Security Guard",
    employer: {
      name: "Apex Security Ltd",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      rating: 4.6
    },
    category: "Security",
    location: "Industrial Area",
    appliedDate: "1 week ago",
    status: "rejected",
    payRate: "KES 18,000",
    payType: "monthly"
  }
]

const activeJobs: ActiveJob[] = [
  {
    id: "1",
    title: "Residential Garden Wall",
    employer: {
      name: "Mary Wanjiku",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      rating: 4.8,
      phone: "+254712345678"
    },
    category: "Masonry",
    location: "Westlands, Nairobi",
    startDate: "3 days ago",
    endDate: "In 4 days",
    payRate: "KES 3,000",
    payType: "daily",
    progress: 65,
    description: "Building decorative garden wall with natural stones. Project is progressing well and on schedule.",
    status: "in-progress"
  },
  {
    id: "2",
    title: "Part-time House Cleaning",
    employer: {
      name: "James Otieno",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
      rating: 4.5,
      phone: "+254723456789"
    },
    category: "House Help",
    location: "Kilimani, Nairobi",
    startDate: "2 weeks ago",
    payRate: "KES 800",
    payType: "daily",
    progress: 90,
    description: "Regular cleaning schedule 3 times per week. Client is very satisfied with the work quality.",
    status: "in-progress"
  }
]

const completedJobs: CompletedJob[] = [
  {
    id: "1",
    title: "Office Deep Cleaning",
    employer: {
      name: "Tech Hub Nairobi",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      rating: 4.4
    },
    category: "House Help",
    location: "Westlands, Nairobi",
    completedDate: "1 week ago",
    payRate: "KES 1,200",
    payType: "daily",
    duration: "3 days",
    earnings: 3600,
    rating: 5
  },
  {
    id: "2",
    title: "Compound Wall Repair",
    employer: {
      name: "Grace Mutua",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1c0?w=40&h=40&fit=crop&crop=face",
      rating: 4.9
    },
    category: "Masonry",
    location: "Karen, Nairobi",
    completedDate: "2 weeks ago",
    payRate: "KES 15,000",
    payType: "project",
    duration: "5 days",
    earnings: 15000,
    rating: 4
  },
  {
    id: "3",
    title: "Event Security",
    employer: {
      name: "Elite Events Kenya",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      rating: 4.8
    },
    category: "Security",
    location: "Various Venues",
    completedDate: "3 weeks ago",
    payRate: "KES 1,800",
    payType: "daily",
    duration: "2 days",
    earnings: 3600,
    rating: 5
  }
]

function getStatusColor(status: string) {
  switch (status) {
    case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "reviewed": return "bg-blue-100 text-blue-800 border-blue-200"
    case "interview": return "bg-purple-100 text-purple-800 border-purple-200"
    case "accepted": return "bg-green-100 text-green-800 border-green-200"
    case "rejected": return "bg-red-100 text-red-800 border-red-200"
    case "in-progress": return "bg-blue-100 text-blue-800 border-blue-200"
    case "completed": return "bg-green-100 text-green-800 border-green-200"
    case "paused": return "bg-gray-100 text-gray-800 border-gray-200"
    default: return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "pending": return <Clock className="w-4 h-4" />
    case "reviewed": return <Eye className="w-4 h-4" />
    case "interview": return <MessageSquare className="w-4 h-4" />
    case "accepted": return <CheckCircle className="w-4 h-4" />
    case "rejected": return <XCircle className="w-4 h-4" />
    case "in-progress": return <AlertCircle className="w-4 h-4" />
    case "completed": return <CheckCircle className="w-4 h-4" />
    case "paused": return <Clock className="w-4 h-4" />
    default: return <Clock className="w-4 h-4" />
  }
}
function page() {
  const [location, setLocation] = useState("All locations");
  const handleSelect = (loc: string) => {
    setLocation(loc);
  };
  return (
    <div className='flex flex-1 flex-col items-center mx-24'>
      <div className='flex flex-col w-full justify-start'>
        <span className='text-xl font-bold'>Find Work Opportunities</span>
        <span>Discover jobs that match your skills and location</span>
      </div>

      <div className='flex items-center justify-start w-full border rounded-xl border-slate-200 py-2 my-5 pl-8 pr-5'>
        <div className="mr-auto w-80">
          <div className="relative">
            <input
              type="search"
              className="w-full pl-12 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow-sm transition placeholder-gray-400 bg-white"
              placeholder="Search for jobs, employers, or categories..."
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
            </span>
          </div>
        </div>

        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn m-1">
            {location}
            <FaArrowDown />
          </div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow">
            {locations.map((loc, i) => (
              <li key={i}>
                <a onClick={() => handleSelect(loc)}>{loc}</a>
              </li>
            ))}
          </ul>
      </div>

        <button className='btn'>
          <FaFilter/>
          Filters
        </button>
    </div>
  </div>
  )
}

export default page
