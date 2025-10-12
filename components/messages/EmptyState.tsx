import { MessageCircle, Plus } from "lucide-react";

interface EmptyStateProps {
  onNew: () => void;
}

export default function EmptyState({ onNew }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col justify-center items-center">
        <div className="bg-base-200 p-4 rounded-full mb-4">
          <MessageCircle className="w-6 h-6 text-base-content/60" />
        </div>
        <h2 className="text-lg font-semibold mt-4">Your Messages</h2>
        <p className="text-sm text-base-content/60 text-center max-w-md">
          Send messages to workers and employers to discuss job opportunities.
        </p>
        <button
          className="mt-4 btn btn-primary"
          onClick={onNew}
        >
          <Plus size={16} /> Start New Conversation
        </button>
      </div>
    </div>
  );
}