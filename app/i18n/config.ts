declare global {
  type Language = "tr" | "en" | "ar" | "de" | "fr" | "ru";
  type SameSite = "lax" | "strict" | "none" | undefined;
  type Direction = "ltr" | "rtl";
}

export const LANGUAGES: Record<string, Language> = {
  ENGLISH: "en",
  TURKISH: "tr",
} as const;

export const ACTIVE_LANGUAGE_DICTONARY = [
  { value: "en", label: "English", seo: { locale: "en-US", direction: "ltr" } },
  { value: "tr", label: "Türkçe", seo: { locale: "tr-TR", direction: "ltr" } },
];

export const ALL_LANGUAGE_DICTONARY = [
  {
    value: "en",
    label: "İngilizce",
    seo: { locale: "en-US", direction: "ltr" },
  },
  { value: "tr", label: "Türkçe", seo: { locale: "tr-TR", direction: "ltr" } },
  { value: "ar", label: "Arapça", seo: { locale: "ar-SA", direction: "rtl" } },
  { value: "de", label: "Almanca", seo: { locale: "de-DE", direction: "ltr" } },
  {
    value: "fr",
    label: "Fransızca",
    seo: { locale: "fr-FR", direction: "ltr" },
  },
  { value: "ru", label: "Rusça", seo: { locale: "ru-RU", direction: "ltr" } },
];

export const SUPPORTED_LANGUAGES: Language[] = Object.values(LANGUAGES);
export const DEFAULT_LANGUAGE: Language = LANGUAGES.ENGLISH;
export const FALLBACK_LANGUAGE: Language = "en";
export const I18N_STORAGE_KEY = "guideofdubai_blog_language";
export const I18N_COOKIE_NAME = "guideofdubai_blog_language";
export const I18N_COOKIE_OPTIONS = {
  expires: 365,
  path: "/",
  sameSite: "lax" as SameSite,
};
