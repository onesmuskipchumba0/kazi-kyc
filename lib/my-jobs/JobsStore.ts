import { create } from "zustand";
import axios from "axios";


interface Application {
    id: string;
    job_id: string;
    applicant_id: string;
    status: string;
    cover_letter: string;
    applied_at: string;
}

interface Employer {
  name: string;
  avatarUrl?: string;
  rating: number;
  verified: boolean;
}


interface Job {
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

interface ApplicationTypes {
    applications: Application[];
    jobs: Job[];
    // will send get request to jobs/id with worker_id
    fetchJobs: () => Promise<void>;
    
}