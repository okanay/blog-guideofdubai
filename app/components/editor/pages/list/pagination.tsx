import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEditorContext } from "@/components/editor/store";

export function Pagination() {
  const {
    totalBlogCount,
    hasMoreBlogs,
    lastFetchCount,
    statusStates: { blogPosts },
    blogPostsQuery,
    setBlogPostsQuery,
    fetchBlogPosts,
  } = useEditorContext();

  const isLoading = blogPosts.loading;
  const limit = blogPostsQuery.limit || 10;
  const offset = blogPostsQuery.offset || 0;
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(totalBlogCount / limit) || 1;
  const currentCount = lastFetchCount;

  // Next butonu aktif/pasif durumu kontrolü
  // 1. Son fetch işleminde limit'ten daha az veri geldiyse, başka veri kalmamıştır
  // 2. Yükleme durumundaysa buton devre dışı bırakılır
  const canGoNext = hasMoreBlogs && !isLoading;

  // Previous butonu aktif/pasif durumu kontrolü
  const canGoPrevious = offset > 0 && !isLoading;

  const handleNextPage = () => {
    if (isLoading || !hasMoreBlogs) return;

    // Sonraki sayfa için offset değerini hesapla
    const newOffset = offset + limit;
    setBlogPostsQuery({ offset: newOffset });
    fetchBlogPosts();
  };

  const handlePreviousPage = () => {
    if (isLoading || offset <= 0) return;

    // Önceki sayfa için offset değerini hesapla
    const newOffset = Math.max(0, offset - limit);
    setBlogPostsQuery({ offset: newOffset });
    fetchBlogPosts();
  };

  return (
    <div className="mt-4 flex items-center justify-between border-t border-zinc-200 pt-4">
      {/* Önceki sayfa butonu */}
      <button
        onClick={handlePreviousPage}
        disabled={!canGoPrevious}
        className="flex items-center justify-center rounded-lg border border-zinc-200 p-2 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
        title="Önceki sayfa"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Sonraki sayfa butonu */}
      <button
        onClick={handleNextPage}
        disabled={!canGoNext}
        className="flex items-center justify-center rounded-lg border border-zinc-200 p-2 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
        title="Sonraki sayfa"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
