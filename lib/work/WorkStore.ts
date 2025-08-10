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

interface UseWork{
  jobs: JobListing[]
  fetchJobs : () => Promise<void>
}
  
export const useWorkStore = create<UseWork>((set) => ({
  jobs: [],
  fetchJobs: async()=>{
    try{
      const res = await axios.get("/api/work")
      const data = res.data

      set({jobs: data})
    } catch(err){
      console.log(`Internal server error 500: ${err}`)
    }
  }
}))