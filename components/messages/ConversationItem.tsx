interface User {
  id: string;
  public_id: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string | null;
  location: string;
  name: string;
}

interface Conversation {
  id: string;
  otherUser: User;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

export default function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
  return (
    <div
      className={`flex items-center gap-3 p-4 hover:bg-base-200 cursor-pointer transition-colors ${
        isSelected ? "bg-base-200" : ""
      }`}
      onClick={onClick}
    >
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-base-300 flex items-center justify-center text-sm font-semibold text-base-content overflow-hidden">
          {conversation.otherUser.avatarUrl ? (
            <img
              src={conversation.otherUser.avatarUrl}
              alt={conversation.otherUser.name}
              className="w-full h-full object-cover"
            />
          ) : (
            conversation.otherUser.name
              .split(" ")
              .map((n) => n[0])
              .join("")
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <p className="text-sm font-semibold truncate">{conversation.otherUser.name}</p>
          <span className="text-xs text-base-content/50 whitespace-nowrap ml-2">
            {new Date(conversation.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
        <p className="text-xs text-base-content/60 truncate mt-1">{conversation.lastMessage}</p>
        <p className="text-xs text-base-content/50 truncate mt-1">
          {conversation.otherUser.location}
        </p>
      </div>
      {conversation.unreadCount > 0 && (
        <span className="badge badge-primary badge-sm flex-shrink-0">
          {conversation.unreadCount}
        </span>
      )}
    </div>
  );
}