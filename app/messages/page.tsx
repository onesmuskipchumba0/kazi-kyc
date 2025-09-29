// app/messages/page.tsx
"use client";

import { Plus, Search, Send, Phone, Video, MoreVertical, Info, User, Briefcase, MapPin, Mail, PhoneCall, MessageCircle, X } from "lucide-react";
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
  const [error, setError] = useState<string | null>(null);

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
        setError(null);
      } else {
        setError("Failed to load user data");
      }
    } catch (error) {
      setError('Failed to load user information');
    }
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/conversations');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      let conversationsData = [];
      
      if (Array.isArray(data.conversations)) {
        conversationsData = data.conversations;
      } else if (data.conversations && typeof data.conversations === 'object') {
        conversationsData = [data.conversations];
      } else if (data.id) {
        conversationsData = [data];
      } else if (Array.isArray(data)) {
        conversationsData = data;
      }
      
      setConversations(conversationsData);
      setError(null);
      
    } catch (error) {
      setError('Failed to load conversations');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    if (!currentUser || !currentUser.public_id) {
      setError("User not authenticated");
      return;
    }

    try {
      setMessageLoading(true);
      setError(null);
      
      const response = await fetch(`/api/messages/${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error}`);
      }
      
      const data = await response.json();
      
      if (data.messages) {
        setMessages(data.messages || []);
        setError(null);
      } else if (data.error) {
        setError(data.error);
      } else {
        setMessages([]);
      }
    } catch (error) {
      setError('Failed to load messages');
      setMessages([]);
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
    if (!currentUser) {
      return false;
    }

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
        return false;
      }

      if (selectedChat) {
        fetchMessages(selectedChat.otherUser.public_id);
      }
      fetchConversations();
      return true;
    } catch (error) {
      return false;
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-2rem)]">
      {/* Sidebar - Show on mobile when no chat is selected */}
      <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-[280px] border-r border-base-200 bg-base-100 flex-col`}>
        {/* Header with mobile back button */}
        <div className="flex items-center justify-between p-4 font-semibold">
          <div className="flex items-center gap-2">
            {selectedChat && (
              <button 
                className="btn btn-ghost btn-sm md:hidden"
                onClick={() => setSelectedChat(null)}
                aria-label="Back to conversations"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <span>Messages</span>
          </div>
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

        {/* Error Display */}
        {error && (
          <div className="mx-4 my-2 p-2 bg-error/10 border border-error/20 rounded text-error text-sm">
            {error}
          </div>
        )}

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="loading loading-spinner loading-md"></div>
              <span className="ml-2 text-sm">Loading conversations...</span>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center p-8 text-base-content/60 text-sm">
              {conversations.length === 0 ? "No conversations yet" : "No conversations match your search"}
            </div>
          ) : (
            <>
              <div className="text-xs text-base-content/50 px-4 py-2">
                {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}
              </div>
              {filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isSelected={selectedChat?.id === conversation.id}
                  onClick={() => setSelectedChat(conversation)}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 flex flex-col ${!selectedChat && !showNewChat ? 'p-4' : ''}`}>
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
            onBack={() => setSelectedChat(null)}
          />
        ) : conversations.length > 0 ? (
          <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8">
            <div className="text-center">
              <div className="bg-base-200 p-4 rounded-full mb-4 inline-flex">
                <MessageCircle className="w-6 h-6 text-base-content/60" />
              </div>
              <h2 className="text-lg font-semibold mb-2">Select a conversation</h2>
              <p className="text-base-content/60 mb-4">
                Choose a conversation from the list to start messaging
              </p>
              <button
                className="btn btn-primary"
                onClick={() => setShowNewChat(true)}
              >
                <Plus size={16} /> Start New Conversation
              </button>
            </div>
          </div>
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
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-base-300 flex items-center justify-center text-sm font-semibold text-base-content overflow-hidden">
          {conversation.otherUser.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={conversation.otherUser.avatarUrl}
              alt={conversation.otherUser.name}
              className="w-full h-full object-cover"
            />
          ) : (
            conversation.otherUser.name
              .split(" ")
              .map((n) => n[0])
              .join("")
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <p className="text-sm font-semibold truncate">{conversation.otherUser.name}</p>
          <span className="text-xs text-base-content/50 whitespace-nowrap ml-2">
            {new Date(conversation.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
        <p className="text-xs text-base-content/60 truncate mt-1">{conversation.lastMessage}</p>
        <p className="text-xs text-base-content/50 truncate mt-1">
          {conversation.otherUser.location}
        </p>
      </div>
      {conversation.unreadCount > 0 && (
        <span className="badge badge-primary badge-sm flex-shrink-0">
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
          <MessageCircle className="w-6 h-6 text-base-content/60" />
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

// User Info Modal Component
function UserInfoModal({ 
  user, 
  onClose 
}: { 
  user: User | null;
  onClose: () => void;
}) {
  if (!user) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">User Information</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <X size={16} />
          </button>
        </div>
        
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-base-300 flex items-center justify-center text-lg font-semibold text-base-content overflow-hidden mb-4">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              user.name.split(" ").map((n) => n[0]).join("")
            )}
          </div>
          <h4 className="text-xl font-semibold">{user.name}</h4>
          {user.location && (
            <p className="text-base-content/60 flex items-center gap-1 mt-1">
              <MapPin size={14} />
              {user.location}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
            <Mail size={16} className="text-base-content/60" />
            <div className="flex-1">
              <p className="text-sm text-base-content/60">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          {user.phoneNumber && (
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <PhoneCall size={16} className="text-base-content/60" />
              <div className="flex-1">
                <p className="text-sm text-base-content/60">Phone</p>
                <p className="font-medium">{user.phoneNumber}</p>
              </div>
            </div>
          )}
        </div>

        <div className="modal-action">
          <button onClick={onClose} className="btn btn-primary">Close</button>
        </div>
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
  onSendMessage,
  onBack
}: { 
  chat: Conversation;
  messages: Message[];
  loading: boolean;
  currentUser: User | null;
  onSendMessage: (content: string) => Promise<boolean>;
  onBack?: () => void;
}) {
  const [input, setInput] = useState("");
  const [sendingMessages, setSendingMessages] = useState<{id: string, content: string, timestamp: string}[]>([]);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages.length, sendingMessages.length]);

  const fetchUserInfo = async (publicId: string) => {
    setLoadingUserInfo(true);
    try {
      const response = await fetch(`/api/user/${publicId}`);
      const data = await response.json();
      if (data.user) {
        setUserInfo(data.user);
        setShowUserInfo(true);
      }
    } catch (error) {
      // Silently handle error
    } finally {
      setLoadingUserInfo(false);
    }
  };

  const handleInfoClick = () => {
    fetchUserInfo(chat.otherUser.public_id);
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || !currentUser) return;
    
    // Create temporary message for instant UI update
    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      id: tempId,
      content: trimmed,
      timestamp: new Date().toISOString()
    };
    
    setSendingMessages(prev => [...prev, tempMessage]);
    setInput("");
    
    const success = await onSendMessage(trimmed);
    
    // Remove temporary message after sending
    setSendingMessages(prev => prev.filter(msg => msg.id !== tempId));
    
    return success;
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

  const MessageStatus = ({ isSent, isRead }: { isSent?: boolean, isRead?: boolean }) => {
    if (isRead) {
      return (
        <svg className="w-3 h-3 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 16 16">
          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
        </svg>
      );
    }
    if (isSent) {
      return (
        <svg className="w-3 h-3 text-gray-400 ml-1" fill="currentColor" viewBox="0 0 16 16">
          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
        </svg>
      );
    }
    return (
      <div className="w-3 h-3 flex items-center justify-center ml-1">
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col w-full h-full bg-base-100">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-base-200 sticky top-0 bg-base-100 z-10">
          {/* Back button for mobile */}
          {onBack && (
            <button 
              className="btn btn-ghost btn-sm md:hidden"
              onClick={onBack}
              aria-label="Back to conversations"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-sm font-semibold overflow-hidden">
              {chat.otherUser.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={chat.otherUser.avatarUrl} 
                  alt={chat.otherUser.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                chat.otherUser.name.split(" ").map((n) => n[0]).join("")
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{chat.otherUser.name}</p>
            <p className="text-xs text-base-content/60">
              {chat.otherUser.location}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button className="btn btn-ghost btn-sm hidden sm:flex" aria-label="Call"><Phone className="w-4 h-4" /></button>
            <button className="btn btn-ghost btn-sm hidden sm:flex" aria-label="Video"><Video className="w-4 h-4" /></button>
            <button 
              className="btn btn-ghost btn-sm" 
              aria-label="Info"
              onClick={handleInfoClick}
              disabled={loadingUserInfo}
            >
              {loadingUserInfo ? (
                <div className="loading loading-spinner loading-xs"></div>
              ) : (
                <Info className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-base-200">
          {loading ? (
            <div className="flex justify-center items-center h-20">
              <div className="loading loading-spinner loading-md"></div>
              <span className="ml-2 text-sm">Loading messages...</span>
            </div>
          ) : messages.length === 0 && sendingMessages.length === 0 ? (
            <div className="text-center text-base-content/60 py-8">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <>
              {/* Real messages */}
              {messages.map((message) => {
                const isMe = currentUser && message.sender.public_id === currentUser.public_id;
                return (
                  <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] sm:max-w-[70%] ${isMe ? 'text-neutral-content' : 'text-base-content'}`}>
                      <div className={`rounded-2xl px-4 py-2 shadow-sm ${isMe ? 'bg-neutral' : 'bg-base-100 border border-base-200'}`}>
                        <div className="break-words">{message.content}</div>
                      </div>
                      <div className={`flex items-center text-[10px] mt-1 ${isMe ? 'text-base-content/70 justify-end pr-1' : 'text-base-content/50 pl-1'}`}>
                        <span>{formatMessageTime(message.created_at)}</span>
                        {isMe && <MessageStatus isSent={true} isRead={message.is_read} />}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Temporary sending messages */}
              {sendingMessages.map((tempMessage) => {
                return (
                  <div key={tempMessage.id} className="flex justify-end">
                    <div className="max-w-[85%] sm:max-w-[70%] text-neutral-content opacity-70">
                      <div className="rounded-2xl px-4 py-2 shadow-sm bg-neutral">
                        <div className="break-words">{tempMessage.content}</div>
                      </div>
                      <div className="flex items-center text-[10px] mt-1 text-neutral-content/70 justify-end pr-1">
                        <span>{formatMessageTime(tempMessage.timestamp)}</span>
                        <MessageStatus />
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Composer */}
        <div className="p-3 border-t border-base-200 bg-base-100">
          <div className="join w-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type a message..."
              className="input input-bordered join-item w-full focus:outline-none focus:border-primary"
            />
            <button 
              onClick={sendMessage} 
              className="btn btn-primary join-item" 
              disabled={!input.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* User Info Modal */}
      <UserInfoModal 
        user={userInfo}
        onClose={() => {
          setShowUserInfo(false);
          setUserInfo(null);
        }}
      />
    </>
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
                  className={`flex items-center gap-3 p-3 hover:bg-base-200 cursor-pointer ${
                    selectedUser?.public_id === user.public_id ? 'bg-base-200' : ''
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center text-xs font-semibold overflow-hidden">
                      {user.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
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
                    // eslint-disable-next-line @next/next/no-img-element
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