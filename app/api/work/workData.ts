
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
 

  interface Category {
    name: string;
    icon: React.ElementType;
    count: number;
  }

  
  const applicationTips = [
    {
      title: "Complete your profile",
      description: "Profiles with photos get 3x more responses",
    },
    {
      title: "Apply early",
      description: "Early applications have higher success rates",
    },
    {
      title: "Personalize applications",
      description: "Tailor your message to each job",
    },
  ];
  
  const featuredJobs: JobListing[] = [
    {
      id: "1",
      title: "Experienced House Manager Needed",
      employer: {
        name: "Sarah Johnson",
        avatar: "",
        rating: 4.9,
        verified: true,
      },
      category: "House Help",
      location: "Karen, Nairobi",
      description:
        "Looking for a reliable house manager for a 5-bedroom home. Must be experienced with meal preparation, cleaning, and household management.",
      requirements: [
        "3+ years experience",
        "References required",
        "Live-in preferred",
        "First aid knowledge",
      ],
      payRate: "KES 35,000",
      payType: "monthly",
      postedTime: "2 hours ago",
      urgent: true,
      applicants: 8,
    },
    {
      id: "2",
      title: "Stone Wall Construction Project",
      employer: {
        name: "David Kiplagat",
        avatar: "",
        rating: 4.7,
        verified: true,
      },
      category: "Masonry",
      location: "Westlands, Nairobi",
      description:
        "Need skilled masons for a 3-week stone wall construction project. Tools and materials provided.",
      requirements: ["Masonry certification", "3+ years experience"],
      payRate: "KES 1,500",
      payType: "daily",
      postedTime: "1 day ago",
      applicants: 12,
    },
  ];