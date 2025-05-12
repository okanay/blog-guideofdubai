import { ALL_LANGUAGE_DICTONARY } from "@/i18n/config";

export const formatDate = (date: string | Date, language: Language) => {
  if (!date) return "";
  const d = new Date(date);

  const locale =
    ALL_LANGUAGE_DICTONARY.find((l) => l.value === language)?.seo?.locale ||
    "en-US";

  console.log(locale);
  // Use toLocaleString to get the month name in the correct language
  const month = d.toLocaleString(locale, { month: "long" });
  const day = d.getDate();
  const year = d.getFullYear();

  return `${month} ${day}, ${year}`;
};
