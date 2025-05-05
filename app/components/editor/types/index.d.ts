type TiptapViewMode = "edit" | "preview" | "json" | "html";
type BlogViewMode = "editor" | "form" | "preview";

type Category = {
  name: string;
  value: string;
};

type Tag = {
  name: string;
  value: string;
};

type SelectOption = {
  name: string;
  value: string;
};

type StatusState = {
  status: "loading" | "success" | "error" | "idle";
  message: string | undefined;
  loading: boolean;
  error: string | null;
};

interface BlogStats {
  blogId: string;
  title: string;
  image: string;
  language: string;
  groupId: string;
  slug: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  lastViewedAt: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogStatsResponse {
  limit: number;
  offset: number;
  stats: BlogStats[];
  success: boolean;
  total: number;
}

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface FetchOptions {
  method: HttpMethod;
  endpoint: string;
  body?: any;
  credentials?: RequestCredentials;
  successMessage?: string;
  errorMessage?: string;
}
