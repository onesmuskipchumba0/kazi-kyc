"use client"
import { useState } from 'react';

import SettingsLayout from '@/components/settings/SettingsLayout';
import AccountSettings from '@/components/settings/AccountSettings';
import PreferencesSettings from '@/components/settings/PreferencesSettings';
import HelpSettings from '@/components/settings/HelpSettings';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountSettings />;
      case 'preferences':
        return <PreferencesSettings />;
      case 'help':
        return <HelpSettings />;
      default:
        return <AccountSettings />;
    }
  };

  return (
    <SettingsLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderTabContent()}
    </SettingsLayout>
  );
};

export default SettingsPage;