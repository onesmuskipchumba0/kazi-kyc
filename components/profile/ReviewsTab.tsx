"use client"
import React from 'react';
import { FaStar } from 'react-icons/fa';
import { reviews } from'@/app/api/profile/dummyData';

const ReviewsTab: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Client Reviews</h2>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="card bg-base-100 shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{review.clientName}</h3>
                <p className="text-gray-600">{review.project}</p>
              </div>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} 
                  />
                ))}
              </div>
            </div>
            <p className="mt-4">{review.comment}</p>
            <div className="text-sm text-gray-500 mt-2">
              {new Date(review.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsTab;