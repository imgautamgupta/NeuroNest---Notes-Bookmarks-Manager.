import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    _id: string;
    name: string;
    email: string;
    token: string;
}

interface AuthState {
    user: User | null;
    isGuest: boolean;
    setUser: (user: User | null) => void;
    loginAsGuest: () => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isGuest: false,
            setUser: (user) => set({ user, isGuest: false }),
            loginAsGuest: () => set({ isGuest: true, user: null }),
            logout: () => {
                set({ user: null, isGuest: false });
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('auth-storage');
                }
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
