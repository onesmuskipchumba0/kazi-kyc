import { create } from "zustand";
import axios from "axios";

// In your UserStore or types file
interface UserType {
  id: string;
  public_id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  avatarUrl?: string;
  profileType: string;
  coreSkills?: string[] | string | null;
  rating?: number;
  jobsCompleted?: number;
  profileViews?: number;
  earnings?: number;
  location?: string;
}

interface UserState {
  user: UserType | null;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  fetchUser: async () => {
    try {
      const res = await axios.get<{ user: UserType }>("/api/user");
      set({ user: res.data.user });
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  },
}));
