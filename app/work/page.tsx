"use client";

import React, { useState } from "react";
import { useWorkStore } from "@/lib/work/WorkStore";
import { useUserStore } from "@/lib/user/UserStore";

export default function WorkPage() {
  const { jobs, fetchJobs, postJobs } = useWorkStore();
  const { fetchUser } = useUserStore();

  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    requirements: [] as string[],
    pay_rate: "",
    pay_type: "hourly",
    urgent: false,
    status: "open",
    location: "",
    category: "",
  });

  const [newRequirement, setNewRequirement] = useState("");

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setJobData({
        ...jobData,
        requirements: [...jobData.requirements, newRequirement.trim()],
      });
      setNewRequirement("");
    }
  };

const handlePostJob = async () => {
  try {
    await postJobs(jobData);
    await fetchJobs();
    await fetchUser();
    
    (document.getElementById("post-job-modal") as HTMLDialogElement).close();
    
    // Reset form
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
    // You can add user-friendly error message here
    alert("Failed to post job. Please try again.");
  }
};

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Jobs</h1>
        <button
          className="btn btn-primary"
          onClick={() =>
            (document.getElementById("post-job-modal") as HTMLDialogElement).showModal()
          }
        >
          Post Job
        </button>
      </div>

      {/* Jobs List */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.length === 0 ? (
          <p className="text-gray-500">No jobs available</p>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="card shadow-md bg-base-100">
              <div className="card-body">
                <h2 className="card-title">{job.title}</h2>
                <p>{job.description}</p>
                <p className="text-sm text-gray-500">
                  {job.pay_rate} ({job.pay_type})
                </p>
                <p className="text-sm">Requirements: {job.requirements?.join(", ")}</p>
                <p className="text-sm text-gray-600">📍 {job.location}</p>
                <p className="text-sm text-gray-600">📂 {job.category}</p>
                <div className="flex justify-between items-center mt-2">
                  <span
                    className={`badge ${job.urgent ? "badge-error" : "badge-ghost"}`}
                  >
                    {job.urgent ? "Urgent" : "Not urgent"}
                  </span>
                  <span className="badge badge-outline">{job.status}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DaisyUI Modal */}
      <dialog id="post-job-modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <h3 className="font-bold text-lg mb-4">Post a Job</h3>

          {/* Title */}
          <div className="form-control mb-3">
            <input
              type="text"
              placeholder="Job Title"
              value={jobData.title}
              onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>

          {/* Description */}
          <div className="form-control mb-3">
            <textarea
              placeholder="Description"
              value={jobData.description}
              onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
              className="textarea textarea-bordered w-full"
            />
          </div>

          {/* Requirements */}
          <div className="form-control mb-3">
            <label className="label">
              <span className="label-text">Requirements</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add requirement"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                className="input input-bordered flex-1"
              />
              <button
                onClick={handleAddRequirement}
                className="btn btn-outline"
                type="button"
              >
                Add
              </button>
            </div>
            <ul className="mt-2 list-disc list-inside text-sm">
              {jobData.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>

          {/* Pay Rate */}
          <div className="form-control mb-3">
            <input
              type="text"
              placeholder="Pay Rate"
              value={jobData.pay_rate}
              onChange={(e) => setJobData({ ...jobData, pay_rate: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>

          {/* Pay Type */}
          <div className="form-control mb-3">
            <select
              value={jobData.pay_type}
              onChange={(e) => setJobData({ ...jobData, pay_type: e.target.value })}
              className="select select-bordered w-full"
            >
              <option value="hourly">Hourly</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>

          {/* Location */}
          <div className="form-control mb-3">
            <input
              type="text"
              placeholder="Location"
              value={jobData.location}
              onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
              className="input input-bordered w-full"
            />
          </div>

          {/* Category */}
          <div className="form-control mb-3">
            <select
              value={jobData.category}
              onChange={(e) => setJobData({ ...jobData, category: e.target.value })}
              className="select select-bordered w-full"
            >
              <option value="">Select category</option>
              <option value="IT">IT</option>
              <option value="Construction">Construction</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Urgent */}
          <div className="form-control mb-3">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={jobData.urgent}
                onChange={(e) => setJobData({ ...jobData, urgent: e.target.checked })}
                className="checkbox"
              />
              <span className="label-text">Urgent</span>
            </label>
          </div>

          {/* Status */}
          <div className="form-control mb-3">
            <select
              value={jobData.status}
              onChange={(e) => setJobData({ ...jobData, status: e.target.value })}
              className="select select-bordered w-full"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Actions */}
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn">Cancel</button>
              <button type="button" onClick={handlePostJob} className="btn btn-primary">
                Post Job
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
