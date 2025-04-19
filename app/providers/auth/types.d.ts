export type AuthStatus = "loading" | "authorize" | "unauthorize";

export type UserRole = "user" | "editor" | "admin";

export type User = {
  id: string;
  username: string;
  email: string;
  role: UserRole;
};

export type LoginCredentials = {
  username: string;
  password: string;
};
