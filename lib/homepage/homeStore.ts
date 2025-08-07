import axios from "axios";
import { create } from "zustand";

interface User {
    id: string | null;
    name: string | null;
    profession: string | null;
    avatar: string | null;
    rating: number;
    location: string | null;
    distance: string | null;
    hourlyRate: string | null;
    isOnline: boolean;
  
    
  }
  
interface useStore{
    users: User[]
    fetchUsers: () => Promise<void>;
}

interface Author{
    name: string
    profession: string
    avatar: string
    rating: number
    location: string
}
interface Post{
    id: string | null
    author: Author
    content: string
    images: string[]
    jobType: string
    timeAgo: string
    likes: number
    comments: number
    isLiked: boolean

}

interface usePosts{
    posts : Post[]
    fetchPosts : () => Promise<void>
}
export const useUsers = create<useStore>((set) =>({
    users: [],
    fetchUsers: async () => {
        try{
            const res =  axios.get("/api/home/users");
            const data = (await res).data;
            set({ users: data })
        } catch ( err){
            console.error(`Internal sever error: ${err}`)
        }
    }

}))

export const recentPosts = create<usePosts>((set) => ({
    posts: [],
    fetchPosts: async () => {
        try{
            const res = axios.get("/api/home/posts")
            const data = (await res).data
            set({ posts: data})
        } catch(err){
            console.log(`Internal server error: ${err}`)
        }
    }

}))