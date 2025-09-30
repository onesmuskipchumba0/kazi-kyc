"use client";
import { useEffect, useState } from "react";
import { MapPin, Calendar, Star, Briefcase, Clock, DollarSign, Building, MessageCircle } from "lucide-react";
import { ApplicationStore } from "@/lib/my-jobs/JobsStore";
import axios from "axios";
import { useRouter } from "next/navigation";

// Define the application type based on your data structure
type ApplicationStatus = "active" | "completed" | "pending" | "cancelled" | "accepted";

interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  status: ApplicationStatus;
  cover_letter: string;
  applied_at: string;
  title: string;
  name: string;
  rating: number;
  progress: number;
  pay_type: string;
  description: string;
  category: string;
  location: string;
  date: string;
  pay: number;
  company?: string;
  salary?: string;
  type?: string;
  employer_id?: string;
}


export default function MyJobsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"active" | "application" | "completed">("active");
  const [isLoading, setIsLoading] = useState(true);
  const fetchJobs = ApplicationStore((state) => state.fetchJobs);
  const applications = ApplicationStore((state) => state.applications);
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await fetchJobs();
      } catch {
        // Error handling
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchJobs]);

  const openDeleteModal = (jobId: string) => {
    setDeleteJobId(jobId);
  };

  const closeDeleteModal = () => {
    setDeleteJobId(null);
  };

  const handleDelete = async () => {
    if (!deleteJobId) return;
    try {
      await axios.delete(`/api/applications/${deleteJobId}`);
      ApplicationStore.setState((state) => ({
        applications: state.applications.filter((job) => job.id !== deleteJobId),
      }));
    } catch {
      // Error handling
    } finally {
      closeDeleteModal();
    }
  };

  const handleContactEmployer = (employerId: string | undefined) => {
    if (employerId) {
      router.push(`/messages?user=${employerId}`);
    }
  };

  const getFilteredJobs = () => {
    switch (activeTab) {
      case "active":
        return applications.filter((app) => app.status === "accepted" as any|| app.status === "active");
      case "application":
        return applications.filter((app) => app.status === "pending");
      case "completed":
        return applications.filter((app) => app.status === "completed");
      default:
        return [];
    }
  };

  const filteredJobs = getFilteredJobs();

  const activeCount = applications.filter((app) => app.status === "accepted" as any|| app.status === "active").length;
  const applicationsCount = applications.filter((app) => app.status === "pending").length;
  const completedCount = applications.filter((app) => app.status === "completed").length;
  
  const totalEarnings = applications
    .filter((app) => app.status === "completed")
    .reduce((sum, app) => sum + (app.pay || 0), 0);

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold">My Jobs</h1>
        <p className="text-base-content/60 mb-6">
          Manage your applications, active jobs, and work history
        </p>
        
        <div className="space-y-6">
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

          <div className="flex gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 w-32 bg-base-300 rounded animate-pulse"></div>
            ))}
          </div>

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

  const renderActiveJobCard = (application: Application) => (
    <div
      key={application.id}
      className="bg-base-100 p-6 rounded-lg shadow border border-base-200 flex flex-col gap-4"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2 className="font-bold text-xl mb-2">
            {application.title}
          </h2>
          <div className="flex items-center gap-2 text-base-content/70 mb-2">
            <Building className="w-4 h-4" />
            <span className="font-medium">{application.name || application.company || "Company"}</span>
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>{application.rating || 0}</span>
          </div>
        </div>
        <span className="badge badge-success badge-lg">
          Active Job
        </span>
      </div>

      {application.description && (
        <p className="text-base-content/80 leading-relaxed">
          {application.description}
        </p>
      )}

      <div className="flex flex-wrap gap-4 text-sm text-base-content/70">
        {application.location && (
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{application.location}</span>
          </div>
        )}
        
        {application.pay && (
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span className="font-semibold text-success">
              KES {application.pay.toLocaleString()}/{application.pay_type}
            </span>
          </div>
        )}
        
        {application.type && (
          <span className="badge badge-outline">{application.type}</span>
        )}
        
        {application.category && (
          <span className="badge badge-secondary">{application.category}</span>
        )}

        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>Hired on {new Date(application.applied_at).toLocaleDateString()}</span>
        </div>
      </div>

      {application.progress > 0 && (
        <div className="mt-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{application.progress}%</span>
          </div>
          <progress
            className="progress progress-primary w-full"
            value={application.progress}
            max="100"
          ></progress>
        </div>
      )}

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-2">Your Application</h4>
        <p className="text-sm text-base-content/70 bg-base-200 p-3 rounded">
          {application.cover_letter}
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <button 
          className="btn btn-primary btn-sm"
          onClick={() => handleContactEmployer(application.employer_id)}
        >
          <MessageCircle className="w-4 h-4 mr-1" />
          Message
        </button>
        <button 
          onClick={() => openDeleteModal(application.id)} 
          className="btn btn-outline btn-error btn-sm"
        >
          Leave Job
        </button>
      </div>
    </div>
  );

  const renderApplicationCard = (application: Application) => (
    <div
      key={application.id}
      className="bg-base-100 p-6 rounded-lg shadow border border-base-200 flex flex-col gap-4"
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-bold text-xl mb-2">
            {application.title}
          </h2>
          <div className="flex items-center gap-2 text-base-content/70">
            <Building className="w-4 h-4" />
            <span>{application.name || application.company || "Company"}</span>
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>{application.rating || 0}</span>
          </div>
        </div>
        <span className="badge badge-warning badge-lg">Under Review</span>
      </div>

      {application.description && (
        <p className="text-base-content/80 leading-relaxed">
          {application.description}
        </p>
      )}

      <div className="flex flex-wrap gap-4 text-sm text-base-content/70">
        {application.location && (
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{application.location}</span>
          </div>
        )}
        
        {application.pay && (
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span className="font-semibold">
              KES {application.pay.toLocaleString()}/{application.pay_type}
            </span>
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-2">Your Cover Letter</h4>
        <p className="text-sm text-base-content/70 bg-base-200 p-3 rounded">
          {application.cover_letter}
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm text-base-content/60">
        <Calendar className="w-4 h-4" />
        <span>Applied on {new Date(application.applied_at).toLocaleDateString()}</span>
      </div>

      <div className="flex gap-3">
        <button 
          onClick={() => openDeleteModal(application.id)} 
          className="btn btn-outline btn-error btn-sm"
        >
          Cancel Application
        </button>
      </div>
    </div>
  );

  const renderCompletedJobCard = (application: Application) => (
    <div
      key={application.id}
      className="bg-base-100 p-6 rounded-lg shadow border border-base-200 flex flex-col gap-4"
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-bold text-xl mb-2">
            {application.title}
          </h2>
          <div className="flex items-center gap-2 text-base-content/70">
            <Building className="w-4 h-4" />
            <span>{application.name || application.company || "Company"}</span>
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span>{application.rating || 0}</span>
          </div>
        </div>
        <span className="badge badge-success badge-lg">Completed</span>
      </div>

      {application.description && (
        <p className="text-base-content/80 leading-relaxed">
          {application.description}
        </p>
      )}

      {application.pay && (
        <div className="flex items-center gap-1 text-success font-semibold">
          <DollarSign className="w-4 h-4" />
          <span>Earned: KES {application.pay.toLocaleString()}</span>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm text-base-content/60">
        <Calendar className="w-4 h-4" />
        <span>Completed on {new Date(application.applied_at).toLocaleDateString()}</span>
      </div>

      <div className="flex gap-3">
        <button className="btn btn-outline btn-sm">
          Leave Review
        </button>
        <button className="btn btn-ghost btn-sm">
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">My Jobs</h1>
      <p className="text-base-content/60 mb-6">
        Manage your applications, active jobs, and work history
      </p>

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
          Completed ({completedCount})
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-base-100 rounded-lg border border-base-200">
            <Briefcase className="w-16 h-16 text-base-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {activeTab === "active" && "No Active Jobs"}
              {activeTab === "application" && "No Pending Applications"}
              {activeTab === "completed" && "No Completed Jobs"}
            </h3>
            <p className="text-base-content/60 mb-6">
              {activeTab === "active" && "You don't have any active jobs at the moment."}
              {activeTab === "application" && "You don't have any pending applications."}
              {activeTab === "completed" && "You haven't completed any jobs yet."}
            </p>
            {activeTab === "application" && (
              <button className="btn btn-primary">Browse Jobs</button>
            )}
          </div>
        ) : (
          filteredJobs.map((application) => {
            switch (activeTab) {
              case "active":
                return renderActiveJobCard(application as Application);
              case "application":
                return renderApplicationCard(application as Application);
              case "completed":
                return renderCompletedJobCard(application as Application);
              default:
                return null;
            }
          })
        )}
      </div>

      {deleteJobId && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Are you sure?</h3>
            <p className="py-4">
              {activeTab === "application" 
                ? "This will cancel your application. This action cannot be undone."
                : "This will remove you from this job. This action cannot be undone."
              }
            </p>
            <div className="modal-action">
              <button onClick={handleDelete} className="btn btn-error">
                Yes, {activeTab === "application" ? "Cancel Application" : "Leave Job"}
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