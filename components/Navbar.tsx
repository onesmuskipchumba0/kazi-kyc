'use client';
import React from 'react';
import {
  FaHome,
  FaSearch,
  FaBriefcase,
  FaEnvelope,
  FaUsers,
  FaBell,
  FaUser,
  FaCog,
  FaLock,
} from 'react-icons/fa';
import Image from 'next/image';
import { useUser, SignOutButton } from '@clerk/nextjs';

function Navbar() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded || !isSignedIn || !user) {
    return (
      <div className="flex w-full justify-center items-center py-2">
        <span className="loading loading-ring loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-w-[250px] bg-white border-r border-gray-200 h-screen flex flex-col justify-between shadow-lg">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-100">
          <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
            K
          </div>
          <div>
            <p className="font-semibold text-sm">KaziKYC</p>
            <p className="text-xs text-gray-500">Connect & Work</p>
          </div>
        </div>

        {/* Menu */}
        <ul className="menu px-2 space-y-1 py-4">
          <li>
            <a href="/" className="flex items-center gap-3 hover:bg-gray-80 rounded-lg transition-colors duration-200">
              <FaHome className="text-gray-600" /> Home
            </a>
          </li>
          <li>
            <a href="/work" className="flex items-center gap-3 hover:bg-gray-80 rounded-lg transition-colors duration-200">
              <FaSearch className="text-gray-600" /> Find Work
            </a>
          </li>
          <li>
            <a href="/my-jobs" className="flex items-center gap-3 hover:bg-gray-80 rounded-lg transition-colors duration-200">
              <FaBriefcase className="text-gray-600" /> My Jobs
            </a>
          </li>
          <li>
            <a href="/messages" className="flex items-center gap-3 hover:bg-gray-80 rounded-lg transition-colors duration-200">
              <FaEnvelope className="text-gray-600" /> Messages
            </a>
          </li>
          <li>
            <a href="/network" className="flex items-center gap-3 hover:bg-gray-80 rounded-lg transition-colors duration-200">
              <FaUsers className="text-gray-600" /> Network
            </a>
          </li>
          <li>
            <a href="/notifications" className="flex items-center gap-3 hover:bg-gray-80 rounded-lg transition-colors duration-200">
              <FaBell className="text-gray-600" /> Notifications
            </a>
          </li>
          <li>
            <a href="/profile" className="flex items-center gap-3 hover:bg-gray-80 rounded-lg transition-colors duration-200">
              <FaUser className="text-gray-600" /> Profile
            </a>
          </li>
          <li>
            <a href="/settings" className="flex items-center gap-3 hover:bg-gray-80 rounded-lg transition-colors duration-200">
              <FaCog className="text-gray-600" /> Settings
            </a>
          </li>
        </ul>
      </div>

      {/* User Footer */}
      <div className="px-4 py-4 border-t border-gray-200 bg-gray-50 pb-16">
        {user ? (
          <div className="flex flex-col space-y-3">
            <div className="flex items-center gap-3 p-2 rounded-lg bg-white shadow-sm border border-gray-100">
              <Image
                src={user.imageUrl}
                width={40}
                height={40}
                className="rounded-full border-2 border-gray-200"
                alt="User"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.fullName || 'John Mwangi'}
                </p>
                <p className="text-xs text-blue-600 font-medium">Mason • Nairobi</p>
              </div>
            </div>
            
            <SignOutButton>
              <button className="btn btn-sm w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm flex justify-between items-center transition-all duration-200 hover:shadow-md">
                <span>Sign Out</span>
                <FaLock className="text-orange-500" />
              </button>
            </SignOutButton>
          </div>
        ) : (
          <div className="flex justify-center items-center py-4">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;
