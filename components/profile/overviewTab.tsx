"use client"
import React from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { Mason } from '@/app/api/types';

interface OverviewTabProps {
  mason: Mason;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ mason }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column */}
      <div>
        <div className="card bg-base-100 shadow-md mb-6">
          <div className="card-body">
            <h2 className="card-title">Account Type</h2>
            <p className="text-gray-600 mb-4">Choose how you want to use KazikYC</p>
            
            <div className="flex flex-col space-y-4">
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <div className="rounded-full bg-blue-100 text-blue-600 w-8 h-8 flex items-center justify-center">1</div>
                </div>
                <div>
                  <h3 className="font-semibold">As a Worker</h3>
                  <p className="text-sm text-gray-600">
                    Looking for work opportunities. Create a profile showcasing your skills, 
                    find jobs, connect with employers, and build your professional network.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 mt-1">
                  <div className="rounded-full bg-gray-200 text-gray-600 w-8 h-8 flex items-center justify-center">2</div>
                </div>
                <div>
                  <h3 className="font-semibold">As a Employer</h3>
                  <p className="text-sm text-gray-600">
                    Looking to hire skilled workers. Post job opportunities, find qualified workers, 
                    manage hiring processes, and build a network of reliable professionals.
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
                <h3 className="font-semibold">Experience</h3>
                <p className="text-gray-600">{mason.experience}</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Availability</h3>
                <p className="text-gray-600">{mason.availability}</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Hourly Rate</h3>
                <p className="text-gray-600">{mason.hourlyRate}</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Response Rate</h3>
                <p className="text-gray-600">{mason.responseRate}</p>
              </div>
              
              <div>
                <h3 className="font-semibold">Languages</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {mason.languages.map((language, index) => (
                    <span key={index} className="badge badge-primary">{language}</span>
                  ))}
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
              <div className="flex items-center">
                <FaPhone className="text-gray-500 mr-3" />
                <span>{mason.contact.phone}</span>
              </div>
              
              <div className="flex items-center">
                <FaEnvelope className="text-gray-500 mr-3" />
                <span>{mason.contact.email}</span>
              </div>
              
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-gray-500 mr-3" />
                <span>{mason.contact.location}</span>
              </div>
            </div>
            
            <button className="btn btn-primary mt-4">
              Contact Me
            </button>
          </div>
        </div>
        
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Core Skills</h2>
            
            <div className="flex flex-wrap gap-2">
              {mason.coreSkills.map((skill, index) => (
                <span key={index} className="badge badge-outline badge-primary p-3">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;