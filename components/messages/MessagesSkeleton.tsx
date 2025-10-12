export default function MessagesSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'} animate-pulse`}>
          <div className={`max-w-[70%] ${i % 2 === 0 ? '' : 'text-right'}`}>
            <div className={`rounded-2xl px-4 py-3 ${i % 2 === 0 ? 'bg-base-100' : 'bg-neutral'}`}>
              <div className="h-4 bg-base-300 rounded w-32 mb-1"></div>
              <div className="h-3 bg-base-300 rounded w-24"></div>
            </div>
            <div className={`h-2 bg-base-300 rounded w-16 mt-1 ${i % 2 === 0 ? '' : 'ml-auto'}`}></div>
          </div>
        </div>
      ))}
    </div>
  );
}