import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  UserX, 
  Globe, 
  Shield, 
  BellOff,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';

interface PrivacySettingsState {
  profileVisibility: 'public' | 'private' | 'connections';
  showOnlineStatus: boolean;
  allowSearchIndexing: boolean;
  dataSharing: boolean;
  marketingEmails: boolean;
  twoFactorAuth: boolean;
  sessionTimeout: number; // in minutes
}

const PrivacySettings = () => {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Initial state - in a real app, this would come from Clerk or your database
  const [settings, setSettings] = useState<PrivacySettingsState>({
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowSearchIndexing: true,
    dataSharing: false,
    marketingEmails: false,
    twoFactorAuth: user?.twoFactorEnabled || false,
    sessionTimeout: 60
  });

  const handleSettingChange = (key: keyof PrivacySettingsState, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setIsLoading(true);
    setSaveStatus('idle');
    
    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would:
      // 1. Save settings to your database
      // 2. Update Clerk settings through their API if needed
      
      setSaveStatus('success');
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsLoading(false);
      // Clear status message after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const enableTwoFactorAuth = async () => {
    // This would integrate with Clerk's 2FA setup process
    // For now, we'll just simulate it
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      handleSettingChange('twoFactorAuth', true);
      setSaveStatus('success');
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const disableTwoFactorAuth = async () => {
    // This would integrate with Clerk's 2FA disable process
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      handleSettingChange('twoFactorAuth', false);
      setSaveStatus('success');
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Privacy & Safety Settings</h1>
        <p className="text-base-content/70">Control your privacy and security preferences.</p>
      </div>

      {/* Profile Visibility */}
      <div className="bg-base-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe size={20} />
          Profile Visibility
        </h3>
        <div className="space-y-4">
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input 
                type="radio" 
                name="visibility" 
                className="radio radio-primary" 
                checked={settings.profileVisibility === 'public'}
                onChange={() => handleSettingChange('profileVisibility', 'public')}
              />
              <span className="label-text">
                <strong>Public</strong> - Anyone can see your profile
              </span>
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input 
                type="radio" 
                name="visibility" 
                className="radio radio-primary" 
                checked={settings.profileVisibility === 'connections'}
                onChange={() => handleSettingChange('profileVisibility', 'connections')}
              />
              <span className="label-text">
                <strong>Connections Only</strong> - Only your connections can see your profile
              </span>
            </label>
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
              <input 
                type="radio" 
                name="visibility" 
                className="radio radio-primary" 
                checked={settings.profileVisibility === 'private'}
                onChange={() => handleSettingChange('profileVisibility', 'private')}
              />
              <span className="label-text">
                <strong>Private</strong> - Only you can see your profile
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Privacy Options */}
      <div className="bg-base-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Eye size={20} />
          Privacy Options
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-base-100 rounded-lg">
                <Eye size={18} />
              </div>
              <div>
                <p className="font-medium">Show Online Status</p>
                <p className="text-sm text-base-content/70">Allow others to see when you're online</p>
              </div>
            </div>
            <input 
              type="checkbox" 
              className="toggle toggle-primary" 
              checked={settings.showOnlineStatus}
              onChange={(e) => handleSettingChange('showOnlineStatus', e.target.checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-base-100 rounded-lg">
                <Globe size={18} />
              </div>
              <div>
                <p className="font-medium">Search Engine Indexing</p>
                <p className="text-sm text-base-content/70">Allow search engines to index your profile</p>
              </div>
            </div>
            <input 
              type="checkbox" 
              className="toggle toggle-primary" 
              checked={settings.allowSearchIndexing}
              onChange={(e) => handleSettingChange('allowSearchIndexing', e.target.checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-base-100 rounded-lg">
                <UserX size={18} />
              </div>
              <div>
                <p className="font-medium">Data Sharing</p>
                <p className="text-sm text-base-content/70">Allow anonymized data for analytics</p>
              </div>
            </div>
            <input 
              type="checkbox" 
              className="toggle toggle-primary" 
              checked={settings.dataSharing}
              onChange={(e) => handleSettingChange('dataSharing', e.target.checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-base-100 rounded-lg">
                <BellOff size={18} />
              </div>
              <div>
                <p className="font-medium">Marketing Communications</p>
                <p className="text-sm text-base-content/70">Receive marketing emails and promotions</p>
              </div>
            </div>
            <input 
              type="checkbox" 
              className="toggle toggle-primary" 
              checked={settings.marketingEmails}
              onChange={(e) => handleSettingChange('marketingEmails', e.target.checked)}
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-base-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield size={20} />
          Security Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-base-100 rounded-lg">
                <Lock size={18} />
              </div>
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-base-content/70">Add an extra layer of security to your account</p>
              </div>
            </div>
            {settings.twoFactorAuth ? (
              <button 
                className="btn btn-error btn-outline btn-sm"
                onClick={disableTwoFactorAuth}
                disabled={isLoading}
              >
                {isLoading ? <RefreshCw className="animate-spin" size={16} /> : 'Disable 2FA'}
              </button>
            ) : (
              <button 
                className="btn btn-primary btn-outline btn-sm"
                onClick={enableTwoFactorAuth}
                disabled={isLoading}
              >
                {isLoading ? <RefreshCw className="animate-spin" size={16} /> : 'Enable 2FA'}
              </button>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Session Timeout</span>
              <span className="label-text-alt">{settings.sessionTimeout} minutes</span>
            </label>
            <input 
              type="range" 
              min="5" 
              max="240" 
              step="5"
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
              className="range range-primary range-sm"
            />
            <div className="flex justify-between text-xs px-2 mt-1">
              <span>5 min</span>
              <span>4 hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Sessions (Clerk Integration) */}
      <div className="bg-base-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Active Sessions</h3>
        <p className="text-base-content/70 mb-4">Manage your active login sessions across devices.</p>
        <button className="btn btn-outline btn-sm">
          View Active Sessions
        </button>
      </div>

      {/* Save Button and Status */}
      <div className="flex justify-between items-center mt-8">
        <div>
          {saveStatus === 'success' && (
            <div className="flex items-center gap-2 text-success">
              <CheckCircle size={16} />
              <span>Settings saved successfully!</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center gap-2 text-error">
              <XCircle size={16} />
              <span>Failed to save settings. Please try again.</span>
            </div>
          )}
        </div>
        <button 
          className="btn btn-primary"
          onClick={saveSettings}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <RefreshCw className="animate-spin" size={16} />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
};

export default PrivacySettings;