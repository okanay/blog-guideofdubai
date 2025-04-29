declare global {
  type Language = "tr" | "en";
  type SameSite = "lax" | "strict" | "none" | undefined;
  type Direction = "ltr" | "rtl";
}

export const LANGUAGES: Record<string, Language> = {
  TURKISH: "tr",
  ENGLISH: "en",
} as const;

export const LANGUAGE_DICTONARY = [
  { value: "tr", label: "Türkçe", seo: { locale: "tr_TR", direction: "ltr" } },
  { value: "en", label: "English", seo: { locale: "en_US", direction: "ltr" } },
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
