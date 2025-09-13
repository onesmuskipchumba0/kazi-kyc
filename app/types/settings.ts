import { LucideIcon } from 'lucide-react';

export interface UserData {
  name: string;
  email: string;
  phone: string | null;
  isVerified: boolean;
  isPremium: boolean;
  plan: string;
  price: string;
}

export interface NotificationSettingsState {
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

export interface SettingsSection {
  id: string;
  label: string;
  icon: LucideIcon;
}