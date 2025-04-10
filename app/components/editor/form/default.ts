import { DEFAULT_LANGUAGE } from "@/i18n/config";

export const DEFAULT_BLOG_FORM_VALUES: FormSchema = {
  seoTitle: "Dubai'de Alışveriş Rehberi",
  seoSlug: "dubai-de-alisveris-rehberi",
  seoDescription:
    "Dubai'de alışveriş yapmanın en iyi yollarını ve popüler alışveriş noktalarını keşfedin.",
  seoImage: "https://images.project-test.info/1.webp",
  blogTitle: "",
  blogDescription: "",
  blogImage: "",
  categories: ["category-shopping"],
  tags: [],
  language: DEFAULT_LANGUAGE,
  readTime: 0,
  featured: false,
  status: "published",
  isCanonical: true,
};
