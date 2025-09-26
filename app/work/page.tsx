"use client";
import { useWorkStore } from "@/lib/work/WorkStore";
import { useUserStore } from "@/lib/user/UserStore";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Plus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function FindWorkPage() {
  const jobs = useWorkStore((state) => state.jobs);
  const isLoading = useWorkStore((state) => state.isLoading);
  const error = useWorkStore((state) => state.error);
  const fetchJobs = useWorkStore((state) => state.fetchJobs);

  // ✅ Get user from store
  const user = useUserStore((state) => state.user);
  const fetchUser = useUserStore((state) => state.fetchUser);

  const [selectedCategory, setSelectedCategory] = useState("All Jobs");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    fetchJobs();
    fetchUser();
  }, [fetchJobs, fetchUser]);

  // ✅ Open Modal
  const handlePostJob = () => {
    setIsModalOpen(true);
  };

  const isEmployer = user?.profileType === "employer";

  const filteredJobs = useMemo(() => {
    if (!jobs) return [];
    return jobs.filter((job) => {
      const matchesCategory =
        selectedCategory === "All Jobs" || job.category === selectedCategory;
      const matchesLocation =
        selectedLocation === "All Locations" ||
        job.location.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesSearch =
        searchTerm === "" ||
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requirements.some((req) =>
          req.toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchesCategory && matchesLocation && matchesSearch;
    });
  }, [jobs, selectedCategory, selectedLocation, searchTerm]);

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Find Work Opportunities</h1>
          {isEmployer && (
            <button
              onClick={handlePostJob}
              className="btn btn-primary gap-2 hidden md:flex"
            >
              <Plus className="w-4 h-4" />
              Post a Job
            </button>
          )}
        </div>

        {/* Search + Filters */}
        <div className="flex items-center gap-4 mt-6 bg-base-100 p-4 rounded-xl shadow-sm border border-base-200">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full pl-10 rounded-full bg-base-200 border-0"
            />
          </div>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="select w-48 rounded-full bg-base-200 border-0"
          >
            <option>All Locations</option>
            <option>Westlands</option>
            <option>Karen</option>
            <option>Kilimani</option>
            <option>CBD</option>
            <option>Industrial Area</option>
          </select>
          <button
            onClick={() => fetchUser()}
            type="button"
            className="btn btn-primary gap-2 rounded-full shadow-sm"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Jobs Listing */}
        <div className="mt-6">
          {isLoading ? (
            <p>Loading...</p>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job.id} className="p-4 border rounded-lg mb-3">
                {job.title}
              </div>
            ))
          ) : (
            <p>No jobs found.</p>
          )}
        </div>
      </div>

      {/* ✅ DaisyUI Modal */}
          {isModalOpen && (
      <dialog open className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Post a Job</h3>

          <form
            method="dialog"
            className="space-y-3 mt-4"
            onSubmit={async (e) => {
              e.preventDefault();

              const formData = new FormData(e.currentTarget);

              // split requirements by newline
              const requirements = (formData.get("requirements") as string)
                .split("\n")
                .map((r) => r.trim())
                .filter((r) => r !== "");

              
              const jobData = {
                title: formData.get("title"),
                description: formData.get("description"),
                location: formData.get("location"),
                category: formData.get("category"),
                requirements,
                pay_rate: formData.get("pay_rate"),
                pay_type: formData.get("pay_type"),
                urgent: formData.get("urgent") === "on",
                status: formData.get("status"),
              };

              // ✅ Send to backend
              try {
                const res = await fetch("/api/jobs", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(jobData),
                });
                const data = await res.json();
                console.log("Job posted:", data);
                setIsModalOpen(false);
              } catch (err) {
                console.error("Error posting job:", err);
              }
            }}
          >
            {/* Job Title */}
            <input
              type="text"
              name="title"
              placeholder="Job Title"
              className="input input-bordered w-full"
              required
            />

            {/* Description */}
            <textarea
              name="description"
              placeholder="Job Description"
              className="textarea textarea-bordered w-full"
              required
            />

            {/* Location */}
            <input
              type="text"
              name="location"
              placeholder="Location"
              className="input input-bordered w-full"
            />

            {/* Category */}
            <input
              type="text"
              name="category"
              placeholder="Category"
              className="input input-bordered w-full"
            />

            {/* Requirements (multi-line) */}
            <textarea
              name="requirements"
              placeholder="Enter each requirement on a new line"
              className="textarea textarea-bordered w-full"
              required
            />

            {/* Pay Rate */}
            <input
              type="text"
              name="pay_rate"
              placeholder="Pay Rate (e.g. 2000 KES)"
              className="input input-bordered w-full"
              required
            />

            {/* Pay Type Dropdown */}
            <select name="pay_type" className="select select-bordered w-full" required>
              <option disabled selected>
                Select Pay Type
              </option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="project">Project</option>
            </select>

            {/* Urgent Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="urgent" className="checkbox" />
              <span>Mark as Urgent</span>
            </label>

            {/* Status Dropdown */}
            <select name="status" className="select select-bordered w-full" required>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
            </select>

            {/* Actions */}
            <div className="modal-action">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="btn"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Post
              </button>
            </div>
          </form>
        </div>
      </dialog>
    )}

    </div>
  );
}
