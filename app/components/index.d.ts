type Blog = {
  id: string;
  groupId: string;
  slug: string;
  metadata: {
    title: string;
    description: string;
    image: string;
  };
  content: {
    title: string;
    description: string;
    readTime: number;
    tags: string[];
    categories: string[];
    html: string;
  };
  stats: {
    views: number;
  };
  language: Language;
  featured: boolean;
  status: BlogStatus;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  version: number;
};
