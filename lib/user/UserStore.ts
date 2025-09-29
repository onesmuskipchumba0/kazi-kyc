import { create } from "zustand";
import axios from "axios";

interface UserType {
  public_id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profileType: string;
}

interface UserState {
  user: UserType | null; // allow null before fetch
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  fetchUser: async () => {
    try {
      const res = await axios.get("/api/user");
      const data = res.data;
      set({ user: data.user });
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  },
}));
