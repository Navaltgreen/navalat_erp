import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthSnapshot, AuthUser } from "../../config/demoAuth";

type AuthStoreState = {
  isReady: boolean;
  isAuthenticated: boolean;
  token: string | null;
  roles: string[];
  user: AuthUser | null;
  lastAttemptedPath: string | null;
  setAuthSnapshot: (snapshot: AuthSnapshot) => void;
  setAuthReady: (isReady: boolean) => void;
  clearAuth: () => void;
  setLastAttemptedPath: (path: string | null) => void;
};

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      isReady: false,
      isAuthenticated: false,
      token: null,
      roles: [],
      user: null,
      lastAttemptedPath: null,
      setAuthSnapshot: (snapshot) =>
        set({
          isAuthenticated: snapshot.isAuthenticated,
          token: snapshot.token,
          roles: snapshot.roles,
          user: snapshot.user,
        }),
      setAuthReady: (isReady) => set({ isReady }),
      clearAuth: () =>
        set({
          isAuthenticated: false,
          token: null,
          roles: [],
          user: null,
        }),
      setLastAttemptedPath: (path) => set({ lastAttemptedPath: path }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        token: state.token,
        roles: state.roles,
        user: state.user,
        lastAttemptedPath: state.lastAttemptedPath,
      }),
    },
  ),
);
