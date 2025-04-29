import { createFileRoute } from "@tanstack/react-router";
import { seoTranslations } from "@/i18n/languages";
import { useTranslation } from "react-i18next";
import { Link } from "@/i18n/link";
import { getLanguageFromSearch } from "@/i18n/action";

export const Route = createFileRoute("/blog/not-found")({
  loader: async ({ location: { search } }) => {
    const lang = getLanguageFromSearch(search);
    return { lang };
  },
  head: ({ loaderData: { lang } }) => {
    const seoData = seoTranslations[lang];
    return {
      meta: [
        {
          title: seoData.notFound.title,
        },
        {
          name: "description",
          content: seoData.notFound.description,
        },
      ],
    };
  },
  component: DefaultNotFound,
});

export function DefaultNotFound() {
  const { t } = useTranslation();

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden py-24">
      {/* Arkaplan gradient ve animasyonlu şekiller */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-zinc-50 to-zinc-100">
        <div className="animate-blob bg-primary-100 absolute -top-24 left-1/3 h-64 w-64 rounded-full opacity-70 mix-blend-multiply blur-xl filter"></div>
        <div className="animate-blob absolute top-24 -right-24 h-64 w-64 rounded-full bg-purple-100 opacity-70 mix-blend-multiply blur-xl filter delay-2000"></div>
        <div className="animate-blob absolute -bottom-32 left-10 h-64 w-64 rounded-full bg-pink-100 opacity-70 mix-blend-multiply blur-xl filter delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-2xl px-8 py-12 transition-all duration-300 sm:px-12 sm:py-16">
            <div className="mb-8 text-center">
              {/* 404 Animasyonlu Metin */}
              <h1 className="text-primary-600 relative mb-4 text-center font-sans text-[120px] leading-none font-black tracking-tight sm:text-[180px]">
                <span className="animate-pulse-slow text-primary-300">4</span>
                <span className="animate-float relative inline-block">
                  <svg
                    className="absolute inset-x-0 -top-1 mx-auto h-full w-full"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 200 200"
                    fill="none"
                  >
                    <circle
                      className="animate-pulse-slow"
                      cx="100"
                      cy="100"
                      r="80"
                      stroke="#E2E8F0"
                      strokeWidth="20"
                      strokeDasharray="5 5"
                    />
                  </svg>
                  <span className="relative z-10 text-zinc-200">0</span>
                </span>
                <span className="animate-pulse-slow text-primary-300">4</span>
              </h1>

              {/* İçerik Başlık */}
              <h2 className="mb-3 text-center text-2xl font-bold text-zinc-800 sm:text-3xl">
                {t("not-found.title")}
              </h2>

              {/* Açıklama */}
              <p className="mx-auto mb-10 max-w-md text-center text-pretty text-zinc-600">
                {t("not-found.description")}
              </p>

              {/* Ana Sayfa Butonu */}
              <Link
                to="/"
                preload={false}
                className="group from-primary-600 to-primary-500 hover:shadow-primary-500/30 relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r p-0.5 text-lg font-medium text-white transition-opacity duration-300 hover:opacity-75 focus:outline-none"
              >
                <span className="bg-primary-600 group-hover:bg-opacity-0 relative flex items-center gap-2 rounded-full px-8 py-3.5 transition-all duration-300 ease-out">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("not-found.link")}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
