import { z } from "zod";
import { Editor } from "@tiptap/react";

declare global {
  type BlogCreate = z.infer<typeof blogCreateValidation>;
}

export const blogCreateValidation = z.object({
  groupId: z.string({ message: "Lütfen geçerli bir grup ID'si girin." }),
  slug: z
    .string()
    .min(10, "URL en az 10 karakter olmalıdır. Bu alan boş bırakılamaz."),
  metadata: z.object({
    title: z
      .string()
      .min(
        10,
        "SEO başlığı en az 10 karakter olmalıdır. Bu alan boş bırakılamaz.",
      )
      .max(60, "SEO başlığı en fazla 60 karakter olabilir."),
    description: z
      .string()
      .min(
        40,
        "SEO açıklaması en az 40 karakter olmalıdır. Bu alan boş bırakılamaz.",
      )
      .max(160, "SEO açıklaması en fazla 160 karakter olabilir."),
    image: z.string().url("Lütfen geçerli bir görsel URL'i girin."),
  }),
  content: z.object({
    title: z
      .string()
      .min(
        10,
        "Kart başlığı en az 10 karakter olmalıdır. Bu alan boş bırakılamaz.",
      )
      .max(60, "Kart başlığı en fazla 60 karakter olabilir."),
    description: z
      .string()
      .min(
        10,
        "Kart açıklaması en az 10 karakter olmalıdır. Bu alan boş bırakılamaz.",
      )
      .max(120, "Kart açıklaması en fazla 120 karakter olabilir."),
    image: z.string().url("Lütfen geçerli bir içerik görsel URL'i girin."),
    readTime: z
      .number()
      .int()
      .positive("Okuma süresi pozitif bir sayı olmalıdır.")
      .min(1, "Okuma dakikasi en az 1 dakika olmalıdır."),
    html: z.string().min(100, "Blog içeriği en az 100 karakter olmalıdır."),
  }),
  categories: z
    .array(z.string(), {
      required_error: "En az 1 kategori seçilmelidir.",
      invalid_type_error: "En az 1 kategori seçilmelidir.",
    })
    .min(1, {
      message: "En az 1 kategori seçilmelidir.",
    }),
  tags: z
    .array(z.string(), {
      invalid_type_error: "En az 1 etiket seçilmelidir.",
    })
    .default([]),
  language: z
    .string({
      required_error: "Blog dili seçilmelidir.",
      invalid_type_error: "Blog dili seçilmelidir.",
    })
    .min(1, "Blog dili seçilmelidir."),
  status: z
    .string({
      required_error: "Blog durumu seçilmelidir.",
      invalid_type_error: "Blog durumu seçilmelidir.",
    })
    .min(1, "Blog durumu seçilmelidir."),
  featured: z.boolean().default(false),
});

// Form verilerini BlogCreate tipine dönüştürme ve doğrulama
export const SafeBlogCreateData = async (
  data: BlogFormSchema,
  editor: Editor,
) => {
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
      image: data.blogImage,
      readTime: data.readTime,
      html: editor?.getHTML(),
    },
    tags: data.tags,
    categories: data.categories,
    language: data.language as Language,
    status: data.status as BlogStatus,
    featured: data.featured,
  };

  return blogCreateValidation.safeParse(json);
};
