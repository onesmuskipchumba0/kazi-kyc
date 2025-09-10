'use client';

import React, { useState } from 'react';
import { FaBriefcase, FaMapMarkerAlt, FaPhone, FaEnvelope, FaBuilding, FaUsers } from 'react-icons/fa';
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
  const [profileData, setProfileData] = useState(mason);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab mason={profileData} />;
      case 'portfolio':
        return <PortfolioTab />;
      case 'reviews':
        return <ReviewsTab />;
      case 'skills':
        return <SkillsTab />;
      case 'settings':
        return <SettingsTab profileData={profileData} setProfileData={setProfileData} />;
      default:
        return <OverviewTab mason={profileData} />;
    }
  };

  // Add a safeguard in case profileData is undefined
  if (!profileData) {
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
          {/* Profile Header with Avatar */}
          <div className="bg-blue-600 text-white p-6 relative">
            <div className="flex items-center">
              {profileData.avatarUrl && (
                <div className="mr-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white">
                    <img 
                      src={profileData.avatarUrl} 
                      alt={profileData.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold">{profileData.name}</h1>
                <div className="flex items-center mt-2 flex-wrap">
                  <FaBriefcase className="mr-2" />
                  <span>{profileData.title}</span>
                  <span className="mx-2">•</span>
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{profileData.location}</span>
                  <span className="mx-2">•</span>
                  <span className="badge badge-outline badge-sm bg-white text-blue-600">
                    {profileData.profileType === 'worker' ? 'Worker' : 'Employer'}
                  </span>
                </div>
                
                {/* Display employer-specific info if applicable */}
                {profileData.profileType === 'employer' && profileData.companyName && (
                  <div className="flex items-center mt-2">
                    <FaBuilding className="mr-2" />
                    <span>{profileData.companyName}</span>
                    {profileData.employeesCount > 0 && (
                      <>
                        <span className="mx-2">•</span>
                        <FaUsers className="mr-2" />
                        <span>{profileData.employeesCount} employees</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <p className="text-gray-700 mb-6">{profileData.description}</p>

            {/* Stats Cards - Different stats for workers vs employers */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {profileData.profileType === 'worker' ? (
                <>
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Jobs Completed</div>
                      <div className="stat-value text-primary">{profileData.jobsCompleted}</div>
                    </div>
                  </div>
                  
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Hourly Rate</div>
                      <div className="stat-value text-primary">{profileData.hourlyRate}</div>
                    </div>
                  </div>
                  
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Response Time</div>
                      <div className="stat-value text-primary">{profileData.responseTime}</div>
                    </div>
                  </div>
                  
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Completion Rate</div>
                      <div className="stat-value text-primary">{profileData.completionRate}%</div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Projects Completed</div>
                      <div className="stat-value text-primary">{profileData.projectsCompleted || 0}</div>
                    </div>
                  </div>
                  
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Employees</div>
                      <div className="stat-value text-primary">{profileData.employeesCount || 0}</div>
                    </div>
                  </div>
                  
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Response Time</div>
                      <div className="stat-value text-primary">{profileData.responseTime || '< 24 hours'}</div>
                    </div>
                  </div>
                  
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Hiring Rate</div>
                      <div className="stat-value text-primary">{profileData.completionRate || 95}%</div>
                    </div>
                  </div>
                </>
              )}
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
                {profileData.profileType === 'worker' ? 'Portfolio' : 'Projects'}
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
                {profileData.profileType === 'worker' ? 'Skills' : 'Services'}
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