
import { create } from "zustand";
import { useUser } from "@clerk/nextjs";

const useUserStore = create((set) => {
  userName : null
  isLoading: false
  error: null

  // fetch user data
  const setUsername = async () => {
    set({isLoading: true, error: null})

    try{
      const { user, isSignedIn } = useUser();
      user && isSignedIn ? 
      set({ userName: user.fullName, isLoading: false, error: null}) :
      set({error: "An error occured while loading user data"})
    }
    catch (err) {
      set({ error: err });
    }
  }


})
