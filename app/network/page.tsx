"use client";

import { useState, useEffect } from "react";
import { MoreVertical, MapPin, Star, Search } from "lucide-react";
import { FaPlus, FaUserPlus, FaCheck } from "react-icons/fa";
import { FaMessage, FaX } from "react-icons/fa6";
import { useRouter } from "next/navigation";

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
  connectionStatus?: 'connected' | 'pending' | 'none'; // New field for connection status
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("My Network");
  const [query, setQuery] = useState("");
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [networkCount, setNetworkCount] = useState(0);
  const [requestsCount, setRequestsCount] = useState(0);
  const [discoverCount, setDiscoverCount] = useState(0);
  const [allConnections, setAllConnections] = useState<any[]>([]); // Store all connections
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "warning">("success");

  const filtered = people.filter((person) =>
    (person.name || "").toLowerCase().includes(query.toLowerCase())
  );

  // Show alert function
  const showAlertMessage = (message: string, type: "success" | "error" | "warning" = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchAllConnections();
      fetchNetworkData();
      fetchAllCounts(); // Pre-load all counts
    }
  }, [activeTab, currentUser, query]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/user");
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
      }
    } catch (error) {
      // Silently handle error
    }
  };

  // Fetch all counts upfront
  const fetchAllCounts = async () => {
    if (!currentUser?.user.public_id) return;

    try {
      const userId = currentUser.user.public_id;

      const [networkResponse, requestsResponse, discoverResponse] = await Promise.all([
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
      // Silently handle error
    }
  };

  // Fetch all connections to check status against discover users
  const fetchAllConnections = async () => {
    if (!currentUser?.user.public_id) return;
    
    try {
      const response = await fetch(`/api/network?type=network&userId=${currentUser.user.public_id}`);
      if (response.ok) {
        const connections = await response.json();
        setAllConnections(connections || []);
      }
    } catch (error) {
      // Silently handle error
    }
  };

  // Check if a user is already connected
  const isUserConnected = (userId: string): boolean => {
    if (!currentUser?.user.public_id) return false;
    
    return allConnections.some(connection => 
      (connection.user_id === currentUser.user.public_id && connection.target_user_id === userId) ||
      (connection.user_id === userId && connection.target_user_id === currentUser.user.public_id)
    );
  };

  // Check if there's a pending request to/from a user
  const hasPendingRequest = async (userId: string): Promise<boolean> => {
    if (!currentUser?.user.public_id) return false;
    
    try {
      const response = await fetch(`/api/network?type=requests&userId=${currentUser.user.public_id}`);
      if (response.ok) {
        const requests = await response.json();
        return requests.some((request: any) => 
          request.user_id === userId
        );
      }
    } catch (error) {
      // Silently handle error
    }
    return false;
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
      let usersArray: Person[] = [];

      if (Array.isArray(data)) {
        if (activeTab === "Discover People") {
          // For discover tab, use the data directly and determine connection status
          usersArray = await Promise.all(
            data.map(async (user) => {
              const isConnected = isUserConnected(user.public_id);
              const hasPending = await hasPendingRequest(user.public_id);
              
              let connectionStatus: 'connected' | 'pending' | 'none' = 'none';
              if (isConnected) {
                connectionStatus = 'connected';
              } else if (hasPending) {
                connectionStatus = 'pending';
              }
              
              return {
                public_id: user.public_id,
                name: user.name,
                avatarUrl: user.avatarUrl,
                location: user.location,
                coreSkills: user.coreSkills,
                experience: user.experience,
                connectionStatus,
              } as Person;
            })
          );
        } else if (activeTab === "Requests") {
          usersArray = await Promise.all(
            data.map(async (request) => {
              const res = await fetch(`/api/user/${request.user_id}`);
              let userDetails: any = {};
              if (res.ok) {
                userDetails = await res.json();
              }

              return {
                public_id: request.user_id,
                name: userDetails.user.name || "Unknown User",
                avatarUrl: userDetails.user.avatarUrl || null,
                location: userDetails.user.location || null,
                coreSkills: userDetails.user.coreSkills || [],
                experience: userDetails.user.experience || null,
                requestId: request.id || undefined,
              } as Person;
            })
          );
        } else {
          const uniqueUserIds = new Set();
          const userPromises: Promise<Person>[] = [];
          
          data.forEach((connection) => {
            const otherUserId = 
              connection.user_id === userId 
                ? connection.target_user_id 
                : connection.user_id;
            
            if (uniqueUserIds.has(otherUserId)) {
              return;
            }
            uniqueUserIds.add(otherUserId);
            
            const userPromise = fetch(`/api/user/${otherUserId}`)
              .then(async (res) => {
                let userDetails: any = {};
                if (res.ok) {
                  userDetails = await res.json();
                }

                return {
                  public_id: otherUserId,
                  name: userDetails.user?.name || "Unknown User",
                  avatarUrl: userDetails.user?.avatarUrl || null,
                  location: userDetails.user?.location || null,
                  coreSkills: userDetails.user?.coreSkills || [],
                  experience: userDetails.user?.experience || null,
                } as Person;
              })
              .catch(() => ({
                public_id: otherUserId,
                name: "Unknown User",
                avatarUrl: null,
                location: null,
                coreSkills: [],
                experience: null,
              } as Person));
              
            userPromises.push(userPromise);
          });
          
          usersArray = await Promise.all(userPromises);
        }
      }

      setPeople(usersArray);

      // Update counts based on the actual processed data
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
      setPeople([]);
      if (!query) {
        switch (activeTab) {
          case "My Network":
            setNetworkCount(0);
            break;
          case "Requests":
            setRequestsCount(0);
            break;
          case "Discover People":
            setDiscoverCount(0);
            break;
        }
      }
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

  const handleMessage = (targetUserId: string) => {
    router.push(`/messages?user=${targetUserId}`);
  };

  const handleConnect = async (targetUserId: string) => {
    if (!currentUser || !currentUser.user) {
      showAlertMessage("Please wait while we load your user information", "error");
      return;
    }

    const currentUserId = currentUser.user.public_id;
    if (!currentUserId) {
      showAlertMessage("User information is incomplete. Please refresh the page.", "error");
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
        // Refresh connections and data
        fetchAllConnections();
        fetchNetworkData();
        fetchAllCounts();
        showAlertMessage("Connection request sent!");
      } else {
        showAlertMessage(responseData.error || "Failed to send connection request", "error");
      }
    } catch (error) {
      showAlertMessage("Error sending connection request", "error");
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
        fetchAllConnections();
        fetchNetworkData();
        fetchAllCounts();
        showAlertMessage("Connection accepted!");
      } else {
        const errorData = await response.json();
        showAlertMessage(errorData.error || "Failed to accept connection", "error");
      }
    } catch (error) {
      showAlertMessage("Error accepting connection", "error");
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
        fetchAllConnections();
        fetchNetworkData();
        fetchAllCounts();
        showAlertMessage("Connection request rejected");
      } else {
        const errorData = await response.json();
        showAlertMessage(errorData.error || "Failed to reject connection", "error");
      }
    } catch (error) {
      showAlertMessage("Error rejecting connection", "error");
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
      {/* DaisyUI Alert */}
      {showAlert && (
        <div className={`alert alert-${alertType} fixed top-4 right-4 z-50 max-w-md shadow-lg`}>
          {alertType === "success" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {alertType === "error" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          {alertType === "warning" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          <span>{alertMessage}</span>
          <button 
            className="btn btn-sm btn-ghost" 
            onClick={() => setShowAlert(false)}
          >
            ✕
          </button>
        </div>
      )}

      <h1 className="text-2xl font-semibold">Your Network</h1>
      <p className="text-gray-600 mb-4">
        Connect with professionals across Kenya to grow your career
        opportunities.
      </p>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-base-200 p-1 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setQuery("");
            }}
            className={`tab tab-lg ${activeTab === tab ? 'tab-active' : ''}`}
          >
            {tab} 
            <span className="badge badge-sm badge-neutral ml-2">
              {getTabCount(tab)}
            </span>
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="flex items-center bg-base-200 rounded-lg px-3 py-2 mb-6">
        <Search className="w-4 h-4 text-base-content/60" />
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
          <div className="loading loading-spinner loading-lg text-primary"></div>
        </div>
      )}

      {/* Cards */}
      {!loading && (
        <div className="space-y-4">
          {filtered.map((person) => (
            <div
              key={person.public_id}
              className="card bg-base-100 border border-base-300 shadow-sm"
            >
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex space-x-3 flex-1">
                    {person.avatarUrl ? (
                      <div className="avatar">
                        <div className="w-12 h-12 rounded-full">
                          <img
                            src={person.avatarUrl}
                            alt={person.name}
                            className="object-cover"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-12">
                          <span className="text-sm">{person.name?.charAt(0) || "U"}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex-1">
                      <h2 className="card-title text-lg">{person.name}</h2>
                      <div className="flex items-center text-sm text-base-content/60 mt-1">
                        <MapPin className="w-3 h-3 mr-1" />{" "}
                        {person.location || "Not specified"}
                      </div>
                      <div className="flex items-center text-sm text-base-content/70 mt-1">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" /> 4.5
                        <span className="mx-2">
                          • {person.experience || "Experience not specified"}
                        </span>
                      </div>
                      <p className="text-sm text-base-content/60">{allConnections.length} mutual connections</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {person.coreSkills?.map((skill, idx) => (
                          <span
                            key={`${person.public_id}-${idx}`}
                            className="badge badge-outline"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Action buttons */}
                      {activeTab === "Requests" && (
                        <div className="card-actions justify-start mt-3">
                          <button
                            onClick={() => handleAccept(person.requestId!)}
                            className="btn btn-primary btn-sm"
                          >
                            <FaPlus />
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(person.requestId!)}
                            className="btn btn-outline btn-error btn-sm"
                          >
                            <FaX />
                            Refuse
                          </button>
                          <button 
                            onClick={() => handleMessage(person.public_id)}
                            className="btn btn-outline btn-sm"
                          >
                            <FaMessage />
                            Message
                          </button>
                        </div>
                      )}

                      {activeTab === "Discover People" && (
                        <div className="card-actions justify-start mt-3">
                          {person.connectionStatus === 'connected' ? (
                            <button
                              disabled
                              className="btn btn-success btn-sm cursor-not-allowed"
                            >
                              <FaCheck />
                              Already Connected
                            </button>
                          ) : person.connectionStatus === 'pending' ? (
                            <button
                              disabled
                              className="btn btn-warning btn-sm cursor-not-allowed"
                            >
                              <FaPlus />
                              Request Sent
                            </button>
                          ) : (
                            <button
                              onClick={() => handleConnect(person.public_id)}
                              className="btn btn-primary btn-sm"
                            >
                              <FaUserPlus />
                              Connect
                            </button>
                          )}
                          <button 
                            onClick={() => handleMessage(person.public_id)}
                            className="btn btn-outline btn-sm"
                          >
                            <FaMessage />
                            Message
                          </button>
                        </div>
                      )}

                      {activeTab === "My Network" && (
                        <div className="card-actions justify-start mt-3">
                          <button 
                            onClick={() => handleMessage(person.public_id)}
                            className="btn btn-outline btn-sm"
                          >
                            <FaMessage />
                            Message
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <MoreVertical className="w-5 h-5 text-base-content/40 cursor-pointer" />
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && !loading && (
            <div className="text-center py-8 text-base-content/60">
              <div className="text-lg font-medium mb-2">No {activeTab.toLowerCase()} found</div>
              <p className="text-sm">
                {activeTab === "Discover People" 
                  ? "Try searching for different users or check back later for new connections."
                  : "Your network will appear here once you start connecting with people."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}