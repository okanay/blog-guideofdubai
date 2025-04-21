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
    blogPosts,
    blogPostsTotal,
    blogPostsStatus,
    blogPostsQuery,
    setBlogPostsQuery,
    fetchBlogPosts,
    changeBlogStatus,
    deleteBlog,
  } = useEditorContext();

  // Sayfa yükleme durumlarını belirleyen değişkenler
  const isLoading = blogPostsStatus.loading;
  const isEmpty = !isLoading && blogPostsTotal === 0;
  const hasData = !isLoading && blogPostsTotal > 0;

  // Sayfa değiştirme fonksiyonları
  const handleNextPage = () => {
    if (isLoading) return;
    const newOffset =
      (blogPostsQuery.offset || 0) + (blogPostsQuery.limit || 10);
    setBlogPostsQuery({ offset: newOffset });
    fetchBlogPosts();
  };

  const handlePreviousPage = () => {
    if ((blogPostsQuery.offset || 0) > 0) {
      const newOffset = Math.max(
        0,
        (blogPostsQuery.offset || 0) - (blogPostsQuery.limit || 10),
      );
      setBlogPostsQuery({ offset: newOffset });
      fetchBlogPosts();
    }
  };

  // Yenileme işlemi
  const handleRefresh = () => {
    setBlogPostsQuery({ offset: 0 });
    fetchBlogPosts();
  };

  const handleApplyFilters = () => {
    fetchBlogPosts();
  };

  // Filtreleri sıfırlama işlemi
  const handleResetFilters = () => {
    fetchBlogPosts();
  };

  // Tarih formatla
  const formatDate = (dateStr: string, lang: string = "tr") => {
    try {
      const date = new Date(dateStr);
      return format(date, "d MMM yyyy", { locale: lang === "tr" ? tr : enUS });
    } catch (e) {
      return dateStr;
    }
  };

  // Silme işlemi
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

  // Silme modalını açma
  const openDeleteModal = (id: string) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };

  // Blog listesini başlangıçta yükle
  useEffect(() => {
    fetchBlogPosts();
  }, []);

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
                {blogPostsTotal > 0
                  ? `${blogPostsTotal} blog bulundu`
                  : "Blog bulunamadı"}
              </p>
              <div className="text-sm text-zinc-500">
                {isLoading ? "Yükleniyor..." : ""}
              </div>
            </div>

            {/* Duruma göre render etme */}
            {isLoading && <LoadingState />}

            {isEmpty && <EmptyState />}

            {hasData && (
              <>
                {/* Blog Tablosu */}
                <BlogTable
                  blogs={blogPosts}
                  onChangeStatus={changeBlogStatus}
                  onDeleteClick={openDeleteModal}
                  formatDate={formatDate}
                />

                {/* Sayfalama */}
                <Pagination
                  total={blogPostsTotal}
                  offset={blogPostsQuery.offset || 0}
                  limit={blogPostsQuery.limit || 10}
                  currentCount={blogPosts.length}
                  onPrevious={handlePreviousPage}
                  onNext={handleNextPage}
                  isLoading={isLoading}
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
