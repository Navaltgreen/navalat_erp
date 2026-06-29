import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser, KeycloakAuthSnapshot } from "../../config/keycloak";

type AuthStoreState = {
  isReady: boolean;
  isAuthenticated: boolean;
  roles: string[];
  user: AuthUser | null;
  lastAttemptedPath: string | null;
  setAuthSnapshot: (snapshot: KeycloakAuthSnapshot) => void;
  setAuthReady: (isReady: boolean) => void;
  clearAuth: () => void;
  setLastAttemptedPath: (path: string | null) => void;
};

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      isReady: false,
      isAuthenticated: false,
      roles: [],
      user: null,
      lastAttemptedPath: null,
      setAuthSnapshot: (snapshot) =>
        set({
          isAuthenticated: snapshot.isAuthenticated,
          roles: snapshot.roles,
          user: snapshot.user,
        }),
      setAuthReady: (isReady) => set({ isReady }),
      clearAuth: () =>
        set({
          isAuthenticated: false,
          roles: [],
          user: null,
        }),
      setLastAttemptedPath: (path) => set({ lastAttemptedPath: path }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        lastAttemptedPath: state.lastAttemptedPath,
      }),
    },
  ),
);
