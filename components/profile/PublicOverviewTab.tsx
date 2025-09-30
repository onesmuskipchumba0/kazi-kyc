import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaBuilding, FaUsers } from 'react-icons/fa';

interface PublicOverviewTabProps {
  user: any;
}

const PublicOverviewTab: React.FC<PublicOverviewTabProps> = ({ user }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column */}
      <div>
        <div className="card bg-base-100 shadow-md mb-6">
          <div className="card-body">
            <h2 className="card-title">Account Type</h2>
            <p className="text-gray-600 mb-4">How this user uses KazikYC</p>
            
            <div className="flex flex-col space-y-4">
              <div className={`flex items-start ${user.profileType === "worker" && 'border border-accent rounded-md p-3'}`}>
                <div className="mr-4 mt-1">
                  <div className={`rounded-full ${user.profileType === 'worker' ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'} w-8 h-8 flex items-center justify-center`}>
                    {user.profileType === 'worker' ? '1' : '2'}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">
                    {user.profileType === 'worker' ? 'As a Worker' : 'As an Employer'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {user.profileType === 'worker' 
                      ? 'Looking for work opportunities. Creates profiles showcasing skills, finds jobs, connects with employers, and builds professional network.'
                      : 'Looking to hire skilled workers. Posts job opportunities, finds qualified workers, manages hiring processes, and builds a network of reliable professionals.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Professional Information</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Profile Type</h3>
                <p className="text-gray-600 capitalize">{user.profileType}</p>
              </div>
              
              {user.profileType === 'employer' && user.companyName && (
                <div>
                  <h3 className="font-semibold">Company Name</h3>
                  <p className="text-gray-600">{user.companyName}</p>
                </div>
              )}
              
              <div>
                <h3 className="font-semibold">Experience</h3>
                <p className="text-gray-600">{user.experience || 'Not specified'}</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Availability</h3>
                <p className="text-gray-600">{user.availability || 'Not specified'}</p>
              </div>
              
              {user.profileType === 'worker' && (
                <div>
                  <h3 className="font-semibold">Hourly Rate</h3>
                  <p className="text-gray-600">${user.hourlyRate || 0}/hour</p>
                </div>
              )}
              
              <div>
                <h3 className="font-semibold">Response Rate</h3>
                <p className="text-gray-600">{user.responseRate || 100}%</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Languages</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user.languages && user.languages.length > 0 ? (
                    user.languages.map((language: string, index: number) => (
                      <span key={index} className="badge badge-primary">{language}</span>
                    ))
                  ) : (
                    <p className="text-gray-500">No languages specified</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Column */}
      <div>
        <div className="card bg-base-100 shadow-md mb-6">
          <div className="card-body">
            <h2 className="card-title">Contact Information</h2>
            
            <div className="space-y-3">
              {user.phoneNumber && (
                <div className="flex items-center">
                  <FaPhone className="text-gray-500 mr-3" />
                  <span>{user.phoneNumber}</span>
                </div>
              )}
              
              {user.email && (
                <div className="flex items-center">
                  <FaEnvelope className="text-gray-500 mr-3" />
                  <span>{user.email}</span>
                </div>
              )}
              
              {user.location && (
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-gray-500 mr-3" />
                  <span>{user.location}</span>
                </div>
              )}
              
              {user.profileType === 'employer' && user.companyName && (
                <div className="flex items-center">
                  <FaBuilding className="text-gray-500 mr-3" />
                  <span>{user.companyName}</span>
                </div>
              )}
              
              {user.profileType === 'employer' && user.employeesCount && user.employeesCount > 0 && (
                <div className="flex items-center">
                  <FaUsers className="text-gray-500 mr-3" />
                  <span>{user.employeesCount} employees</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">
              {user.profileType === 'worker' ? 'Core Skills' : 'Services Offered'}
            </h2>
            
            <div className="flex flex-wrap gap-2">
              {user.coreSkills && user.coreSkills.length > 0 ? (
                user.coreSkills.map((skill: string, index: number) => (
                  <span key={index} className="badge badge-outline badge-primary p-3">{skill}</span>
                ))
              ) : (
                <p className="text-gray-500">No skills specified</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicOverviewTab;