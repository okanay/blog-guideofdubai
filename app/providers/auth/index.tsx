import { QueryClient, useQueryClient } from "@tanstack/react-query";
import type { User, AuthStatus, LoginCredentials } from "./types.d.ts";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { AuthSessionController } from "./session-control.js";

// Query key'leri tanımlayalım
export const authQueryKeys = {
  user: ["auth", "user"],
  session: ["auth", "session"],
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

// Auth Context
const AuthContext = createContext<AuthContextType>(undefined);
type AuthContextType = StoreApi<DataState> | undefined;

// Ana dış AuthProvider - useQueryClient hook'unu kullanır
export function AuthProvider({
  children,
  user = null,
  status = "loading",
}: PropsWithChildren & {
  user?: User | null;
  status?: AuthStatus;
}) {
  // QueryClient'ı mevcut context'ten al
  const queryClient = useQueryClient();

  return (
    <AuthProviderInner user={user} status={status} queryClient={queryClient}>
      <AuthSessionController>{children}</AuthSessionController>
    </AuthProviderInner>
  );
}

// İç özel AuthProvider - queryClient'ı props olarak alır
function AuthProviderInner({
  children,
  user = null,
  status = "loading",
  queryClient,
}: PropsWithChildren & {
  user?: User | null;
  status?: AuthStatus;
  queryClient: QueryClient;
}) {
  const [store] = useState(() =>
    createStore<DataState>()(
      immer((set) => ({
        status: status,
        setAuthStatus: (status: AuthStatus) => set({ status }),
        user: user,
        setUser: (user: User | null) => set({ user }),

        logout: async () => {
          try {
            // QueryClient ile logout işlemini yap
            await queryClient.fetchQuery({
              queryKey: ["auth", "logout"],
              queryFn: async () => {
                const response = await fetch(
                  `${import.meta.env.VITE_APP_BACKEND_URL}/auth/logout`,
                  {
                    headers: {
                      "Content-Type": "application/json",
                    },
                    method: "GET",
                    credentials: "include",
                  },
                );

                if (!response.ok) {
                  throw new Error("Logout failed");
                }

                return response;
              },
              // Bu sorgu her zaman yeni veri almalı
              staleTime: 0,
            });

            // Kullanıcı oturumunu sonlandırdıktan sonra auth ile ilgili cache'i temizle
            queryClient.removeQueries({ queryKey: authQueryKeys.user });
            queryClient.removeQueries({ queryKey: authQueryKeys.session });

            // Sayfayı yenile
            window.location.reload();
          } catch (error) {
            console.warn("Failed to logout:", error);
          }
        },

        login: async (credentials: LoginCredentials) => {
          try {
            // QueryClient ile login işlemini yap
            const user = await queryClient.fetchQuery({
              queryKey: ["auth", "login", credentials],
              queryFn: async () => {
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

                return response.json();
              },
              // Bu sorgu her zaman yeni veri almalı
              staleTime: 0,
            });

            // Auth durumunu ve kullanıcı bilgilerini güncelle
            set({ user, status: "authorize" });

            // Auth query cache'ini güncelle
            queryClient.setQueryData(authQueryKeys.user, user);
            queryClient.setQueryData(authQueryKeys.session, {
              status: "authorize",
            });

            return { success: true, message: "Login successful" };
          } catch (error) {
            // Hata durumunda auth durumunu güncelle
            set({ user: null, status: "unauthorize" });

            // Auth query cache'ini temizle
            queryClient.setQueryData(authQueryKeys.user, null);
            queryClient.setQueryData(authQueryKeys.session, {
              status: "unauthorize",
            });

            return { success: false, message: "Login failed" };
          }
        },

        initialSessionControl: async () => {
          try {
            // QueryClient ile kullanıcı bilgisini al
            const userData = await queryClient.fetchQuery({
              queryKey: authQueryKeys.user,
              queryFn: async () => {
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

                return response.json();
              },
              // 5 dakikalık önbellek süresi
              staleTime: 1000 * 60 * 5,
            });

            // Kullanıcı bilgisi ve auth durumunu güncelle
            set({ user: userData.user, status: "authorize" });

            // Session bilgisini cache'e kaydet
            queryClient.setQueryData(authQueryKeys.session, {
              status: "authorize",
            });
          } catch (error) {
            console.warn("Failed to check user login:", error);

            // Hata durumunda auth durumunu güncelle
            set({ user: null, status: "unauthorize" });

            // Auth query cache'ini temizle
            queryClient.setQueryData(authQueryKeys.user, null);
            queryClient.setQueryData(authQueryKeys.session, {
              status: "unauthorize",
            });
          }
        },
      })),
    ),
  );

  return <AuthContext.Provider value={store}>{children}</AuthContext.Provider>;
}

// useAuth hook'u - zustand store'a erişim sağlar
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth hook must be used within a AuthProvider");
  }

  return useStore(context, (state) => state);
}
