import axios from "axios";
import { create } from "zustand";

interface JobListing {
    id: string;
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
    payRate: string;
    payType: "hourly" | "daily" | "monthly" | "project";
    postedTime: string;
    urgent?: boolean;
    applicants: number;
  }

interface UseWork {
  jobs: JobListing[];
  isLoading: boolean;
  error: string | null;
  fetchJobs: () => Promise<void>;
}
  
export const useWorkStore = create<UseWork>((set) => ({
  jobs: [],
  isLoading: false,
  error: null,
  fetchJobs: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get("/api/work");
      const data = res.data;
      set({ jobs: data });
    } catch (err) {
      set({ error: "Failed to load jobs. Please try again." });
      console.log(`Internal server error 500: ${err}`);
    } finally {
      set({ isLoading: false });
    }
  },
}));