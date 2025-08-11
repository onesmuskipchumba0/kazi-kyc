// app/messages/page.tsx
"use client";

import { Plus, Search, Send, Phone, Video, MoreVertical, Info, User, Briefcase, MapPin } from "lucide-react";
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
    { id: "m1", text: chat.message, sender: "them", time: "10:30 AM" },
    { id: "m2", text: "I'm interested in your masonry services for my new house project.", sender: "them", time: "10:32 AM" },
    { id: "m3", text: "Hello Sarah! Thank you for reaching out. I'd be happy to help with your project.", sender: "me", time: "10:35 AM" },
    { id: "m4", text: "Could you tell me more about the scope of work you need done?", sender: "me", time: "10:36 AM" },
    { id: "m5", text: "I need stone work for the exterior walls and some interior features. About 200 sq meters total.", sender: "them", time: "10:45 AM" },
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
          <p className="text-xs text-success">Online</p>
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
        {messages.map((m) => {
          const isMe = m.sender === "me";
          return (
            <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[78%] ${isMe ? 'text-neutral-content' : 'text-base-content'}`}>
                <div className={`rounded-2xl px-4 py-2 shadow-sm ${isMe ? 'bg-neutral' : 'bg-base-100 border border-base-200'}`}>
                  {m.text}
                </div>
                <div className={`text-[10px] mt-1 ${isMe ? 'text-neutral-content/70 text-right pr-1' : 'text-base-content/50 pl-1'}`}>
                  {m.time}
                </div>
              </div>
            </div>
          );
        })}
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
    <div className="card w-full max-w-md bg-base-100 border border-base-200 shadow">
      <div className="card-body gap-4">
        <div>
          <h2 className="card-title">Start New Conversation</h2>
          <p className="text-sm text-base-content/60">Create a chat with a client or worker. Fill in the details below.</p>
        </div>

        {/* Avatar Preview */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-base-200 grid place-items-center text-sm font-semibold">
            {name.trim()
              ? name.trim().split(" ").slice(0, 2).map((n) => n[0]).join("")
              : <User className="w-5 h-5 text-base-content/60" />}
          </div>
          <div className="text-xs text-base-content/60">Avatar will be generated from the name</div>
        </div>

        {/* Name */}
        <label className="form-control w-full">
          <div className="label"><span className="label-text">Full Name</span></div>
          <div className="relative">
            <User className="w-4 h-4 text-base-content/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g., Sarah Wanjiku"
              className="input input-bordered w-full pl-9"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </label>

        {/* Role */}
        <label className="form-control w-full">
          <div className="label"><span className="label-text">Role</span></div>
          <div className="relative">
            <Briefcase className="w-4 h-4 text-base-content/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g., Home Owner, Project Manager"
              className="input input-bordered w-full pl-9"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {['Home Owner','Business Owner','Construction Manager','Project Manager'].map((s) => (
              <button key={s} type="button" className="btn btn-xs btn-outline" onClick={() => setRole(s)}>
                {s}
              </button>
            ))}
          </div>
        </label>

        {/* Location */}
        <label className="form-control w-full">
          <div className="label"><span className="label-text">Location</span></div>
          <div className="relative">
            <MapPin className="w-4 h-4 text-base-content/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g., Nairobi"
              className="input input-bordered w-full pl-9"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {['Nairobi','Mombasa','Kisumu','Nakuru','Kiambu'].map((city) => (
              <button key={city} type="button" className="btn btn-xs btn-ghost" onClick={() => setLocation(city)}>
                {city}
              </button>
            ))}
          </div>
        </label>

        {/* Actions */}
        <div className="card-actions justify-end pt-2">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button
            className="btn btn-primary"
            disabled={!name.trim() || !role.trim() || !location.trim()}
            onClick={() => { if (name && role && location) onCreate(name, role, location); }}
          >
            Create Chat
          </button>
        </div>
      </div>
    </div>
  );
}
