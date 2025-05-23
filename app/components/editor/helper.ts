import { format } from "date-fns";
import { enUS, tr } from "date-fns/locale";

// app/components/editor/create/helpers.ts
interface ContentStats {
  wordCount: number;
  readTime: number;
  characterCount: number;
}

export function calculateContentStats(
  html: string,
  wordsPerMinute: number = 200,
): ContentStats {
  let text: string;

  if (typeof html === "string") {
    text = html.includes("<") ? stripHtml(html) : html;
  }

  // Kelime sayımı
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Karakter sayımı
  const characterCount = text.length;

  // Okuma süresi hesaplama (dakika olarak, yuvarlanmış)
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  return {
    wordCount,
    readTime: readTimeMinutes,
    characterCount,
  };
}

function stripHtml(html: string): string {
  // Basit bir HTML temizleme için DOM API kullanımı
  if (typeof DOMParser !== "undefined") {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  }

  // DOM API yoksa regex ile temizleme (tam olarak güvenilir değil ama yeterli olabilir)
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export const slugify = (text: string): string => {
  if (!text) return "";

  return (
    text
      .toLowerCase()
      .trim()
      // Türkçe karakterleri değiştir
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      // Diğer özel karakterleri ve boşlukları değiştir
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-") // Boşlukları tire ile değiştir
      .replace(/-+/g, "-")
  ); // Birden fazla tireyi tekli tireye dönüştür
};

export const extractErrorMessages = (errors) => {
  let messages = [];
  for (const key in errors) {
    const error = errors[key];
    if (error) {
      if (error.message && typeof error.message === "string") {
        // Doğrudan message varsa ekle
        messages.push(error.message);
      } else if (typeof error === "object" && !Array.isArray(error)) {
        // İç içe nesne ise recursive olarak çağır
        messages = messages.concat(extractErrorMessages(error));
      } else if (Array.isArray(error)) {
        // Eğer dizi içinde hatalar varsa (örneğin array field'larda)
        error.forEach((item) => {
          if (item && typeof item === "object") {
            messages = messages.concat(extractErrorMessages(item));
          }
        });
      }
      // react-hook-form bazen root hatası verebilir array/object fieldlar için
      else if (
        error.root &&
        error.root.message &&
        typeof error.root.message === "string"
      ) {
        messages.push(error.root.message);
      }
    }
  }
  // Tekrarlanan mesajları kaldır
  return [...new Set(messages)];
};

export const API_URL =
  import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:8080/";

export const createStatusState = (
  status: StatusState["status"] = "idle",
  message?: string,
): StatusState => ({
  status,
  message,
  loading: status === "loading",
  error: status === "error" ? message || null : null,
});

export const formatDate = (dateStr: string, lang: string = "tr") => {
  try {
    const date = new Date(dateStr);
    return format(date, "d MMM yyyy HH:mm", {
      locale: lang === "tr" ? tr : enUS,
    });
  } catch (e) {
    return dateStr;
  }
};
