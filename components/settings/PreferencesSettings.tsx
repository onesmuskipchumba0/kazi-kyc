// components/AppPreferences.tsx
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

const AppPreferences = () => {
  const [showToast, setShowToast] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const { theme, changeTheme, preferences, setPreferences } = useTheme();

  const languages = ['English', 'Swahili', 'French', 'Spanish', 'German', 'Chinese'];
  const currencies = ['KSh (Kenyan Shilling)', 'USD (US Dollar)', 'EUR (Euro)', 'GBP (British Pound)', 'JPY (Japanese Yen)'];
  const timezones = ['East Africa Time (GMT+3)', 'Central Africa Time (GMT+2)', 'West Africa Time (GMT+1)', 'Greenwich Mean Time (GMT)', 'Central European Time (GMT+1)'];
  const frequencies = ['Never', 'Daily Summary', 'Weekly Summary', 'Monthly Summary'];
  const themes = ['light', 'dark', 'retro', 'cyberpunk', 'valentine', 'aqua'];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const savePreferences = () => {
    // Preferences are already saved in context, just show toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const resetPreferences = () => {
    const defaultPreferences = {
      language: 'English',
      currency: 'KSh',
      timezone: 'GMT+3',
      autoAccept: true,
      emailFrequency: 'daily',
      theme: 'light'
    };
    
    setPreferences(defaultPreferences);
    changeTheme('light');
    
    // Show reset notification
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: any) => {
    setPreferences({
      ...preferences,
      [key]: value
    });
  };

  if (!isMounted) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Toast Notification */}
      {showToast && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-success">
            <span>Preferences saved successfully!</span>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">App Preferences</h1>
          <p className="text-gray-600 mt-2">Customize your app experience and settings.</p>
        </div>
        
        {/* Theme Dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-outline">
            <span className="hidden md:inline">Theme: {theme}</span>
            <span className="md:hidden">Theme</span>
            <svg
              width="12px"
              height="12px"
              className="inline-block h-2 w-2 fill-current opacity-60 ml-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 2048 2048">
              <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
            </svg>
          </div>
          <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-box z-10 w-52 p-2 shadow-2xl">
            {themes.map((t) => (
              <li key={t}>
                <button
                  className={`btn btn-sm btn-block btn-ghost justify-start ${theme === t ? 'btn-primary' : ''}`}
                  onClick={() => changeTheme(t)}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Localization Section */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4 text-primary">Localization</h2>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Language</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
            
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-semibold">Currency</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={preferences.currency}
                onChange={(e) => handlePreferenceChange('currency', e.target.value)}
              >
                {currencies.map((curr) => (
                  <option key={curr} value={curr.split(' ')[0]}>{curr}</option>
                ))}
              </select>
            </div>
            
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-semibold">Timezone</span>
              </label>
              <select 
                className="select select-bordered w-full"
                value={preferences.timezone}
                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz.split(' ')[2].replace('(', '').replace(')', '')}>{tz}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Behavior Section */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4 text-primary">Behavior</h2>
            
            <div className="form-control">
              <label className="label cursor-pointer justify-start p-4 bg-base-200 rounded-lg">
                <input 
                  type="checkbox" 
                  className="toggle toggle-primary mr-3" 
                  checked={preferences.autoAccept}
                  onChange={(e) => handlePreferenceChange('autoAccept', e.target.checked)}
                />
                <span className="label-text">
                  <span className="font-medium">Auto-accept Connection Requests</span>
                  <p className="text-sm text-gray-500 mt-1">Automatically accept new connection requests</p>
                </span>
              </label>
            </div>
            
            <div className="divider my-6"></div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email Digest Frequency</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {frequencies.map((freq) => (
                  <button
                    key={freq}
                    className={`btn btn-sm ${preferences.emailFrequency === freq.toLowerCase().replace(' ', '-') ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => handlePreferenceChange('emailFrequency', freq.toLowerCase().replace(' ', '-'))}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
        <button className="btn btn-outline" onClick={resetPreferences}>
          Reset to Defaults
        </button>
        <button className="btn btn-primary" onClick={savePreferences}>
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default AppPreferences;