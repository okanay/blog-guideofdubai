import { z } from "zod";

const imageUrlSchema = z
  .string()
  .url()
  .refine(
    async (url) => {
      // Daha önce başlatılmış bir isteği iptal etmek için controller
      let controller = new AbortController();

      try {
        // İstek için zaman aşımı süresi (3 saniye)
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch(url, {
          method: "HEAD",
          signal: controller.signal, // AbortController sinyalini ekle
        });

        // Zaman aşımı zamanlayıcısını temizle
        clearTimeout(timeoutId);

        return (
          response.ok &&
          response.headers.get("content-type")?.startsWith("image/")
        );
      } catch (error) {
        // AbortError olup olmadığını kontrol et
        if (error.name === "AbortError") {
          console.log("Fetch işlemi zaman aşımına uğradı veya iptal edildi");
        }
        return false;
      } finally {
        // Controller'ı temizle
        controller = null;
      }
    },
    { message: "URL erişilebilir bir görsel dosyasına işaret etmelidir." },
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
  categories: z.array(z.string()).min(1, "En az 1 kategori seçilmelidir."),
  tags: z.array(z.string()).optional(),
  language: z.string().min(1, "Blog dili seçilmelidir."),
  featured: z.boolean().default(false),
  readTime: z.number().min(1, "Okuma dakikasi en az 1 dakika olmalıdır."),
  status: z.string().min(1, "Blog durumu seçilmelidir."),
  isCanonical: z.boolean().default(true),
});

declare global {
  type FormSchema = z.infer<typeof formSchema>;
}
