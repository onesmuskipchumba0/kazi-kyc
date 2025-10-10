"use client";
import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/lib/user/UserStore';

const SkillsTab: React.FC = () => {
  const { fetchUser, user } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await fetchUser();
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [fetchUser]);

  // Debug logging
  useEffect(() => {
    console.log('User data:', user);
    console.log('User coreSkills:', user?.coreSkills);
  }, [user]);

  // Safely get skills as array
  const getSkills = (): string[] => {
    if (!user) return [];
    
    const coreSkills = user.coreSkills;
    console.log('Raw coreSkills:', coreSkills);
    
    if (!coreSkills) return [];
    
    if (Array.isArray(coreSkills)) {
      return coreSkills.filter((skill): skill is string => typeof skill === 'string');
    }
    
    if (typeof coreSkills === 'string') {
      // Handle comma-separated skills or single skill
      if (coreSkills.includes(',')) {
        return coreSkills.split(',').map(s => s.trim()).filter(s => s.length > 0);
      }
      return [coreSkills];
    }
    
    return [];
  };

  const skills = getSkills();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-gray-500">Loading skills...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="alert alert-error mb-4">
          {error}
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <div className="alert alert-warning">
          User not found. Please try logging in again.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Skills & Expertise</h2>
      
      {skills.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No skills added yet.</p>
          <button className="btn btn-primary">
            Add Your First Skill
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">You have {skills.length} skill(s)</p>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <div 
                key={index} 
                className="badge badge-primary badge-lg p-4 text-base"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsTab;