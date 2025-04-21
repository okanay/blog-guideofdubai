import { format } from "date-fns";
import { enUS, tr } from "date-fns/locale";
import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useEditorContext } from "@/components/editor/store";

import {
  BlogListHeader,
  BlogTable,
  Pagination,
  LoadingState,
  EmptyState,
  DeleteModal,
  BlogFilters,
} from "@/components/editor/pages/list";

export const Route = createFileRoute("/$lang/_auth/_editor/editor/list")({
  component: BlogListPage,
});

function BlogListPage() {
  // State yönetimi
  const [selectedId, setSelectedId] = useState<string>("empty");
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  // Context'ten verileri ve fonksiyonları alma
  const {
    fetchedBlogs,
    visibleBlogIds,
    totalBlogCount,
    lastFetchCount,
    hasMoreBlogs,
    statusStates: { blogPosts },
    blogPostsQuery,
    setBlogPostsQuery,
    fetchBlogPosts,
    changeBlogStatus,
    deleteBlog,
  } = useEditorContext();

  const limit = blogPostsQuery.limit || 10;
  const currentPage = Math.floor((blogPostsQuery.offset || 0) / limit);
  const startIndex = currentPage * limit;
  const endIndex = startIndex + limit;
  const totalPages = Math.ceil(totalBlogCount / limit);
  const pageVisibleIds = visibleBlogIds.slice(startIndex, endIndex);

  // ID'lere göre blog nesnelerini al
  const visibleBlogs = pageVisibleIds
    .map((id) => fetchedBlogs[id])
    .filter(Boolean);

  // Sayfa yükleme durumlarını belirleyen değişkenler
  const isLoading = blogPosts.loading;
  const isEmpty = !isLoading && totalBlogCount === 0;
  const hasData = !isLoading && totalBlogCount > 0;

  // Sayfa ilk yüklendiğinde verileri getir
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  // Sayfa değiştirme fonksiyonları
  const handleNextPage = () => {
    if (isLoading || !hasMoreBlogs) return;

    // Sonraki sayfa için offset değerini hesapla
    const newOffset =
      (blogPostsQuery.offset || 0) + (blogPostsQuery.limit || 10);
    setBlogPostsQuery({ offset: newOffset });
    fetchBlogPosts();
  };

  const handlePreviousPage = () => {
    if (isLoading || (blogPostsQuery.offset || 0) <= 0) return;

    // Önceki sayfa için offset değerini hesapla
    const newOffset = Math.max(
      0,
      (blogPostsQuery.offset || 0) - (blogPostsQuery.limit || 10),
    );
    setBlogPostsQuery({ offset: newOffset });
    fetchBlogPosts();
  };

  const handleRefresh = () => {
    // Yenileme işleminde offset'i sıfırla ve temiz veri getir
    setBlogPostsQuery({ offset: 0 });
    fetchBlogPosts();
  };

  const handleApplyFilters = () => {
    // Filtre uygulandığında yeni veri getir
    // Offset otomatik olarak sıfırlanacak
    fetchBlogPosts();
  };

  const handleResetFilters = () => {
    // Filtreler sıfırlandığında yeni veri getir
    fetchBlogPosts();
  };

  const formatDate = (dateStr: string, lang: string = "tr") => {
    try {
      const date = new Date(dateStr);
      return format(date, "d MMM yyyy HH:mm", {
        locale: lang === "tr" ? tr : enUS,
      });
    } catch (e) {
      return dateStr;
    }
  };

  const handleDeleteBlog = async () => {
    try {
      const success = await deleteBlog(selectedId);
      if (success) {
        setSelectedId("empty");
        setDeleteModalOpen(false);
      }
    } finally {
      setSelectedId("empty");
      setDeleteModalOpen(false);
    }
  };

  const openDeleteModal = (id: string) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Komponenti */}
      <BlogListHeader onRefresh={handleRefresh} isLoading={isLoading} />

      <main className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <BlogFilters
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
            isLoading={isLoading}
          />
          <div>
            {/* Blog sayısı ve yükleme durumu */}
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-zinc-500">
                {totalBlogCount > 0
                  ? `${totalBlogCount} blog bulundu (${visibleBlogs.length} gösteriliyor)`
                  : "Blog bulunamadı"}
              </p>
              <div className="text-sm text-zinc-500">
                {isLoading ? "Yükleniyor..." : ""}
              </div>
            </div>

            {/* Duruma göre render etme */}
            {isLoading && visibleBlogs.length === 0 && <LoadingState />}

            {isEmpty && <EmptyState />}

            {hasData && (
              <>
                {/* Blog Tablosu */}
                <BlogTable
                  blogs={visibleBlogs}
                  onChangeStatus={changeBlogStatus}
                  onDeleteClick={openDeleteModal}
                  formatDate={formatDate}
                />

                {/* Sayfalama */}
                <Pagination
                  total={totalBlogCount}
                  offset={blogPostsQuery.offset || 0}
                  limit={blogPostsQuery.limit || 10}
                  currentCount={visibleBlogs.length}
                  onPrevious={handlePreviousPage}
                  onNext={handleNextPage}
                  isLoading={isLoading}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  hasMoreBlogs={hasMoreBlogs}
                  lastFetchCount={lastFetchCount}
                />
              </>
            )}

            {/* Silme Modalı */}
            <DeleteModal
              isOpen={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              onConfirm={handleDeleteBlog}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
