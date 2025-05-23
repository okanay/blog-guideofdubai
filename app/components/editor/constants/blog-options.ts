declare global {
  type BlogStatus = "published" | "draft" | "archived" | "deleted";
}

export const BLOG_OPTIONS = [
  {
    value: "published",
    label: "Yayınla",
    label2: "Yayınlandı",
    label3: "Direkt Yayına Al",
    config: {
      label: "Yayında",
      color: "text-green-600 bg-green-50 border-green-200",
    },
  },
  {
    value: "draft",
    label: "Hazırlanıyor",
    label2: "Hazırlanıyor",
    label3: "Taslak Olarak Beklet",
    config: {
      label: "Taslak",
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
  },
  {
    value: "archived",
    label: "Arşiv",
    label2: "Arşivlendi",
    label3: "Arşiv Olarak Beklet",
    config: {
      label: "Arşivlenmiş",
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
  },
];
