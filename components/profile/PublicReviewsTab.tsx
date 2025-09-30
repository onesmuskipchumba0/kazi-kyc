import React from 'react';
import { FaStar } from 'react-icons/fa';

const PublicReviewsTab: React.FC = () => {
  // For now, using a placeholder. You can create an API to fetch public reviews
  return (
    <div className="text-center py-12">
      <div className="text-gray-500">
        <FaStar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No reviews to display</p>
        <p className="text-sm">Reviews will appear here once users leave feedback</p>
      </div>
    </div>
  );
};

export default PublicReviewsTab;