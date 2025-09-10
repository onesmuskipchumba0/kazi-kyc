"use client"
import React from 'react';
import { portfolioItems } from '@/app/api/profile/dummyData';

const PortfolioTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Portfolio</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portfolioItems.map((item) => (
          <div key={item.id} className="card bg-base-100 shadow-md">
            <figure>
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Project Image</span>
              </div>
            </figure>
            <div className="card-body">
              <h3 className="card-title">{item.title}</h3>
              <p>{item.description}</p>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>{item.location}</span>
                <span>{new Date(item.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioTab;