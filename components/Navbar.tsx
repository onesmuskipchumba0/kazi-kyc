'use client';
import React, { useMemo, useState } from 'react';
import Link from 'next/link';
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
  FaBars,
} from 'react-icons/fa';
import Image from 'next/image';
import { useUser, SignOutButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

function Navbar() {
  const { user } = useUser();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = useMemo(
    () => [
      { href: '/', label: 'Home', icon: FaHome },
      { href: '/work', label: 'Find Work', icon: FaSearch },
      { href: '/my-jobs', label: 'My Jobs', icon: FaBriefcase },
      { href: '/messages', label: 'Messages', icon: FaEnvelope },
      { href: '/network', label: 'Network', icon: FaUsers },
      { href: '/notifications', label: 'Notifications', icon: FaBell },
      { href: '/profile', label: 'Profile', icon: FaUser },
      { href: '/settings', label: 'Settings', icon: FaCog },
    ],
    []
  );

  const renderMenu = (onNavigate?: () => void) => (
    <ul className="menu px-2 py-4 gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center gap-3 rounded-lg transition-colors duration-200 ${
                isActive ? 'bg-base-200 font-semibold' : 'hover:bg-base-200'
              }`}
              aria-current={isActive ? 'page' : undefined}
              onClick={onNavigate}
            >
              <Icon className="text-base-content/70" /> {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  const renderUser = (
    <div className="px-4 py-4 border-t border-base-200 bg-base-100">
      {user ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-base-100 shadow-sm border border-base-200">
            <Image
              src={user.imageUrl}
              width={40}
              height={40}
              className="rounded-full border-2 border-base-200"
              alt="User"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {user.fullName || 'User'}
              </p>
              <p className="text-xs text-base-content/50">Mason • Nairobi</p>
            </div>
          </div>
          <SignOutButton>
            <button className="btn btn-outline btn-sm w-full flex justify-between items-center">
              <span>Sign Out</span>
              <FaLock className="text-warning" />
            </button>
          </SignOutButton>
        </div>
      ) : (
        <div className="flex flex-col gap-3 animate-pulse">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-base-100 shadow-sm border border-base-200">
            <div className="w-10 h-10 rounded-full bg-base-200" />
            <div className="flex-1 min-w-0">
              <div className="h-3 w-24 bg-base-200 rounded mb-2" />
              <div className="h-2 w-32 bg-base-200/70 rounded" />
            </div>
          </div>
          <button className="btn btn-outline btn-sm w-full" disabled>
            Loading...
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:fixed top-0 left-0 w-[280px] bg-base-100 border-r border-base-200 h-screen flex-col justify-between shadow-sm z-30">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-base-200">
            <div className="w-10 h-10 rounded-lg bg-neutral text-neutral-content grid place-items-center text-lg font-bold">
              K
            </div>
            <div>
              <p className="font-semibold">KaziKYC</p>
              <p className="text-xs text-base-content/50">Connect & Work</p>
            </div>
          </div>
          {renderMenu()}
        </div>
        {renderUser}
      </div>

      {/* Mobile Topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-base-100 border-b border-base-200 z-40">
        <div className="navbar px-4">
          <div className="flex-1">
            <button
              aria-label="Open menu"
              className="btn btn-ghost btn-sm"
              onClick={() => setIsMobileOpen(true)}
            >
              <FaBars />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-neutral text-neutral-content grid place-items-center text-sm font-bold">
              K
            </div>
            <span className="font-semibold">KaziKYC</span>
          </div>
          <div className="flex-1" />
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed top-0 left-0 h-screen w-[280px] bg-base-100 border-r border-base-200 shadow-xl z-50 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 px-4 py-4 border-b border-base-200">
                <div className="w-10 h-10 rounded-lg bg-neutral text-neutral-content grid place-items-center text-lg font-bold">
                  K
                </div>
                <div>
                  <p className="font-semibold">KaziKYC</p>
                  <p className="text-xs text-base-content/50">Connect & Work</p>
                </div>
              </div>
              {renderMenu(() => setIsMobileOpen(false))}
            </div>
            {renderUser}
          </div>
        </>
      )}
    </>
  );
}

export default Navbar;
