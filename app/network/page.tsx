"use client";

import { useState } from "react";
import { MoreVertical, MapPin, Star, Search } from "lucide-react";

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

const data: Record<Tab, Person[]> = {
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

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState<Tab>("My Network");
  const [query, setQuery] = useState("");

  const people = data[activeTab];
  const filtered = people.filter((person) =>
    person.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Your Network</h1>
      <p className="text-gray-600 mb-4">
        Connect with professionals across Kenya to grow your career opportunities.
      </p>

      {/* Tabs */}
      <div className="flex space-x-2 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setQuery("");
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeTab === tab
                ? "bg-gray-200 text-gray-900"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab} ({data[tab].length})
          </button>
        ))}
      </div>

      {/* Search bar: global for My Network & Requests, top-only for Discover */}
      {activeTab !== "Discover People" && (
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-6">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search your network..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="ml-2 flex-1 bg-transparent outline-none text-sm"
          />
        </div>
      )}

      {/* Discover People search bar on top */}
      {activeTab === "Discover People" && (
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-6">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search to discover..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="ml-2 flex-1 bg-transparent outline-none text-sm"
          />
        </div>
      )}

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map((person) => (
          <div
            key={person.id}
            className="bg-white border rounded-2xl p-4 shadow-sm flex items-start justify-between"
          >
            <div className="flex space-x-3">
              {person.image ? (
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-700">
                  {person.initials}
                </div>
              )}
              <div>
                <h2 className="font-medium">{person.name}</h2>
                <p className="text-sm text-gray-600">{person.role}</p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="w-3 h-3 mr-1" /> {person.location}
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Star className="w-3 h-3 text-yellow-500 mr-1" /> {person.rating}
                  {person.rate && <span className="mx-2">• {person.rate}</span>}
                  <span>• {person.experience}</span>
                </div>
                <p className="text-sm text-gray-500">{person.connections}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {person.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                {activeTab === "Requests" && (
                  <div className="flex gap-2 mt-3">
                    <button className="px-3 py-1 text-xs rounded-full hover:bg-green-200 bg-green-100 text-green-700">
                      Accept
                    </button>
                    <button className="px-3 py-1 text-xs rounded-full hover:bg-red-200 bg-red-100 text-red-700">
                      Refuse
                    </button>
                    <button className="px-3 py-1 text-xs rounded-full hover:bg-blue-200 bg-blue-100 text-blue-700">
                      Message
                    </button>
                  </div>
                )}

                {activeTab === "Discover People" && (
                  <div className="flex gap-2 mt-3">
                    <button className="px-3 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
                      Connect
                    </button>
                    <button className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      Message
                    </button>
                  </div>
                )}
              </div>
            </div>
            <MoreVertical className="w-5 h-5 text-gray-500 cursor-pointer" />
          </div>
        ))}
      </div>
    </div>
  );
}
