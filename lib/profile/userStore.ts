import { create } from "zustand";
import axios from "axios";

interface UserType {
    email: string | null
    firstName: string | null
    lastName: string | null
    phoneNumber: string | null
    location: string | null
    description: string | null
    jobsCompleted: string | null
    hourlyRate: number | null
    responseTime: number | null
    completionRate: number | null
    experience: string | null
    availability: string | null
    responseRate: number | null
    languages: string []
    contacts: string []
    coreSkills: string []
    profileType: string | null
    projectCompleted: number | null
    avatarUrl: string | null
    fetchUser: () => Promise<void>
}

interface User{
    userType: UserType | null
    fetchUser: () => Promise<void>
}

export const useUserStore = create<User>((set) => ({
    userType: null,
    fetchUser: async() => {
        try{
            const res = await axios.get("/api/profile")
            const user = res.data
            set({ userType: user})
        }catch(err){
            console.log(`An error occured: ${err}`)
        }
    }
})
)
