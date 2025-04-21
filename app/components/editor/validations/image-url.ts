import { z } from "zod";

export const simpleImageUrlSchema = z
  .string()
  .url({ message: "Lütfen geçerli bir URL girin." })
  .superRefine(async (url, ctx) => {
    // Boş URL kontrolü
    if (!url.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Görsel URL'si boş olamaz.",
      });
      return;
    }

    // Temel format kontrolü
    const hasImageExtension = /\.(jpeg|jpg|png|webp)(\?.)?$/i.test(url);
    if (!hasImageExtension) {
      ctx.addIssue({
        code: "custom",
        message:
          "URL bir görsel formatında değil (.jpg, .jpeg, .png veya .webp olmalı).",
      });
      return;
    }

    // Erişilebilirlik kontrolü
    try {
      const response = await fetch(url, { method: "HEAD" });
      const contentType = response.headers.get("content-type");
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

      if (!response.ok) {
        ctx.addIssue({
          code: "custom",
          message:
            "Görsel URL'sine erişilemedi. URL'nin doğru olduğundan emin olun.",
        });
        return;
      }

      if (!contentType || !allowedTypes.includes(contentType.toLowerCase())) {
        ctx.addIssue({
          code: "custom",
          // path: ["image"], // <-- BU SATIRI KALDIRIN veya [] yapın
          message:
            "URL bir görsel içeriğine sahip değil veya desteklenmeyen bir format kullanıyor.",
        });
        return;
      }
    } catch (error) {
      ctx.addIssue({
        code: "custom",
        message:
          "Görsel URL'si erişim veya ağ sorunları nedeniyle doğrulanamadı.",
      });
    }
  });

export const imageUrlSchema = z
  .string()
  .url({ message: "Lütfen geçerli bir URL girin." })
  .superRefine((url, ctx) => {
    if (!url.trim()) {
      ctx.addIssue({
        code: "custom",
        // path: ["image"], // <-- BU SATIRI KALDIRIN veya [] yapın
        message: "Görsel URL'si boş olamaz.",
      });
      return;
    }

    const hasImageExtension = /\.(jpeg|jpg|png|webp)(\?.)?$/i.test(url);
    if (!hasImageExtension) {
      ctx.addIssue({
        code: "custom",
        // path: ["image"], // <-- BU SATIRI KALDIRIN veya [] yapın
        message:
          "URL bir görsel formatında değil (.jpg, .jpeg, .png veya .webp olmalı).",
      });
    }
  });
