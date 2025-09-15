"use client"
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const UserDebugInfo: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    if (isLoaded && user) {
      setDebugInfo({
        id: user.id,
        emailAddresses: user.emailAddresses,
        primaryEmailAddress: user.primaryEmailAddress,
        isLoaded,
        isSignedIn: !!user
      });
    }
  }, [user, isLoaded]);

  if (!isLoaded) {
    return <div className="text-sm text-gray-500">Loading user info...</div>;
  }

  if (!user) {
    return <div className="text-sm text-red-500">No user found</div>;
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg text-sm">
      <h3 className="font-bold mb-2">User Debug Info:</h3>
      <pre className="whitespace-pre-wrap text-xs">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
};

export default UserDebugInfo;
