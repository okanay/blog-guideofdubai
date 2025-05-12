import { ACTIVE_LANGUAGE_DICTONARY } from "@/i18n/config";
import { Link } from "@/i18n/link";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock,
  CalendarDays,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { formatDate } from "../editor/helper";
import { BlogCard, BlogSkeleton } from "../main/blog-card";
import { useSnapScroll } from "@/hooks/use-snap-scroll";

// Related Blogs Component
export function RelatedBlogs({ blog, lang }) {
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

        const url = `${import.meta.env.VITE_APP_BACKEND_URL}/blog/related?blogId=${blog.id}&categories=${categories}&tags=${tags}&language=${lang}&limit=4`;

        const response = await fetch(url);
        const data = await response.json();

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

  const {
    containerRef,
    cardRefs,
    btnLeftRef,
    btnRightRef,
    handleScrollLeft,
    handleScrollRight,
  } = useSnapScroll({
    gap: 12,
    dependencies: [relatedBlogs],
  });

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
              <BlogSkeleton key={`blog_skeleton_${index}`} />
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
              onClick={() => handleScrollLeft()}
              className="border-primary-cover bg-primary absolute top-[50%] left-1 z-20 size-10 translate-y-[-50%] rounded-full border p-1 shadow-md transition-opacity duration-300 focus:outline-none aria-disabled:cursor-not-allowed aria-disabled:opacity-0"
            >
              <ChevronLeft className="text-color-primary size-full" />
            </button>

            <button
              ref={btnRightRef}
              aria-disabled="false"
              aria-label="Scroll Right"
              onClick={() => handleScrollRight()}
              className="border-primary-cover bg-primary absolute top-[50%] right-1 z-20 size-10 translate-y-[-50%] rounded-full border p-1 shadow-md transition-opacity duration-300 focus:outline-none aria-disabled:cursor-not-allowed aria-disabled:opacity-0"
            >
              <ChevronRight className="text-color-primary size-full" />
            </button>

            <ul
              ref={containerRef as any}
              style={{
                scrollbarWidth: "none",
                scrollBehavior: "smooth",
                overscrollBehavior: "contain",
              }}
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
                  className="w-[320px] max-w-[320px] flex-shrink-0 snap-center"
                >
                  <BlogCard blog={blog} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
