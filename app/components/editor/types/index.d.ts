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

type StatusState = {
  status: "loading" | "success" | "error" | "idle";
  message: string | undefined;
  loading: boolean;
  error: string | null;
};
