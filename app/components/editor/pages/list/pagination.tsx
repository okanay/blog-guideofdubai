import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEditorContext } from "@/components/editor/store";

export function Pagination() {
  const {
    blogList,
    setBlogPostsQuery,
    fetchBlogPosts,
    statusStates: { blogPosts },
  } = useEditorContext();

  const isLoading = blogPosts.loading;
  const limit = blogList.query.limit || 10;
  const offset = blogList.query.offset || 0;
  const totalCount = blogList.totalCount || 0;

  // Toplam sayfa sayısı
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));
  // Şu anki sayfa (1-indexed)
  const currentPage = Math.floor(offset / limit) + 1;

  // Sonraki sayfa var mı?
  const canGoNext = currentPage < totalPages && !isLoading;
  // Önceki sayfa var mı?
  const canGoPrevious = currentPage > 1 && !isLoading;

  const handleNextPage = () => {
    setBlogPostsQuery({ offset: offset + limit });
    fetchBlogPosts();
  };

  const handlePreviousPage = () => {
    if (!canGoPrevious) return;
    setBlogPostsQuery({ offset: Math.max(0, offset - limit) });
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

      <div className="text-xs text-zinc-600">
        Sayfa <b>{currentPage}</b> / <b>{totalPages}</b>
        <span className="ml-2 text-zinc-400">({totalCount} kayıt)</span>
      </div>

      {/* Sonraki sayfa butonu */}
      <button
        onClick={handleNextPage}
        className="flex items-center justify-center rounded-lg border border-zinc-200 p-2 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
        title="Sonraki sayfa"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
