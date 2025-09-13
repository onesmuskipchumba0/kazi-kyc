"use client"
import { useState } from 'react';

import { useUser } from '@clerk/nextjs';
import {
  User,
  Bell,
  Shield,
  Settings as SettingsIcon,
  Lock,
  HelpCircle,
  Mail,
  Phone,
  CreditCard,
  Download,
  Trash2,
  Edit,
  CheckCircle
} from 'lucide-react';

const SettingsPage = () => {
  const { user } = useUser();
  const [activeSection, setActiveSection] = useState('account');

  // Mock data - in a real app, this would come from Clerk
  const userData = {
    name: user?.fullName || 'John Mwangi',
    email: user?.primaryEmailAddress?.emailAddress || 'john.mwangi@email.com',
    phone: '+254 712 345 678',
    isVerified: true,
    isPremium: true,
    plan: 'Premium Plan',
    price: 'KSh 500/month'
  };

  const settingsSections = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Safety', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'account':
        return (
          <div className="space-y-6">
            <div className="bg-base-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Account Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="text-primary" size={20} />
                    <div>
                      <p className="font-medium">Email Address</p>
                      <p className="text-sm text-base-content/70">Your primary email for account notifications</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{userData.email}</span>
                    <button className="btn btn-ghost btn-sm">
                      <Edit size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="text-primary" size={20} />
                    <div>
                      <p className="font-medium">Phone Number</p>
                      <p className="text-sm text-base-content/70">Used for SMS notifications and verification</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{userData.phone}</span>
                    <button className="btn btn-ghost btn-sm">
                      <Edit size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-primary" size={20} />
                    <div>
                      <p className="font-medium">Subscription</p>
                      <p className="text-sm text-base-content/70">Manage your membership plan</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="badge badge-primary">{userData.plan}</span>
                    <button className="btn btn-ghost btn-sm">
                      <Edit size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-base-200 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Data Management</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Download className="text-primary" size={20} />
                    <div>
                      <p className="font-medium">Export Data</p>
                      <p className="text-sm text-base-content/70">Download a copy of your account data</p>
                    </div>
                  </div>
                  <button className="btn btn-outline">Export</button>
                </div>

                <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Trash2 className="text-error" size={20} />
                    <div>
                      <p className="font-medium">Delete Account</p>
                      <p className="text-sm text-base-content/70">Permanently delete your account and all data</p>
                    </div>
                  </div>
                  <button className="btn btn-error btn-outline">Delete Account</button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="bg-base-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
            <p className="text-base-content/70">Manage your notification preferences here.</p>
            {/* Add notification settings components */}
          </div>
        );
      
      // Add other cases for different sections
      
      default:
        return (
          <div className="bg-base-200 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Settings Content</h3>
            <p className="text-base-content/70">Select a section from the menu to view settings.</p>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-base-200 p-6 rounded-lg sticky top-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <SettingsIcon size={24} />
              Settings
            </h2>
            <ul className="menu bg-base-200 rounded-box">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <li key={section.id}>
                    <a
                      className={activeSection === section.id ? 'active' : ''}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <Icon size={18} />
                      {section.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          <div className="bg-base-100 p-6 rounded-lg shadow-md">
            {/* User Profile Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="avatar">
                <div className="w-16 rounded-full">
                  <img src={user?.imageUrl || "https://via.placeholder.com/64"} alt={userData.name} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">{userData.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-base-content/70">{userData.email}</span>
                  {userData.isVerified && (
                    <span className="badge badge-success badge-sm gap-1">
                      <CheckCircle size={12} />
                      Verified
                    </span>
                  )}
                  {userData.isPremium && (
                    <span className="badge badge-primary badge-sm">Premium Member</span>
                  )}
                </div>
              </div>
            </div>

            {/* Section Content */}
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;