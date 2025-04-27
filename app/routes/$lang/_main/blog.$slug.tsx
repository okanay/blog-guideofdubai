import { RenderJSON } from "@/components/editor/tiptap/renderer";
import { BlogTOC } from "@/components/editor/tiptap/renderer/toc";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CalendarDays,
  AlertTriangle,
} from "lucide-react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/link";
import { formatDate } from "@/components/editor/helper";
import { LANGUAGE_DICTONARY } from "@/i18n/config";

// Blog sayfasının ana route tanımlaması
export const Route = createFileRoute("/$lang/_main/blog/$slug")({
  loader: async ({ params }) => {
    const slug = params.slug;
    const lang = params.lang;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_BACKEND_URL}/blog?slug=${slug}&lang=${lang}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();
      if (data.blog === null || data.blog === undefined) {
        throw redirect({ replace: true, to: `/${lang}/not-found` });
      }

      return {
        lang,
        slug,
        blog: data.blog,
      };
    } catch (error) {
      throw redirect({ replace: true, to: `/${lang}/not-found` });
    }
  },
  head: ({ loaderData: { blog } }) => {
    return {
      meta: [
        {
          charSet: "utf-8",
        },
      ],
    };
  },
  component: BlogPage,
});

function BlogPage() {
  const { blog, lang } = Route.useLoaderData();

  return (
    <div className="flex flex-col">
      <main className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
        {/* İçerik */}
        <article className="prose max-w-5xl flex-1">
          <RenderJSON json={JSON.parse(blog.content.json) || {}} />
        </article>
        {/* TOC */}
        <aside className="hidden w-64 flex-shrink-0 lg:block">
          <BlogTOC htmlContainerSelector=".prose" />
        </aside>
      </main>

      {/* İlgili Bloglar Bölümü */}
      <RelatedBlogs blog={blog} lang={lang} />
    </div>
  );
}

// İlgili Bloglar Komponenti
function RelatedBlogs({ blog, lang }) {
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);
  const btnLeftRef = useRef(null);
  const btnRightRef = useRef(null);
  const cardRefs = useRef([]);

  // İlgili blogları API'den çekme
  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      if (!blog?.id) return;

      try {
        setIsLoading(true);
        setError(null);

        // Blog kategorileri ve etiketleri parametrelere dönüştür
        const categories = blog.categories?.map((c) => c.name).join(",") || "";
        const tags = blog.tags?.map((t) => t.name).join(",") || "";

        const url = `${import.meta.env.VITE_APP_BACKEND_URL}/blog/related?blogId=${blog.id}&categories=${categories}&tags=${tags}&language=${lang}&limit=8`;

        const response = await fetch(url);
        const data = await response.json();

        console.log(data);

        if (data.success && data.blogs) {
          setRelatedBlogs(data.blogs);
        } else {
          setRelatedBlogs([]);
        }
      } catch (err) {
        console.error("İlgili bloglar yüklenirken hata:", err);
        setError("İlgili blogları yüklerken bir sorun oluştu");
        setRelatedBlogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedBlogs();
  }, [blog?.id, lang]);

  // Kaydırma fonksiyonları
  const handleButtonClick = (direction) => {
    if (!containerRef.current || cardRefs.current.length === 0) return;

    // İlk kartın genişliği ve margin değerini al
    const firstCard = cardRefs.current[0];
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const cardMargin = 12; // gap-3 className'inden gelen değer
    const scrollAmount = cardWidth + cardMargin;

    const scrollOffset = direction === "Left" ? -scrollAmount : scrollAmount;
    const currentScroll = containerRef.current.scrollLeft;

    // Scroll sınırlarını kontrol et
    const maxScroll =
      containerRef.current.scrollWidth - containerRef.current.clientWidth;
    const targetScroll = currentScroll + scrollOffset;

    // Scroll değerini sınırlar içinde tut
    const boundedScroll = Math.max(0, Math.min(targetScroll, maxScroll));

    containerRef.current.scrollTo({
      left: boundedScroll,
      behavior: "smooth",
    });

    updateButtonState();
  };

  const updateButtonState = () => {
    if (!containerRef.current || !btnLeftRef.current || !btnRightRef.current)
      return;

    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    const isAtStart = scrollLeft <= 0;
    const isAtEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth;

    btnLeftRef.current.ariaDisabled = isAtStart.toString();
    btnRightRef.current.ariaDisabled = isAtEnd.toString();
  };

  // Scroll olaylarını dinleme
  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const handleScroll = () => {
      updateButtonState();
    };

    // Scroll event listener
    currentContainer.addEventListener("scroll", handleScroll);

    // Resize event listener için debounce fonksiyonu
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateButtonState();
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    updateButtonState();

    return () => {
      currentContainer.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
    };
  }, [relatedBlogs]);

  // İçerik yoksa gösterme
  if (!isLoading && relatedBlogs.length === 0 && !error) {
    return null;
  }

  return (
    <section className="border-t border-zinc-100 bg-zinc-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-l-primary-cover mb-6 flex items-center justify-between rounded border border-l-2 border-zinc-100 bg-zinc-100 px-4 py-2">
          <h2 className="text-2xl font-semibold">Related Posts</h2>
        </div>

        {/* Hata durumu */}
        {error && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <p className="mt-4 text-base text-zinc-600">{error}</p>
          </div>
        )}

        {/* Yükleme durumu */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <RelatedBlogSkeleton key={index} />
            ))}
          </div>
        )}

        {/* İlgili bloglar listesi */}
        {!isLoading && relatedBlogs.length > 0 && (
          <div className="relative">
            <button
              ref={btnLeftRef}
              aria-disabled="true"
              aria-label="Sola Kaydır"
              onClick={() => handleButtonClick("Left")}
              className="border-primary-cover bg-primary absolute top-[50%] left-1 z-20 size-10 translate-y-[-50%] rounded-full border p-1 shadow-md transition-opacity duration-300 focus:opacity-75 focus:outline-none aria-disabled:cursor-not-allowed aria-disabled:opacity-0"
            >
              <ChevronLeft className="text-color-primary size-full" />
            </button>

            <button
              ref={btnRightRef}
              aria-disabled="false"
              aria-label="Sağa Kaydır"
              onClick={() => handleButtonClick("Right")}
              className="border-primary-cover bg-primary absolute top-[50%] right-1 z-20 size-10 translate-y-[-50%] rounded-full border p-1 shadow-md transition-opacity duration-300 focus:opacity-75 focus:outline-none aria-disabled:cursor-not-allowed aria-disabled:opacity-0"
            >
              <ChevronRight className="text-color-primary size-full" />
            </button>

            <ul
              ref={containerRef}
              style={{ scrollbarWidth: "none" }}
              className="flex snap-x snap-mandatory flex-nowrap items-center justify-start gap-3 overflow-x-auto pb-4"
            >
              {relatedBlogs.map((blog, index) => (
                <li
                  key={blog.id}
                  ref={(el) => {
                    if (el) {
                      cardRefs.current[index] = el;
                    }
                  }}
                  className="w-[320px] max-w-[320px] flex-shrink-0"
                >
                  <RelatedBlogCard blog={blog} index={index} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

// İlgili Blog Kart Komponenti
function RelatedBlogCard({ blog, index }) {
  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white ring ring-zinc-50 transition-all hover:ring-zinc-300 hover:ring-offset-2 focus:ring-zinc-300 focus:ring-offset-2 focus:outline-none"
    >
      {/* Resim */}
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={
            blog.content?.image ||
            `https://images.project-test.info/${(index % 4) + 1}.webp`
          }
          alt={blog.content?.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* İçerik */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-3 line-clamp-2 text-xl font-semibold">
          {blog.content?.title}
        </h3>
        <p className="mb-5 line-clamp-2 flex-1 text-sm text-zinc-600">
          {blog.content?.description}
        </p>

        {/* Alt bilgiler */}
        <div className="flex items-center justify-between">
          <span className="mr-3 text-sm font-medium">
            {LANGUAGE_DICTONARY.find((l) => l.value === blog.language)?.label ||
              blog.language}
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <Clock size={12} />
              {blog.content?.readTime || 3} dk
            </span>
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <CalendarDays size={12} />
              {formatDate(blog.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// İskelet yükleme komponenti
function RelatedBlogSkeleton() {
  return (
    <div className="flex animate-pulse flex-col rounded-lg border border-zinc-200 bg-white">
      {/* Resim iskeleti */}
      <div className="h-48 w-full bg-zinc-200"></div>

      {/* İçerik iskeleti */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 h-6 w-3/4 rounded bg-zinc-200"></div>
        <div className="mb-2 h-4 w-full rounded bg-zinc-200"></div>
        <div className="mb-5 h-4 w-2/3 rounded bg-zinc-200"></div>

        {/* Alt bilgiler iskeleti */}
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

export default BlogPage;
