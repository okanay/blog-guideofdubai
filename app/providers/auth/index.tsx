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
  login: (user: LoginCredentials) => Promise<void>;
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
            set({ user: null });
          } catch (error) {
            console.warn("Failed to logout:", error);
          }
        },
        login: async (credentials: LoginCredentials) => {
          try {
            await fetch(`${import.meta.env.VITE_APP_BACKEND_URL}/login`, {
              headers: {
                "Content-Type": "application/json",
              },
              method: "POST",
              body: JSON.stringify(credentials),
              credentials: "include",
            });
            set({ user: null });
          } catch (error) {
            console.warn("Failed to login:", error);
          }
        },
        initialSessionControl: async () => {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_APP_BACKEND_URL}/auth/get-me`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
                method: "GET",
                credentials: "include",
              },
            );

            if (!response.ok) {
              set({ user: null, status: "unauthorize" });
              return;
            }

            const data = await response.json();
            set({ user: data.user, status: "authorize" });
          } catch (error) {
            set({ user: null, status: "unauthorize" });
            console.warn("Failed to check user login:", error);
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
