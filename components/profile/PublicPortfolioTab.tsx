import React, { useState, useEffect } from 'react';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  location: string;
  date: string;
}

interface PublicPortfolioTabProps {
  publicId: string;
}

const PublicPortfolioTab: React.FC<PublicPortfolioTabProps> = ({ publicId }) => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        // You'll need to create this API route to fetch public portfolio
        const response = await fetch(`/api/portfolio/public?userId=${publicId}`);
        if (response.ok) {
          const data = await response.json();
          setPortfolioItems(data.portfolioItems || []);
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolio();
  }, [publicId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (portfolioItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <p>No portfolio items to display</p>
          <p className="text-sm">This user hasn't added any portfolio items yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {portfolioItems.map((item) => (
        <div key={item.id} className="card bg-base-100 shadow-md overflow-hidden">
          <figure>
            <img 
              src={item.imageURL} 
              alt={item.title}
              className="w-full h-48 object-cover"
            />
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
  );
};

export default PublicPortfolioTab;