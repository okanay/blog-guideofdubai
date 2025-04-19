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
      40,
      "SEO açıklaması en az 40 karakter olmalıdır. Bu alan boş bırakılamaz.",
    )
    .max(160, "SEO açıklaması en fazla 160 karakter olabilir."),
  seoImage: imageUrlSchema,
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
  blogImage: imageUrlSchema,
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
    .optional(),
  language: z
    .string({
      required_error: "Blog dili seçilmelidir.",
      invalid_type_error: "Blog dili seçilmelidir.",
    })
    .min(1, "Blog dili seçilmelidir."),
  featured: z.boolean().default(false),
  readTime: z.number().min(1, "Okuma dakikasi en az 1 dakika olmalıdır."),
  status: z.string().min(1, "Blog durumu seçilmelidir."),
});

declare global {
  type BlogFormSchema = z.infer<typeof formSchema>;
}
