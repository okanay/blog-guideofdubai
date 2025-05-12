// app/routes/blog/_main/all.tsx
import { createFileRoute } from "@tanstack/react-router";
import { BlogSearchBar, useSearch } from "@/components/main/search";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { BlogCard } from "@/components/main/blog-card";
import { useLanguage } from "@/i18n/use-language";
import { useBlogList } from "@/components/main/search/store";

export const Route = createFileRoute("/blog/_main/all")({
  component: AllBlogsPage,
});

function AllBlogsPage() {
  const { language } = useLanguage();
  const { blogs, loading, initialLoading, hasMore, fetchBlogs, loadMoreBlogs } =
    useBlogList();

  // İlk yüklemede veya dil değiştiğinde blogları yükle
  useEffect(() => {
    fetchBlogs({
      isInitial: true,
      language,
      limit: 8,
      sortBy: "createdAt",
      sortDirection: "desc",
    });
  }, [language]);

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
          <BlogSearchBar placeholder="Search blog posts..." />
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
                      <span>Loading...</span>
                    </>
                  ) : (
                    <span>Show More</span>
                  )}
                </button>
              )}

              {!hasMore && blogs.length > 0 && (
                <p className="text-center text-zinc-500">
                  All blog posts loaded
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
