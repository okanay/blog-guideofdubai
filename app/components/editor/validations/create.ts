import { z } from "zod";
import { Editor } from "@tiptap/react";

declare global {
  type BlogCreate = z.infer<typeof blogCreateValidation>;
}

export const blogCreateValidation = z.object({
  groupId: z.string().min(1, "İçerik grubu tanımlayıcısı gereklidir."),
  slug: z.string().min(5, "Slug en az 5 karakter olmalıdır."),
  metadata: z.object({
    title: z
      .string()
      .min(10, "Başlık en az 10 karakter olmalıdır.")
      .max(60, "Başlık en fazla 60 karakter olabilir."),
    description: z
      .string()
      .min(40, "Açıklama en az 40 karakter olmalıdır.")
      .max(160, "Açıklama en fazla 160 karakter olabilir."),
    image: z.string().url("Lütfen geçerli bir görsel URL'i girin."),
  }),
  content: z.object({
    title: z.string().min(10, "İçerik başlığı en az 10 karakter olmalıdır."),
    description: z
      .string()
      .min(40, "İçerik açıklaması en az 40 karakter olmalıdır."),
    readTime: z
      .number()
      .int()
      .positive("Okuma süresi pozitif bir sayı olmalıdır."),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).min(1, "En az bir kategori seçilmelidir."),
    html: z.string().min(100, "Blog içeriği en az 100 karakter olmalıdır."),
  }),
  language: z.enum(["tr", "en"], {
    errorMap: () => ({ message: "Geçerli bir dil seçilmelidir (tr, en)." }),
  }),
  status: z.enum(["published", "draft", "archived", "deleted"]),
  featured: z.boolean(),
});

// Form verilerini BlogCreate tipine dönüştürme ve doğrulama
export const SafeBlogCreateData = async (data: Blog, editor: Editor) => {
  const json: BlogCreate = {
    groupId: data.seoSlug,
    slug: data.seoSlug,
    metadata: {
      title: data.seoTitle,
      description: data.seoDescription,
      image: data.seoImage,
    },
    content: {
      title: data.blogTitle,
      description: data.blogDescription,
      readTime: data.readTime,
      tags: data.tags,
      categories: data.categories,
      html: editor?.getHTML() || "",
    },
    language: data.language as Language,
    status: data.status as BlogStatus,
    featured: data.featured,
  };

  return blogCreateValidation.safeParse(json);
};
