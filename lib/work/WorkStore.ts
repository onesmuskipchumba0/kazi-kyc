import axios from "axios";
import { create } from "zustand";

interface JobListing {
  id: number; // Supabase uses int8
  title: string;
  employer: {
    name: string;
    avatar?: string;
    rating: number;
    verified: boolean;
  };
  category: string;
  location: string;
  description: string;
  requirements: string[];
  pay_rate: string;
  pay_type: "hourly" | "daily" | "monthly" | "project";
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
      rating: 4.5,
      verified: true,
    },
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

export const useWorkStore = create<UseWork>((set) => ({
  jobs: [],
  isLoading: false,
  error: null,

  // ✅ Correct postJobs
postJobs: async (job: any) => {
  try {
    const res = await axios.get("/api/user");
    const user = res.data.user;

    if (!user || !user.public_id) {
      console.error("No user found or missing public_id");
      throw new Error("User not authenticated");
    }

    const post_res = await axios.post("/api/jobs", {
      public_id: user.public_id,
      email: user.email,
      job,
    });

    console.log("Backend response: ", post_res.data);

    // Refresh jobs after posting
    await useWorkStore.getState().fetchJobs();
  } catch (error: any) {
    console.error("Error posting job:", error.response?.data || error.message);
    throw error; // Re-throw to handle in component
  }
},

  // ✅ Fixed fetchUser (only fetches user)
  fetchUser: async () => {
    try {
      const res = await axios.get("/api/user");
      const user = res.data.user;

      if (!user) {
        console.log("No user found");
        return null;
      }

      return user;
    } catch (error) {
      console.log(`An error occurred: ${error}`);
      return null;
    }
  },

  // ✅ Fetch jobs
  fetchJobs: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get("/api/jobs");
      const data = res.data;

      const transformedJobs = data.jobs ? data.jobs.map(transformJobData) : [];

      set({ jobs: transformedJobs });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error || "Failed to load jobs. Please try again.";
      set({ error: errorMessage });
      console.error("Error fetching jobs:", err);
    } finally {
      set({ isLoading: false });
    }
  },
}));
