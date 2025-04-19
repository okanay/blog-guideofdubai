import { z } from "zod";

export const imageUrlSchema = z
  .string()
  .url({ message: "Lütfen geçerli bir URL girin." })
  .refine(
    async (url) => {
      try {
        const response = await fetch(url, { method: "HEAD" });
        const contentType = response.headers.get("content-type");
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
