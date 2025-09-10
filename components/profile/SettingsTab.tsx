import React, { useState } from 'react';

interface SettingsTabProps {
  profileData: any;
  setProfileData: (data: any) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ profileData, setProfileData }) => {
  const [formData, setFormData] = useState({
    name: profileData.name,
    email: profileData.contact.email,
    phone: profileData.contact.phone,
    location: profileData.contact.location,
    hourlyRate: profileData.hourlyRate,
    availability: profileData.availability,
    notifications: true,
    profileType: profileData.profileType,
    companyName: profileData.companyName || '',
    employeesCount: profileData.employeesCount || 0,
    projectsCompleted: profileData.projectsCompleted || 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
               type === 'number' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update profile data
    const updatedData = {
      ...profileData,
      name: formData.name,
      contact: {
        ...profileData.contact,
        email: formData.email,
        phone: formData.phone,
        location: formData.location
      },
      hourlyRate: formData.hourlyRate,
      availability: formData.availability,
      profileType: formData.profileType,
      companyName: formData.companyName,
      employeesCount: formData.employeesCount,
      projectsCompleted: formData.projectsCompleted
    };
    
    setProfileData(updatedData);
    alert('Profile settings saved successfully!');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="card bg-base-100 shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Profile Type</h3>
          <div className="form-control">
            <label className="label cursor-pointer justify-start">
              <input 
                type="radio" 
                name="profileType" 
                value="worker" 
                className="radio radio-primary mr-3" 
                checked={formData.profileType === 'worker'}
                onChange={handleInputChange}
              />
              <span className="label-text">Worker - Looking for work opportunities</span>
            </label>
          </div>
          
          <div className="form-control mt-2">
            <label className="label cursor-pointer justify-start">
              <input 
                type="radio" 
                name="profileType" 
                value="employer" 
                className="radio radio-primary mr-3" 
                checked={formData.profileType === 'employer'}
                onChange={handleInputChange}
              />
              <span className="label-text">Employer - Looking to hire skilled workers</span>
            </label>
          </div>
          
          {/* Employer-specific fields */}
          {formData.profileType === 'employer' && (
            <div className="mt-4 space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Company Name</span>
                </label>
                <input 
                  type="text" 
                  name="companyName"
                  placeholder="Company Name" 
                  className="input input-bordered" 
                  value={formData.companyName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Number of Employees</span>
                </label>
                <input 
                  type="number" 
                  name="employeesCount"
                  placeholder="Number of Employees" 
                  className="input input-bordered" 
                  value={formData.employeesCount}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Projects Completed</span>
                </label>
                <input 
                  type="number" 
                  name="projectsCompleted"
                  placeholder="Projects Completed" 
                  className="input input-bordered" 
                  value={formData.projectsCompleted}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="card bg-base-100 shadow-md p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input 
                type="text" 
                name="name"
                placeholder="Name" 
                className="input input-bordered" 
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="email" 
                name="email"
                placeholder="Email" 
                className="input input-bordered" 
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone Number</span>
              </label>
              <input 
                type="tel" 
                name="phone"
                placeholder="Phone" 
                className="input input-bordered" 
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <input 
                type="text" 
                name="location"
                placeholder="Location" 
                className="input input-bordered" 
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Professional Settings</h3>
          <div className="space-y-4">
            {formData.profileType === 'worker' && (
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Hourly Rate</span>
                </label>
                <input 
                  type="text" 
                  name="hourlyRate"
                  placeholder="Hourly Rate" 
                  className="input input-bordered" 
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                />
              </div>
            )}
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Availability</span>
              </label>
              <select 
                name="availability"
                className="select select-bordered"
                value={formData.availability}
                onChange={handleInputChange}
              >
                <option value="Available immediately">Available immediately</option>
                <option value="Available in 1 week">Available in 1 week</option>
                <option value="Available in 2 weeks">Available in 2 weeks</option>
                <option value="Not available">Not available</option>
              </select>
            </div>
            
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Receive job notifications</span>
                <input 
                  type="checkbox" 
                  name="notifications"
                  className="toggle toggle-primary" 
                  checked={formData.notifications}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            
            <button type="submit" className="btn btn-primary">Save Changes</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SettingsTab;