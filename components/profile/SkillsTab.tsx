"use client"
import React from 'react';
import { skills } from '@/app/api/profile/dummyData';

const SkillsTab: React.FC = () => {
  const skillCategories = [...new Set(skills.map(skill => skill.category))];
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Skills & Expertise</h2>
      
      {skillCategories.map((category) => (
        <div key={category} className="mb-8">
          <h3 className="text-xl font-semibold mb-4">{category}</h3>
          <div className="space-y-4">
            {skills
              .filter(skill => skill.category === category)
              .map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{skill.name}</span>
                    <span>{skill.proficiency}%</span>
                  </div>
                  <progress 
                    className="progress progress-primary w-full" 
                    value={skill.proficiency} 
                    max="100"
                  ></progress>
                </div>
              ))
            }
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillsTab;