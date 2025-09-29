"use client";

import React, { useState, useEffect } from "react";
import { useWorkStore } from "@/lib/work/WorkStore";
import { useUserStore } from "@/lib/user/UserStore";
import { 
  FiSearch, 
  FiMapPin, 
  FiDollarSign, 
  FiUser, 
  FiBriefcase,
  FiPlus,
  FiX,
  FiCheck,
  FiCalendar,
  FiSend
} from "react-icons/fi";
import { FaFire } from "react-icons/fa";

interface EmployerInfo {
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export default function WorkPage() {
  const { jobs, fetchJobs, postJobs, isLoading, fetchUserById, applyToJob } = useWorkStore();
  const { fetchUser } = useUserStore();

  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    requirements: [] as string[],
    pay_rate: "",
    pay_type: "hourly" as "hourly" | "fixed",
    urgent: false,
    status: "open" as "open" | "closed",
    location: "",
    category: "",
  });

  const [newRequirement, setNewRequirement] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [userCache, setUserCache] = useState<{[key: string]: EmployerInfo}>({});
  const [coverLetter, setCoverLetter] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Fetch user data for a job and update cache
  const fetchJobUser = async (employerId: string) => {
    if (!employerId) return null;
    
    if (userCache[employerId]) return userCache[employerId];
    
    try {
      const user = await fetchUserById(employerId);
      if (user) {
        const employerInfo = {
          firstName: user.firstName || "Unknown",
          lastName: user.lastName || "Employer",
          avatarUrl: user.avatarUrl
        };
        setUserCache(prev => ({ ...prev, [employerId]: employerInfo }));
        return employerInfo;
      }
    } catch (error) {
      console.error("Error fetching employer:", error);
    }
    return null;
  };

  // Load employer data for all jobs on component mount
  useEffect(() => {
    const loadEmployers = async () => {
      const jobsWithEmployers = jobs.filter(job => job.employer_id);
      for (const job of jobsWithEmployers) {
        if (job.employer_id && !userCache[job.employer_id]) {
          await fetchJobUser(job.employer_id);
        }
      }
    };

    if (jobs.length > 0) {
      loadEmployers();
    }
  }, [jobs]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.requirements.some(req => req.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === "all" || job.category === filterCategory;
    const matchesStatus = filterStatus === "all" || job.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ["IT", "Construction", "Healthcare", "Education", "Other"];

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setJobData({
        ...jobData,
        requirements: [...jobData.requirements, newRequirement.trim()],
      });
      setNewRequirement("");
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setJobData({
      ...jobData,
      requirements: jobData.requirements.filter((_, i) => i !== index),
    });
  };

  const handlePostJob = async () => {
    try {
      await postJobs(jobData);
      await fetchUser();
      
      (document.getElementById("post-job-modal") as HTMLDialogElement)?.close();
      
      setJobData({
        title: "",
        description: "",
        requirements: [],
        pay_rate: "",
        pay_type: "hourly",
        urgent: false,
        status: "open",
        location: "",
        category: "",
      });
    } catch (error) {
      console.error("Failed to post job:", error);
      alert("Failed to post job. Please try again.");
    }
  };

  const handleApplyToJob = async () => {
    if (!selectedJobId) return;

    setIsApplying(true);
    try {
      await applyToJob(selectedJobId, coverLetter);
      alert("Application submitted successfully!");
      (document.getElementById("apply-job-modal") as HTMLDialogElement)?.close();
      setCoverLetter("");
      setSelectedJobId(null);
    } catch (error: any) {
      alert(error.response?.data?.error || "Failed to apply to job");
    } finally {
      setIsApplying(false);
    }
  };

  const openApplyModal = (jobId: string) => {
    setSelectedJobId(jobId);
    setCoverLetter("");
    (document.getElementById("apply-job-modal") as HTMLDialogElement)?.showModal();
  };

  const formatSalary = (pay_rate: string, pay_type: string) => {
    const rate = parseFloat(pay_rate);
    if (isNaN(rate)) return pay_rate;
    
    return pay_type === "hourly" 
      ? `$${rate}/hr` 
      : `$${rate.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      IT: "bg-blue-50 text-blue-700",
      Construction: "bg-orange-50 text-orange-700",
      Healthcare: "bg-green-50 text-green-700",
      Education: "bg-purple-50 text-purple-700",
      Other: "bg-gray-50 text-gray-700"
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  const getEmployerName = (job: any) => {
    if (job.employer_id && userCache[job.employer_id]) {
      const employer = userCache[job.employer_id];
      return `${employer.firstName} ${employer.lastName}`;
    }
    return job.employer?.name || "Employer";
  };

  const getEmployerAvatar = (job: any) => {
    if (job.employer_id && userCache[job.employer_id]?.avatarUrl) {
      return userCache[job.employer_id].avatarUrl;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold  bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Job Board
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Discover your next career opportunity</p>
            </div>
            <button
              className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => (document.getElementById("post-job-modal") as HTMLDialogElement)?.showModal()}
            >
              <FiPlus className="w-5 h-5 mr-2" />
              Post New Job
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <label className="label">
                <span className="label-text font-semibold text-gray-700">Search Jobs</span>
              </label>
              <div className="relative">
                <FiSearch className="w-5 h-5 absolute left-4 top-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, description, or requirements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-bordered w-full pl-12 pr-4 py-3 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold text-gray-700">Category</span>
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="select select-bordered w-full rounded-xl"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold text-gray-700">Status</span>
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="select select-bordered w-full rounded-xl"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Available Positions <span className="text-blue-600">({filteredJobs.length})</span>
              </h2>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <FiBriefcase className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or post a new job</p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredJobs.map((job) => {
                  const employerName = getEmployerName(job);
                  const employerAvatar = getEmployerAvatar(job);

                  return (
                    <div key={job.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-1">
                              {job.title}
                            </h3>
                            
                            <div className="flex items-center text-gray-600 mb-2">
                              {employerAvatar ? (
                                <img 
                                  src={employerAvatar} 
                                  alt={employerName}
                                  className="w-6 h-6 rounded-full mr-2"
                                />
                              ) : (
                                <FiUser className="w-4 h-4 mr-1" />
                              )}
                              <span className="text-sm">{employerName}</span>
                              <FiCheck className="w-3 h-3 ml-1 text-green-500" />
                            </div>
                          </div>
                          {job.urgent && (
                            <span className="badge badge-error gap-1 animate-pulse">
                              <FaFire className="w-3 h-3" />
                              Urgent
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 line-clamp-3 mb-4 text-sm">{job.description}</p>

                        {job.requirements.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              {job.requirements.slice(0, 3).map((req, idx) => (
                                <span key={idx} className="badge badge-outline badge-sm rounded-lg">
                                  {req}
                                </span>
                              ))}
                              {job.requirements.length > 3 && (
                                <span className="badge badge-ghost badge-sm rounded-lg">
                                  +{job.requirements.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center text-gray-600">
                            <FiDollarSign className="w-4 h-4 mr-2 text-green-500" />
                            <span className="text-sm font-medium">{formatSalary(job.pay_rate, job.pay_type)}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FiMapPin className="w-4 h-4 mr-2 text-red-500" />
                            <span className="text-sm">{job.location}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FiBriefcase className="w-4 h-4 mr-2 text-blue-500" />
                            <span className="text-sm">{job.category}</span>
                          </div>
                          {job.created_at && (
                            <div className="flex items-center text-gray-500">
                              <FiCalendar className="w-4 h-4 mr-2" />
                              <span className="text-xs">{formatDate(job.created_at)}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <span className={`badge rounded-full ${getCategoryColor(job.category)}`}>
                            {job.category}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className={`badge rounded-full ${job.status === 'open' ? 'badge-success' : 'badge-error'}`}>
                              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                            </span>
                            <button 
                              onClick={() => openApplyModal(job.id)}
                              className="btn btn-primary btn-sm rounded-full shadow hover:shadow-md transition-shadow"
                              disabled={job.status !== 'open'}
                            >
                              Apply Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Post Job Modal */}
      <dialog id="post-job-modal" className="modal">
        <div className="modal-box max-w-4xl rounded-2xl shadow-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">
              <FiX className="w-5 h-5" />
            </button>
          </form>
          
          <h3 className="font-bold text-2xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Post a New Job
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto pr-2">
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Job Title *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Senior Frontend Developer"
                  value={jobData.title}
                  onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                  className="input input-bordered rounded-xl"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Description *</span>
                </label>
                <textarea
                  placeholder="Describe the job responsibilities..."
                  value={jobData.description}
                  onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                  className="textarea textarea-bordered rounded-xl h-32"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Requirements</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a requirement..."
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
                    className="input input-bordered flex-1 rounded-xl"
                  />
                  <button
                    onClick={handleAddRequirement}
                    className="btn btn-outline rounded-xl"
                    type="button"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {jobData.requirements.map((req, idx) => (
                    <span key={idx} className="badge badge-primary gap-1 rounded-lg">
                      {req}
                      <button onClick={() => handleRemoveRequirement(idx)} className="hover:text-error">
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Pay Rate *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 50"
                    value={jobData.pay_rate}
                    onChange={(e) => setJobData({ ...jobData, pay_rate: e.target.value })}
                    className="input input-bordered rounded-xl"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Pay Type *</span>
                  </label>
                  <select
                    value={jobData.pay_type}
                    onChange={(e) => setJobData({ ...jobData, pay_type: e.target.value as "hourly" | "fixed" })}
                    className="select select-bordered rounded-xl"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Location *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., New York, NY or Remote"
                  value={jobData.location}
                  onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
                  className="input input-bordered rounded-xl"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Category *</span>
                </label>
                <select
                  value={jobData.category}
                  onChange={(e) => setJobData({ ...jobData, category: e.target.value })}
                  className="select select-bordered rounded-xl"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Status</span>
                  </label>
                  <select
                    value={jobData.status}
                    onChange={(e) => setJobData({ ...jobData, status: e.target.value as "open" | "closed" })}
                    className="select select-bordered rounded-xl"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="cursor-pointer flex items-center gap-3 pt-8">
                    <input
                      type="checkbox"
                      checked={jobData.urgent}
                      onChange={(e) => setJobData({ ...jobData, urgent: e.target.checked })}
                      className="checkbox checkbox-primary rounded"
                    />
                    <span className="label-text font-semibold">Urgent</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-action mt-6">
            <form method="dialog" className="flex gap-3 w-full">
              <button className="btn btn-ghost rounded-xl flex-1">Cancel</button>
              <button 
                type="button" 
                onClick={handlePostJob} 
                className="btn btn-primary rounded-xl flex-1 shadow-lg hover:shadow-xl"
                disabled={!jobData.title || !jobData.description || !jobData.pay_rate || !jobData.location || !jobData.category}
              >
                Post Job
              </button>
            </form>
          </div>
        </div>
      </dialog>

      {/* Apply Job Modal */}
      <dialog id="apply-job-modal" className="modal">
        <div className="modal-box max-w-2xl rounded-2xl shadow-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">
              <FiX className="w-5 h-5" />
            </button>
          </form>
          
          <h3 className="font-bold text-2xl mb-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Apply for Job
          </h3>
          <p className="text-gray-600 mb-6">Submit your application for this position</p>

          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Cover Letter (Optional)</span>
              </label>
              <textarea
                placeholder="Tell the employer why you're interested in this position..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="textarea textarea-bordered rounded-xl h-32"
                maxLength={1000}
              />
              <div className="label">
                <span className="label-text-alt text-gray-500">{coverLetter.length}/1000 characters</span>
              </div>
            </div>
          </div>

          <div className="modal-action mt-6">
            <form method="dialog" className="flex gap-3 w-full">
              <button className="btn btn-ghost rounded-xl flex-1">Cancel</button>
              <button 
                type="button" 
                onClick={handleApplyToJob}
                disabled={isApplying}
                className="btn btn-success rounded-xl flex-1 shadow-lg hover:shadow-xl"
              >
                {isApplying ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    <FiSend className="w-4 h-4 mr-2" />
                    Submit Application
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}