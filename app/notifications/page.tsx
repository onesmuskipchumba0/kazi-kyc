// app/notifications/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Bell, ChevronDown, Briefcase, Users, MessageSquare, Star, CheckCircle, UserCheck, Server, Settings } from 'lucide-react';
import { useNotificationsStore } from '@/lib/notifications/NotificationsStore';
import { useUserStore } from '@/lib/user/UserStore';
import Link from 'next/link';
import { metadata } from '../layout';
interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const { fetchUser } = useUserStore();
  const user = useUserStore((state) => state.user)

  useEffect(() => {
    fetchUser()
  },[fetchUser])
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    error,
    fetchNotifications, 
    markAsRead, 
    markAllAsRead,
    deleteNotification
  } = useNotificationsStore();

  useEffect(() => {
    if (user?.public_id) {
      fetchNotifications(user.public_id);
      console.log(user.public_id)
    }
  }, [user?.public_id, fetchNotifications]);

  // Map notification type to icon
  const getNotificationIcon = (type: string) => {
    const iconClass = "h-5 w-5";
    
    switch (type) {
      case 'job_match':
        return <Bell className={`${iconClass} text-blue-500`} />;
      case 'application_update':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'job_completed':
        return <Briefcase className={`${iconClass} text-yellow-500`} />;
      case 'connection':
        return <UserCheck className={`${iconClass} text-purple-500`} />;
      case 'message':
        return <MessageSquare className={`${iconClass} text-indigo-500`} />;
      case 'review':
        return <Star className={`${iconClass} text-amber-500`} />;
      case 'system':
        return <Server className={`${iconClass} text-red-500`} />;
      default:
        return <Bell className={`${iconClass} text-gray-500`} />;
    }
  };

  // Format time relative to now
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Filter notifications based on active tab
  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : activeTab === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === activeTab);

  // Calculate counts for tabs
  const getTabCounts = () => {
    const allCount = notifications.length;
    const unreadCountValue = notifications.filter(n => !n.read).length;
    const jobMatchCount = notifications.filter(n => n.type === 'job_match').length;
    const applicationUpdateCount = notifications.filter(n => n.type === 'application_update').length;
    const connectionCount = notifications.filter(n => n.type === 'connection').length;
    const messageCount = notifications.filter(n => n.type === 'message').length;
    const reviewCount = notifications.filter(n => n.type === 'review').length;
    const systemCount = notifications.filter(n => n.type === 'system').length;

    return {
      all: allCount,
      unread: unreadCountValue,
      job_match: jobMatchCount,
      application_update: applicationUpdateCount,
      connection: connectionCount,
      message: messageCount,
      review: reviewCount,
      system: systemCount
    };
  };

  const tabCounts = getTabCounts();

  const tabs: TabItem[] = [
    { id: 'all', label: `All (${tabCounts.all})` },
    { id: 'unread', label: `Unread (${tabCounts.unread})` },
    { id: 'job_match', label: 'Jobs', icon: <Bell className="h-4 w-4" />, count: tabCounts.job_match },
    { id: 'application_update', label: 'Applications', icon: <CheckCircle className="h-4 w-4" />, count: tabCounts.application_update },
    { id: 'connection', label: 'Network', icon: <Users className="h-4 w-4" />, count: tabCounts.connection },
    { id: 'message', label: 'Messages', icon: <MessageSquare className="h-4 w-4" />, count: tabCounts.message },
    { id: 'review', label: 'Reviews', icon: <Star className="h-4 w-4" />, count: tabCounts.review },
    { id: 'system', label: 'System', icon: <Settings className="h-4 w-4" />, count: tabCounts.system }
  ];

  const handleMarkAsRead = async (notification: any) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (user?.public_id) {
      await markAllAsRead(user.public_id);
    }
  };

  const handleDeleteNotification = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  // Calculate activity stats for the week
  const getWeeklyActivity = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentNotifications = notifications.filter(n => 
      new Date(n.created_at) >= oneWeekAgo
    );

    return {
      jobUpdates: recentNotifications.filter(n => n.type === 'job_match' || n.type === 'application_update').length,
      connections: recentNotifications.filter(n => n.type === 'connection').length,
      messages: recentNotifications.filter(n => n.type === 'message').length,
      reviews: recentNotifications.filter(n => n.type === 'review').length,
    };
  };

  const weeklyActivity = getWeeklyActivity();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Error Display */}
      {error && (
        <div className="alert alert-error shadow-lg mb-6 rounded-lg">
          <div>
            <Server className="h-6 w-6" />
            <span>{error}</span>
          </div>
          <button 
            className="btn btn-ghost btn-sm"
            onClick={() => user?.public_id && fetchNotifications(user.public_id)}
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <button className="btn btn-outline btn-sm" onClick={handleMarkAllAsRead}>
            Mark all as read
          </button>
        )}
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
            {tab.count !== undefined && tab.id !== 'all' && tab.id !== 'unread' && tab.count > 0 && (
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
          <p className="text-gray-500">
            {activeTab === 'unread' 
              ? "You're all caught up! No unread notifications." 
              : "No notifications found for this category."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer group ${
                !notification.read 
                  ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => handleMarkAsRead(notification)}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${!notification.read ? 'text-blue-600' : 'text-gray-700'}`}>
                        {notification.title}
                        {!notification.read && <span className="ml-1">●</span>}
                      </h3>
                      <p className="text-gray-600 mt-1">{notification.description}</p>
                      <p className="text-gray-400 text-sm mt-2">{formatTime(notification.created_at)}</p>
                      
                      {notification.type === 'job_match' && !notification.read && (
                        <div className="mt-3">
                          <Link href={`/work/${notification.metadata?.job_id}`}>
                            <button className="btn btn-primary btn-sm">
                              View Job <ChevronDown className="ml-1 h-4 w-4" />
                            </button>
                          </Link>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 ml-2">
                      {!notification.read && (
                        
                        <button 
                          className="btn btn-ghost btn-xs text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification);
                          }}
                        >
                          Mark read
                        </button>
                      )}
                      <button 
                        className="btn btn-ghost btn-xs text-gray-500 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleDeleteNotification(notification.id, e)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
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
              <div className="stat-value">{weeklyActivity.jobUpdates}</div>
              <div className="stat-desc">From last week</div>
            </div>
          </div>
          
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-secondary">
                <Users className="h-6 w-6" />
              </div>
              <div className="stat-title">Connections</div>
              <div className="stat-value">{weeklyActivity.connections}</div>
              <div className="stat-desc">Recently added</div>
            </div>
          </div>
          
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-accent">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div className="stat-title">Messages</div>
              <div className="stat-value">{weeklyActivity.messages}</div>
              <div className="stat-desc">This week</div>
            </div>
          </div>
          
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-info">
                <Star className="h-6 w-6" />
              </div>
              <div className="stat-title">Reviews</div>
              <div className="stat-value">{weeklyActivity.reviews}</div>
              <div className="stat-desc">This week</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}