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
  
    fetchUser: () => Promise<void>;
  }
  
const useUsers = create<User>((set) =>({
    id: null,
    name: null,
    profession: null,
    avatar: null,
    rating: 0,
    location: null,
    distance: null,
    hourlyRate: null,
    isOnline: false,

    fetchUser: async () => {
        try{
            const res =  axios.get("/api/home/users");
            const user = (await res).data;
            set({ 
                id: user.id,
                name: user.name,
                profession: user.profession,
                avatar: user.avatar,
                rating: user.rating,
                location: user.location,
                distance: user.distance,
                hourlyRate: user.hourlyRate,
                isOnline: user.isOnline,

            })
        } catch ( err){
            console.error(`Internal sever error: ${err}`)
        }
    }

}))