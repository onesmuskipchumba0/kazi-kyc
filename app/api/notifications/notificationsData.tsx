// data/notificationsData.ts
import { 
    Bell, 
    CheckCircle, 
    MessageSquare, 
    Users, 
    Star, 
    Settings, 
    Briefcase,
    UserCheck,
    Mail,
    StarHalf,
    Server
  } from 'lucide-react';
  
  export interface NotificationItem {
    id: number;
    type: 'job_match' | 'application_update' | 'job_completed' | 'connection' | 'message' | 'review' | 'system';
    title: string;
    description: string;
    time: string;
    read: boolean;
    icon: React.ReactNode;
  }
  
  export interface TabItem {
    id: string;
    label: string;
    count?: number;
    icon?: React.ReactNode;
  }
  
  // Dummy data for all notification types
  export const allNotifications: NotificationItem[] = [
    // Job Matches (3 unread)
    {
      id: 1,
      type: 'job_match',
      title: 'New Job Match Found ●',
      description: 'A masonry job in Kambu matches your skills and location preferences.',
      time: '5 minutes ago',
      read: false,
      icon: <Bell className="h-5 w-5 text-blue-500" />
    },
    {
      id: 2,
      type: 'job_match',
      title: 'Job Opportunity ●',
      description: 'Web Developer position available in your area. Required skills: React, Next.js, TypeScript.',
      time: '2 hours ago',
      read: false,
      icon: <Bell className="h-5 w-5 text-blue-500" />
    },
    {
      id: 3,
      type: 'job_match',
      title: 'Perfect Match for You ●',
      description: 'UX Designer role at TechCorp matches 95% of your profile.',
      time: '1 day ago',
      read: false,
      icon: <Bell className="h-5 w-5 text-blue-500" />
    },
    {
      id: 4,
      type: 'job_match',
      title: 'Remote Job Available',
      description: 'Remote Data Analyst position with flexible hours.',
      time: '3 days ago',
      read: true,
      icon: <Bell className="h-5 w-5 text-gray-500" />
    },
    
    // Application Updates (2 unread)
    {
      id: 5,
      type: 'application_update',
      title: 'Job Application Update ●',
      description: 'Your application for "Security Guard Position" has been viewed by the employer.',
      time: '1 hour ago',
      read: false,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />
    },
    {
      id: 6,
      type: 'application_update',
      title: 'Interview Scheduled ●',
      description: 'Your interview for Senior Developer role is scheduled for June 15, 2:00 PM.',
      time: '5 hours ago',
      read: false,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />
    },
    {
      id: 7,
      type: 'application_update',
      title: 'Application Status Changed',
      description: 'Your application for Marketing Manager has moved to the next round.',
      time: '2 days ago',
      read: true,
      icon: <CheckCircle className="h-5 w-5 text-gray-500" />
    },
    
    // Job Completed (all read)
    {
      id: 8,
      type: 'job_completed',
      title: 'Job Completed',
      description: 'Congratulations! You\'ve successfully completed the "House Cleaning" job.',
      time: '2 days ago',
      read: true,
      icon: <Briefcase className="h-5 w-5 text-gray-500" />
    },
    {
      id: 9,
      type: 'job_completed',
      title: 'Project Finished',
      description: 'The website redesign project has been completed and approved by client.',
      time: '1 week ago',
      read: true,
      icon: <Briefcase className="h-5 w-5 text-gray-500" />
    },
    
    // Connections (1 unread)
    {
      id: 10,
      type: 'connection',
      title: 'New Connection Request ●',
      description: 'Sarah Johnson wants to connect with you. View profile to accept.',
      time: '30 minutes ago',
      read: false,
      icon: <UserCheck className="h-5 w-5 text-purple-500" />
    },
    {
      id: 11,
      type: 'connection',
      title: 'Connection Accepted',
      description: 'John Doe has accepted your connection request.',
      time: '3 days ago',
      read: true,
      icon: <Users className="h-5 w-5 text-gray-500" />
    },
    {
      id: 12,
      type: 'connection',
      title: 'Profile Viewed',
      description: 'A hiring manager from TechSolutions viewed your profile.',
      time: '4 days ago',
      read: true,
      icon: <Users className="h-5 w-5 text-gray-500" />
    },
    
    // Messages (all read)
    {
      id: 13,
      type: 'message',
      title: 'New Message',
      description: 'You have a new message from Jane Smith about the project timeline.',
      time: '4 days ago',
      read: true,
      icon: <MessageSquare className="h-5 w-5 text-gray-500" />
    },
    {
      id: 14,
      type: 'message',
      title: 'Message Received',
      description: 'Alex Thompson sent you a message regarding your proposal.',
      time: '1 week ago',
      read: true,
      icon: <Mail className="h-5 w-5 text-gray-500" />
    },
    
    // Reviews (all read)
    {
      id: 15,
      type: 'review',
      title: 'New Review',
      description: 'You have received a new 5-star review from your recent client.',
      time: '1 week ago',
      read: true,
      icon: <Star className="h-5 w-5 text-gray-500" />
    },
    {
      id: 16,
      type: 'review',
      title: 'Feedback Received',
      description: 'Your client left positive feedback on the completed project.',
      time: '2 weeks ago',
      read: true,
      icon: <StarHalf className="h-5 w-5 text-gray-500" />
    },
    
    // System (1 unread)
    {
      id: 17,
      type: 'system',
      title: 'System Maintenance ●',
      description: 'Scheduled maintenance this Sunday from 2:00 AM to 4:00 AM.',
      time: '1 hour ago',
      read: false,
      icon: <Server className="h-5 w-5 text-red-500" />
    },
    {
      id: 18,
      type: 'system',
      title: 'Password Updated',
      description: 'Your password was successfully changed.',
      time: '2 days ago',
      read: true,
      icon: <Settings className="h-5 w-5 text-gray-500" />
    },
    {
      id: 19,
      type: 'system',
      title: 'New Feature Available',
      description: 'Check out the new portfolio showcase feature on your profile.',
      time: '5 days ago',
      read: true,
      icon: <Settings className="h-5 w-5 text-gray-500" />
    }
  ];
  
  export const tabs: TabItem[] = [
    { id: 'all', label: 'All (19)', count: 19 },
    { id: 'unread', label: 'Unread (7)', count: 7 },
    { id: 'job_match', label: 'Jobs', icon: <Bell className="h-4 w-4" />, count: 4 },
    { id: 'application_update', label: 'Applications', icon: <CheckCircle className="h-4 w-4" />, count: 3 },
    { id: 'connection', label: 'Network', icon: <Users className="h-4 w-4" />, count: 3 },
    { id: 'message', label: 'Messages', icon: <MessageSquare className="h-4 w-4" />, count: 2 },
    { id: 'review', label: 'Reviews', icon: <Star className="h-4 w-4" />, count: 2 },
    { id: 'system', label: 'System', icon: <Settings className="h-4 w-4" />, count: 3 }
  ];