import { create } from 'zustand';

type AuthState = {
  token: string | null;
  setToken: (t: string | null) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>((set: any) => ({
  token: null,
  setToken: (t: string | null) => set({ token: t }),
  clear: () => set({ token: null }),
}));

export default useAuthStore;
