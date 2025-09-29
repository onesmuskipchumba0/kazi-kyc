"use client";

import { useState, useEffect } from "react";
import { MoreVertical, MapPin, Star, Search } from "lucide-react";
import { FaPlus, FaUserPlus } from "react-icons/fa";
import { FaMessage, FaX } from "react-icons/fa6";

const TABS = ["My Network", "Requests", "Discover People"] as const;
type Tab = (typeof TABS)[number];

interface Person {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  experience: string;
  connections: string;
  skills: string[];
  initials?: string;
  image?: string;
  requestId?: string; // For requests tab
}

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState<Tab>("My Network");
  const [query, setQuery] = useState("");
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  const filtered = people.filter((person) =>
    person.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    fetchNetworkData();
  }, [activeTab]);

  const fetchNetworkData = async () => {
    try {
      setLoading(true);
      const type = getApiType(activeTab);
      const searchParam = query ? `&search=${encodeURIComponent(query)}` : '';
      
      const response = await fetch(`/api/user/network?type=${type}${searchParam}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch network data');
      }
      
      const data = await response.json();
      setPeople(data);
    } catch (error) {
      console.error('Error fetching network data:', error);
      setPeople([]);
    } finally {
      setLoading(false);
    }
  };

  const getApiType = (tab: Tab): string => {
    switch (tab) {
      case "My Network": return "network";
      case "Requests": return "requests";
      case "Discover People": return "discover";
      default: return "network";
    }
  };

  const handleConnect = async (userId: string) => {
    try {
      const response = await fetch('/api/user/network/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUserId: userId }),
      });

      if (response.ok) {
        fetchNetworkData();
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      const response = await fetch('/api/user/network/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId }),
      });

      if (response.ok) {
        fetchNetworkData();
      }
    } catch (error) {
      console.error('Error accepting connection:', error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const response = await fetch('/api/user/network/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId }),
      });

      if (response.ok) {
        fetchNetworkData();
      }
    } catch (error) {
      console.error('Error rejecting connection:', error);
    }
  };

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
            {tab} ({people.length})
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-6">
        <Search className="w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder={
            activeTab === "Discover People" 
              ? "Search to discover..." 
              : "Search your network..."
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              fetchNetworkData();
            }
          }}
          className="ml-2 flex-1 bg-transparent outline-none text-sm"
        />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Cards */}
      {!loading && (
        <div className="space-y-4">
          {filtered.map((person) => (
            <div
              key={person.id}
              className="bg-white border rounded-2xl p-4 shadow-sm flex items-start justify-between"
            >
              <div className="flex space-x-3 flex-1">
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
                <div className="flex-1">
                  <h2 className="font-medium">{person.name}</h2>
                  <p className="text-sm text-gray-600">{person.role}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="w-3 h-3 mr-1" /> {person.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Star className="w-3 h-3 text-yellow-500 mr-1" /> {person.rating}
                    <span className="mx-2">• {person.experience}</span>
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
                      <button 
                        onClick={() => handleAccept(person.requestId || person.id)}
                        className="btn bg-slate-900 text-white px-3 py-1 text-xs rounded-md flex items-center gap-1"
                      >
                        <FaPlus/>
                        <span>Accept</span>
                      </button>
                      <button 
                        onClick={() => handleReject(person.requestId || person.id)}
                        className="btn px-3 py-1 text-xs rounded-md hover:bg-red-200 bg-red-100 text-red-700 flex items-center gap-1"
                      >
                        <FaX/>
                        <span>Refuse</span>
                      </button>
                      <button className="btn px-3 py-1 text-xs rounded-md hover:bg-blue-200 bg-blue-100 text-blue-700 flex items-center gap-1">
                        <FaMessage/>
                        Message
                      </button>
                    </div>
                  )}

                  {activeTab === "Discover People" && (
                    <div className="flex gap-2 mt-3">
                      <button 
                        onClick={() => handleConnect(person.id)}
                        className="btn px-3 py-1 text-xs rounded-md bg-gray-700 text-gray-200 flex items-center gap-1"
                      >
                        <FaUserPlus/>
                        Connect
                      </button>
                      <button className="btn px-3 py-1 text-xs rounded-md bg-blue-100 text-blue-700 flex items-center gap-1">
                        <FaMessage/>
                        Message
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <MoreVertical className="w-5 h-5 text-gray-500 cursor-pointer" />
            </div>
          ))}
          
          {filtered.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              No {activeTab.toLowerCase()} found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}