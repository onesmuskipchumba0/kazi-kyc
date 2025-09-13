// components/AppPreferences.jsx
'use client';

import { useState } from 'react';

const AppPreferences = () => {
  const [language, setLanguage] = useState('English');
  const [currency, setCurrency] = useState('KSh');
  const [timezone, setTimezone] = useState('GMT+3');
  const [autoAccept, setAutoAccept] = useState(true);
  const [emailFrequency, setEmailFrequency] = useState('daily');

  const languages = ['English', 'Swahili', 'French', 'Spanish', 'German', 'Chinese'];
  const currencies = ['KSh (Kenyan Shilling)', 'USD (US Dollar)', 'EUR (Euro)', 'GBP (British Pound)', 'JPY (Japanese Yen)'];
  const timezones = ['East Africa Time (GMT+3)', 'Central Africa Time (GMT+2)', 'West Africa Time (GMT+1)', 'Greenwich Mean Time (GMT)', 'Central European Time (GMT+1)'];
  const frequencies = ['Never', 'Daily Summary', 'Weekly Summary', 'Monthly Summary'];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">App Preferences</h1>
          <p className="text-gray-600 mt-2">Customize your app experience and settings.</p>
        </div>
        
        {/* Theme Dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-outline">
            Theme
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
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Default"
                value="light"
              />
            </li>
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Dark"
                value="dark"
              />
            </li>
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Retro"
                value="retro"
              />
            </li>
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Cyberpunk"
                value="cyberpunk"
              />
            </li>
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Valentine"
                value="valentine"
              />
            </li>
            <li>
              <input
                type="radio"
                name="theme-dropdown"
                className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                aria-label="Aqua"
                value="aqua"
              />
            </li>
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
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
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
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
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
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
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
                  checked={autoAccept}
                  onChange={(e) => setAutoAccept(e.target.checked)}
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
              <div className="btn-group w-full">
                {frequencies.map((freq) => (
                  <button
                    key={freq}
                    className={`btn btn-sm ${emailFrequency === freq.toLowerCase().replace(' ', '-') ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => setEmailFrequency(freq.toLowerCase().replace(' ', '-'))}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end gap-4">
        <button className="btn btn-outline">Cancel</button>
        <button className="btn btn-primary">Save Preferences</button>
      </div>
    </div>
  );
};

export default AppPreferences;