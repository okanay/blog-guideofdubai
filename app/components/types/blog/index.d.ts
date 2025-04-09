type Blog = {
  id: string;
  groupId: string;
  slug: string;
  metadata: {
    title: string;
    description: string;
    openGraph: {
      title: string;
      description: string;
      image: string | null;
    };
    canonicalSlug: boolean;
    alternatives: {
      language: Language;
      slug: string;
    }[];
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
  status: BlogStatus;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
};

type BlogStatus = "published" | "draft" | "archived" | "deleted";
