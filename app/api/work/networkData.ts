type Person = {
    id: number;
    name: string;
    role: string;
    location: string;
    rating: number;
    rate?: string | null;
    experience: string;
    connections: string;
    skills: string[];
    initials?: string;
    image?: string;
  };

  const TABS = ["My Network", "Requests", "Discover People"] as const;
  type Tab = (typeof TABS)[number];
  
  export const networkData: Record<Tab, Person[]> = {
    "My Network": [
      {
        id: 1,
        name: "Sarah Wanjiku",
        role: "House Manager",
        location: "Kiambu",
        rating: 4.8,
        rate: "KSh 400/hour",
        experience: "5 years exp",
        connections: "12 mutual connections",
        skills: ["Cleaning", "Cooking", "Child Care"],
        initials: "SW",
      },
      {
        id: 2,
        name: "David Kimani",
        role: "Construction Supervisor",
        location: "Nairobi",
        rating: 4.9,
        rate: "KSh 800/hour",
        experience: "8 years exp",
        connections: "8 mutual connections",
        skills: ["Project Management", "Quality Control", "Team Leadership"],
        image: "https://i.pravatar.cc/100?img=12",
      },
    ],
    Requests: [
      {
        id: 3,
        name: "James Otieno",
        role: "Driver",
        location: "Nakuru",
        rating: 4.6,
        rate: "KSh 300/hour",
        experience: "4 years exp",
        connections: "3 mutual connections",
        skills: ["Driving", "Logistics"],
        initials: "JO",
      },
    ],
    "Discover People": [
      {
        id: 4,
        name: "Mary Achieng",
        role: "Event Planner",
        location: "Kisumu",
        rating: 4.8,
        rate: "KSh 1000/hour",
        experience: "7 years exp",
        connections: "10 mutual connections",
        skills: ["Event Planning", "Budgeting", "Customer Service"],
        image: "https://i.pravatar.cc/100?img=8",
      },
    ],
  };
  