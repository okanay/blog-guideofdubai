declare global {
  type Language = "tr" | "en" | "ar" | string;
  type SameSite = "lax" | "strict" | "none" | undefined;
  type Direction = "ltr" | "rtl";
}

export const LANGUAGES: Record<string, Language> = {
  TURKISH: "tr",
  ENGLISH: "en",
  ARABIC: "ar", // İleride eklenebilecek Arapça için
} as const;

export const LANGUAGE_DIRECTIONS: Record<Language, Direction> = {
  tr: "ltr",
  en: "ltr",
  ar: "rtl", // Arapça için RTL
};

export const LANGUAGE_DICTONARY_TR = [
  { value: "tr", label: "Türkçe" },
  { value: "en", label: "İngilizce" },
  { value: "ar", label: "Arapça" },
];

export const SUPPORTED_LANGUAGES: Language[] = Object.values(LANGUAGES);
export const DEFAULT_LANGUAGE: Language = LANGUAGES.ENGLISH;
export const FALLBACK_LANGUAGE: Language = "";
export const I18N_STORAGE_KEY = "language";
export const I18N_COOKIE_NAME = "language";
export const I18N_COOKIE_OPTIONS = {
  expires: 365,
  path: "/",
  sameSite: "lax" as SameSite,
};
