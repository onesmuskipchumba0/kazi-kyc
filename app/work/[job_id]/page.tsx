// app/work/[job_id]/page.tsx
'use client';

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWorkStore } from "@/lib/work/WorkStore";
import { useUserStore } from "@/lib/user/UserStore";
import { 
  FiMapPin, 
  FiDollarSign, 
  FiUser, 
  FiBriefcase,
  FiCalendar,
  FiSend,
  FiArrowLeft,
  FiCheck,
  FiClock,
  FiAlertCircle,
  FiShare2
} from "react-icons/fi";
import { FaFire } from "react-icons/fa";
import Link from "next/link";
import axios from "axios";

interface EmployerInfo {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  name?: string;
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.job_id as string;
  
  const { fetchUserById, applyToJob } = useWorkStore();
  const { fetchUser } = useUserStore();
  const user = useUserStore((state) => state.user);
  
  const [job, setJob] = useState<any>(null);
  const [employer, setEmployer] = useState<EmployerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    fetchUser();
    const loadJobData = async () => {
      if (!jobId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Try to fetch the job from API first
        const res = await axios.get(`/api/jobs/${jobId}`);
        if (res.data.job) {
          const jobData = res.data.job;
          setJob(jobData);
          
          // Fetch employer information
          if (jobData.employer_id) {
            try {
              const employerData = await fetchUserById(jobData.employer_id);
              if (employerData) {
                setEmployer({
                  firstName: employerData.firstName || "",
                  lastName: employerData.lastName || "",
                  name: employerData.name,
                  avatarUrl: employerData.avatarUrl,
                });
              }
            } catch (employerError) {
              // Continue without employer data
            }
          }
        } else {
          setError("Job not found in API response");
        }
      } catch (error: any) {
        console.error("Error loading job:", error);
        
        if (error.response?.status === 404) {
          setError("Job not found");
        } else if (error.response?.data?.error) {
          setError(error.response.data.error);
        } else {
          setError("Failed to load job details");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadJobData();
  }, [jobId, fetchUserById, fetchUser]);

  // Add debug logging
  useEffect(() => {
    console.log('Current loading state:', isLoading);
  }, [job, error, isLoading]);

  const formatSalary = (pay_rate: string, pay_type: string) => {
    if (!pay_rate) return "Not specified";
    
    const rate = parseFloat(pay_rate);
    if (isNaN(rate)) return pay_rate;
    
    return pay_type === "hourly" 
      ? `KES ${rate}/hr` 
      : `KES ${rate.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      IT: "bg-blue-100 text-blue-800",
      Construction: "bg-orange-100 text-orange-800",
      Healthcare: "bg-green-100 text-green-800",
      Education: "bg-purple-100 text-purple-800",
      Other: "bg-gray-100 text-gray-800"
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  const handleApplyToJob = async () => {
    if (!job) return;

    setIsApplying(true);
    setError(null);
    try {
      await applyToJob(job.id, coverLetter);
      setShowApplyModal(false);
      setCoverLetter("");
      // Show success message or redirect
      alert('Application submitted successfully!');
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to apply to job");
    } finally {
      setIsApplying(false);
    }
  };

  const shareJob = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job?.title || 'Job',
          text: job?.description || '',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Job link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="flex justify-center items-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600">Loading job details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <FiAlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {error || "Job not found"}
            </h2>
            <p className="text-gray-600 mb-6">
              {error ? "Please try again later" : "The job you're looking for doesn't exist or has been removed."}
            </p>
            <Link href="/work" className="btn btn-primary">
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Job Board
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const employerName = employer?.name || `${employer?.firstName} ${employer?.lastName}` || "Employer";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/work" className="btn btn-ghost btn-sm">
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Link>
        </div>

        {/* Job Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{job.title}</h1>
                {job.urgent && (
                  <span className="badge badge-error gap-1 animate-pulse">
                    <FaFire className="w-3 h-3" />
                    Urgent
                  </span>
                )}
                <span className={`badge ${getCategoryColor(job.category)} font-medium`}>
                  {job.category}
                </span>
                <span className={`badge ${job.status === 'open' ? 'badge-success' : 'badge-error'}`}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </span>
              </div>

              {/* Employer Info */}
              <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
                {employer?.avatarUrl ? (
                  <img 
                    src={employer.avatarUrl} 
                    alt={employerName}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiUser className="w-6 h-6 text-blue-600" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{employerName}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiCheck className="w-4 h-4 text-green-500" />
                      <span>Verified Employer</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiDollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Pay Rate</p>
                    <p className="font-semibold text-gray-900">{formatSalary(job.pay_rate, job.pay_type)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiMapPin className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">{job.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiBriefcase className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-semibold text-gray-900 capitalize">{job.pay_type}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiCalendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Posted</p>
                    <p className="font-semibold text-gray-900">{formatDate(job.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 lg:w-48">
              {job.status === 'open' ? (
                <>
                  <button 
                    onClick={() => setShowApplyModal(true)}
                    className="btn btn-primary btn-lg shadow-lg hover:shadow-xl"
                    disabled={!user}
                  >
                    <FiSend className="w-4 h-4 mr-2" />
                    Apply Now
                  </button>
                  {!user && (
                    <p className="text-sm text-gray-500 text-center">
                      Please sign in to apply
                    </p>
                  )}
                </>
              ) : (
                <button className="btn btn-error btn-lg" disabled>
                  <FiClock className="w-4 h-4 mr-2" />
                  Position Closed
                </button>
              )}
              
              <button 
                onClick={shareJob}
                className="btn btn-outline btn-sm"
              >
                <FiShare2 className="w-4 h-4 mr-2" />
                Share Job
              </button>
            </div>
          </div>
        </div>
        {/* Job Description and Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((requirement: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <FiCheck className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Job Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{job.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Job Type:</span>
                  <span className="font-medium capitalize">{job.pay_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{job.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${job.status === 'open' ? 'text-green-600' : 'text-red-600'}`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </div>
                {job.created_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Posted:</span>
                    <span className="font-medium">{formatDate(job.created_at)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* About Employer */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">About Employer</h3>
              <div className="flex items-center gap-3 mb-4">
                {employer?.avatarUrl ? (
                  <img 
                    src={employer.avatarUrl} 
                    alt={employerName}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiUser className="w-6 h-6 text-blue-600" />
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-gray-900">{employerName}</h4>
                  <p className="text-sm text-gray-600">Verified Employer</p>
                </div>
              </div>
              <Link href={`/profile/${job.employer_id}`}>
              <button className="btn btn-outline btn-sm w-full">
                View Profile
              </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl rounded-2xl shadow-2xl p-0 overflow-hidden bg-white">
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
              <div className="flex items-center justify-between p-6">
                <h3 className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Apply for {job.title}
                </h3>
                <button 
                  className="btn btn-sm btn-circle btn-ghost"
                  onClick={() => setShowApplyModal(false)}
                >
                  <FiArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {error && (
                <div className="alert alert-error mb-6 rounded-lg">
                  <FiAlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">Job Details</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-medium">{job.title}</p>
                  <p className="text-gray-600 text-sm">{employerName} • {job.location}</p>
                  <p className="text-gray-600 text-sm">{formatSalary(job.pay_rate, job.pay_type)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Cover Letter (Optional)</span>
                  </label>
                  <textarea
                    placeholder="Tell the employer why you're interested in this position and why you'd be a good fit..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="textarea textarea-bordered rounded-xl h-32 resize-none"
                    maxLength={1000}
                  />
                  <div className="label">
                    <span className="label-text-alt text-gray-500">{coverLetter.length}/1000 characters</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-action p-6 bg-gray-50 border-t border-gray-200">
              <div className="flex gap-3 w-full flex-col sm:flex-row">
                <button 
                  className="btn btn-ghost rounded-xl flex-1 order-2 sm:order-1"
                  onClick={() => setShowApplyModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleApplyToJob}
                  disabled={isApplying}
                  className="btn btn-success rounded-xl flex-1 shadow-lg hover:shadow-xl order-1 sm:order-2"
                >
                  {isApplying ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiSend className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}