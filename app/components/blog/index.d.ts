type Blog = {
  id: string;
  slug: string;
  status: "published" | "draft" | "archived" | "deleted";
  metadata: {
    title: string;
    description: string;
    openGraph: {
      title: string;
      description: string;
      image: string | null;
    };
  };
  writer: {
    name: string;
    avatar: string | null;
  };
  content: {
    title: string;
    description: string | null;
    tags: string[] | null;
    categories: string[] | null;
    html: string;
  };
  stats: {
    views: number | null;
    readTime: number | null;
    version: number | null;
  };
  language: Language;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
};
