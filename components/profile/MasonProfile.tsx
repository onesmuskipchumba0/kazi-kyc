'use client';

import React, { useState, useEffect } from 'react';
import { FaBriefcase, FaMapMarkerAlt, FaPhone, FaEnvelope, FaBuilding, FaUsers } from 'react-icons/fa';
import OverviewTab from './overviewTab';
import PortfolioTab from './portfolioTab';
import ReviewsTab from './ReviewsTab';
import SkillsTab from './SkillsTab';
import SettingsTab from './SettingsTab';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabaseClient';
import { supabaseAdmin } from '@/lib/supabaseClient';

interface MasonProfileProps {
  mason?: any;
}

const MasonProfile: React.FC<MasonProfileProps> = ({ mason }) => {
  const [inputValue, setInputValue] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  // Add these new state variables for coreSkills
  const [coreSkillsInputValue, setCoreSkillsInputValue] = useState("");
  const [selectedCoreSkills, setSelectedCoreSkills] = useState<string[]>([]);

  const [ phoneNumber, setPhoneNumber ] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [hourlyRate, setHourlyRate] = useState<string>('');
  const [experience, setExperience] = useState<string>('');
  const [availability, setAvailability] = useState<string>('');
  const [coreSkills, setCoreSkills] = useState<string[]>([]);
  const [profileType, setProfileType] = useState<string>('worker');
  const [description, setDescription] = useState<string>('');
  
  // Add state for profile picture upload
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  // Add toast state
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');

  // Add loading state
  const [isLoading, setIsLoading] = useState(false);

  const {isSignedIn, user, isLoaded} = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState(mason);

  // Add function to load user data from database
  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        const userData = data.user;
        
        if (userData) {
          // Pre-populate form fields with existing data
          setPhoneNumber(userData.phoneNumber || '');
          setLocation(userData.location || '');
          setHourlyRate(userData.hourlyRate?.toString() || '');
          setExperience(userData.experience || '');
          setAvailability(userData.availability || '');
          setDescription(userData.description || '');
          setProfileType(userData.profileType || 'worker');
          
          // Set profile picture URL if exists
          if (userData.avatarUrl) {
            setProfilePictureUrl(userData.avatarUrl);
          }
          
          // Handle languages
          if (userData.languages && Array.isArray(userData.languages)) {
            setLanguages(userData.languages);
            setSelected(userData.languages);
          }
          
          // Handle core skills
          if (userData.coreSkills && Array.isArray(userData.coreSkills)) {
            setCoreSkills(userData.coreSkills);
            setSelectedCoreSkills(userData.coreSkills);
          }
          
          // Debug: Log the avatar URL
          console.log('Loaded avatar URL:', userData.avatarUrl);
          console.log('Clerk image URL:', user?.imageUrl);
          
          // Transform data to match OverviewTab expectations
          const transformedData = {
            ...userData,
            contact: {
              phone: userData.phoneNumber || '',
              email: userData.email || '',
              location: userData.location || ''
            },
            languages: userData.languages || [],
            coreSkills: userData.coreSkills || [],
            responseRate: userData.responseRate || 100,
            hourlyRate: userData.hourlyRate || 0,
            experience: userData.experience || '',
            availability: userData.availability || '',
            companyName: userData.companyName || '',
            employeesCount: userData.employeesCount || 0,
            profileType: userData.profileType || 'worker',
            avatarUrl: userData.avatarUrl // Fallback to Clerk image
          };
          
          console.log('Transformed data avatarUrl:', transformedData.avatarUrl);
          setProfileData(transformedData);
        }
      } else {
        console.log('No user data found, using default values');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      showToast('Failed to load profile data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Load user data when component mounts
  useEffect(() => {
    if (isSignedIn && isLoaded) {
      loadUserData();
    }
  }, [isSignedIn, isLoaded]);

  const handleAdd = () => {
    if (inputValue && !languages.includes(inputValue)) {
      setLanguages([...languages, inputValue]);
      setInputValue("");
    }
  };

  // Add these new functions for coreSkills
  const handleAddCoreSkill = () => {
    if (coreSkillsInputValue && !coreSkills.includes(coreSkillsInputValue)) {
      setCoreSkills([...coreSkills, coreSkillsInputValue]);
      setCoreSkillsInputValue("");
    }
  };

  const handleCoreSkillCheckboxChange = (skill: string) => {
    setSelectedCoreSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleCheckboxChange = (lang: string) => {
    setSelected((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  // Enhanced upload function with better debugging
  const uploadProfilePicture = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      
      console.log('Starting upload for file:', file.name, file.size, file.type);
      
      const formData = new FormData();
      formData.append('file', file);

      console.log('Sending request to /api/upload-profile-image');
      const response = await fetch('/api/upload-profile-image', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const error = await response.json();
        console.error('Upload failed:', error);
        showToast(`Upload failed: ${error.error}`, 'error');
        return null;
      }

      const result = await response.json();
      console.log('Upload successful, URL:', result.url);
      
      showToast('Profile picture uploaded successfully!', 'success');
      return result.url;
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Failed to upload profile picture', 'error');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Update handleProfilePictureChange to handle upload
  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file', 'error');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size must be less than 5MB', 'error');
        return;
      }

      setProfilePicture(file);
      
      // Upload immediately when file is selected
      const uploadedUrl = await uploadProfilePicture(file);
      if (uploadedUrl) {
        setProfilePictureUrl(uploadedUrl);
      }
    }
  };

  // Add function to show toast
  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Add validation function
  const validateForm = () => {
    const errors: string[] = [];

    // Required field validations
    if (!phoneNumber || phoneNumber.trim() === '') {
      errors.push('Phone number is required');
    }

    if (!location || location.trim() === '') {
      errors.push('Location is required');
    }

    if (!hourlyRate || hourlyRate.trim() === '') {
      errors.push('Hourly rate is required');
    }

    if (!experience || experience.trim() === '') {
      errors.push('Experience description is required');
    }

    if (!availability || availability.trim() === '') {
      errors.push('Availability status is required');
    }

    if (!description || description.trim() === '') {
      errors.push('Description is required');
    }

    // Validate phone number format (basic validation)
    if (phoneNumber && !/^[\+]?[1-9][\d]{0,15}$/.test(phoneNumber.replace(/\s/g, ''))) {
      errors.push('Please enter a valid phone number');
    }

    // Validate hourly rate is a positive number
    if (hourlyRate && (isNaN(Number(hourlyRate)) || Number(hourlyRate) <= 0)) {
      errors.push('Hourly rate must be a positive number');
    }

    // Validate that at least one language is selected
    if (selected.length === 0) {
      errors.push('Please select at least one language');
    }

    // Validate that at least one core skill is selected
    if (selectedCoreSkills.length === 0) {
      errors.push('Please select at least one core skill');
    }

    return errors;
  };

  // Update handleSubmit with validation and error handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      showToast(validationErrors[0], 'error');
      return;
    }
    
    // Format data to match API expectations
    const formData = {
      phoneNumber,
      location,
      description,
      hourlyRate: Number(hourlyRate),
      experience,
      availability,
      languages: selected,
      coreSkills: selectedCoreSkills,
      profileType,
      avatarURL: profilePictureUrl || profileData.avatarUrl, // Use uploaded URL or existing
      jobsCompleted: 0,
      responseTime: 24,
      completionRate: 100,
      responseRate: 100,
      contact: phoneNumber,
      companyName: profileType === 'employer' ? '' : null,
      employeesCount: profileType === 'employer' ? 0 : null,
      projectsCompleted: profileType === 'employer' ? 0 : null,
    };

    console.log('Form data:', formData);

    try {
      showToast('Updating profile...', 'warning');

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast('Profile updated successfully!', 'success');
        (document.getElementById("profile-form") as HTMLDialogElement).close();
        await loadUserData();
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Network error. Please try again.', 'error');
    }
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
      {/* Toast Container */}
      {toastMessage && (
        <div className="toast toast-top toast-end">
          <div className={`alert ${toastType === 'success' ? 'alert-success' : toastType === 'error' ? 'alert-error' : 'alert-warning'}`}>
            <div>
              <span>{toastMessage}</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">KaziKYC</h1>
        </div>
      </header>

      {/* Profile Section */}
      {isSignedIn && isLoaded ? (
        <>
          {isLoading ? (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="loading loading-spinner loading-lg"></div>
                <div className="text-xl font-bold text-gray-700 mt-4">Loading profile...</div>
              </div>
            </div>
          ) : (
            <main className="container mx-auto px-4 py-8">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Profile Header with Avatar */}
                <div className="bg-blue-600 text-white p-6 relative">
                  <div className="flex items-center">
                      <div className="mr-4 relative">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white">
                          <img 
                            src={profileData.avatarUrl || user.imageUrl} 
                            alt={user.firstName || ""}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Show indicator if custom profile picture is uploaded */}
                        {profileData.avatarUrl && profileData.avatarUrl !== user.imageUrl && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    <div>
                      <h1 className="text-3xl font-bold">{user.fullName}</h1>
                      <div className="flex items-center mt-2 flex-wrap">
                        <FaBriefcase className="mr-2" />
                        <span>{profileData.title || 'Professional'}</span>
                        <span className="mx-2">•</span>
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{profileData.location || 'Location not set'}</span>
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
                  <p className="text-gray-700 mb-6">{profileData.description || 'No description available'}</p>

                  {/* Stats Cards - Different stats for workers vs employers */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {profileData.profileType === 'worker' ? (
                      <>
                        <div className="stats shadow">
                          <div className="stat">
                            <div className="stat-title">Jobs Completed</div>
                            <div className="stat-value text-primary">{profileData.jobsCompleted || 0}</div>
                          </div>
                        </div>
                        
                        <div className="stats shadow">
                          <div className="stat">
                            <div className="stat-title">Hourly Rate</div>
                            <div className="stat-value text-primary">${profileData.hourlyRate || 0}</div>
                          </div>
                        </div>
                        
                        <div className="stats shadow">
                          <div className="stat">
                            <div className="stat-title">Response Time</div>
                            <div className="stat-value text-primary">{profileData.responseTime || 24}h</div>
                          </div>
                        </div>
                        
                        <div className="stats shadow">
                          <div className="stat">
                            <div className="stat-title">Completion Rate</div>
                            <div className="stat-value text-primary">{profileData.completionRate || 100}%</div>
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
                            <div className="stat-value text-primary">{profileData.responseTime || 24}h</div>
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
                      <div className="modal-box w-3/4">
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
                              value={phoneNumber}
                              onChange={e => setPhoneNumber(e.target.value)}
                              placeholder="+254712345768"
                            />

                            <label htmlFor="location">Location:</label>
                            <input
                              type="text"
                              className="input"
                              id="location"
                              value={location}
                              onChange={e => setLocation(e.target.value)}
                              placeholder="Enter your current location"
                            />

                            <label>Hourly Rate:</label>
                            <input
                              type="number"
                              className="input"
                              value={hourlyRate}
                              onChange={e => setHourlyRate(e.target.value)}
                              placeholder="Enter your hourly rate"
                            />

                            <label>Experience:</label>
                            <input
                              type="text"
                              className="input"
                              value={experience}
                              placeholder="Please describe your experience"
                              onChange={e => setExperience(e.target.value)}
                            />

                            <label>Availability:</label>
                            <input
                              type="text"
                              className="input"
                              value={availability}
                              onChange={e => setAvailability(e.target.value)}
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

                            <label htmlFor="portfolio">Core Skills:</label>
                            <div className="flex flex-col gap-2">
                              <div className="flex gap-2">
                            <input
                              type="text"
                                value={coreSkillsInputValue}
                                onChange={(e) => setCoreSkillsInputValue(e.target.value)}
                                placeholder="Type a skill"
                                className="input px-2 py-1 rounded flex-grow"
                              />
                              <button
                                type="button"
                                onClick={handleAddCoreSkill}
                                className="bg-blue-500 text-white px-3 py-1 rounded"
                              >
                                Add
                              </button>
                            </div>

                            <div className="mb-4">
                              {coreSkills.length > 0 ? (
                                coreSkills.map((skill, index) => (
                                  <label key={index} className="block mb-1">
                                    <input
                                      type="checkbox"
                                      checked={selectedCoreSkills.includes(skill)}
                                      onChange={() => handleCoreSkillCheckboxChange(skill)}
                                      className="mr-2"
                                    />
                                    {skill}
                                  </label>
                                ))
                              ) : (
                                <p className="text-gray-500">No skills added yet.</p>
                              )}
                            </div>
                          </div>

                            <label htmlFor="profile-type">Profile Type:</label>
                            <select 
                              name="profile-type" 
                              id="profile-type" 
                              className='select'
                              value={profileType}
                              onChange={(e) => setProfileType(e.target.value)}
                            >
                              <option value="worker">Worker</option>
                              <option value="employer">Employer</option>
                            </select>

                            <label htmlFor="profile-pic">Upload profile picture</label>
                            <div className="space-y-2">
                              <input 
                                type="file" 
                                className='file-input'
                                id="profile-pic"
                                accept="image/*"
                                onChange={handleProfilePictureChange}
                                disabled={isUploading}
                              />
                              {isUploading && (
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <div className="loading loading-spinner loading-sm"></div>
                                  Uploading...
                                </div>
                              )}
                              {profilePictureUrl && (
                                <div className="mt-2">
                                  <p className="text-sm text-green-600 mb-2">✓ Profile picture uploaded</p>
                                  <img 
                                    src={profilePictureUrl} 
                                    alt="Profile preview" 
                                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                                  />
                                </div>
                              )}
                            </div>

                            <label htmlFor="description">Description:</label>
                            <textarea 
                              className='textarea' 
                              placeholder='Tell us about yourself...'
                              id="description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                            />

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
          )}
        </>
      ) : null}
    </div>
  );
};

export default MasonProfile;