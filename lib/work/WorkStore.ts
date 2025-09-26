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
  pay_rate: string;
  pay_type: "hourly" | "daily" | "monthly" | "project";
  urgent?: boolean;
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
  fetchUser: () => Promise<void>;
}

// Helper function to transform Supabase data to match your frontend interface
const transformJobData = (job: any): JobListing => {
  const employerName = job.user 
    ? `${job.user.firstName} ${job.user.lastName}`
    : 'Employer';

  return {
    id: job.id,
    title: job.title,
    employer: {
      name: employerName,
      rating: 4.5, // Default rating - you might want to add this to your database
      verified: true // Default verified - you might want to add this to your database
    },
    category: job.category,
    location: job.location,
    description: job.description,
    requirements: job.requirements || [],
    pay_rate: job.pay_rate,
    pay_type: job.pay_type,
    urgent: job.urgent || false,
    applicants_count: job.applicants_count || 0,
    created_at: job.created_at,
    user: job.user
  };
};

export const useWorkStore = create<UseWork>((set) => ({
  jobs: [],
  isLoading: false,
  error: null,
  fetchUser: async() => {
    try{
    const res = await axios.get("/api/user");
    const user = res.data.user;

    if(!user) console.log("No user found");

    // query supabase
    const post_res = await axios.post("/api/jobs", {
      public_id: user.public_id,
      email: user.email
    })
    console.log("Backend response: ", post_res.data )

  } catch (error){
    console.log(`An error occured: ${error}`)
  }
  },
  fetchJobs: async () => {
    set({ isLoading: true, error: null });
    try {
      // Change this to your actual jobs API endpoint
      const res = await axios.get("/api/jobs");
      const data = res.data;
      
      // Transform the data to match your frontend interface
      const transformedJobs = data.jobs ? data.jobs.map(transformJobData) : [];
      
      set({ jobs: transformedJobs });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || "Failed to load jobs. Please try again.";
      set({ error: errorMessage });
      console.error("Error fetching jobs:", err);
    } finally {
      set({ isLoading: false });
    }
  },
}));