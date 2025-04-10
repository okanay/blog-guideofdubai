declare global {
  type BlogStatus = "published" | "draft" | "archived" | "deleted";
}

export const BLOG_OPTIONS = [
  { value: "status-published", label: "Yayınla" },
  { value: "status-draft", label: "Hazırlanıyor" },
  { value: "status-deleted", label: "Sil" },
  { value: "status-archived", label: "Arşiv" },
];
