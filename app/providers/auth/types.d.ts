export type AuthStatus = "loading" | "authorize" | "unauthorize";

export type Role = "User" | "Editor" | "Admin";

export type Status = "Active" | "Suspended" | "Deleted";

export type User = {
  id: string;
  username: string;
  email: string;
  role: Role;
  status: Status;
  emailVerified: boolean;
  createdAt: string;
  lastLogin: string;
};

export type LoginCredentials = {
  username: string;
  password: string;
};
