type TiptapViewMode = "edit" | "preview" | "json" | "html";
type BlogViewMode = "editor" | "form" | "preview";

type BlogCreateRequest = {
  groupID: string;
  slug: string;
  language: string;
  featured: boolean;
  status: string;
  metadata: {
    title: string;
    description: string;
    image: string;
  };
  content: {
    title: string;
    description: string;
    readTime: number;
    html: string;
  };
  categories: string[];
  tags: string[];
};
