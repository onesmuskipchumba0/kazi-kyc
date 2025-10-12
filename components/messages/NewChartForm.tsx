"use client";
import { useState, useEffect } from "react";
import { Search, Mail, PhoneCall, MessageCircle } from "lucide-react";

interface User {
  id: string;
  public_id: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string | null;
  location: string;
  name: string;
}

interface NewChatFormProps {
  onCreate: (user: User) => void;
  onCancel: () => void;
}

export default function NewChatForm({ onCreate, onCancel }: NewChatFormProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/user/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.users) {
        const detailedUsers = await Promise.all(
          data.users.map(async (user: any) => {
            try {
              const userResponse = await fetch(`/api/user/${user.public_id}`);
              const userData = await userResponse.json();
              return userData.user || user;
            } catch (error) {
              return user;
            }
          })
        );
        setSearchResults(detailedUsers);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleCreateChat = () => {
    if (selectedUser) {
      onCreate(selectedUser);
    }
  };

  return (
    <div className="card w-full max-w-md bg-base-100 border border-base-200 shadow mx-auto">
      <div className="card-body gap-4">
        <div>
          <h2 className="card-title">Start New Conversation</h2>
          <p className="text-sm text-base-content/60">
            Search for users by email or phone number to start a new chat.
          </p>
        </div>

        {/* Search Input */}
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Search by Email or Phone</span>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-base-content/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter email or phone number..."
              className="input input-bordered w-full pl-9"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedUser(null);
              }}
            />
          </div>
        </label>

        {/* Search Results */}
        {searchQuery && (
          <div className="border border-base-200 rounded-lg max-h-60 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center p-4">
                <div className="loading loading-spinner loading-sm"></div>
                <span className="ml-2 text-sm">Searching...</span>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center p-4 text-base-content/60 text-sm">
                No users found
              </div>
            ) : (
              searchResults.map((user) => (
                <div
                  key={user.public_id}
                  className={`flex items-center gap-3 p-3 hover:bg-base-200 cursor-pointer transition-colors ${
                    selectedUser?.public_id === user.public_id ? 'bg-base-200' : ''
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center text-xs font-semibold overflow-hidden">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        user.name.split(" ").map((n) => n[0]).join("")
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <div className="flex items-center gap-2 text-xs text-base-content/60">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </span>
                      {user.phoneNumber && (
                        <span className="flex items-center gap-1">
                          <PhoneCall className="w-3 h-3" />
                          {user.phoneNumber}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-base-content/50 truncate">
                      {user.location}
                    </p>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUser(user);
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Selected User Preview */}
        {selectedUser && (
          <div className="border border-primary rounded-lg p-3 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-sm font-semibold overflow-hidden">
                  {selectedUser.avatarUrl ? (
                    <img
                      src={selectedUser.avatarUrl}
                      alt={selectedUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    selectedUser.name.split(" ").map((n) => n[0]).join("")
                  )}
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium">{selectedUser.name}</p>
                <p className="text-sm text-base-content/60">{selectedUser.location}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="card-actions justify-end pt-2">
          <button className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            disabled={!selectedUser}
            onClick={handleCreateChat}
          >
            Start Chat
          </button>
        </div>
      </div>
    </div>
  );
}