export default function ConversationListSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
          <div className="w-12 h-12 rounded-full bg-base-300"></div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <div className="h-4 bg-base-300 rounded w-1/3"></div>
              <div className="h-3 bg-base-300 rounded w-12"></div>
            </div>
            <div className="h-3 bg-base-300 rounded w-2/3"></div>
            <div className="h-3 bg-base-300 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}