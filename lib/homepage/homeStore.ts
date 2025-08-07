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