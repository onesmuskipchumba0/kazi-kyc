import { X, MapPin, Mail, PhoneCall } from "lucide-react";

interface User {
  id: string;
  public_id: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string | null;
  location: string;
  name: string;
}

interface UserInfoModalProps {
  user: User | null;
  onClose: () => void;
}

export default function UserInfoModal({ user, onClose }: UserInfoModalProps) {
  if (!user) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">User Information</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <X size={16} />
          </button>
        </div>
        
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-base-300 flex items-center justify-center text-lg font-semibold text-base-content overflow-hidden mb-4">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              user.name.split(" ").map((n) => n[0]).join("")
            )}
          </div>
          <h4 className="text-xl font-semibold">{user.name}</h4>
          {user.location && (
            <p className="text-base-content/60 flex items-center gap-1 mt-1">
              <MapPin size={14} />
              {user.location}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
            <Mail size={16} className="text-base-content/60" />
            <div className="flex-1">
              <p className="text-sm text-base-content/60">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
          </div>

          {user.phoneNumber && (
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <PhoneCall size={16} className="text-base-content/60" />
              <div className="flex-1">
                <p className="text-sm text-base-content/60">Phone</p>
                <p className="font-medium">{user.phoneNumber}</p>
              </div>
            </div>
          )}
        </div>

        <div className="modal-action">
          <button onClick={onClose} className="btn btn-primary">Close</button>
        </div>
      </div>
    </div>
  );
}