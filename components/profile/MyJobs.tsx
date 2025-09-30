"use client";

import React, { useEffect, useState } from "react";
import { useUserStore } from "@/lib/user/UserStore";
import axios from "axios";
import { 
  Briefcase, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Loader2,
  Calendar,
  MapPin,
  DollarSign,
  X,
  Clock,
  FileText,
  Users,
  Globe,
  Bookmark,
  Share2,
  ArrowRight,
  CheckCircle
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company?: string;
  location?: string;
  salary?: string;
  type?: string;
  postedDate?: string;
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  applicationStatus?: string;
  applicationDate?: string;
  category?: string;
  experienceLevel?: string;
  remote?: boolean;
  [key: string]: any;
}

const MyJobs: React.FC = () => {
  const fetchUser = useUserStore((state) => state.fetchUser);
  const user = useUserStore((state) => state.user);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await fetchUser();

      if (!user?.public_id) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await axios.get(`/api/user/jobs/${user.public_id}`);
        const jobsArray = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.jobs)
          ? res.data.jobs
          : [];
        setJobs(jobsArray);
      } catch (err) {
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchUser, user?.public_id]);

  // Function to open job details modal
  const handleViewDetails = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  // Mock function for saving job
  const handleSaveJob = (jobId: string) => {
    console.log("Saving job:", jobId);
    // Implement actual save functionality
  };

  // Mock function for sharing job
  const handleShareJob = (job: Job) => {
    console.log("Sharing job:", job.title);
    // Implement actual share functionality
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg font-semibold">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <User className="h-6 w-6" />
          <span>Unable to load user information</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            <Briefcase className="h-8 w-8 text-primary" />
            My Job Dashboard
          </h1>
          <p className="text-base-content/70">Manage and view your job applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="stat bg-base-100 rounded-lg shadow-sm">
            <div className="stat-figure text-primary">
              <Briefcase className="h-6 w-6" />
            </div>
            <div className="stat-title">Total Jobs</div>
            <div className="stat-value text-2xl">{jobs.length}</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-sm">
            <div className="stat-figure text-secondary">
              <User className="h-6 w-6" />
            </div>
            <div className="stat-title">Profile Type</div>
            <div className="stat-value text-xl capitalize">{user.profileType || "N/A"}</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-sm">
            <div className="stat-figure text-accent">
              <Mail className="h-6 w-6" />
            </div>
            <div className="stat-title">Email</div>
            <div className="stat-desc truncate">{user.email}</div>
          </div>

          <div className="stat bg-base-100 rounded-lg shadow-sm">
            <div className="stat-figure text-info">
              <Phone className="h-6 w-6" />
            </div>
            <div className="stat-title">Phone</div>
            <div className="stat-desc">{user.phoneNumber || "Not provided"}</div>
          </div>
        </div>

        {/* Jobs Section */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex justify-between items-center mb-6">
              <h2 className="card-title text-2xl">
                <Briefcase className="h-6 w-6 text-primary" />
                Your Job Applications
              </h2>
              <div className="badge badge-primary badge-lg">
                {jobs.length} {jobs.length === 1 ? 'Job' : 'Jobs'}
              </div>
            </div>

            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="h-16 w-16 text-base-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                <p className="text-base-content/70 mb-6">
                  You haven't applied to any jobs yet. Start exploring opportunities!
                </p>
                <button className="btn btn-primary">
                  Browse Jobs
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <div key={job.id} className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="card-body">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="card-title text-lg mb-2">{job.title}</h3>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-base-content/70 mb-3">
                            {job.company && (
                              <div className="flex items-center gap-1">
                                <Building className="h-4 w-4" />
                                <span>{job.company}</span>
                              </div>
                            )}
                            
                            {job.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{job.location}</span>
                              </div>
                            )}
                            
                            {job.salary && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                <span>{job.salary}</span>
                              </div>
                            )}
                            
                            {job.type && (
                              <div className="badge badge-outline">{job.type}</div>
                            )}
                            
                            {job.postedDate && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(job.postedDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>

                          {job.applicationStatus && (
                            <div className="flex items-center gap-2">
                              <div className={`badge ${
                                job.applicationStatus === 'Applied' ? 'badge-info' :
                                job.applicationStatus === 'Under Review' ? 'badge-warning' :
                                job.applicationStatus === 'Interview' ? 'badge-primary' :
                                job.applicationStatus === 'Accepted' ? 'badge-success' :
                                'badge-error'
                              }`}>
                                {job.applicationStatus}
                              </div>
                              {job.applicationDate && (
                                <span className="text-xs text-base-content/60">
                                  Applied on {new Date(job.applicationDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={() => handleViewDetails(job)}
                          >
                            View Details
                          </button>
                          <button className="btn btn-sm btn-primary">
                            View Applicants
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      {isModalOpen && selectedJob && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{selectedJob.title}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-base-content/70 mb-3">
                  {selectedJob.company && (
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      <span className="font-semibold">{selectedJob.company}</span>
                    </div>
                  )}
                  
                  {selectedJob.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedJob.location}</span>
                    </div>
                  )}
                  
                  {selectedJob.experienceLevel && (
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{selectedJob.experienceLevel}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedJob.type && (
                    <div className="badge badge-primary">{selectedJob.type}</div>
                  )}
                  {selectedJob.category && (
                    <div className="badge badge-secondary">{selectedJob.category}</div>
                  )}
                  {selectedJob.remote && (
                    <div className="badge badge-accent">Remote</div>
                  )}
                  {selectedJob.salary && (
                    <div className="badge badge-outline badge-success">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {selectedJob.salary}
                    </div>
                  )}
                </div>
              </div>
              
              <button 
                className="btn btn-sm btn-circle btn-ghost ml-4"
                onClick={handleCloseModal}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[60vh] pr-4">
              {/* Application Status */}
              {selectedJob.applicationStatus && (
                <div className="mb-6 p-4 bg-base-200 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-info" />
                    Application Status
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className={`badge badge-lg ${
                      selectedJob.applicationStatus === 'Applied' ? 'badge-info' :
                      selectedJob.applicationStatus === 'Under Review' ? 'badge-warning' :
                      selectedJob.applicationStatus === 'Interview' ? 'badge-primary' :
                      selectedJob.applicationStatus === 'Accepted' ? 'badge-success' :
                      'badge-error'
                    }`}>
                      {selectedJob.applicationStatus}
                    </div>
                    {selectedJob.applicationDate && (
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-4 w-4" />
                        Applied on {new Date(selectedJob.applicationDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Job Description */}
              {selectedJob.description && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Job Description
                  </h3>
                  <p className="text-base-content/80 leading-relaxed">
                    {selectedJob.description}
                  </p>
                </div>
              )}

              {/* Requirements */}
              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5 text-secondary" />
                    Requirements
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-base-content/80">
                    {selectedJob.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Responsibilities */}
              {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-accent" />
                    Key Responsibilities
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-base-content/80">
                    {selectedJob.responsibilities.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-success" />
                    Benefits & Perks
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-base-content/80">
                    {selectedJob.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-action">
              <div className="flex gap-2">
                <button 
                  className="btn btn-outline"
                  onClick={() => handleShareJob(selectedJob)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
                <button 
                  className="btn btn-ghost"
                  onClick={() => handleSaveJob(selectedJob.id)}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </button>
                <button className="btn btn-primary">
                  Track Application
                  <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Backdrop */}
          <div className="modal-backdrop" onClick={handleCloseModal}></div>
        </div>
      )}
    </div>
  );
};

export default MyJobs;