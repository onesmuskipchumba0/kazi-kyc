"use client";
import { useState } from "react";
import { MapPin, Calendar, Star, Briefcase, Clock, DollarSign } from "lucide-react";

export default function MyJobsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "application" | "completed">("active");

  // Common jobs data
  const jobs = [
    {
      id: 1,
      title: "Residential Garden Wall",
      name: "Mary Wanjiku",
      rating: 4.8,
      progress: 65,
      description:
        "Building decorative garden wall with natural stones. Project is progressing well and on schedule.",
      category: "Masonry",
      location: "Westlands, Nairobi",
      date: "Started 3 days ago",
      pay: 3000,
      status: "active",
    },
    {
      id: 2,
      title: "Part-time House Cleaning",
      name: "James Otieno",
      rating: 4.5,
      progress: 90,
      description:
        "Regular cleaning schedule 3 times per week. Client is very satisfied with the work quality.",
      category: "House Help",
      location: "Kilimani, Nairobi",
      date: "Started 2 weeks ago",
      pay: 800,
      status: "active",
    },
    {
      id: 3,
      title: "Full-time Gardener",
      name: "Sarah Njeri",
      rating: 4.7,
      description:
        "Looking for a dedicated gardener for daily maintenance of a residential compound.",
      category: "Gardening",
      location: "Karen, Nairobi",
      date: "Applied 5 days ago",
      pay: 2000,
      status: "application",
    },
    {
      id: 4,
      title: "Office Cleaning Services",
      name: "David Mwangi",
      rating: 4.6,
      description:
        "Pending approval for weekly cleaning of small office block in CBD.",
      category: "Cleaning",
      location: "Nairobi CBD",
      date: "Applied 1 week ago",
      pay: 1500,
      status: "application",
    },
    {
      id: 5,
      title: "Home Painting Project",
      name: "Peter Kamau",
      rating: 4.9,
      description:
        "Completed full interior painting of a 3-bedroom house with high quality finishes.",
      category: "Painting",
      location: "Runda, Nairobi",
      date: "Completed 1 month ago",
      pay: 5000,
      status: "completed",
    },
    {
      id: 6,
      title: "Fence Repair Work",
      name: "Lucy Muthoni",
      rating: 4.8,
      description:
        "Successfully repaired and reinforced perimeter fence with metal support.",
      category: "Construction",
      location: "Lang'ata, Nairobi",
      date: "Completed 3 weeks ago",
      pay: 2500,
      status: "completed",
    },
  ];

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
      className="bg-white p-4 rounded-lg shadow flex flex-col gap-2"
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
          <p className="text-sm text-gray-700">{job.description}</p>
          <progress
            className="progress progress-primary w-full"
            value={job.progress}
            max="100"
          ></progress>
          <span className="text-sm">{job.progress}%</span>
        </>
      )}

      {job.status !== "active" && (
        <p className="text-sm text-gray-700">{job.description}</p>
      )}

      {/* Details */}
      <div className="flex gap-2 flex-wrap text-sm text-gray-600">
        <span className="badge badge-outline">{job.category}</span>
        <span className="flex items-center gap-1">
          <MapPin className="w-4 h-4" /> {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" /> {job.date}
        </span>
      </div>

      {/* Pay */}
      <p className="text-green-600 font-semibold">KES {job.pay.toLocaleString()}/daily</p>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="btn btn-outline btn-sm">Contact</button>
        {job.status === "active" && (
          <button className="btn btn-sm">Update Progress</button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">My Jobs</h1>
      <p className="text-gray-600 mb-6">
        Manage your applications, active jobs, and work history
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <Briefcase className="text-blue-600 w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold">{activeCount}</span>
            <p className="text-gray-600">Active Jobs</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow flex items-center gap-4">
          <div className="bg-yellow-100 p-3 rounded-full">
            <Clock className="text-yellow-600 w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold">{applicationsCount}</span>
            <p className="text-gray-600">Pending Applications</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-full">
            <DollarSign className="text-green-600 w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-green-600">
              KES {totalEarnings.toLocaleString()}
            </span>
            <p className="text-gray-600">Total Earnings</p>
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
    </div>
  );
}
