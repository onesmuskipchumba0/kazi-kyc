export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        {/* Main loading spinner */}
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg text-blue-600"></span>
        </div>
        
        {/* Loading text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Loading KaziKYC...</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Please wait while we prepare your personalized experience
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="w-80 mx-auto">
          <progress className="progress progress-primary w-full" value="70" max="100"></progress>
        </div>
        
        {/* Additional loading indicators */}
        <div className="flex justify-center space-x-2">
          <span className="loading loading-dots loading-sm text-blue-600"></span>
          <span className="loading loading-dots loading-sm text-green-600"></span>
          <span className="loading loading-dots loading-sm text-orange-600"></span>
        </div>
      </div>
    </div>
  );
}
