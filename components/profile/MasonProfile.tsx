'use client';

import React, { useState } from 'react';
import { FaBriefcase, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import OverviewTab from './overviewTab';
import PortfolioTab from './portfolioTab';
import ReviewsTab from './ReviewsTab';
import SkillsTab from './SkillsTab';
import SettingsTab from './SettingsTab';

interface MasonProfileProps {
  mason: any;
}

const MasonProfile: React.FC<MasonProfileProps> = ({ mason }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab mason={mason} />;
      case 'portfolio':
        return <PortfolioTab />;
      case 'reviews':
        return <ReviewsTab />;
      case 'skills':
        return <SkillsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab mason={mason} />;
    }
  };

  // Add a safeguard in case mason is undefined
  if (!mason) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-700">Profile not found</div>
          <p className="text-gray-500 mt-2">The requested profile could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">KaziKYC</h1>
        </div>
      </header>

      {/* Profile Section */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-3xl font-bold">{mason.name}</h1>
            <div className="flex items-center mt-2 flex-wrap">
              <FaBriefcase className="mr-2" />
              <span>{mason.title}</span>
              <span className="mx-2">•</span>
              <FaMapMarkerAlt className="mr-2" />
              <span>{mason.location}</span>
              <span className="mx-2">•</span>
              <span>Worker</span>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <p className="text-gray-700 mb-6">{mason.description}</p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">Jobs Completed</div>
                  <div className="stat-value text-primary">{mason.jobsCompleted}</div>
                </div>
              </div>
              
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">Hourly Rate</div>
                  <div className="stat-value text-primary">{mason.hourlyRate}</div>
                </div>
              </div>
              
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">Response Time</div>
                  <div className="stat-value text-primary">{mason.responseTime}</div>
                </div>
              </div>
              
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">Completion Rate</div>
                  <div className="stat-value text-primary">{mason.completionRate}%</div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="tabs tabs-boxed mb-6 flex-wrap">
              <button 
                className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button> 
              <button 
                className={`tab ${activeTab === 'portfolio' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('portfolio')}
              >
                Portfolio
              </button> 
              <button 
                className={`tab ${activeTab === 'reviews' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </button> 
              <button 
                className={`tab ${activeTab === 'skills' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('skills')}
              >
                Skills
              </button> 
              <button 
                className={`tab ${activeTab === 'settings' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                Settings
              </button>
            </div>

            {/* Tab Content */}
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MasonProfile;