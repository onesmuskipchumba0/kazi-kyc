'use client';

import React, { useState } from 'react';
import { FaBriefcase, FaMapMarkerAlt, FaPhone, FaEnvelope, FaBuilding, FaUsers } from 'react-icons/fa';
import OverviewTab from './overviewTab';
import PortfolioTab from './portfolioTab';
import ReviewsTab from './ReviewsTab';
import SkillsTab from './SkillsTab';
import SettingsTab from './SettingsTab';
import { useUser } from '@clerk/nextjs';

interface MasonProfileProps {
  mason: any;
}

const MasonProfile: React.FC<MasonProfileProps> = ({ mason }) => {
  const [inputValue, setInputValue] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const {isSignedIn, user, isLoaded} = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState(mason);

  const handleAdd = () => {
    if (inputValue && !languages.includes(inputValue)) {
      setLanguages([...languages, inputValue]);
      setInputValue("");
    }
  };

  const handleCheckboxChange = (lang: string) => {
    setSelected((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Selected languages:", selected);
  };
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
      {isSignedIn && isLoaded ? (

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header with Avatar */}
          <div className="bg-blue-600 text-white p-6 relative">
            <div className="flex items-center">
              {profileData.avatarUrl && (
                <div className="mr-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white">
                    <img 
                      src={user.imageUrl} 
                      alt={user.firstName || ""}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold">{user.fullName}</h1>
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

              <div>
                <button
                onClick={() => (document.getElementById("profile-form") as HTMLDialogElement).showModal()} 
                className='btn btn-accent'>Update profile</button>
                <dialog className="modal" id="profile-form">
                <div className="modal-box">
                <h3 className='text-lg font-semibold mb-3'>Please fill the form below</h3>
                  {/* Two-column layout with divider */}
                  <div className="flex flex-row divide-x divide-gray-300 gap-6">
                    
                    {/* Left Side */}
                    <div className="flex flex-col space-y-4 pr-6 w-1/2">
                      <label htmlFor="phone">Phone number:</label>
                      <input
                        type="tel"
                        className="input"
                        id="phone"
                        placeholder="Enter your phone number"
                      />

                      <label htmlFor="location">Location:</label>
                      <input
                        type="text"
                        className="input"
                        id="location"
                        placeholder="Enter your current location"
                      />

                      <label>Hourly Rate:</label>
                      <input
                        type="number"
                        className="input"
                        placeholder="Enter your hourly rate"
                      />

                      <label>Experience:</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Please describe your experience"
                      />

                      <label>Availability:</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Please state if you are available to work"
                      />

                      <label>Languages:</label>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Type a language"
                            className="input px-2 py-1 rounded flex-grow"
                          />
                          <button
                            type="button"
                            onClick={handleAdd}
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                          >
                            Add
                          </button>
                        </div>

                        <div className="mb-4">
                          {languages.length > 0 ? (
                            languages.map((lang, index) => (
                              <label key={index} className="block mb-1">
                                <input
                                  type="checkbox"
                                  checked={selected.includes(lang)}
                                  onChange={() => handleCheckboxChange(lang)}
                                  className="mr-2"
                                />
                                {lang}
                              </label>
                            ))
                          ) : (
                            <p className="text-gray-500">No languages added yet.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col space-y-4 pl-6 w-1/2">
                      <label htmlFor="contact">Contact:</label>
                      <input
                        type="tel"
                        className="input"
                        id="conatct"
                        placeholder="Enter an emergency contact"
                      />

                      <label htmlFor="portfolio">Core Skills:</label>
                      <input
                        type="url"
                        className="input"
                        id="portfolio"
                        placeholder="Enter your portfolio link"
                      />

                      <label htmlFor="linkedin">Profile Type:</label>
                      <select name="" id="" className='select'>
                        <option value="worker">Worker</option>
                        <option value="employer">Employer</option>
                      </select>

                      <label htmlFor="profile-pic">Upload profile picture</label>
                      <input type="file" className='file-input' />

                      <label htmlFor="Description">Description:</label>
                      <textarea className='textarea' placeholder='Tell us about yourself...'>
                      </textarea>

                      {/* Submit button */}
                      <button type='submit' className='btn btn-primary' onClick={handleSubmit}>Submit</button>
                    </div>
                  </div>
                </div>

                <form method="dialog" className="modal-backdrop">
                  <button>close</button>
                </form>
              </dialog>

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
      ): null}
    </div>
  );
};

export default MasonProfile;