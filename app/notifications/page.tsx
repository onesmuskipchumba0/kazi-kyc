// components/Notifications.tsx
'use client';

import { useState } from 'react';
import { Bell, ChevronDown, Briefcase, Users, MessageSquare, Star } from 'lucide-react';
import { allNotifications, tabs, NotificationItem, TabItem  } from '../api/notifications/notificationsData';


const Notifications = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>(allNotifications);

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

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
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