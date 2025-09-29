"use client";
import { useEffect, useState } from "react";
import { MapPin, Calendar, Star, Briefcase, Clock, DollarSign } from "lucide-react";
import { ApplicationStore } from "@/lib/my-jobs/JobsStore";
import axios from "axios";

export default function MyJobsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "application" | "completed">("active");
  const [isLoading, setIsLoading] = useState(true);
  const fetchJobs = ApplicationStore((state) => state.fetchJobs);
  const applications = ApplicationStore((state) => state.applications);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await fetchJobs();
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchJobs]);


// Open modal
const openDeleteModal = (jobId: string) => {
  setDeleteJobId(jobId);
};

// Close modal
const closeDeleteModal = () => {
  setDeleteJobId(null);
};

// Handle delete
const handleDelete = async () => {
  if (!deleteJobId) return;
  try {
    await axios.delete(`/api/applications/${deleteJobId}`);
    ApplicationStore.setState((state) => ({
      applications: state.applications.filter((job) => job.id !== deleteJobId),
    }));
  } catch (error) {
    console.error("Failed to delete job:", error);
  } finally {
    closeDeleteModal();
  }
};

  // Show loading screen
  if (isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold">My Jobs</h1>
        <p className="text-base-content/60 mb-6">
          Manage your applications, active jobs, and work history
        </p>
        
        {/* Loading skeleton */}
        <div className="space-y-6">
          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-base-100 rounded-lg p-4 shadow border border-base-200 flex items-center gap-4">
                <div className="bg-base-300 p-3 rounded-full animate-pulse">
                  <div className="w-6 h-6"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-6 w-12 bg-base-300 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-base-300 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs Skeleton */}
          <div className="flex gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 w-32 bg-base-300 rounded animate-pulse"></div>
            ))}
          </div>

          {/* Job Cards Skeleton */}
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-base-100 p-4 rounded-lg shadow border border-base-200 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-5 w-48 bg-base-300 rounded animate-pulse"></div>
                    <div className="h-4 w-32 bg-base-300 rounded animate-pulse"></div>
                  </div>
                  <div className="h-6 w-20 bg-base-300 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-full bg-base-300 rounded animate-pulse"></div>
                <div className="h-4 w-3/4 bg-base-300 rounded animate-pulse"></div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-base-300 rounded animate-pulse"></div>
                  <div className="h-6 w-24 bg-base-300 rounded animate-pulse"></div>
                </div>
                <div className="h-5 w-28 bg-base-300 rounded animate-pulse"></div>
                <div className="flex gap-2">
                  <div className="h-8 w-20 bg-base-300 rounded animate-pulse"></div>
                  <div className="h-8 w-28 bg-base-300 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Common jobs data
  const jobs = applications.map((job) => ({
    ...job,
    // ✅ normalize status so "pending" → "application"
    status: job.status === "pending" ? "application" : job.status,
  }));

  // Filtered jobs
  const filteredJobs = jobs.filter((job) => job.status === activeTab);

  // Stats
  const activeCount = jobs.filter((j) => j.status === "active").length;
  const applicationsCount = jobs.filter((j) => j.status === "application").length;
  const totalEarnings = jobs
    .filter((j) => j.status === "completed")
    .reduce((sum, job) => sum + job.pay, 0);


  // Render job card
  const renderJobCard = (job: any) => (
    <div
      key={job.id}
      className="bg-base-100 p-4 rounded-lg shadow border border-base-200 flex flex-col gap-2"
    >
      {/* Title and status */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold">{job.title}</h2>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>{job.name}</span>
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>{job.rating}</span>
          </div>
        </div>
        <span
          className={`badge ${
            job.status === "active"
              ? "badge-info"
              : job.status === "application"
              ? "badge-warning"
              : "badge-success"
          }`}
        >
          {job.status === "active"
            ? "In Progress"
            : job.status === "application"
            ? "Awaiting Approval"
            : "Completed"}
        </span>
      </div>

      {/* Description and progress */}
      {job.status === "active" && (
        <>
          <p className="text-sm text-base-content/80">{job.description}</p>
          <progress
            className="progress progress-primary w-full"
            value={job.progress}
            max="100"
          ></progress>
          <span className="text-sm">{job.progress}%</span>
        </>
      )}

      {job.status !== "active" && (
        <p className="text-sm text-base-content/80">{job.description}</p>
      )}

      {/* Details */}
      <div className="flex gap-2 flex-wrap text-sm text-base-content/70">
        <span className="badge badge-outline">{job.category}</span>
        <span className="flex items-center gap-1">
          <MapPin className="w-4 h-4" /> {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" /> {job.date}
        </span>
      </div>

      {/* Pay */}
      <p className="text-success font-semibold">
        KES {job.pay.toLocaleString()}/{job.pay_type}
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="btn btn-primary btn-sm">Contact</button>
        <button
        onClick={() =>openDeleteModal(job.id)} 
        className="btn btn-warning btn-sm">Cancel</button>
        {job.status === "active" && (
          <button className="btn btn-outline btn-sm">Update Progress</button>
        )}
      </div>

      {/*  cancel modal */}
        {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Are you sure?</h3>
            <p className="py-4">
              This action cannot be undone. Do you really want to delete this application?
            </p>
            <div className="modal-action">
              <button onClick={handleDelete} className="btn btn-error">
                Yes, Delete
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">My Jobs</h1>
      <p className="text-base-content/60 mb-6">
        Manage your applications, active jobs, and work history
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-base-100 rounded-lg p-4 shadow border border-base-200 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Briefcase className="text-blue-600 w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold">{activeCount}</span>
            <p className="text-base-content/60">Active Jobs</p>
          </div>
        </div>
        <div className="bg-base-100 rounded-lg p-4 shadow border border-base-200 flex items-center gap-4">
          <div className="bg-yellow-100 p-3 rounded-full">
            <Clock className="text-yellow-600 w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold">{applicationsCount}</span>
            <p className="text-base-content/60">Pending Applications</p>
          </div>
        </div>
        <div className="bg-base-100 rounded-lg p-4 shadow border border-base-200 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <DollarSign className="text-green-600 w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-success">
              KES {totalEarnings.toLocaleString()}
            </span>
            <p className="text-base-content/60">Total Earnings</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div role="tablist" className="tabs tabs-bordered mb-6">
        <button
          role="tab"
          className={`tab ${activeTab === "active" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("active")}
        >
          Active Jobs ({activeCount})
        </button>
        <button
          role="tab"
          className={`tab ${activeTab === "application" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("application")}
        >
          Applications ({applicationsCount})
        </button>
        <button
          role="tab"
          className={`tab ${activeTab === "completed" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          Completed ({jobs.filter((j) => j.status === "completed").length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex flex-col gap-4">
        {filteredJobs.map((job) => renderJobCard(job))}
      </div>
      {/* Cancel modal  */}
      {deleteJobId && (
      <div className="modal modal-open">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Are you sure?</h3>
          <p className="py-4">
            This action cannot be undone. Do you really want to delete this application?
          </p>
          <div className="modal-action">
            <button onClick={handleDelete} className="btn btn-error">
              Yes, Delete
            </button>
            <button onClick={closeDeleteModal} className="btn">
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}

    </div>
  );
}