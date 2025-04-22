import type { User, AuthStatus, LoginCredentials } from "./types.d.ts";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";

type Props = PropsWithChildren & {
  children: React.ReactNode;
  user?: User | null;
  status?: AuthStatus;
};

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

export function AuthProvider({
  children,
  user = null,
  status = "loading",
}: Props) {
  const [store] = useState(() =>
    createStore<DataState>()(
      immer((set) => ({
        status: status,
        setAuthStatus: (status: AuthStatus) => set({ status }),
        user: user,
        setUser: (user: User | null) => set({ user }),
        logout: async () => {
          try {
            await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/auth/logout`, {
              headers: {
                "Content-Type": "application/json",
              },
              method: "GET",
              credentials: "include",
            });
            window.location.reload();
          } catch (error) {
            console.warn("Failed to logout:", error);
          }
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
              set({ user: null, status: "unauthorize" });
              return { success: false, message: "Login failed" };
            }

            const user = await response.json();
            set({ user, status: "authorize" });
            return { success: true, message: "Login successful" };
          } catch {
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

            if (response.ok) {
              const data = await response.json();
              set({ user: data.user, status: "authorize" });
            } else {
              set({ user: null, status: "unauthorize" });
            }
          } catch (error) {
            console.warn("Failed to check user login:", error);
            set({ user: null, status: "unauthorize" });
          }
        },
      })),
    ),
  );

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth hook must be used within a AuthProvider");
  }

  return useStore(context, (state) => state);
}

const AuthContext = createContext<AuthContextType>(undefined);
type AuthContextType = StoreApi<DataState> | undefined;
