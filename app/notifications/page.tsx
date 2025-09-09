// components/Notifications.tsx
'use client';

import { useState } from 'react';
import { Bell, CheckCircle, MessageSquare, Users, Star, Settings, ChevronDown } from 'lucide-react';

interface NotificationItem {
  id: number;
  type: 'job_match' | 'application_update' | 'job_completed' | 'connection' | 'message' | 'review';
  title: string;
  description: string;
  time: string;
  read: boolean;
  icon: React.ReactNode;
}

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
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
      type: 'application_update',
      title: 'Job Application Update ●',
      description: 'Your application for "Security Guard Position" has been viewed by the employer.',
      time: '1 hour ago',
      read: false,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />
    },
    {
      id: 3,
      type: 'job_completed',
      title: 'Job Completed',
      description: 'Congratulations! You\'ve successfully completed the "House Cleaning" job.',
      time: '2 days ago',
      read: true,
      icon: <CheckCircle className="h-5 w-5 text-gray-500" />
    },
    {
      id: 4,
      type: 'connection',
      title: 'New Connection',
      description: 'John Doe has accepted your connection request.',
      time: '3 days ago',
      read: true,
      icon: <Users className="h-5 w-5 text-purple-500" />
    },
    {
      id: 5,
      type: 'message',
      title: 'New Message',
      description: 'You have a new message from Jane Smith.',
      time: '4 days ago',
      read: true,
      icon: <MessageSquare className="h-5 w-5 text-orange-500" />
    },
    {
      id: 6,
      type: 'review',
      title: 'New Review',
      description: 'You have received a new 5-star review from your recent client.',
      time: '1 week ago',
      read: true,
      icon: <Star className="h-5 w-5 text-yellow-500" />
    }
  ]);

  const tabs = [
    { id: 'all', label: 'All (10)', count: 10 },
    { id: 'unread', label: 'Unread (3)', count: 3 },
    { id: 'jobs', label: 'Jobs', icon: <Bell className="h-4 w-4" /> },
    { id: 'network', label: 'Network', icon: <Users className="h-4 w-4" /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'reviews', label: 'Reviews', icon: <Star className="h-4 w-4" /> },
    { id: 'system', label: 'System', icon: <Settings className="h-4 w-4" /> }
  ];

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : activeTab === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === activeTab);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Notifications</h1>
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
          </button>
        ))}
      </div>
      
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
                
                {notification.type === 'job_match' && (
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
      
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">This Week's Activity</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Job Updates</div>
              <div className="stat-value">3</div>
            </div>
          </div>
          
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Connections</div>
              <div className="stat-value">2</div>
            </div>
          </div>
          
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Messages</div>
              <div className="stat-value">1</div>
            </div>
          </div>
          
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Reviews</div>
              <div className="stat-value">1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;