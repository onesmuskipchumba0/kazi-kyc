import { useState } from 'react';

interface NotificationToggleProps {
  icon: string;
  title: string;
  description: string;
  isActive: boolean;
  onToggle: () => void;
}

interface NotificationSectionProps {
  title: string;
  children: React.ReactNode;
}

interface NotificationSettingsState {
  jobMatches: boolean;
  messages: boolean;
  reviews: boolean;
  connectionRequests: boolean;
  payments: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketing: boolean;
}

const NotificationToggle = ({ icon, title, description, isActive, onToggle }: NotificationToggleProps) => {
  return (
    <div className="flex items-start justify-between p-4 border-b border-base-300">
      <div className="flex items-start gap-3">
        <span className="text-xl mt-1">{icon}</span>
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-base-content/70 mt-1">{description}</p>
        </div>
      </div>
      <input 
        type="checkbox" 
        className="toggle toggle-primary" 
        checked={isActive} 
        onChange={onToggle}
      />
    </div>
  );
};

const NotificationSection = ({ title, children }: NotificationSectionProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="bg-base-100 rounded-lg border border-base-300">
        {children}
      </div>
    </div>
  );
};

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState<NotificationSettingsState>({
    jobMatches: true,
    messages: false,
    reviews: true,
    connectionRequests: true,
    payments: false,
    pushNotifications: false,
    emailNotifications: false,
    smsNotifications: true,
    marketing: false
  });

  const handleToggle = (key: keyof NotificationSettingsState) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Notification Preferences</h1>
        <p className="text-base-content/70">Choose what notifications you want to receive.</p>
      </div>

      {/* Job & Work Notifications Section */}
      <NotificationSection title="Job & Work Notifications">
        <NotificationToggle
          icon="📅"
          title="Job Matches"
          description="Get notified when jobs match your skills and location"
          isActive={notifications.jobMatches}
          onToggle={() => handleToggle('jobMatches')}
        />
        <NotificationToggle
          icon="☐"
          title="Messages"
          description="New messages from clients and connections"
          isActive={notifications.messages}
          onToggle={() => handleToggle('messages')}
        />
        <NotificationToggle
          icon="✔"
          title="Reviews & Ratings"
          description="When clients leave reviews for your work"
          isActive={notifications.reviews}
          onToggle={() => handleToggle('reviews')}
        />
      </NotificationSection>

      {/* Network & Social Section */}
      <NotificationSection title="Network & Social">
        <NotificationToggle
          icon="🔍"
          title="Connection Requests"
          description="When someone wants to connect with you"
          isActive={notifications.connectionRequests}
          onToggle={() => handleToggle('connectionRequests')}
        />
        <NotificationToggle
          icon="☐"
          title="Payments"
          description="Payment confirmations and updates"
          isActive={notifications.payments}
          onToggle={() => handleToggle('payments')}
        />
      </NotificationSection>

      {/* Delivery Methods Section */}
      <NotificationSection title="Delivery Methods">
        <NotificationToggle
          icon="☐"
          title="Push Notifications"
          description="Receive notifications on your device"
          isActive={notifications.pushNotifications}
          onToggle={() => handleToggle('pushNotifications')}
        />
        <NotificationToggle
          icon="☐"
          title="Email Notifications"
          description="Receive notifications via email"
          isActive={notifications.emailNotifications}
          onToggle={() => handleToggle('emailNotifications')}
        />
        <NotificationToggle
          icon="📄"
          title="SMS Notifications"
          description="Important updates via SMS"
          isActive={notifications.smsNotifications}
          onToggle={() => handleToggle('smsNotifications')}
        />
        <NotificationToggle
          icon="🔄"
          title="Marketing Communications"
          description="Newsletters, tips, and promotional content"
          isActive={notifications.marketing}
          onToggle={() => handleToggle('marketing')}
        />
      </NotificationSection>

      <div className="flex justify-end gap-4 mt-8">
        <button className="btn btn-ghost">Cancel</button>
        <button className="btn btn-primary">Save Changes</button>
      </div>
    </>
  );
};

export default NotificationSettings;