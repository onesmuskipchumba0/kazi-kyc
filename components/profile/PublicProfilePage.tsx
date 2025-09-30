'use client';

import React, { useState, useEffect } from 'react';
import { FaBriefcase, FaMapMarkerAlt, FaPhone, FaEnvelope, FaBuilding, FaUsers, FaComments } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface PublicProfilePageProps {
  publicId: string;
}

interface UserData {
  user: {
    public_id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    location: string | null;
    phoneNumber: string | null;
    description: string | null;
    hourlyRate: number | null;
    experience: string | null;
    availability: string | null;
    profileType: 'worker' | 'employer';
    companyName: string | null;
    employeesCount: number | null;
    languages: string[];
    coreSkills: string[];
    jobsCompleted: number;
    responseTime: number;
    completionRate: number;
    responseRate: number;
    projectsCompleted: number;
  };
}

const PublicProfilePage: React.FC<PublicProfilePageProps> = ({ publicId }) => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Professional Loading Component
  const ProfessionalLoadingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="h-8 w-48 bg-gray-300 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Profile Header Skeleton */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 relative">
            <div className="flex items-center space-x-6">
              {/* Avatar Skeleton */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-blue-500/30 animate-pulse border-4 border-white/50 shadow-lg"></div>
              </div>
              
              {/* Text Content Skeleton */}
              <div className="flex-1 space-y-4">
                <div className="space-y-3">
                  <div className="h-8 w-64 bg-white/30 rounded-lg animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-48 bg-white/30 rounded animate-pulse"></div>
                    <div className="h-4 w-56 bg-white/30 rounded animate-pulse"></div>
                  </div>
                </div>
                
                {/* Badge Skeleton */}
                <div className="flex items-center space-x-4">
                  <div className="h-6 w-24 bg-white/30 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-3 mb-8">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200 animate-pulse">
                  <div className="space-y-3">
                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                    <div className="h-8 w-16 bg-gray-400 rounded"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <div className="h-12 w-48 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>

            <div className="mb-8">
              <div className="flex space-x-2 bg-gray-100 rounded-2xl p-2 w-full max-w-2xl">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="h-12 flex-1 bg-gray-300 rounded-xl animate-pulse"></div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 animate-pulse">
                  <div className="space-y-4">
                    <div className="h-6 w-32 bg-gray-300 rounded"></div>
                    <div className="space-y-3">
                      <div className="h-4 w-full bg-gray-300 rounded"></div>
                      <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 animate-pulse">
                  <div className="space-y-4">
                    <div className="h-6 w-32 bg-gray-300 rounded"></div>
                    <div className="space-y-3">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                          <div className="h-4 w-32 bg-gray-300 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  // Simple tab components for now
  const PublicOverviewTab = ({ user }: { user: any }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <div className="card bg-base-100 shadow-md mb-6">
          <div className="card-body">
            <h2 className="card-title">Professional Information</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Profile Type</h3>
                <p className="text-gray-600 capitalize">{user.profileType}</p>
              </div>
              {user.experience && (
                <div>
                  <h3 className="font-semibold">Experience</h3>
                  <p className="text-gray-600">{user.experience}</p>
                </div>
              )}
              {user.availability && (
                <div>
                  <h3 className="font-semibold">Availability</h3>
                  <p className="text-gray-600">{user.availability}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Core Skills</h2>
            <div className="flex flex-wrap gap-2">
              {user.coreSkills?.map((skill: string, index: number) => (
                <span key={index} className="badge badge-primary">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const PublicPortfolioTab = ({ publicId }: { publicId: string }) => (
    <div className="text-center py-12">
      <div className="text-gray-500">
        <p>Portfolio coming soon</p>
      </div>
    </div>
  );

  const PublicReviewsTab = ({ publicId }: { publicId: string }) => (
    <div className="text-center py-12">
      <div className="text-gray-500">
        <p>Reviews will appear here</p>
      </div>
    </div>
  );

  const PublicSkillsTab = ({ user }: { user: any }) => (
    <div>
      <h2 className="text-xl font-semibold mb-6">Skills & Expertise</h2>
      <div className="flex flex-wrap gap-3">
        {user.coreSkills?.map((skill: string, index: number) => (
          <div key={index} className="badge badge-primary badge-lg p-4">
            {skill}
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/user/${publicId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('User not found');
          }
          throw new Error('Failed to load profile');
        }
        
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (publicId) {
      fetchUserData();
    }
  }, [publicId]);

  const handleMessage = () => {
    router.push(`/messages?user=${publicId}`);
  };

  const renderTabContent = () => {
    if (!userData?.user) return null;

    switch (activeTab) {
      case 'overview':
        return <PublicOverviewTab user={userData.user} />;
      case 'portfolio':
        return <PublicPortfolioTab publicId={publicId} />;
      case 'reviews':
        return <PublicReviewsTab publicId={publicId} />;
      case 'skills':
        return <PublicSkillsTab user={userData.user} />;
      default:
        return <PublicOverviewTab user={userData.user} />;
    }
  };

  if (isLoading) {
    return <ProfessionalLoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-700 mb-2">Profile Not Found</div>
          <p className="text-gray-500">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="btn btn-primary mt-4"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!userData?.user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-700">Profile not found</div>
          <p className="text-gray-500 mt-2">The requested profile could not be loaded.</p>
        </div>
      </div>
    );
  }

  const user = userData.user;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">KaziKYC</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-blue-600 text-white p-6 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-4 relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white">
                    <img 
                      src={user.avatarUrl || '/default-avatar.png'} 
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <div className="flex items-center mt-2 flex-wrap">
                    <FaBriefcase className="mr-2" />
                    <span>{user.profileType === 'worker' ? 'Professional' : 'Employer'}</span>
                    <span className="mx-2">•</span>
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{user.location || 'Location not set'}</span>
                    <span className="mx-2">•</span>
                    <span className="badge badge-outline badge-sm bg-white text-blue-600">
                      {user.profileType === 'worker' ? 'Worker' : 'Employer'}
                    </span>
                  </div>
                  
                  {user.profileType === 'employer' && user.companyName && (
                    <div className="flex items-center mt-2">
                      <FaBuilding className="mr-2" />
                      <span>{user.companyName}</span>
                      {user.employeesCount && user.employeesCount > 0 && (
                        <>
                          <span className="mx-2">•</span>
                          <FaUsers className="mr-2" />
                          <span>{user.employeesCount} employees</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Message Button */}
              <button 
                onClick={handleMessage}
                className="btn btn-primary gap-2"
              >
                <FaComments />
                Message
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <p className="text-gray-700 mb-6">{user.description || 'No description available'}</p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {user.profileType === 'worker' ? (
                <>
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Jobs Completed</div>
                      <div className="stat-value text-primary">{user.jobsCompleted || 0}</div>
                    </div>
                  </div>
                  
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Hourly Rate</div>
                      <div className="stat-value text-primary">${user.hourlyRate || 0}</div>
                    </div>
                  </div>
                  
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Response Time</div>
                      <div className="stat-value text-primary">{user.responseTime || 24}h</div>
                    </div>
                  </div>
                  
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Completion Rate</div>
                      <div className="stat-value text-primary">{user.completionRate || 100}%</div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Projects Completed</div>
                      <div className="stat-value text-primary">{user.projectsCompleted || 0}</div>
                    </div>
                  </div>
                  
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Employees</div>
                      <div className="stat-value text-primary">{user.employeesCount || 0}</div>
                    </div>
                  </div>
                  
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Response Time</div>
                      <div className="stat-value text-primary">{user.responseTime || 24}h</div>
                    </div>
                  </div>
                  
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Hiring Rate</div>
                      <div className="stat-value text-primary">{user.completionRate || 95}%</div>
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
                {user.profileType === 'worker' ? 'Portfolio' : 'Projects'}
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
                {user.profileType === 'worker' ? 'Skills' : 'Services'}
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

export default PublicProfilePage;