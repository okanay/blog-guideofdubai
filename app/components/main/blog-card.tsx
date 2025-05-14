// app/components/blog/blog-card.tsx
import { Link } from "@/i18n/link";
import { CalendarDays, Clock, Heart } from "lucide-react";
import { formatDate } from "@/utils/format-date";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/i18n/use-language";
import { twMerge } from "tailwind-merge";

interface BlogCardProps {
  blog: BlogPostCardView;
}

export function BlogCard({ blog }: BlogCardProps) {
  const { language } = useLanguage();
  const { t } = useTranslation();

  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white ring ring-zinc-50 transition-all hover:ring-zinc-300 hover:ring-offset-2 focus:ring-zinc-300 focus:ring-offset-2 focus:outline-none"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={
            blog.content.image ||
            "https://images.project-test.info/placeholder.webp"
          }
          alt={blog.content.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Category Badge - Eğer kategori varsa ilk kategoriyi göster */}
        {blog.categories && blog.categories.length > 0 && (
          <span className="absolute top-3 left-3 rounded-full border border-zinc-900 bg-zinc-900/80 px-2 py-1 text-[0.6rem] font-medium text-zinc-100 backdrop-blur-sm">
            <CategoryBadge
              name={blog.categories[0].name}
              value={blog.categories[0].value}
            />
          </span>
        )}
      </div>
      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-3 line-clamp-2 text-xl font-semibold">
          {blog.content.title}
        </h3>
        <p className="mb-5 line-clamp-3 flex-1 text-sm text-zinc-600">
          {blog.content.description}
        </p>
        {/* Footer info */}
        <div className="mt-auto flex items-center justify-between">
          <span className="mr-3 text-sm font-medium">
            {t(`common.languages.${blog.language}`, blog.language)}
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <Clock size={12} />
              {blog.content.readTime || 3} {t("main.sections.common.min_read")}
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <CalendarDays size={12} />
              {formatDate(blog.createdAt, language)}
            </span>
            {blog.stats && (
              <span className="flex items-center gap-1 text-xs text-zinc-500">
                <Heart size={12} />
                {blog.stats.likes || 0}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function CategoryBadge({
  name,
  value,
}: {
  name: string;
  value: string;
}) {
  const { t } = useTranslation();
  const safeTranslatedCategory = t(`common.card.categories.${name}`, value);

  return safeTranslatedCategory;
}

export function TagBadge({ name, value }: { name: string; value: string }) {
  const { t } = useTranslation();
  const safeTranslatedTag = t(`common.card.tags.${name}`, value);

  return safeTranslatedTag;
}

// Skeleton loading component
export function BlogSkeleton() {
  return (
    <div className="flex animate-pulse flex-col rounded-lg border border-zinc-200 bg-white">
      {/* Image skeleton */}
      <div className="h-48 w-full bg-zinc-200"></div>

      {/* Content skeleton */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 h-6 w-3/4 rounded bg-zinc-200"></div>
        <div className="mb-2 h-4 w-full rounded bg-zinc-200"></div>
        <div className="mb-5 h-4 w-2/3 rounded bg-zinc-200"></div>

        {/* Footer info skeleton */}
        <div className="mt-auto flex items-center justify-between">
          <div className="h-4 w-16 rounded bg-zinc-200"></div>
          <div className="flex gap-2">
            <div className="h-4 w-12 rounded bg-zinc-200"></div>
            <div className="h-4 w-14 rounded bg-zinc-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
