import { create } from "zustand";
import axios from "axios";

export interface UserType {
  public_id: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profileType: string;
  experience:string;
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
