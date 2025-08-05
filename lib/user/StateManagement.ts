
import { create } from "zustand";
import { useUser } from "@clerk/nextjs";

interface UserStore {
  userName: string | null;
  isLoading: boolean;
  error: string | null;
  setUsername: (user: { firstName: string } | null, isSignedIn: boolean) => void;
}

const { user, isSignedIn } = useUser(); 
const useUserStore = create<UserStore>((set) => ({
  userName: null,
  isLoading: false,
  error: null,
  setUsername: async (user: { firstName: string } | null, isSignedIn: boolean) => {
    set({ isLoading: true, error: null });
    try {
      if (user && isSignedIn) {
        set({ userName: user.firstName, isLoading: false, error: null });
      } else {
        set({ error: "An error occured while loading user data", isLoading: false });
      }
    } catch (err: any) {
      set({ error: err?.message || "Unknown error", isLoading: false });
    }
  }
}));

export default useUserStore; 