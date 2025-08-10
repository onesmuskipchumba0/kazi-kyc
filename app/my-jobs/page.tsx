"use client";
import { useState } from "react";
import { MapPin, Calendar, Star } from "lucide-react";

export default function MyJobsPage() {
  const [activeTab, setActiveTab] = useState("active");

  const activeJobs = [
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
      startDate: "Started 3 days ago",
      pay: "KES 3,000/daily",
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
      startDate: "Started 2 weeks ago",
      pay: "KES 800/daily",
    },
  ];

  const applications = [
    {
      id: 1,
      title: "Full-time Gardener",
      name: "Sarah Njeri",
      rating: 4.7,
      status: "Awaiting Approval",
      description:
        "Looking for a dedicated gardener for daily maintenance of a residential compound.",
      category: "Gardening",
      location: "Karen, Nairobi",
      date: "Applied 5 days ago",
      pay: "KES 2,000/daily",
    },
  ];

  const completedJobs = [
    {
      id: 1,
      title: "Home Painting Project",
      name: "Peter Kamau",
      rating: 4.9,
      description:
        "Completed full interior painting of a 3-bedroom house with high quality finishes.",
      category: "Painting",
      location: "Runda, Nairobi",
      date: "Completed 1 month ago",
      pay: "KES 5,000/daily",
    },
  ];

  const renderJobCard = (job, type) => (
    <div
      key={job.id}
      className="bg-white p-4 rounded-lg shadow flex flex-col gap-2"
    >
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
            type === "active"
              ? "badge-info"
              : type === "applications"
              ? "badge-warning"
              : "badge-success"
          }`}
        >
          {type === "active"
            ? "In Progress"
            : type === "applications"
            ? job.status
            : "Completed"}
        </span>
      </div>

      {type === "active" && (
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

      {type !== "active" && (
        <p className="text-sm text-gray-700">{job.description}</p>
      )}

      <div className="flex gap-2 flex-wrap text-sm text-gray-600">
        <span className="badge badge-outline">{job.category}</span>
        <span className="flex items-center gap-1">
          <MapPin className="w-4 h-4" /> {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />{" "}
          {type === "active" ? job.startDate : job.date}
        </span>
      </div>

      <p className="text-green-600 font-semibold">{job.pay}</p>

      <div className="flex gap-2">
        <button className="btn btn-outline btn-sm">Contact</button>
        {type === "active" && (
          <button className="btn btn-sm">Update Progress</button>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">My Jobs</h1>
      <p className="text-gray-600 mb-6">
        Manage your applications, active jobs, and work history
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow flex flex-col items-center">
          <span className="text-2xl font-bold">2</span>
          <span className="text-gray-600">Active Jobs</span>
        </div>
        <div className="bg-white rounded-lg p-4 shadow flex flex-col items-center">
          <span className="text-2xl font-bold">1</span>
          <span className="text-gray-600">Pending Applications</span>
        </div>
        <div className="bg-white rounded-lg p-4 shadow flex flex-col items-center">
          <span className="text-2xl font-bold text-green-600">KES 22,200</span>
          <span className="text-gray-600">Total Earnings</span>
        </div>
      </div>

      {/* Tabs */}
      <div role="tablist" className="tabs tabs-bordered mb-6">
        <button
          role="tab"
          className={`tab ${activeTab === "active" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("active")}
        >
          Active Jobs ({activeJobs.length})
        </button>
        <button
          role="tab"
          className={`tab ${activeTab === "applications" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("applications")}
        >
          Applications ({applications.length})
        </button>
        <button
          role="tab"
          className={`tab ${activeTab === "completed" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          Completed ({completedJobs.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex flex-col gap-4">
        {activeTab === "active" &&
          activeJobs.map((job) => renderJobCard(job, "active"))}
        {activeTab === "applications" &&
          applications.map((job) => renderJobCard(job, "applications"))}
        {activeTab === "completed" &&
          completedJobs.map((job) => renderJobCard(job, "completed"))}
      </div>
    </div>
  );
}
