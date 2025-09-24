import axios from "axios";
import { create } from "zustand";
import { supabase, supabaseAdmin } from "@/lib/supabaseClient";

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

interface Author {
    name: string;
    profession: string;
    avatar?: string;
    rating: number;
    location: string;
}

interface Post {
    id: string;
    title: string;
    description: string;
    imageURL: string[];
    likes: number;
    comments: number;
    shares: number;
    userId: string;
    created_at: string;
    author?: Author;
}

interface useStore{
    users: User[]
    fetchUsers: () => Promise<void>;
}

interface PostStore {
    posts: Post[];
    fetchPosts: () => Promise<void>;
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

export const useRecentPosts = create<PostStore>((set) => ({
    posts: [],
    fetchPosts: async () => {
        try {
            const { data: posts, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            const formattedPosts = await Promise.all(posts.map(async post => {
                let userData = null;

                try {
                    // First, verify the post.userId is in the correct format
                    if (!post.userId) {
                        throw new Error('Post is missing userId');
                    }

                    // Fetch user data using userId with regular client
                    const { data, error: userError } = await supabase
                        .from('user')  // Using the correct table name
                        .select(`
                            public_id,
                            firstName,
                            lastName,
                            avatarUrl,
                            location,
                            email
                        `)
                        .eq('public_id', post.userId)
                        .maybeSingle(); // Use maybeSingle instead of single to avoid errors

                    if (userError) {
                        throw userError;
                    }

                    if (!data) {
                        throw new Error('User not found');
                    }

                    userData = data;
                } catch (error) {
                    // Silent fail - will use anonymous user
                }

                // Parse imageURL if it's a string
                let parsedImageURL = post.imageURL;
                if (typeof post.imageURL === 'string') {
                    try {
                        parsedImageURL = JSON.parse(post.imageURL);
                    } catch {
                        parsedImageURL = [post.imageURL];
                    }
                }

                const author = userData ? {
                    name: `${userData.firstName} ${userData.lastName}`,
                    profession: 'Professional', // Default profession since we don't have it in DB
                    avatar: userData.avatarUrl || null,
                    rating: 4.5, // Default rating since we don't have it in DB
                    location: userData.location || 'Remote'
                } : {
                    name: "Anonymous",
                    profession: "Professional",
                    avatar: null,
                    rating: 0,
                    location: "Remote"
                };



                return {
                    ...post,
                    imageURL: Array.isArray(parsedImageURL) ? parsedImageURL : [],
                    author
                };
            }));

            set({ posts: formattedPosts });
        } catch (error) {
            throw error;
        }
    }
}))