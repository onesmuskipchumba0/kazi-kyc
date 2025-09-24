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
            console.log('Fetching posts...');
            const { data: posts, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching posts:', error);
                return;
            }

            const formattedPosts = await Promise.all(posts.map(async post => {
                console.log('Processing post:', post);
                let userData = null;

                try {
                    // First, verify the post.userId is in the correct format
                    if (!post.userId) {
                        console.error('Missing userId in post:', post);
                        throw new Error('Post is missing userId');
                    }

                    console.log('Attempting to fetch user with ID:', post.userId);

                    console.log('Looking up user with public_id:', post.userId);

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
                        console.error('Supabase error details:', {
                            error: userError,
                            code: userError.code,
                            message: userError.message,
                            details: userError.details
                        });
                        throw userError;
                    }

                    if (!data) {
                        console.error('No user found for ID:', post.userId);
                        throw new Error('User not found');
                    }

                    console.log('Successfully found user:', data);
                    userData = data;
                } catch (error) {
                    console.error('Error in user fetch:', error);
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

                console.log('Formatted author:', author);

                return {
                    ...post,
                    imageURL: Array.isArray(parsedImageURL) ? parsedImageURL : [],
                    author
                };
            }));

            set({ posts: formattedPosts });
        } catch (error) {
            console.error('Error:', error);
        }
    }
}))