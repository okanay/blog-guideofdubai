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
  head: ({ loaderData: { blog, lang, slug } }) => {
    const API_URL = import.meta.env.VITE_APP_FRONTEND_URL || "http://localhost:3000"; // prettier-ignore
    const sitename = import.meta.env.VITE_APP_SITE_NAME || "Guide of Dubai"; // prettier-ignore

    // Metadata
    const metadata = blog?.metadata || {};
    const content = blog?.content || {};
    const blogLanguage = blog?.language || lang || "en";

    const url = `${API_URL}/${blogLanguage}/blog/${slug}`;

    const title = metadata.title ? `${metadata.title} | ${sitename}` : sitename;
    const description =  metadata.description || content.description || ""; // prettier-ignore
    const image = metadata.image || content.image || `https://images.project-test.info/1.webp`; // prettier-ignore
    const locale =  LANGUAGE_DICTONARY.find((l) => l.value === blog?.language)?.seo.locale || "en_US"; // prettier-ignore

    const tags = (blog.tags || []).map(
      (c: { value?: string }) => c.value || "Activities",
    );
    const categories = (blog.categories || []).map(
      (c: { value?: string }) => c.value || "Activities",
    );
    const keywords = [...tags, ...categories].join(", ");

    return {
      title,
      meta: [
        { charSet: "utf-8" },
        { title: title },
        { name: "description", content: description },
        { name: "keywords", content: keywords },
        { property: "og:type", content: "article" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: image },
        { property: "og:url", content: url },
        { property: "og:locale", content: locale },
        { property: "og:site_name", content: sitename },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      links: [
        {
          rel: "canonical",
          href: url,
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

// Related Blogs Component
function RelatedBlogs({ blog, lang }) {
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);
  const btnLeftRef = useRef(null);
  const btnRightRef = useRef(null);
  const cardRefs = useRef([]);

  // Fetch related blogs from the API
  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      if (!blog?.id) return;

      try {
        setIsLoading(true);
        setError(null);

        // Convert blog categories and tags into parameters
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
        console.error("Error while loading related blogs:", err);
        setError("An issue occurred while loading related blogs");
        setRelatedBlogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedBlogs();
  }, [blog?.id, lang]);

  // Scroll functions
  const handleButtonClick = (direction) => {
    if (!containerRef.current || cardRefs.current.length === 0) return;

    // Get the width and margin of the first card
    const firstCard = cardRefs.current[0];
    if (!firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const cardMargin = 12; // Value from the gap-3 className
    const scrollAmount = cardWidth + cardMargin;

    const scrollOffset = direction === "Left" ? -scrollAmount : scrollAmount;
    const currentScroll = containerRef.current.scrollLeft;

    // Check scroll boundaries
    const maxScroll =
      containerRef.current.scrollWidth - containerRef.current.clientWidth;
    const targetScroll = currentScroll + scrollOffset;

    // Keep the scroll value within bounds
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

  // Listen to scroll events
  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const handleScroll = () => {
      updateButtonState();
    };

    // Scroll event listener
    currentContainer.addEventListener("scroll", handleScroll);

    // Debounce function for resize event listener
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

  // Do not display if there is no content
  if (!isLoading && relatedBlogs.length === 0 && !error) {
    return null;
  }

  return (
    <section className="border-t border-zinc-100 bg-zinc-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="border-l-primary-cover mb-6 flex items-center justify-between rounded border border-l-2 border-zinc-100 bg-zinc-100 px-4 py-2">
          <h2 className="text-2xl font-semibold">Related Posts</h2>
        </div>

        {/* Error state */}
        {error && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <p className="mt-4 text-base text-zinc-600">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <RelatedBlogSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Related blogs list */}
        {!isLoading && relatedBlogs.length > 0 && (
          <div className="relative">
            <button
              ref={btnLeftRef}
              aria-disabled="true"
              aria-label="Scroll Left"
              onClick={() => handleButtonClick("Left")}
              className="border-primary-cover bg-primary absolute top-[50%] left-1 z-20 size-10 translate-y-[-50%] rounded-full border p-1 shadow-md transition-opacity duration-300 focus:opacity-75 focus:outline-none aria-disabled:cursor-not-allowed aria-disabled:opacity-0"
            >
              <ChevronLeft className="text-color-primary size-full" />
            </button>

            <button
              ref={btnRightRef}
              aria-disabled="false"
              aria-label="Scroll Right"
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

// Related Blog Card Component
function RelatedBlogCard({ blog, index }) {
  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white ring ring-zinc-50 transition-all hover:ring-zinc-300 hover:ring-offset-2 focus:ring-zinc-300 focus:ring-offset-2 focus:outline-none"
    >
      {/* Image */}
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

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-3 line-clamp-2 text-xl font-semibold">
          {blog.content?.title}
        </h3>
        <p className="mb-5 line-clamp-2 flex-1 text-sm text-zinc-600">
          {blog.content?.description}
        </p>

        {/* Footer info */}
        <div className="flex items-center justify-between">
          <span className="mr-3 text-sm font-medium">
            {LANGUAGE_DICTONARY.find((l) => l.value === blog.language)?.label ||
              blog.language}
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-xs text-zinc-500">
              <Clock size={12} />
              {blog.content?.readTime || 3} min
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

// Skeleton loading component
function RelatedBlogSkeleton() {
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

export default BlogPage;
