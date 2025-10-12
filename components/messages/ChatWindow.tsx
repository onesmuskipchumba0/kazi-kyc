"use client";
import { useState, useEffect, useRef } from "react";
import { Phone, Video, Info, Send, MessageCircle, X } from "lucide-react";
import UserInfoModal from "./UserInfoModal";
import MessagesSkeleton from "./MessagesSkeleton";

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

interface ChatWindowProps {
  chat: Conversation;
  messages: Message[];
  loading: boolean;
  currentUser: User | null;
  onSendMessage: (content: string) => Promise<boolean>;
  onBack?: () => void;
}

export default function ChatWindow({ 
  chat, 
  messages, 
  loading, 
  currentUser,
  onSendMessage,
  onBack
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const [sendingMessages, setSendingMessages] = useState<{id: string, content: string, timestamp: string}[]>([]);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages.length, sendingMessages.length]);

  const fetchUserInfo = async (publicId: string) => {
    try {
      const response = await fetch(`/api/user/${publicId}`);
      const data = await response.json();
      if (data.user) {
        setUserInfo(data.user);
        setShowUserInfo(true);
      }
    } catch (error) {
      // Silently handle error
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
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-base-200">
          {loading ? (
            <MessagesSkeleton />
          ) : messages.length === 0 && sendingMessages.length === 0 ? (
            <div className="text-center text-base-content/60 py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-base-content/30" />
              <p className="text-lg font-medium mb-2">No messages yet</p>
              <p className="text-base-content/60">Start the conversation by sending a message!</p>
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
                      <div className={`flex items-center text-[10px] mt-1 ${isMe ? 'text-neutral-content/70 justify-end pr-1' : 'text-base-content/50 pl-1'}`}>
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