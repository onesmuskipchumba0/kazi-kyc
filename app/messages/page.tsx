// app/messages/page.tsx
"use client";

import { Plus, Search, Send, Phone, Video, MoreVertical, Info, User, Briefcase, MapPin, Mail, PhoneCall, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface User {
  id: string;
  public_id: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string | null;
  location: string;
  name: string;
}

interface Conversation {
  id: string;
  otherUser: User;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender: User;
  receiver: User;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Fetch current user and conversations
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Fetch conversations when current user is available
  useEffect(() => {
    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser]);

  // Fetch messages when a chat is selected
  useEffect(() => {
    if (selectedChat && currentUser) {
      fetchMessages(selectedChat.otherUser.public_id);
    }
  }, [selectedChat, currentUser]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/user');
      const data = await response.json();
      if (data.user) {
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/conversations');
      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      setMessageLoading(true);
      const response = await fetch(`/api/messages/${userId}`);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessageLoading(false);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.otherUser.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewChat = (user: User) => {
    const newConversation: Conversation = {
      id: `new-${Date.now()}`,
      otherUser: user,
      lastMessage: "New conversation started...",
      timestamp: new Date().toISOString(),
      unreadCount: 0,
    };
    setConversations([newConversation, ...conversations]);
    setSelectedChat(newConversation);
    setShowNewChat(false);
  };

const handleSendMessage = async (content: string, receiverId: string) => {
  if (!currentUser) return false;

  try {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_id: currentUser.public_id,
        receiver_id: receiverId,
        content,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error("Send message failed:", result);
      return false;
    }

    if (selectedChat) {
      fetchMessages(selectedChat.otherUser.public_id);
    }
    fetchConversations();
    return true;
  } catch (error) {
    console.error("Error sending message:", error);
    return false;
  }
};



  return (
    <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-2rem)]">
      {/* Sidebar */}
      <div className="hidden md:flex w-[280px] border-r border-base-200 bg-base-100 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 font-semibold">
          Messages
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setSelectedChat(null);
              setShowNewChat(true);
            }}
          >
            <Plus size={16} /> New
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-2">
          <div className="flex items-center bg-base-200 rounded px-2 py-1">
            <Search size={16} className="text-base-content/60" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="bg-transparent flex-1 outline-none px-2 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="loading loading-spinner loading-md"></div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center p-8 text-base-content/60 text-sm">
              No conversations found
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedChat?.id === conversation.id}
                onClick={() => setSelectedChat(conversation)}
              />
            ))
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col p-4">
        {showNewChat ? (
          <NewChatForm 
            onCreate={handleNewChat} 
            onCancel={() => setShowNewChat(false)} 
          />
        ) : selectedChat ? (
          <ChatWindow 
            chat={selectedChat} 
            messages={messages} 
            loading={messageLoading}
            currentUser={currentUser}
            onSendMessage={async (content) => {
              return await handleSendMessage(content, selectedChat.otherUser.public_id);
            }}
          />
        ) : (
          <EmptyState onNew={() => setShowNewChat(true)} />
        )}
      </div>
    </div>
  );
}

// Conversation Item Component
function ConversationItem({ 
  conversation, 
  isSelected, 
  onClick 
}: { 
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-4 hover:bg-base-200 cursor-pointer ${
        isSelected ? "bg-base-200" : ""
      }`}
      onClick={onClick}
    >
      <div className="relative w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-sm font-semibold text-base-content">
        {conversation.otherUser.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={conversation.otherUser.avatarUrl}
            alt={conversation.otherUser.name}
            className="rounded-full w-full h-full"
          />
        ) : (
          conversation.otherUser.name
            .split(" ")
            .map((n) => n[0])
            .join("")
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <p className="text-sm font-semibold truncate">{conversation.otherUser.name}</p>
          <span className="text-xs text-base-content/50">
            {new Date(conversation.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
        <p className="text-xs text-base-content/60 truncate">{conversation.lastMessage}</p>
        <p className="text-xs text-base-content/50 truncate">
          {conversation.otherUser.location}
        </p>
      </div>
      {conversation.unreadCount > 0 && (
        <span className="badge badge-primary badge-sm">
          {conversation.unreadCount}
        </span>
      )}
    </div>
  );
}

// Empty State Component
function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col justify-center items-center">
        <div className="bg-base-200 p-4 rounded-full mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 8h10M7 12h6m-6 4h10M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold mt-4">Your Messages</h2>
        <p className="text-sm text-base-content/60 text-center max-w-md">
          Send messages to workers and employers to discuss job opportunities.
        </p>
        <button
          className="mt-4 btn btn-primary"
          onClick={onNew}
        >
          <Plus size={16} /> Start New Conversation
        </button>
      </div>
    </div>
  );
}

// Chat Window Component
function ChatWindow({ 
  chat, 
  messages, 
  loading, 
  currentUser,
  onSendMessage 
}: { 
  chat: Conversation;
  messages: Message[];
  loading: boolean;
  currentUser: User | null;
  onSendMessage: (content: string) => Promise<boolean>;
}) {
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages.length]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || !currentUser) return;
    
    const success = await onSendMessage(trimmed);
    if (success) {
      setInput("");
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex flex-col w-full h-full mb-12 border-base-200 rounded bg-base-100">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-base-200 sticky top-0 bg-base-100 z-10">
        <div className="relative w-10 h-10 rounded-full bg-base-300 grid place-items-center text-sm font-semibold">
          {chat.otherUser.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={chat.otherUser.avatarUrl} alt={chat.otherUser.name} className="rounded-full w-full h-full" />
          ) : (
            chat.otherUser.name.split(" ").map((n) => n[0]).join("")
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{chat.otherUser.name}</p>
          <p className="text-xs text-base-content/60">
            {chat.otherUser.location}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button className="btn btn-ghost btn-sm" aria-label="Call"><Phone className="w-4 h-4" /></button>
          <button className="btn btn-ghost btn-sm" aria-label="Video"><Video className="w-4 h-4" /></button>
          <button className="btn btn-ghost btn-sm" aria-label="Info"><Info className="w-4 h-4" /></button>
          <button className="btn btn-ghost btn-sm" aria-label="More"><MoreVertical className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Messages */}
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-200">
        {loading ? (
          <div className="flex justify-center items-center h-20">
            <div className="loading loading-spinner loading-md"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-base-content/60 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => {
            const isMe = currentUser && message.sender.public_id === currentUser.public_id;
            return (
              <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[78%] ${isMe ? 'text-neutral-content' : 'text-base-content'}`}>
                  <div className={`rounded-2xl px-4 py-2 shadow-sm ${isMe ? 'bg-neutral' : 'bg-base-100 border border-base-200'}`}>
                    {message.content}
                  </div>
                  <div className={`text-[10px] mt-1 ${isMe ? 'text-neutral-content/70 text-right pr-1' : 'text-base-content/50 pl-1'}`}>
                    {formatMessageTime(message.created_at)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Composer */}
      <div className="p-3">
        <div className="join w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a message"
            className="input input-ghost join-item w-full border-none focus:outline-none focus:ring-0 focus:border-transparent shadow-none bg-base-100"
          />
          <button onClick={sendMessage} className="btn btn-primary join-item" disabled={!input.trim()}>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// New Chat Form Component
function NewChatForm({
  onCreate,
  onCancel,
}: {
  onCreate: (user: User) => void;
  onCancel: () => void;
}) {
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
        // Fetch detailed user information including avatarUrl for each user
        const detailedUsers = await Promise.all(
          data.users.map(async (user: any) => {
            try {
              const userResponse = await fetch(`/api/user/${user.public_id}`);
              const userData = await userResponse.json();
              return userData.user || user;
            } catch (error) {
              console.error('Error fetching user details:', error);
              return user;
            }
          })
        );
        setSearchResults(detailedUsers);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching users:', error);
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
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center p-4 text-base-content/60 text-sm">
                No users found
              </div>
            ) : (
              searchResults.map((user) => (
                <div
                  key={user.public_id}
                  className={`flex items-center gap-3 p-3 hover:bg-base-200 cursor-pointer ${
                    selectedUser?.public_id === user.public_id ? 'bg-base-200' : ''
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="relative w-8 h-8 rounded-full bg-base-300 flex items-center justify-center text-xs font-semibold">
                    {user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="rounded-full w-full h-full"
                      />
                    ) : (
                      user.name.split(" ").map((n) => n[0]).join("")
                    )}
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
              <div className="relative w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-sm font-semibold">
                {selectedUser.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedUser.avatarUrl}
                    alt={selectedUser.name}
                    className="rounded-full w-full h-full"
                  />
                ) : (
                  selectedUser.name.split(" ").map((n) => n[0]).join("")
                )}
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