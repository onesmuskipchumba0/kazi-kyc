"use client";
import { useWorkStore } from "@/lib/work/WorkStore";
import { applicationTips } from "../api/work/workData";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

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
  Plus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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
  pay_rate: string;
  pay_type: "hourly" | "daily" | "monthly" | "project";
  urgent?: boolean;
  applicants_count: number;
  created_at: string | any;
  user?: {
    firstName: string;
    lastName: string;
    profileType: string;
    location: string;
  };
}

const categories = [
  { name: "All Jobs", icon: Briefcase, count: 0 },
  { name: "House Help", icon: HomeIcon, count: 0 },
  { name: "Masonry", icon: Users, count: 0 },
  { name: "Security", icon: Shield, count: 0 },
  { name: "Food Service", icon: Utensils, count: 0 },
];

function UrgentJobRow({ job }: { job: JobListing }) {
  const employerName = job.user ? `${job.user.firstName} ${job.user.lastName}` : job.employer.name;
  
  return (
    <div className="flex justify-between items-center bg-white border border-slate-200 rounded-lg p-3">
      <div>
        <h4 className="font-medium">{job.title}</h4>
        <p className="text-sm text-gray-500">
          {employerName} • {job.location}
        </p>
        <p className="text-green-600 font-semibold text-sm">
          {job.pay_rate}/{job.pay_type}
        </p>
      </div>
      <button className="btn bg-orange-500 hover:bg-orange-400 btn-sm text-white">Apply Now</button>
    </div>
  );
}

function JobCard({ job }: { job: JobListing }) {
  const employerName = job.user ? `${job.user.firstName} ${job.user.lastName}` : job.employer.name;
  const postedTime = getTimeAgo(job.created_at);

  return (
    <div className="card bg-white shadow border border-slate-200">
      <div className="card-body p-5">
        <div className="flex items-start justify-between">
          <div className="flex gap-3">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-12">
                <span>{employerName.charAt(0)}</span>
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
                <span>{employerName}</span>
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
            <Clock className="w-4 h-4" /> {postedTime}
          </div>
          <span>{job.applicants_count} applicants</span>
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
              {job.pay_rate}
            </span>
            <span className="text-gray-500 text-sm">/{job.pay_type}</span>
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

// Helper function to format time ago
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 2592000)} months ago`;
}

export default function FindWorkPage() {
  const jobs = useWorkStore((state) => state.jobs);
  const isLoading = useWorkStore((state) => state.isLoading);
  const error = useWorkStore((state) => state.error);
  const fetchJobs = useWorkStore((state) => state.fetchJobs);
  const [selectedCategory, setSelectedCategory] = useState("All Jobs");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [searchTerm, setSearchTerm] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    fetchJobs();
    fetchUserProfile();
  }, [fetchJobs]);

  // Fetch user profile to check if they're an employer
  const fetchUserProfile = async () => {
    if (!user) {
      setProfileLoading(false);
      return;
    }
    
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePostJob = () => {
    router.push('/post-job'); // Navigate to post job page
  };

  const hasJobs = useMemo(() => jobs && jobs.length > 0, [jobs]);

  // Filter jobs based on selections
  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    
    return jobs.filter(job => {
      const matchesCategory = selectedCategory === "All Jobs" || job.category === selectedCategory;
      const matchesLocation = selectedLocation === "All Locations" || 
        job.location.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesSearch = searchTerm === "" || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requirements.some(req => req.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesCategory && matchesLocation && matchesSearch;
    });
  }, [jobs, selectedCategory, selectedLocation, searchTerm]);

  // Update category counts
  const categoriesWithCounts = useMemo(() => {
    if (!jobs) return categories;
    
    return categories.map(cat => {
      if (cat.name === "All Jobs") {
        return { ...cat, count: jobs.length };
      }
      const count = jobs.filter(job => job.category === cat.name).length;
      return { ...cat, count };
    });
  }, [jobs]);

  // Get today's jobs count
  const todaysJobsCount = useMemo(() => {
    if (!jobs) return 0;
    const today = new Date().toDateString();
    return jobs.filter(job => new Date(job.created_at).toDateString() === today).length;
  }, [jobs]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleLocationSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(e.target.value);
  };

  // Check if user is an employer
  const isEmployer = userProfile?.profileType === 'employer';

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Post Job Button */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Find Work Opportunities</h1>
            <p className="text-base-content/60">Discover jobs that match your skills and location</p>
          </div>
          
          {/* Post Job Button - Only show for employers */}
          {!profileLoading && isEmployer && (
            <button 
              onClick={handlePostJob}
              className="btn btn-primary gap-2 hidden md:flex"
            >
              <Plus className="w-4 h-4" />
              Post a Job
            </button>
          )}
        </div>

        {/* Mobile Post Job Button */}
        {!profileLoading && isEmployer && (
          <div className="md:hidden mb-4">
            <button 
              onClick={handlePostJob}
              className="btn btn-primary gap-2 w-full"
            >
              <Plus className="w-4 h-4" />
              Post a Job
            </button>
          </div>
        )}

        {/* Search + Filters */}
        <div className="flex items-center gap-4 mt-6 bg-base-100 p-4 rounded-xl shadow-sm border border-base-200">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search for jobs, skills, or keywords..."
              aria-label="Search jobs"
              value={searchTerm}
              onChange={handleSearch}
              className="input w-full pl-10 rounded-full bg-base-200 border-0 focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-base-content/50"
            />
          </div>
          <select
            aria-label="Location filter"
            value={selectedLocation}
            onChange={handleLocationSelect}
            className="select w-48 rounded-full bg-base-200 border-0 focus:outline-none focus:ring-2 focus:ring-primary/30"
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
        <div className="flex items-center gap-6 text-sm text-base-content/60 mt-3">
          {isLoading ? (
            <>
              <span className="h-4 w-28 bg-gray-200 rounded animate-pulse" /> •
              <span className="h-4 w-28 bg-gray-200 rounded animate-pulse" /> •
              <span className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
            </>
          ) : (
            <>
              <span>{filteredJobs.length} jobs available</span> •
              <span>{todaysJobsCount} posted today</span> •
              <span>{filteredJobs.filter((j) => j.urgent).length} urgent positions</span>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Left Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {/* Categories */}
            <div className="card bg-base-100 shadow border border-base-200">
              <div className="card-body">
                <h2 className="card-title mb-3">Job Categories</h2>
                {categoriesWithCounts.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleCategorySelect(c.name)}
                    className={`btn justify-between w-full ${
                      selectedCategory === c.name ? 'btn-primary' : 'btn-ghost'
                    }`}
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
            <div className="card bg-base-100 shadow border border-base-200">
              <div className="card-body">
                <h2 className="card-title mb-3">Application Tips</h2>
                {applicationTips.map((tip) => (
                  <div
                    key={tip.title}
                    className="p-3 rounded-lg bg-base-200 mb-2"
                  >
                    <h4 className="font-medium text-sm">{tip.title}</h4>
                    <p className="text-xs text-base-content/60">{tip.description}</p>
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
                {isLoading ? (
                  [...Array(3)].map((_, idx) => (
                    <div key={idx} className="h-16 bg-orange-100 rounded-lg animate-pulse" />
                  ))
                ) : (
                  filteredJobs
                    .filter((j) => j.urgent)
                    .map((job) => <UrgentJobRow key={job.id} job={job} />)
                )}
              </div>
            </div>

            {/* All Jobs */}
            {isLoading ? (
              [...Array(4)].map((_, idx) => (
                <div key={idx} className="card bg-base-100 shadow border border-base-200">
                  <div className="card-body p-5 animate-pulse">
                    <div className="h-5 w-48 bg-gray-200 rounded" />
                    <div className="mt-3 h-3 w-full bg-gray-100 rounded" />
                    <div className="mt-2 h-3 w-2/3 bg-gray-100 rounded" />
                    <div className="mt-4 h-24 w-full bg-gray-100 rounded" />
                  </div>
                </div>
              ))
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
            ) : error ? (
              <div className="alert alert-error text-white">{error}</div>
            ) : (
              <div className="text-gray-500 text-center py-8">
                No jobs found matching your criteria.
                {!profileLoading && isEmployer && (
                  <div className="mt-4">
                    <button 
                      onClick={handlePostJob}
                      className="btn btn-primary gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Be the first to post a job!
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}