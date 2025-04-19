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
