// app/messages/page.tsx
"use client";

import { Plus, Search, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Conversation {
  name: string;
  role: string;
  location: string;
  message: string;
  online: boolean;
  avatar?: string | null;
}

const initialConversations: Conversation[] = [
  {
    name: "Sarah Wanjiku",
    role: "Home Owner",
    location: "Kiambu",
    message: "Hi, I'm interested in your masonry services...",
    online: true,
    avatar: null,
  },
  {
    name: "David Kimani",
    role: "Construction Manager",
    location: "Nairobi",
    message: "Perfect! When can you start? I need this urgently...",
    online: true,
    avatar: "/avatars/david.png",
  },
  {
    name: "Grace Njeri",
    role: "Restaurant Owner",
    location: "Mombasa",
    message: "Thank you for the excellent work on my project...",
    online: false,
    avatar: "/avatars/grace.png",
  },
  {
    name: "Peter Macharia",
    role: "Hotel Manager",
    location: "Nakuru",
    message: "Can you provide a quote for the security services...",
    online: false,
    avatar: "/avatars/peter.png",
  },
  {
    name: "Mary Akinyi",
    role: "Business Owner",
    location: "Kisumu",
    message: "I need a house help for weekends only...",
    online: true,
    avatar: "/avatars/mary.png",
  },
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewChat = (name: string, role: string, location: string) => {
    const newConversation: Conversation = {
      name,
      role,
      location,
      message: "New conversation started...",
      online: true,
      avatar: null,
    };
    setConversations([newConversation, ...conversations]);
    setSelectedChat(newConversation);
    setShowNewChat(false);
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
          {filteredConversations.map((c, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-4 hover:bg-base-200 cursor-pointer ${
                selectedChat?.name === c.name ? "bg-base-200" : ""
              }`}
              onClick={() => {
                setSelectedChat(c);
                setShowNewChat(false);
              }}
            >
              <div className="relative w-10 h-10 rounded-full bg-base-300 flex items-center justify-center text-sm font-semibold text-base-content">
                {c.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={c.avatar}
                    alt={c.name}
                    className="rounded-full w-full h-full"
                  />
                ) : (
                  c.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                )}
                {c.online && (
                  <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 rounded-full border-2 border-base-100"></span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="text-xs text-base-content/60 truncate">{c.message}</p>
                <p className="text-xs text-base-content/50">
                  {c.role} · {c.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col p-4">
        {showNewChat ? (
          <NewChatForm onCreate={handleNewChat} onCancel={() => setShowNewChat(false)} />
        ) : selectedChat ? (
          <ChatWindow chat={selectedChat} />
        ) : (
          <EmptyState onNew={() => setShowNewChat(true)} />
        )}
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <>
      <div className="bg-base-200 p-4 rounded-full">
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
      <p className="text-sm text-base-content/60 max-w-xs">
        Send messages to workers and employers to discuss job opportunities.
      </p>
      <button
        className="mt-4 btn btn-primary"
        onClick={onNew}
      >
        <Plus size={16} /> Start New Conversation
      </button>
    </>
  );
}

// Chat Window Component
function ChatWindow({ chat }: { chat: Conversation }) {
  interface Message {
    id: string;
    text: string;
    sender: "me" | "them";
    time: string;
  }

  const [messages, setMessages] = useState<Message[]>([
    { id: "m1", text: chat.message, sender: "them", time: "10:12 AM" },
    { id: "m2", text: "Hi! Happy to help. Could you share more details?", sender: "me", time: "10:13 AM" },
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages.length]);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { id: `m-${Date.now()}`, text: trimmed, sender: "me", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
    ]);
    setInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full h-full border border-base-200 rounded bg-base-100">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-base-200 sticky top-0 bg-base-100 z-10">
        <div className="relative w-10 h-10 rounded-full bg-base-300 grid place-items-center text-sm font-semibold">
          {chat.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={chat.avatar} alt={chat.name} className="rounded-full w-full h-full" />
          ) : (
            chat.name.split(" ").map((n) => n[0]).join("")
          )}
          {chat.online && <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 rounded-full border-2 border-base-100" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{chat.name}</p>
          <p className="text-xs text-base-content/60 truncate">{chat.role} · {chat.location}</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-base-200">
        {messages.map((m) => (
          <div key={m.id} className={`chat ${m.sender === "me" ? "chat-end" : "chat-start"}`}>
            {m.sender === "them" && (
              <div className="chat-image avatar">
                <div className="w-8 rounded-full bg-base-300 grid place-items-center text-[10px] font-semibold">
                  {chat.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={chat.avatar} alt={chat.name} className="rounded-full w-full h-full" />
                  ) : (
                    chat.name.split(" ").map((n) => n[0]).join("")
                  )}
                </div>
              </div>
            )}
            <div className="chat-header mb-1 text-xs opacity-70">
              {m.sender === "me" ? "You" : chat.name} <time className="ml-1">{m.time}</time>
            </div>
            <div className={`chat-bubble ${m.sender === "me" ? "chat-bubble-primary" : ""}`}>{m.text}</div>
            <div className="chat-footer text-xs opacity-70">{m.sender === "me" ? "Sent" : ""}</div>
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="p-3 border-t border-base-200">
        <div className="join w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a message"
            className="input input-bordered join-item w-full"
          />
          <button onClick={sendMessage} className="btn btn-primary join-item">
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
  onCreate: (name: string, role: string, location: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");

  return (
    <div className="w-full max-w-sm bg-base-100 border border-base-200 rounded p-4">
      <h2 className="text-lg font-semibold mb-4">Start New Conversation</h2>
      <input
        type="text"
        placeholder="Full Name"
        className="input input-bordered w-full mb-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Role (e.g., Business Owner)"
        className="input input-bordered w-full mb-2"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <input
        type="text"
        placeholder="Location"
        className="input input-bordered w-full mb-4"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <div className="flex gap-2">
        <button className="btn btn-primary flex-1" onClick={() => { if (name && role && location) onCreate(name, role, location); }}>
          Create
        </button>
        <button className="btn btn-ghost flex-1" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
