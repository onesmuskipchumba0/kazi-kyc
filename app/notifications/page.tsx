// components/Notifications.tsx
'use client';

import { useState } from 'react';
import { 
  Bell, 
  CheckCircle, 
  MessageSquare, 
  Users, 
  Star, 
  Settings, 
  ChevronDown, 
  Briefcase,
  UserCheck,
  Mail,
  StarHalf,
  Server,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface NotificationItem {
  id: number;
  type: 'job_match' | 'application_update' | 'job_completed' | 'connection' | 'message' | 'review' | 'system';
  title: string;
  description: string;
  time: string;
  read: boolean;
  icon: React.ReactNode;
}

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Dummy data for all notification types
  const allNotifications: NotificationItem[] = [
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

  const tabs = [
    { id: 'all', label: 'All (19)', count: 19 },
    { id: 'unread', label: 'Unread (7)', count: 7 },
    { id: 'job_match', label: 'Jobs', icon: <Bell className="h-4 w-4" />, count: 4 },
    { id: 'application_update', label: 'Applications', icon: <CheckCircle className="h-4 w-4" />, count: 3 },
    { id: 'connection', label: 'Network', icon: <Users className="h-4 w-4" />, count: 3 },
    { id: 'message', label: 'Messages', icon: <MessageSquare className="h-4 w-4" />, count: 2 },
    { id: 'review', label: 'Reviews', icon: <Star className="h-4 w-4" />, count: 2 },
    { id: 'system', label: 'System', icon: <Settings className="h-4 w-4" />, count: 3 }
  ];

  const filteredNotifications = activeTab === 'all' 
    ? allNotifications 
    : activeTab === 'unread'
    ? allNotifications.filter(n => !n.read)
    : allNotifications.filter(n => n.type === activeTab);

  const markAsRead = (id: number) => {
    const updatedNotifications = allNotifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    // In a real app, we would update state with updatedNotifications
    // For this demo, we'll just show an alert
    alert(`Notification ${id} marked as read`);
  };

  const markAllAsRead = () => {
    alert('All notifications marked as read');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <button className="btn btn-outline btn-sm" onClick={markAllAsRead}>
          Mark all as read
        </button>
      </div>
      <p className="text-gray-600 mb-6">Stay updated with your latest activities and opportunities.</p>
      
      <div className="divider mb-6"></div>
      
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon && <span className="mr-1">{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && tab.id !== 'all' && tab.id !== 'unread' && (
              <span className="ml-1 badge badge-ghost badge-sm">{tab.count}</span>
            )}
          </button>
        ))}
      </div>
      
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-10">
          <div className="inline-flex items-center justify-center rounded-full bg-gray-100 p-4 mb-4">
            <Bell className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
          <p className="text-gray-500">You're all caught up! Check back later for new updates.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`p-4 rounded-lg border ${!notification.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {notification.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold ${!notification.read ? 'text-blue-600' : 'text-gray-700'}`}>
                    {notification.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{notification.description}</p>
                  <p className="text-gray-400 text-sm mt-2">{notification.time}</p>
                  
                  {notification.type === 'job_match' && !notification.read && (
                    <div className="mt-3">
                      <button className="btn btn-primary btn-sm">
                        View Job <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
                {!notification.read && (
                  <button 
                    className="btn btn-ghost btn-xs"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">This Week's Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Briefcase className="h-6 w-6" />
              </div>
              <div className="stat-title">Job Updates</div>
              <div className="stat-value">3</div>
              <div className="stat-desc">From last week</div>
            </div>
          </div>
          
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <Users className="h-6 w-6" />
              </div>
              <div className="stat-title">Connections</div>
              <div className="stat-value">2</div>
              <div className="stat-desc">Recently added</div>
            </div>
          </div>
          
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-accent">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div className="stat-title">Messages</div>
              <div className="stat-value">1</div>
              <div className="stat-desc">Waiting reply</div>
            </div>
          </div>
          
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <Star className="h-6 w-6" />
              </div>
              <div className="stat-title">Reviews</div>
              <div className="stat-value">1</div>
              <div className="stat-desc">5-star rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;