import { Link } from "@/i18n/link";
import { useLanguage } from "@/i18n/use-language";
import { X, Globe2 } from "lucide-react";
import { useState, useEffect } from "react";

type AlternateLanguageDetectProps = {
  blog: {
    language: string;
    slug: string;
  };
  alternatives: Array<{
    language: string;
    slug: string;
    title: string;
  }>;
};

export function AlternateLanguageDetect({
  blog,
  alternatives,
}: AlternateLanguageDetectProps) {
  const { language: preferredLanguage } = useLanguage();
  const [shouldRender, setShouldRender] = useState(false);
  const [visible, setVisible] = useState(false);

  // Alternatif dilde içerik var mı?
  const alt = alternatives.find(
    (a) => a.language === preferredLanguage && a.slug !== blog.slug,
  );

  const storageKey = "alt-lang-hide";
  const TIMEOUT_MS = 6 * 60 * 60 * 1000;

  useEffect(() => {
    setVisible(false); // Her değişimde önce gizle
    setShouldRender(false);

    if (!alt) return;

    const item = localStorage.getItem(storageKey);

    let hidden = false;
    if (item) {
      try {
        const { timestamp } = JSON.parse(item);
        if (Date.now() - timestamp < TIMEOUT_MS) {
          hidden = true;
        }
      } catch {
        hidden = false;
      }
    }

    if (!hidden) {
      setShouldRender(true);
      setTimeout(() => setVisible(true), 50);
    }
  }, [blog.slug, preferredLanguage, alt]);

  if (!shouldRender || !alt) return null;

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem(storageKey, JSON.stringify({ timestamp: Date.now() }));
    setTimeout(() => setShouldRender(false), 300);
  };

  return (
    <div
      className={`fixed right-0 bottom-0 z-50 flex w-full items-start gap-3 border border-gray-200 bg-gradient-to-br from-white/95 to-gray-50/90 p-4 shadow-xl backdrop-blur transition-all sm:right-4 sm:bottom-4 sm:max-w-120 sm:rounded-2xl ${visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-50"} `}
      style={{
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      }}
    >
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 rounded p-1 transition hover:bg-gray-100"
        aria-label="Close"
      >
        <X size={18} className="text-gray-400" />
      </button>
      <div className="bg-primary/10 mr-2 flex h-10 w-10 items-center justify-center rounded-full">
        <Globe2 size={20} className="text-primary" />
      </div>
      <div className="min-w-0 flex-1 pr-10">
        <div className="mb-1 text-xs font-medium text-gray-900">
          This blog post is also available in your preferred language.
        </div>
        <div className="mb-2 truncate text-xs text-gray-600">
          You can read the post titled{" "}
          <span className="font-semibold">"{alt.title}"</span> in{" "}
          <span className="font-semibold">
            {preferredLanguage.toUpperCase()}
          </span>{" "}
          language.
        </div>
        <Link
          to={`/${alt.slug}`}
          className="bg-primary hover:bg-primary-dark inline-block rounded px-4 py-2 text-xs font-semibold text-white shadow transition"
        >
          Switch to {preferredLanguage.toUpperCase()}
        </Link>
      </div>
    </div>
  );
}
