"use client";

import { useState } from "react";
import { MoreVertical, MapPin, Star, Search } from "lucide-react";
import { networkData } from "../api/work/networkData";
import { FaCross, FaPlus, FaUserPlus } from "react-icons/fa";
import { FaMessage, FaX } from "react-icons/fa6";


const TABS = ["My Network", "Requests", "Discover People"] as const;
type Tab = (typeof TABS)[number];

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState<Tab>("My Network");
  const [query, setQuery] = useState("");

  const people = networkData[activeTab];
  const filtered = people.filter((person) =>
    person.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold">Your Network</h1>
      <p className="text-gray-600 mb-4">
        Connect with professionals across Kenya to grow your career opportunities.
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
            {tab} ({networkData[tab].length})
          </button>
        ))}
      </div>

      {/* Search bar: global for My Network & Requests, top-only for Discover */}
      {activeTab !== "Discover People" && (
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-6">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search your network..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="ml-2 flex-1 bg-transparent outline-none text-sm"
          />
        </div>
      )}

      {/* Discover People search bar on top */}
      {activeTab === "Discover People" && (
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-6">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search to discover..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="ml-2 flex-1 bg-transparent outline-none text-sm"
          />
        </div>
      )}

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map((person) => (
          <div
            key={person.id}
            className="bg-white border rounded-2xl p-4 shadow-sm flex items-start justify-between"
          >
            <div className="flex space-x-3">
              {person.image ? (
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-700">
                  {person.initials}
                </div>
              )}
              <div>
                <h2 className="font-medium">{person.name}</h2>
                <p className="text-sm text-gray-600">{person.role}</p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="w-3 h-3 mr-1" /> {person.location}
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Star className="w-3 h-3 text-yellow-500 mr-1" /> {person.rating}
                  {person.rate && <span className="mx-2">• {person.rate}</span>}
                  <span>• {person.experience}</span>
                </div>
                <p className="text-sm text-gray-500">{person.connections}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {person.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                {activeTab === "Requests" && (
                  <div className="flex gap-2 mt-3">
                    <button className="btn bg-slate-900 text-white px-3 py-1 text-xs rounded-md">
                      <FaPlus/>
                      <span>Accept</span>
                    </button>
                    <button className="btn px-3 py-1 text-xs rounded-md hover:bg-red-200 bg-red-100 text-red-700">
                      <FaX/>
                      <span>Refuse</span>
                    </button>
                    <button className="btn px-3 py-1 text-xs rounded-md hover:bg-blue-200 bg-blue-100 text-blue-700">
                      <FaMessage/>
                      Message
                    </button>
                  </div>
                )}

                {activeTab === "Discover People" && (
                  <div className="flex gap-2 mt-3">
                    <button className="btn px-3 py-1 text-xs rounded-md bg-gray-700 text-gray-200">
                      <FaUserPlus/>
                      Connect
                    </button>
                    <button className="btn px-3 py-1 text-xs rounded-md bg-blue-100 text-blue-700">
                      <FaMessage/>
                      Message
                    </button>
                  </div>
                )}
              </div>
            </div>
            <MoreVertical className="w-5 h-5 text-gray-500 cursor-pointer" />
          </div>
        ))}
      </div>
    </div>
  );
}
