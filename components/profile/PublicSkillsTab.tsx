import React from 'react';

interface PublicSkillsTabProps {
  user: any;
}

const PublicSkillsTab: React.FC<PublicSkillsTabProps> = ({ user }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        {user.profileType === 'worker' ? 'Skills & Expertise' : 'Services Offered'}
      </h2>
      
      <div className="flex flex-wrap gap-3">
        {user.coreSkills && user.coreSkills.length > 0 ? (
          user.coreSkills.map((skill: string, index: number) => (
            <div key={index} className="badge badge-primary badge-lg p-4 text-lg">
              {skill}
            </div>
          ))
        ) : (
          <div className="text-center w-full py-8">
            <p className="text-gray-500">
              {user.profileType === 'worker' 
                ? 'No skills specified yet' 
                : 'No services specified yet'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicSkillsTab;