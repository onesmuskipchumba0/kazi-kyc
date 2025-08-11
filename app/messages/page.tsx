// app/messages/page.tsx
"use client";

import { Plus, Search } from "lucide-react";
import Image from "next/image";

const conversations = [
  {
    name: "Sarah Wanjiku",
    role: "Home Owner",
    location: "Kiambu",
    message: "Hi, I'm interested in your masonry serv...",
    online: true,
    avatar: null,
  },
  {
    name: "David Kimani",
    role: "Construction Manager",
    location: "Nairobi",
    message: "Perfect! When can you start? I need this...",
    online: true,
    avatar: "/avatars/david.png",
  },
  {
    name: "Grace Njeri",
    role: "Restaurant Owner",
    location: "Mombasa",
    message: "Thank you for the excellent work on m...",
    online: false,
    avatar: "/avatars/grace.png",
  },
  {
    name: "Peter Macharia",
    role: "Hotel Manager",
    location: "Nakuru",
    message: "Can you provide a quote for the securi...",
    online: false,
    avatar: "/avatars/peter.png",
  },
  {
    name: "Mary Akinyi",
    role: "Business Owner",
    location: "Kisumu",
    message: "I need a house help for weekends only",
    online: true,
    avatar: "/avatars/mary.png",
  },
];

export default function MessagesPage() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-[250px] border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 font-semibold">
          Messages
          <button className="bg-black text-white px-3 py-1 rounded flex items-center gap-1 text-sm">
            <Plus size={16} /> New
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-2">
          <div className="flex items-center bg-gray-100 rounded px-2 py-1">
            <Search size={16} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="bg-transparent flex-1 outline-none px-2 text-sm"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 hover:bg-gray-100 cursor-pointer"
            >
              <div className="relative w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                {c.avatar && (
                  <Image
                    src={c.avatar}
                    alt={c.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                {c.online && (
                  <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="text-xs text-gray-500 truncate">{c.message}</p>
                <p className="text-xs text-gray-400">
                  {c.role} · {c.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="bg-gray-200 p-4 rounded-full">
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
        <p className="text-sm text-gray-500 max-w-xs">
          Send messages to workers and employers to discuss job opportunities.
        </p>
        <button className="mt-4 bg-black text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus size={16} /> Start New Conversation
        </button>
      </div>
    </div>
  );
}
