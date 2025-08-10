"use client";

import {
  Search,
  MapPin,
  Clock,
  Star,
  Filter,
  Briefcase,
  Home as HomeIcon,
  Users,
  Shield,
  Utensils,
} from "lucide-react";

interface JobListing {
  id: string;
  title: string;
  employer: {
    name: string;
    avatar?: string;
    rating: number;
    verified: boolean;
  };
  category: string;
  location: string;
  description: string;
  requirements: string[];
  payRate: string;
  payType: "hourly" | "daily" | "monthly" | "project";
  postedTime: string;
  urgent?: boolean;
  applicants: number;
}

const categories = [
  { name: "All Jobs", icon: Briefcase, count: 156 },
  { name: "House Help", icon: HomeIcon, count: 42 },
  { name: "Masonry", icon: Users, count: 28 },
  { name: "Security", icon: Shield, count: 35 },
  { name: "Food Service", icon: Utensils, count: 51 },
];

const applicationTips = [
  {
    title: "Complete your profile",
    description: "Profiles with photos get 3x more responses",
  },
  {
    title: "Apply early",
    description: "Early applications have higher success rates",
  },
  {
    title: "Personalize applications",
    description: "Tailor your message to each job",
  },
];

const featuredJobs: JobListing[] = [
  {
    id: "1",
    title: "Experienced House Manager Needed",
    employer: {
      name: "Sarah Johnson",
      avatar: "",
      rating: 4.9,
      verified: true,
    },
    category: "House Help",
    location: "Karen, Nairobi",
    description:
      "Looking for a reliable house manager for a 5-bedroom home. Must be experienced with meal preparation, cleaning, and household management.",
    requirements: [
      "3+ years experience",
      "References required",
      "Live-in preferred",
      "First aid knowledge",
    ],
    payRate: "KES 35,000",
    payType: "monthly",
    postedTime: "2 hours ago",
    urgent: true,
    applicants: 8,
  },
  {
    id: "2",
    title: "Stone Wall Construction Project",
    employer: {
      name: "David Kiplagat",
      avatar: "",
      rating: 4.7,
      verified: true,
    },
    category: "Masonry",
    location: "Westlands, Nairobi",
    description:
      "Need skilled masons for a 3-week stone wall construction project. Tools and materials provided.",
    requirements: ["Masonry certification", "3+ years experience"],
    payRate: "KES 1,500",
    payType: "daily",
    postedTime: "1 day ago",
    applicants: 12,
  },
];

function UrgentJobRow({ job }: { job: JobListing }) {
  return (
    <div className="flex justify-between items-center bg-white border border-slate-200 rounded-lg p-3">
      <div>
        <h4 className="font-medium">{job.title}</h4>
        <p className="text-sm text-gray-500">
          {job.employer.name} • {job.location}
        </p>
        <p className="text-green-600 font-semibold text-sm">
          {job.payRate}/{job.payType}
        </p>
      </div>
      <button className="btn bg-orange-500 hover:bg-orange-400 btn-sm text-white">Apply Now</button>
    </div>
  );
}

function JobCard({ job }: { job: JobListing }) {
  return (
    <div className="card bg-white shadow border border-slate-200">
      <div className="card-body p-5">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-12">
                {job.employer.avatar ? (
                  <img src={job.employer.avatar} alt={job.employer.name} />
                ) : (
                  <span>{job.employer.name.charAt(0)}</span>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{job.title}</h3>
                {job.urgent && (
                  <div className="badge badge-error text-xs text-white">
                    Urgent
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{job.employer.name}</span>
                {job.employer.verified && (
                  <div className="badge badge-outline badge-success text-xs">
                    Verified
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  {job.employer.rating}
                </div>
              </div>
            </div>
          </div>
          <div className="badge badge-outline">{job.category}</div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" /> {job.location}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {job.postedTime}
          </div>
          <span>{job.applicants} applicants</span>
        </div>

        <p className="text-sm mt-3">{job.description}</p>

        <div>
          <h4 className="font-medium text-sm mb-2 mt-3">Requirements:</h4>
          <div className="flex flex-wrap gap-2">
            {job.requirements.map((req, i) => (
              <div key={i} className="badge badge-outline text-xs">
                {req}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-4">
          <div>
            <span className="font-semibold text-lg text-green-600">
              {job.payRate}
            </span>
            <span className="text-gray-500 text-sm">/{job.payType}</span>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline btn-sm">Save</button>
            <button className="btn bg-slate-900 text-white btn-sm">Apply Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FindWorkPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-bold">Find Work Opportunities</h1>
        <p className="text-gray-500">
          Discover jobs that match your skills and location
        </p>

        {/* Search + Filters */}
        <div className="flex items-center gap-4 mt-6 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for jobs, skills, or keywords..."
              aria-label="Search jobs"
              className="input w-full pl-10 rounded-full bg-gray-100 border-0 focus:outline-none focus:ring-2 focus:ring-slate-300 placeholder:text-gray-400"
            />
          </div>
          <select
            aria-label="Location filter"
            className="select w-48 rounded-full bg-gray-100 border-0 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <option>All Locations</option>
            <option>Westlands</option>
            <option>Karen</option>
            <option>Kilimani</option>
            <option>CBD</option>
            <option>Industrial Area</option>
          </select>
          <button type="button" className="btn btn-primary gap-2 rounded-full shadow-sm">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6 text-sm text-gray-500 mt-3">
          <span>156 jobs available</span> •
          <span>23 posted today</span> •
          <span>8 urgent positions</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Left Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {/* Categories */}
            <div className="card bg-white shadow border border-slate-200">
              <div className="card-body">
                <h2 className="card-title mb-3">Job Categories</h2>
                {categories.map((c) => (
                  <button
                    key={c.name}
                    className="btn btn-ghost justify-between w-full"
                  >
                    <div className="flex items-center gap-2">
                      <c.icon className="w-4 h-4" /> {c.name}
                    </div>
                    <div className="badge badge-secondary">{c.count}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Application Tips */}
            <div className="card bg-white shadow border border-slate-200">
              <div className="card-body">
                <h2 className="card-title mb-3">Application Tips</h2>
                {applicationTips.map((tip) => (
                  <div
                    key={tip.title}
                    className="p-3 rounded-lg bg-gray-50 mb-2"
                  >
                    <h4 className="font-medium text-sm">{tip.title}</h4>
                    <p className="text-xs text-gray-500">{tip.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Urgent Positions */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <h3 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                <span>🔔</span> Urgent Positions
              </h3>
              <div className="space-y-3">
                {featuredJobs
                  .filter((j) => j.urgent)
                  .map((job) => (
                    <UrgentJobRow key={job.id} job={job} />
                  ))}
              </div>
            </div>

            {/* All Jobs */}
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
