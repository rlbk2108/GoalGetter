import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
    allUserData: null, // Use this to store all user data
    loading: false,
    user: () => ({
        user_id: get().allUserData?.user_id || null,
        email: get().allUserData?.email || null,
        username: get().allUserData?.username || null,
    }),
    setUser: (user) => set({ allUserData: user }),
    setLoading: (loading) => set({ loading }),
    isLoggedIn: () => get().allUserData !== null,
}));



export { useAuthStore };