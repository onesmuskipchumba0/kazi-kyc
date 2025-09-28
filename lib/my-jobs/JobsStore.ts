import { create } from "zustand";
import axios from "axios";


interface ApplicationDB {
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

interface Application{
    id: string;
    title: string;
    name: string;
    rating: number;
    progress: number;
    description: string;
    category: string;
    location: string;
    date:string;
    pay: number;
    status: "active" | "completed" | "pending" | "cancelled";
}

interface ApplicationTypes {
    applications_db: ApplicationDB[];
    job: Job | null;
    employer: Employer | null;
    applications: Application[];
    // will send get request to user/applications/[id] with worker_id
    fetchJobs: () => Promise<any>;

}

export const ApplicationStore = create<ApplicationTypes>((set) => ({
    applications_db: [],
    job: null,
    employer: null,
    applications: [],
    fetchJobs: async () => {
  try {
    const res_user = await axios.get("/api/user");
    const user = res_user.data.user;

    const application_res = await axios.get(`/api/user/applications/${user.id}`);
    const applicationsDB: ApplicationDB[] = application_res.data.applications;

    set({ applications_db: applicationsDB });

    const formated_applications: Application[] = await Promise.all(
      applicationsDB.map(async (app) => {
        const job_res = await axios.get(`/api/jobs/${app.job_id}`);
        const job: Job = job_res.data.job;

        const employer_res = await axios.get(`/api/user/${job.employer_id}`);
        const employer: Employer = employer_res.data.user;

        return {
          id: app.id,
          title: job.title,
          name: employer.name,
          rating: employer.rating,
          progress: 100,
          description: job.description,
          category: job.category,
          location: job.location,
          date: job.created_at,
          pay: parseFloat(job.pay_rate),
          status: app.status as "active" | "completed" | "pending" | "cancelled",
        };
      })
    );

    set({ applications: formated_applications });
  } catch (err) {
    console.log("an error occurred: ", err);
  }
}

})
) 


