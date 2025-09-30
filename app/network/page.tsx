"use client";

import { useState, useEffect } from "react";
import { MoreVertical, MapPin, Star, Search } from "lucide-react";
import { FaPlus, FaUserPlus } from "react-icons/fa";
import { FaMessage, FaX } from "react-icons/fa6";

const TABS = ["My Network", "Requests", "Discover People"] as const;
type Tab = (typeof TABS)[number];

interface Person {
  public_id: string;
  name: string;
  avatarUrl: string | null;
  location: string | null;
  coreSkills: string[] | null;
  experience: string | null;
  requestId?: string; // For requests tab
}

interface CurrentUser {
  user: {
    public_id: string;
    name: string;
    email: string;
    firstName: string;
    lastName: string;
    location: string | null;
  };
}

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState<Tab>("My Network");
  const [query, setQuery] = useState("");
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [networkCount, setNetworkCount] = useState(0);
  const [requestsCount, setRequestsCount] = useState(0);
  const [discoverCount, setDiscoverCount] = useState(0);

  const filtered = people.filter((person) =>
    (person.name || "").toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchNetworkData();
      fetchAllCounts();
    }
  }, [activeTab, currentUser, query]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/user");
      if (response.ok) {
        const userData = await response.json();
        console.log("Current user data:", userData.user);
        setCurrentUser(userData);
      } else {
        console.error("Failed to fetch current user");
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  const fetchAllCounts = async () => {
    if (!currentUser || query) return;

    try {
      const userId = currentUser.user.public_id;

      const [networkResponse, requestsResponse, discoverResponse] =
        await Promise.all([
          fetch(`/api/network?type=network&userId=${userId}`),
          fetch(`/api/network?type=requests&userId=${userId}`),
          fetch(`/api/network?type=discover&userId=${userId}`),
        ]);

      if (networkResponse.ok) {
        const networkData = await networkResponse.json();
        setNetworkCount(Array.isArray(networkData) ? networkData.length : 0);
      }

      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        setRequestsCount(Array.isArray(requestsData) ? requestsData.length : 0);
      }

      if (discoverResponse.ok) {
        const discoverData = await discoverResponse.json();
        setDiscoverCount(Array.isArray(discoverData) ? discoverData.length : 0);
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  const fetchNetworkData = async () => {
  try {
    setLoading(true);
    const type = getApiType(activeTab);
    const userId = currentUser?.user.public_id;

    let response;
    if (query && activeTab === "Discover People") {
      response = await fetch(
        `/api/user/search?q=${encodeURIComponent(query)}`
      );
    } else {
      response = await fetch(`/api/network?type=${type}&userId=${userId}`);
    }

    if (!response.ok) throw new Error("Failed to fetch network data");

    const data = await response.json();
    console.log("📦 Raw network data from API:", data); // 👈 log the raw API response

    let usersArray: Person[] = [];

if (Array.isArray(data)) {
  usersArray = await Promise.all(
    data.map(async (u) => {
      // fetch user details for each user_id
      const res = await fetch(`/api/user/${u.user_id}`);
      let userDetails: any = {};
      if (res.ok) {
        userDetails = await res.json();
      }

      return {
        public_id: u.user_id,
        name: userDetails.user.name || "Unknown User",
        avatarUrl: userDetails.user.avatarUrl || null,
        location: userDetails.user.location || null,
        coreSkills: userDetails.user.coreSkills || [],
        experience: userDetails.user.experience || null,
        requestId: u.id || undefined,
      } as Person;
    })
  );
}



    console.log("✅ Parsed usersArray:", usersArray); // 👈 log after parsing

    setPeople(usersArray);

    if (!query) {
      const count = usersArray.length;
      switch (activeTab) {
        case "My Network":
          setNetworkCount(count);
          break;
        case "Requests":
          setRequestsCount(count);
          break;
        case "Discover People":
          setDiscoverCount(count);
          break;
      }
    }
  } catch (error) {
    console.error("Error fetching network data:", error);
    setPeople([]);
  } finally {
    setLoading(false);
  }
};


  const getApiType = (tab: Tab): string => {
    switch (tab) {
      case "My Network":
        return "network";
      case "Requests":
        return "requests";
      case "Discover People":
        return "discover";
      default:
        return "network";
    }
  };

  const handleConnect = async (targetUserId: string) => {
    if (!currentUser || !currentUser.user) {
      alert("Please wait while we load your user information");
      return;
    }

    const currentUserId = currentUser.user.public_id;
    if (!currentUserId) {
      alert("User information is incomplete. Please refresh the page.");
      return;
    }

    try {
      const requestBody = {
        currentUserId: currentUserId,
        targetUserId: targetUserId,
      };

      const response = await fetch("/api/network", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      if (response.ok) {
        fetchNetworkData();
        fetchAllCounts();
        alert("Connection request sent!");
      } else {
        alert(responseData.error || "Failed to send connection request");
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
      alert("Error sending connection request");
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      const response = await fetch("/api/network/actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "accept",
          requestId,
        }),
      });

      if (response.ok) {
        fetchNetworkData();
        fetchAllCounts();
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to accept connection");
      }
    } catch (error) {
      console.error("Error accepting connection:", error);
      alert("Error accepting connection");
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const response = await fetch("/api/network/actions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "reject",
          requestId,
        }),
      });

      if (response.ok) {
        fetchNetworkData();
        fetchAllCounts();
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to reject connection");
      }
    } catch (error) {
      console.error("Error rejecting connection:", error);
      alert("Error rejecting connection");
    }
  };

  const getTabCount = (tab: Tab): number => {
    if (query && tab === activeTab) {
      return filtered.length;
    }

    switch (tab) {
      case "My Network":
        return networkCount;
      case "Requests":
        return requestsCount;
      case "Discover People":
        return discoverCount;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Your Network</h1>
      <p className="text-gray-600 mb-4">
        Connect with professionals across Kenya to grow your career
        opportunities.
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
            {tab} ({getTabCount(tab)})
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
            if (e.key === "Enter") {
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
              key={person.public_id}
              className="bg-white border rounded-2xl p-4 shadow-sm flex items-start justify-between"
            >
              <div className="flex space-x-3 flex-1">
                {person.avatarUrl && (
                  <img
                    src={person.avatarUrl}
                    alt={person.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}

                <div className="flex-1">
                  <h2 className="font-medium">{person.name}</h2>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="w-3 h-3 mr-1" />{" "}
                    {person.location || "Not specified"}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Star className="w-3 h-3 text-yellow-500 mr-1" /> 4.5
                    <span className="mx-2">
                      • {person.experience || "Experience not specified"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">0 mutual connections</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {person.coreSkills?.map((skill, idx) => (
                      <span
                        key={`${person.public_id}-${idx}`}
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
                        onClick={() => handleAccept(person.requestId!)}
                        className="btn bg-slate-900 text-white px-3 py-1 text-xs rounded-md flex items-center gap-1"
                      >
                        <FaPlus />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleReject(person.requestId!)}
                        className="btn px-3 py-1 text-xs rounded-md hover:bg-red-200 bg-red-100 text-red-700 flex items-center gap-1"
                      >
                        <FaX />
                        <span>Refuse</span>
                      </button>
                      <button className="btn px-3 py-1 text-xs rounded-md hover:bg-blue-200 bg-blue-100 text-blue-700 flex items-center gap-1">
                        <FaMessage />
                        Message
                      </button>
                    </div>
                  )}

                  {activeTab === "Discover People" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleConnect(person.public_id)}
                        className="btn px-3 py-1 text-xs rounded-md bg-gray-700 text-gray-200 flex items-center gap-1"
                      >
                        <FaUserPlus />
                        Connect
                      </button>
                      <button className="btn px-3 py-1 text-xs rounded-md bg-blue-100 text-blue-700 flex items-center gap-1">
                        <FaMessage />
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
