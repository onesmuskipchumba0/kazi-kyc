// types/index.ts
export interface Mason {
    id: string;
    name: string;
    location: string;
    title: string;
    description: string;
    jobsCompleted: number;
    hourlyRate: string;
    responseTime: string;
    completionRate: number;
    experience: string;
    availability: string;
    responseRate: string;
    languages: string[];
    contact: {
      phone: string;
      email: string;
      location: string;
    };
    coreSkills: string[];
  }
  
  export interface PortfolioItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    date: string;
    location: string;
  }
  
  export interface Review {
    id: string;
    clientName: string;
    rating: number;
    comment: string;
    date: string;
    project: string;
  }
  
  export interface Skill {
    name: string;
    proficiency: number; // 1-100
    category: string;
  }