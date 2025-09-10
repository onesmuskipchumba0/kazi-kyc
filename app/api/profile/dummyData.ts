// data/dummyData.ts
import { Mason, PortfolioItem, Review, Skill } from '../types';

export const masonData: Mason = {
  id: '1',
  name: 'John Mwangi',
  location: 'Nairobi, Kenya',
  title: 'Mason',
  description: 'Experienced mason with 8+ years in construction. Specializing in stonework, foundations, and renovations. Available for both residential and commercial projects across Nairobi and surrounding areas.',
  jobsCompleted: 47,
  hourlyRate: 'KSh 600/hr',
  responseTime: '< 2 hours',
  completionRate: 98,
  experience: '8+ years',
  availability: 'Available immediately',
  responseRate: '98%',
  languages: ['English', 'Swahili', 'Kikuyu'],
  contact: {
    phone: '+254 712 345 678',
    email: 'john.mwangi@email.com',
    location: 'Nairobi, Kenya'
  },
  coreSkills: ['Stonework', 'Bricklaying', 'Foundation Work', 'Renovation', 'Concrete Work']
};

export const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'Modern Stone House',
    description: 'Complete stonework for a modern residential house in Karen',
    imageUrl: '/images/portfolio1.jpg',
    date: '2023-05-15',
    location: 'Karen, Nairobi'
  },
  {
    id: '2',
    title: 'Office Complex Foundation',
    description: 'Laid foundation for a 5-story office building in Westlands',
    imageUrl: '/images/portfolio2.jpg',
    date: '2023-02-10',
    location: 'Westlands, Nairobi'
  },
  {
    id: '3',
    title: 'Heritage Building Renovation',
    description: 'Restored stonework for a historical building in Nairobi CBD',
    imageUrl: '/images/portfolio3.jpg',
    date: '2022-11-20',
    location: 'Nairobi CBD'
  },
  {
    id: '4',
    title: 'Residential Compound Wall',
    description: 'Built decorative stone wall for a residential compound',
    imageUrl: '/images/portfolio4.jpg',
    date: '2022-08-05',
    location: 'Lavington, Nairobi'
  }
];

export const reviews: Review[] = [
  {
    id: '1',
    clientName: 'Sarah Johnson',
    rating: 5,
    comment: 'John did an excellent job on our foundation. His work was precise and he completed the project ahead of schedule. Highly recommended!',
    date: '2023-06-10',
    project: 'House Foundation'
  },
  {
    id: '2',
    clientName: 'Michael Kamau',
    rating: 4,
    comment: 'Good quality stonework for our office building. John was professional and his team was punctual.',
    date: '2023-03-15',
    project: 'Office Building'
  },
  {
    id: '3',
    clientName: 'Grace Wanjiku',
    rating: 5,
    comment: 'I hired John for a renovation project and was impressed with his attention to detail. The stonework transformed our home.',
    date: '2023-01-22',
    project: 'Home Renovation'
  },
  {
    id: '4',
    clientName: 'James Omondi',
    rating: 5,
    comment: 'Exceptional craftsmanship on our compound wall. John suggested design improvements that made it look even better than we imagined.',
    date: '2022-11-05',
    project: 'Compound Wall'
  }
];

export const skills: Skill[] = [
  { name: 'Stonework', proficiency: 95, category: 'Construction' },
  { name: 'Bricklaying', proficiency: 90, category: 'Construction' },
  { name: 'Foundation Work', proficiency: 92, category: 'Construction' },
  { name: 'Renovation', proficiency: 88, category: 'Construction' },
  { name: 'Concrete Work', proficiency: 93, category: 'Construction' },
  { name: 'Project Planning', proficiency: 85, category: 'Management' },
  { name: 'Team Leadership', proficiency: 87, category: 'Management' },
  { name: 'Client Communication', proficiency: 90, category: 'Soft Skills' }
];