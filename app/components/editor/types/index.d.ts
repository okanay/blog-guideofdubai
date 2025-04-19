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
  loading: boolean;
  error: string | null;
};
