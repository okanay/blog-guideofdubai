import { Editor } from "@tiptap/react";
import { z } from "zod";

const imageUrlSchema = z
  .string()
  .url({ message: "Lütfen geçerli bir URL girin." })
  .refine(
    async (url) => {
      try {
        const response = await fetch(url, { method: "HEAD" });
        const contentType = response.headers.get("content-type");
        // Sadece belirli formatları kabul et
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        return response.ok && contentType && allowedTypes.includes(contentType);
      } catch {
        return false;
      }
    },
    {
      message:
        "URL sadece JPEG, PNG veya WEBP formatında bir görsel olmalıdır.",
    },
  );

export const BlogSchema = z.object({
  id: z.string().uuid({ message: "Geçersiz ID." }),

  groupId: z
    .string()
    .min(5, "Grup ID en az 5 karakter olmalıdır. Bu alan boş bırakılamaz.")
    .regex(
      /^[a-z0-9-]+$/,
      "Grup ID sadece küçük harfler, rakamlar ve tire içerebilir.",
    ),

  slug: z
    .string()
    .min(5, "URL slug en az 5 karakter olmalıdır. Bu alan boş bırakılamaz.")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug sadece küçük harfler, rakamlar ve tire içerebilir.",
    ),

  language: z
    .string({
      required_error: "Blog dili seçilmelidir.",
      invalid_type_error: "Blog dili seçilmelidir.",
    })
    .min(2, "Blog dili geçerli bir dil kodu olmalıdır."),

  featured: z.boolean().default(false),

  status: z.string({
    required_error: "Blog durumu seçilmelidir.",
    invalid_type_error: "Geçersiz blog durumu.",
  }),

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

    image: imageUrlSchema,
  }),

  content: z.object({
    title: z
      .string()
      .min(
        10,
        "Blog başlığı en az 10 karakter olmalıdır. Bu alan boş bırakılamaz.",
      )
      .max(100, "Blog başlığı en fazla 100 karakter olabilir."),

    description: z
      .string()
      .min(
        40,
        "Blog açıklaması en az 40 karakter olmalıdır. Bu alan boş bırakılamaz.",
      )
      .max(250, "Blog açıklaması en fazla 250 karakter olabilir."),

    image: imageUrlSchema,

    readTime: z
      .number()
      .int()
      .min(1, "Okuma dakikası en az 1 dakika olmalıdır.")
      .max(60, "Okuma dakikası en fazla 60 dakika olabilir."),

    html: z
      .string()
      .min(
        100,
        "Blog içeriği en az 100 karakter olmalıdır. Bu alan boş bırakılamaz.",
      ),
  }),

  categories: z.array(z.string()).min(1, {
    message: "En az 1 kategori seçilmelidir.",
  }),
  tags: z.array(z.string()).default([]),

  // İsteğe bağlı: Tarih alanları için validasyon
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  publishedAt: z.string().datetime().nullable().optional(),

  // İsteğe bağlı: İstatistikler için validasyon
  stats: z
    .object({
      views: z.number().int().min(0).default(0),
      likes: z.number().int().min(0).default(0),
      shares: z.number().int().min(0).default(0),
      comments: z.number().int().min(0).default(0),
    })
    .optional(),
});

export const BlogFormSchema = z.object({
  groupId: z
    .string()
    .min(5, "Grup ID en az 5 karakter olmalıdır. Bu alan boş bırakılamaz.")
    .regex(
      /^[a-z0-9-]+$/,
      "Grup ID sadece küçük harfler, rakamlar ve tire içerebilir.",
    ),
  slug: z
    .string()
    .min(5, "URL slug en az 5 karakter olmalıdır. Bu alan boş bırakılamaz.")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug sadece küçük harfler, rakamlar ve tire içerebilir.",
    ),
  language: z
    .string({
      required_error: "Blog dili seçilmelidir.",
      invalid_type_error: "Blog dili seçilmelidir.",
    })
    .min(2, "Blog dili geçerli bir dil kodu olmalıdır."),
  featured: z.boolean().default(false),
  status: z.string({
    required_error: "Blog durumu seçilmelidir.",
    invalid_type_error: "Geçersiz blog durumu.",
  }),
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

    image: imageUrlSchema,
  }),

  content: z.object({
    title: z
      .string()
      .min(
        10,
        "Blog başlığı en az 10 karakter olmalıdır. Bu alan boş bırakılamaz.",
      )
      .max(100, "Blog başlığı en fazla 100 karakter olabilir."),

    description: z
      .string()
      .min(
        40,
        "Blog açıklaması en az 40 karakter olmalıdır. Bu alan boş bırakılamaz.",
      )
      .max(250, "Blog açıklaması en fazla 250 karakter olabilir."),

    image: imageUrlSchema,

    readTime: z
      .number()
      .int()
      .min(1, "Okuma dakikası en az 1 dakika olmalıdır.")
      .max(60, "Okuma dakikası en fazla 60 dakika olabilir."),

    html: z
      .string()
      .min(
        100,
        "Blog içeriği en az 100 karakter olmalıdır. Bu alan boş bırakılamaz.",
      ),
  }),

  categories: z.array(z.string()).min(1, {
    message: "En az 1 kategori seçilmelidir.",
  }),
  tags: z.array(z.string()).default([]),
});

export const BlogCreateData = (data: BlogFormSchema, editor: Editor) => {
  const json = {
    groupId: data.slug,
    slug: data.slug,
    metadata: {
      title: data.metadata.title,
      description: data.metadata.description,
      image: data.metadata.image,
    },
    content: {
      title: data.content.title,
      description: data.content.description,
      image: data.content.image,
      readTime: data.content.readTime,
      html: editor?.getHTML(),
    },
    tags: data.tags,
    categories: data.categories,
    language: data.language,
    status: data.status,
    featured: data.featured,
  };

  return {
    success: true,
    data: json,
  };
};

declare global {
  type BlogSchema = z.infer<typeof BlogSchema>;
  type BlogFormSchema = z.infer<typeof BlogFormSchema>;
}
