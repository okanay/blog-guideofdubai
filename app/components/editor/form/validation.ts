import { z } from "zod";

export const formSchema = z.object({
  seoTitle: z
    .string()
    .min(
      10,
      "SEO başlığı en az 10 karakter olmalıdır. Bu alan boş bırakılamaz.",
    )
    .max(60, "SEO başlığı en fazla 60 karakter olabilir."),
  seoSlug: z
    .string()
    .min(10, "URL en az 10 karakter olmalıdır. Bu alan boş bırakılamaz."),
  seoDescription: z
    .string()
    .min(
      10,
      "SEO açıklaması en az 10 karakter olmalıdır. Bu alan boş bırakılamaz.",
    )
    .max(160, "SEO açıklaması en fazla 160 karakter olabilir."),
  seoImage: z
    .string()
    .min(
      10,
      "Sosyal medya görseli en az 10 karakter olmalıdır. Bu alan boş bırakılamaz.",
    ),
  blogTitle: z
    .string()
    .min(
      10,
      "Kart başlığı en az 10 karakter olmalıdır. Bu alan boş bırakılamaz.",
    )
    .max(60, "Kart başlığı en fazla 60 karakter olabilir."),
  blogDescription: z
    .string()
    .min(
      10,
      "Kart açıklaması en az 10 karakter olmalıdır. Bu alan boş bırakılamaz.",
    )
    .max(120, "Kart açıklaması en fazla 120 karakter olabilir."),
  blogImage: z.string().optional(),
  categories: z.array(z.string()).min(1, "En az 1 kategori seçilmelidir."),
  tags: z.array(z.string()).optional(),
  language: z.string().min(1, "Blog dili seçilmelidir."),
  featured: z.boolean().default(false),
  readTime: z.number().min(1, "Okuma süresi 1'den küçük olamaz."),

  status: z.string().min(1, "Blog durumu seçilmelidir."),
  isCanonical: z.boolean().default(true),
  alternatives: z
    .array(
      z.object({
        language: z.string().min(1, "Alternatif dil seçilmelidir."),
        slug: z.string().min(10, "Alternatif URL en az 10 karakter olmalıdır."),
      }),
    )
    .optional(),
});

declare global {
  type FormSchema = z.infer<typeof formSchema>;
}
