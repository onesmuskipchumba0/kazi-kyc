import { ReactNode } from 'react';
import {
  User,
  Bell,
  Shield,
  Settings as SettingsIcon,
  HelpCircle,
  LucideIcon,
} from 'lucide-react';

interface SettingsLayoutProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: ReactNode;
}

interface SettingsSection {
  id: string;
  label: string;
  icon: LucideIcon;
}

const SettingsLayout = ({ activeTab, onTabChange, children }: SettingsLayoutProps) => {
  const settingsSections: SettingsSection[] = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Safety', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-base-200 p-6 rounded-lg sticky top-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <SettingsIcon size={24} />
              Settings
            </h2>
            <ul className="menu bg-base-200 rounded-box">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <li key={section.id}>
                    <a
                      className={activeTab === section.id ? 'active' : ''}
                      onClick={() => onTabChange(section.id)}
                    >
                      <Icon size={18} />
                      {section.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          <div className="bg-base-100 p-6 rounded-lg shadow-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;