import { BookOpenText } from "lucide-react";
import { BlogSearchBar } from "./search";
import { Link } from "@/i18n/link";
import { useLatestBlog } from "./search/store";
import { useTranslation } from "react-i18next";

function BackgroudGradient() {
  return (
    <div className="to-primary-50/70 fixed top-0 left-0 -z-10 h-[125vh] w-full bg-gradient-to-t from-sky-50 via-zinc-50" />
  );
}

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <>
      <BackgroudGradient />
      <section id="#hero">
        <div className="relative z-21 mx-auto max-w-7xl px-4">
          <div className="mx-auto flex w-full max-w-xl flex-col gap-6 md:items-center md:justify-center md:text-center">
            <LatestBlogButton />
            <h1 className="text-5xl sm:text-6xl">{t("main.hero.title")}</h1>
            <p className="text-base sm:text-lg">{t("main.hero.description")}</p>
            <BlogSearchBar />
          </div>
        </div>
      </section>
    </>
  );
}

export function LatestBlogButton() {
  const { t } = useTranslation();
  const { latestBlog, loading } = useLatestBlog();

  const slug = latestBlog?.slug || "";

  return (
    <div className="relative">
      <Link
        to={`/${slug}`}
        className="flex w-fit items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-1 text-xs font-medium tracking-wide shadow-inner ring shadow-zinc-200/5 ring-zinc-200 ring-offset-2 transition-all duration-300 hover:bg-zinc-100 hover:shadow-md active:scale-95 disabled:cursor-wait disabled:opacity-70"
        aria-disabled={loading}
        onClick={loading ? (e) => e.preventDefault() : undefined}
      >
        {t("main.hero.button")}
        <BookOpenText className="text-primary-dark size-3 translate-y-[0.5px]" />
      </Link>
    </div>
  );
}
