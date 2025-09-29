// lib/work/WorkStore.ts
import axios from "axios";
import { create } from "zustand";

interface Employer {
  name: string;
  avatarUrl?: string;
  rating: number;
  verified: boolean;
}

interface JobListing {
  id: string;
  title: string;
  employer: Employer;
  employer_id?: string;
  category: string;
  location: string;
  description: string;
  requirements: string[];
  pay_rate: string;
  pay_type: "hourly" | "fixed" | "daily" | "monthly" | "project";
  urgent?: boolean;
  status: "open" | "closed";
  applicants_count: number;
  created_at: string;
  user?: {
    firstName: string;
    lastName: string;
    profileType: string;
    location: string;
  };
}

interface UseWork {
  jobs: JobListing[];
  isLoading: boolean;
  error: string | null;
  fetchJobs: () => Promise<void>;
  fetchUser: () => Promise<any>;
  postJobs: (job: any) => Promise<void>;
  fetchUserById: (public_id: string) => Promise<any>;
  applyToJob: (jobId: string, coverLetter?: string) => Promise<any>;
}

const transformJobData = (job: any): JobListing => {
  const employerName = job.user
    ? `${job.user.firstName} ${job.user.lastName}`
    : "Employer";

  return {
    id: job.id,
    title: job.title,
    employer: {
      name: employerName,
      avatarUrl: job.user?.avatarUrl,
      rating: 4.5,
      verified: true,
    },
    employer_id: job.employer_id,
    category: job.category,
    location: job.location,
    description: job.description,
    requirements: job.requirements || [],
    pay_rate: job.pay_rate,
    pay_type: job.pay_type,
    status: job.status,
    urgent: job.urgent || false,
    applicants_count: job.applicants_count || 0,
    created_at: job.created_at,
    user: job.user,
  };
};

export const useWorkStore = create<UseWork>((set, get) => ({
  jobs: [],
  isLoading: false,
  error: null,

  fetchUserById: async (public_id: string) => {
    try {
      const res = await axios.get(`/api/user/${public_id}`);
      return res.data.user;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  },

  applyToJob: async (jobId: string, coverLetter: string = "") => {
    try {
      const res = await axios.get("/api/user");
      const user = res.data.user;

      if (!user || !user.public_id) {
        throw new Error("User not authenticated");
      }

      const applyRes = await axios.post(`/api/jobs/${jobId}/apply`, {
        applicant_id: user.public_id,
        cover_letter: coverLetter,
      });

      return applyRes.data;
    } catch (error: any) {
      console.error("Error applying to job:", error.response?.data || error.message);
      throw error;
    }
  },

  postJobs: async (job: any) => {
    try {
      const res = await axios.get("/api/user");
      const user = res.data.user;

      if (!user || !user.public_id) {
        throw new Error("User not authenticated");
      }

      const postRes = await axios.post("/api/jobs", {
        public_id: user.public_id,
        email: user.email,
        job,
      });

      await get().fetchJobs();
      return postRes.data;
    } catch (error: any) {
      console.error("Error posting job:", error.response?.data || error.message);
      throw error;
    }
  },

  fetchUser: async () => {
    try {
      const res = await axios.get("/api/user");
      return res.data.user;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  },

  fetchJobs: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get("/api/jobs");
      const data = res.data;

      const transformedJobs = data.jobs ? data.jobs.map(transformJobData) : [];
      set({ jobs: transformedJobs });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Failed to load jobs";
      set({ error: errorMessage });
      console.error("Error fetching jobs:", err);
    } finally {
      set({ isLoading: false });
    }
  },
}));