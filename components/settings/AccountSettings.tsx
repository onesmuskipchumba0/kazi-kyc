import { useUser } from '@clerk/nextjs';
import { Mail, Phone, CreditCard, Download, Trash2, Edit, CheckCircle } from 'lucide-react';

interface UserData {
  name: string;
  email: string;
  phone: string | null;
  isVerified: boolean;
  isPremium: boolean;
  plan: string;
  price: string;
}

const AccountSettings = () => {
  const { user, isLoaded } = useUser();
  
  // Show loading animation while user data is being fetched
  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="loading loading-spinner loading-lg text-primary"></div>
        <p className="mt-4 text-base-content/70">Loading your account information...</p>
      </div>
    );
  }

  // Extract phone number from Clerk user data
  const getPhoneNumber = (): string | null => {
    if (!user) return null;
    
    // Check primary phone number
    if (user.primaryPhoneNumber) {
      return user.primaryPhoneNumber.phoneNumber;
    }
    
    // Check all phone numbers
    if (user.phoneNumbers && user.phoneNumbers.length > 0) {
      return user.phoneNumbers[0].phoneNumber;
    }
    
    return null;
  };

  // Check if user is verified (using correct Clerk properties)
  const isUserVerified = (): boolean => {
    if (!user) return false;
    
    // Check if email addresses are verified
    const hasVerifiedEmail = user.emailAddresses.some(
      (email) => email.verification?.status === 'verified'
    );
    
    // Check if phone numbers are verified
    const hasVerifiedPhone = user.phoneNumbers.some(
      (phone) => phone.verification?.status === 'verified'
    );
    
    return hasVerifiedEmail || hasVerifiedPhone;
  };

  const userData: UserData = {
    name: user?.fullName || 'User',
    email: user?.primaryEmailAddress?.emailAddress || 'No email provided',
    phone: getPhoneNumber(),
    isVerified: isUserVerified(),
    isPremium: true, // This would come from your subscription service
    plan: 'Premium Plan',
    price: 'KSh 500/month'
  };

  return (
    <>
      {/* User Profile Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="avatar">
          <div className="w-16 rounded-full">
            <img src={user?.imageUrl || "https://via.placeholder.com/64"} alt={userData.name} />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{userData.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-base-content/70">{userData.email}</span>
            {userData.isVerified && (
              <span className="badge badge-success badge-sm gap-1">
                <CheckCircle size={12} />
                Verified
              </span>
            )}
            {userData.isPremium && (
              <span className="badge badge-primary badge-sm">Premium Member</span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-base-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Account Information</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="text-primary" size={20} />
                <div>
                  <p className="font-medium">Email Address</p>
                  <p className="text-sm text-base-content/70">Your primary email for account notifications</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span>{userData.email}</span>
                <button className="btn btn-ghost btn-sm">
                  <Edit size={16} />
                </button>
              </div>
            </div>

            {/* Conditionally render phone number section only if user has a phone number */}
            {userData.phone && (
              <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="text-primary" size={20} />
                  <div>
                    <p className="font-medium">Phone Number</p>
                    <p className="text-sm text-base-content/70">Used for SMS notifications and verification</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span>{userData.phone}</span>
                  <button className="btn btn-ghost btn-sm">
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="text-primary" size={20} />
                <div>
                  <p className="font-medium">Subscription</p>
                  <p className="text-sm text-base-content/70">Manage your membership plan</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="badge badge-primary">{userData.plan}</span>
                <button className="btn btn-ghost btn-sm">
                  <Edit size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-base-200 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Data Management</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg">
              <div className="flex items-center gap-3">
                <Download className="text-primary" size={20} />
                <div>
                  <p className="font-medium">Export Data</p>
                  <p className="text-sm text-base-content/70">Download a copy of your account data</p>
                </div>
              </div>
              <button className="btn btn-outline">Export</button>
            </div>

            <div className="flex items-center justify-between p-4 bg-base-100 rounded-lg">
              <div className="flex items-center gap-3">
                <Trash2 className="text-error" size={20} />
                <div>
                  <p className="font-medium">Delete Account</p>
                  <p className="text-sm text-base-content/70">Permanently delete your account and all data</p>
                </div>
              </div>
              <button className="btn btn-error btn-outline">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountSettings;