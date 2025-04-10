declare global {
  type BlogStatus = "published" | "draft" | "archived" | "deleted";
}

export const BLOG_OPTIONS = [
  { value: "published", label: "Yayınla" },
  { value: "draft", label: "Hazırlanıyor" },
  { value: "deleted", label: "Sil" },
  { value: "archived", label: "Arşiv" },
];
