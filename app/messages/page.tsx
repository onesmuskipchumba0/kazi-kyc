"use client";
import { useEffect, useState } from "react";
import { Plus, Search, MessageCircle, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import ConversationListSkeleton from "@/components/messages/ConversationListSkeleton";
import ConversationItem from "@/components/messages/ConversationItem";
import EmptyState from "@/components/messages/EmptyState";
import ChatWindow from "@/components/messages/ChatWindow";
import NewChatForm from "@/components/messages/NewChartForm";

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
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [messageLoading, setMessageLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const searchParams = useSearchParams();
  const userParam = searchParams.get("user");

  // Fixed: Simplified userParam handling to prevent redirect loops
  useEffect(() => {
    if (userParam && initialLoadComplete && currentUser) {
      handleUserParam(userParam);
    }
  }, [userParam, initialLoadComplete, currentUser]);

  const handleUserParam = async (targetUserId: string) => {
    try {
      // First, check if we already have a conversation with this user
      const existingConversation = conversations.find(
        (c) => c.otherUser.public_id === targetUserId
      );

      if (existingConversation) {
        setSelectedChat(existingConversation);
        return;
      }

      // If no existing conversation, try to get user info and create a new chat
      const userResponse = await fetch(`/api/user/${targetUserId}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData.user) {
          handleNewChat(userData.user);
        }
      }
    } catch (error) {
      console.error("Error handling user param:", error);
    }
  };

  // Fixed: Simplified data initialization
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        
        // Fetch current user
        const userResponse = await fetch("/api/user");
        if (!userResponse.ok) throw new Error("Failed to fetch user");
        
        const userData = await userResponse.json();
        if (!userData.user) throw new Error("No user data found");

        setCurrentUser(userData.user);

        // Fetch conversations
        const conversationsResponse = await fetch("/api/conversations");
        if (!conversationsResponse.ok) throw new Error("Failed to fetch conversations");
        
        const conversationsData = await conversationsResponse.json();
        
        let conversationsArray: Conversation[] = [];
        if (Array.isArray(conversationsData)) {
          conversationsArray = conversationsData;
        } else if (Array.isArray(conversationsData.conversations)) {
          conversationsArray = conversationsData.conversations;
        } else if (conversationsData.conversations && typeof conversationsData.conversations === "object") {
          conversationsArray = [conversationsData.conversations];
        } else if (conversationsData.id) {
          conversationsArray = [conversationsData];
        }

        setConversations(conversationsArray);
        setError(null);
      } catch (error) {
        console.error("Error initializing data:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
        setInitialLoadComplete(true);
      }
    };

    initializeData();
  }, []);

  // Fetch messages when a chat is selected
  useEffect(() => {
    if (selectedChat && currentUser) {
      fetchMessages(selectedChat.otherUser.public_id);
    }
  }, [selectedChat, currentUser]);

  const fetchMessages = async (userId: string) => {
    if (!currentUser?.public_id) {
      setError("User not authenticated");
      return;
    }

    try {
      setMessageLoading(true);
      setError(null);
      
      const response = await fetch(`/api/messages/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.messages && Array.isArray(data.messages)) {
        setMessages(data.messages);
      } else if (Array.isArray(data)) {
        setMessages(data);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
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
    if (!currentUser?.public_id) {
      setError("User not authenticated");
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
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to send message" }));
        setError(errorData.error || "Failed to send message");
        return false;
      }

      const result = await response.json();

      // Refresh messages
      if (selectedChat) {
        fetchMessages(selectedChat.otherUser.public_id);
      }
      
      // Update conversation list
      setConversations(prev => prev.map(conv => 
        conv.otherUser.public_id === receiverId 
          ? { 
              ...conv, 
              lastMessage: content, 
              timestamp: new Date().toISOString(),
              unreadCount: 0
            }
          : conv
      ));
      
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message");
      return false;
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-2rem)]">
      {/* Sidebar */}
      <div className={`${selectedChat ? 'hidden md:flex' : 'flex'} w-full md:w-[280px] border-r border-base-200 bg-base-100 flex-col`}>
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
            <button 
              className="float-right text-error/60 hover:text-error"
              onClick={() => setError(null)}
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <ConversationListSkeleton />
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