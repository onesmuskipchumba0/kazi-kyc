"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const categories = [
  "House Help",
  "Masonry", 
  "Security",
  "Food Service",
  "Cleaning",
  "Gardening",
  "Driving",
  "Construction",
  "Delivery",
  "Other"
];

const payTypes = ["hourly", "daily", "monthly", "project"];

export default function PostJobPage() {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
    requirements: "",
    payRate: "",
    payType: "hourly",
    urgent: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to post job");
      }

      router.push("/work");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to post a job</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Post a Job</h1>
            <p className="text-gray-600 mt-2">Fill in the details below to post your job listing</p>
          </div>

          {error && (
            <div className="alert alert-error mb-6">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Title */}
              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text font-semibold">Job Title *</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full"
                  placeholder="e.g., House Cleaner Needed"
                />
              </div>

              {/* Category */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Category *</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="select select-bordered w-full"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Location *</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full"
                  placeholder="e.g., Westlands, Nairobi"
                />
              </div>

              {/* Pay Rate */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Pay Rate *</span>
                </label>
                <input
                  type="text"
                  name="payRate"
                  value={formData.payRate}
                  onChange={handleChange}
                  required
                  className="input input-bordered w-full"
                  placeholder="e.g., 500"
                />
              </div>

              {/* Pay Type */}
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Pay Type *</span>
                </label>
                <select
                  name="payType"
                  value={formData.payType}
                  onChange={handleChange}
                  required
                  className="select select-bordered w-full"
                >
                  {payTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Job Description *</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="textarea textarea-bordered w-full"
                placeholder="Describe the job responsibilities and expectations..."
              />
            </div>

            {/* Requirements */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Requirements</span>
                <span className="label-text-alt">(one per line)</span>
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                rows={3}
                className="textarea textarea-bordered w-full"
                placeholder="e.g., Must have 2 years experience&#10;Must have references&#10;Must be available immediately"
              />
            </div>

            {/* Urgent */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  name="urgent"
                  checked={formData.urgent}
                  onChange={handleChange}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text font-semibold">Mark as urgent position</span>
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn btn-outline flex-1"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Posting Job...
                  </>
                ) : (
                  "Post Job"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}