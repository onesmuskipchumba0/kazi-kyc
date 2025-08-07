import { Heart, MessageCircle, Share, MapPin, Clock, Star } from "lucide-react"

interface WorkPostProps {
  id: string
  author: {
    name: string
    profession: string
    avatar?: string
    rating: number
    location: string
  }
  content: string
  images?: string[]
  jobType: string
  timeAgo: string
  likes: number
  comments: number
  isLiked?: boolean
}

export default function WorkPost({ 
  author, 
  content, 
  images, 
  jobType, 
  timeAgo, 
  likes, 
  comments, 
  isLiked = false 
}: WorkPostProps) {
  return (
    <div className="mb-6 rounded-lg shadow bg-white">
      <div className="pb-3">
        <div className="flex items-start gap-3 p-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {author.avatar ? (
              <img
                src={author.avatar ?? ""}
                alt={author.name ?? ""}
                className="w-10 h-10 object-cover rounded-full"
              />
            ) : (
              <span className="text-sm font-semibold text-gray-600">
                {author.name.split(' ').map(n => n[0]).join('')}
              </span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{author.name}</h4>
              <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">{author.profession}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {author.location}
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {author.rating}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pb-3 px-4">
        <span className="inline-block mb-3 px-2 py-0.5 rounded border border-gray-300 text-xs text-gray-700 bg-white">{jobType}</span>
        <p className="mb-4">{content}</p>
        
        {images && images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 rounded-lg overflow-hidden">
            {images.map((image, index) => (
              <div key={index} className="aspect-video bg-gray-100">
                {/* Replace ImageWithFallback with img for HTML */}
                <img 
                  src={image} 
                  alt={`Work image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="pt-0 px-4 pb-4 ">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <button 
              type="button"
              className={`flex items-center gap-1 text-sm px-2 py-1 rounded hover:bg-gray-100 transition ${isLiked ? 'text-red-500' : 'text-gray-700'}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              {likes}
            </button>
            <button
              type="button"
              className="flex items-center gap-1 text-sm px-2 py-1 rounded hover:bg-gray-100 transition text-gray-700"
            >
              <MessageCircle className="w-4 h-4" />
              {comments}
            </button>
          </div>
          <button
            type="button"
            className="flex items-center px-2 py-1 rounded hover:bg-gray-100 transition text-gray-700"
          >
            <Share className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )}