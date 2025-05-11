// app/routes/blog/_main/all.tsx
import { createFileRoute } from "@tanstack/react-router";
import { SearchBarWithProvider } from "@/components/main/search";
import { useEffect, useState } from "react";
import { API_URL } from "@/components/editor/helper";
import { useLanguage } from "@/i18n/use-language";
import { Loader2 } from "lucide-react";
import { BlogCard } from "@/components/main/blog-card";

export const Route = createFileRoute("/blog/_main/all")({
  component: AllBlogsPage,
});

function AllBlogsPage() {
  const { language } = useLanguage();
  const [blogs, setBlogs] = useState<BlogPostCardView[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState({
    limit: 8,
    offset: 0,
  });

  useEffect(() => {
    fetchBlogs(true);
  }, [language]);

  const fetchBlogs = async (isInitial = false) => {
    if (isInitial) {
      setInitialLoading(true);
      setPagination({ limit: 8, offset: 0 });
    } else {
      setLoading(true);
    }

    try {
      const params = new URLSearchParams({
        language,
        limit: pagination.limit.toString(),
        offset: isInitial ? "0" : pagination.offset.toString(),
        sortBy: "createdAt",
        sortDirection: "desc",
      });

      const response = await fetch(`${API_URL}/blog/cards?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success && Array.isArray(data.blogs)) {
        if (isInitial) {
          setBlogs(data.blogs);
        } else {
          setBlogs((prevBlogs) => [...prevBlogs, ...data.blogs]);
        }

        // Daha fazla blog yüklenebilir mi?
        setHasMore(data.blogs.length >= pagination.limit);

        // Eğer başlangıç yüklemesi değilse offset'i güncelle
        if (!isInitial) {
          setPagination((prev) => ({
            ...prev,
            offset: prev.offset + prev.limit,
          }));
        } else {
          // İlk yükleme sonrası offset'i ayarla
          setPagination((prev) => ({
            ...prev,
            offset: prev.limit,
          }));
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Blog yüklenirken hata oluştu:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const loadMoreBlogs = () => {
    if (!loading && hasMore) {
      fetchBlogs(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 space-y-6">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">All Blog Posts</h1>
          <p className="mx-auto max-w-2xl text-zinc-600">
            Check out the latest and most comprehensive guides, places to visit,
            and tips about Dubai.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mx-auto max-w-2xl">
          <SearchBarWithProvider placeholder="Search blog posts..." />
        </div>
      </div>

      {/* Blog Card Grid */}
      {initialLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="text-primary h-12 w-12 animate-spin" />
            <p className="text-zinc-600">Loading blog posts...</p>
          </div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 p-8">
          <h3 className="mb-2 text-xl font-semibold text-zinc-800">
            No blog posts found
          </h3>
          <p className="text-center text-zinc-600">
            There are no blog posts published in this language yet.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>

          {/* Load More Button */}
          {blogs.length > 0 && (
            <div className="mt-10 flex justify-center">
              {hasMore && (
                <button
                  onClick={loadMoreBlogs}
                  disabled={loading}
                  className="from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r px-6 py-3 text-base font-medium text-white shadow-md transition-opacity duration-300 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Yükleniyor...</span>
                    </>
                  ) : (
                    <span>Daha Fazla Göster</span>
                  )}
                </button>
              )}

              {!hasMore && blogs.length > 0 && (
                <p className="text-center text-zinc-500">
                  Tüm blog yazıları yüklendi
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
