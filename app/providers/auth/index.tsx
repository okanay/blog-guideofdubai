import type { User, AuthStatus, LoginCredentials } from "./types.d.ts";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";

// Zustand tipi
interface DataState {
  status: AuthStatus;
  setAuthStatus: (status: AuthStatus) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  login: (
    credentials: LoginCredentials,
  ) => Promise<{ success: boolean; message: string }>;
  initialSessionControl: () => Promise<void>;
}

// Auth Context
const AuthContext = createContext<AuthContextType>(undefined);
type AuthContextType = StoreApi<DataState> | undefined;

// Provider
export function AuthProvider({
  children,
  user: initialUser = null,
  status: initialStatus = "loading",
}: PropsWithChildren & {
  user?: User | null;
  status?: AuthStatus;
}) {
  const [store] = useState(() =>
    createStore<DataState>()(
      immer((set) => ({
        status: initialStatus,
        setAuthStatus: (status: AuthStatus) => set({ status }),
        user: initialUser,
        setUser: (user: User | null) => set({ user }),

        logout: async () => {
          try {
            await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/logout`, {
              headers: { "Content-Type": "application/json" },
              method: "GET",
              credentials: "include",
            });
          } catch (error) {
            // Hata olsa bile localde logout işlemi yapılmalı
            console.warn("Failed to logout from backend:", error);
          }
          set({ user: null, status: "unauthorize" });
          window.location.reload();
        },

        login: async (credentials: LoginCredentials) => {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_APP_BACKEND_URL}/login`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
                credentials: "include",
              },
            );
            if (!response.ok) {
              throw new Error("Login failed");
            }
            const user = await response.json();
            set({ user, status: "authorize" });
            return { success: true, message: "Login successful" };
          } catch (error) {
            set({ user: null, status: "unauthorize" });
            return { success: false, message: "Login failed" };
          }
        },

        initialSessionControl: async () => {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_APP_BACKEND_URL}/auth/get-me`,
              {
                headers: { "Content-Type": "application/json" },
                method: "GET",
                credentials: "include",
              },
            );
            if (!response.ok) {
              throw new Error("User not found or not authenticated");
            }
            const userData = await response.json();
            set({ user: userData.user, status: "authorize" });
          } catch (error) {
            set({ user: null, status: "unauthorize" });
          }
        },
      })),
    ),
  );

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
}

// useAuth hook'u
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth hook must be used within a AuthProvider");
  }
  return useStore(context, (state) => state);
}
