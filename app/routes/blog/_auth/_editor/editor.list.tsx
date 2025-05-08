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

export const Route = createFileRoute("/blog/_auth/_editor/editor/list")({
  component: BlogListPage,
});

function BlogListPage() {
  // State yönetimi
  const [selectedId, setSelectedId] = useState<string>("empty");
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  // Context'ten verileri alma (yeni blogList yapısı)
  const { blogList, fetchBlogPosts, addToFeatured, removeFromFeatured } =
    useEditorContext();

  useEffect(() => {
    fetchBlogPosts(true);
  }, []);

  const { filteredData, loading, totalCount } = blogList;

  // Sayfa yükleme durumları
  const isLoading = loading;
  const isEmpty = !isLoading && totalCount === 0;
  const hasData = !isLoading && totalCount > 0;

  const openDeleteModal = (id: string) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };

  const handleFeaturedToggle = async (
    blogId: string,
    currentStatus: boolean,
  ) => {
    const blog = blogList.originalData.find((b) => b.id === blogId);
    if (!blog) return;
    if (currentStatus) {
      await removeFromFeatured(blogId);
    } else {
      await addToFeatured(blogId, blog.language);
    }
    // Listeyi yenile
    fetchBlogPosts();
  };

  return (
    <main className="relative mx-auto w-full space-y-4 overflow-hidden px-4 sm:px-6 lg:px-8">
      <BlogListHeader />
      <BlogFilters />
      {/* Blog sayısı ve yükleme durumu */}
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          {totalCount > 0
            ? `${totalCount} blog bulundu (${filteredData.length} gösteriliyor)`
            : "Blog bulunamadı"}
        </p>
        <div className="text-sm text-zinc-500">
          {isLoading ? "Yükleniyor..." : ""}
        </div>
      </div>

      {/* Duruma göre render etme */}
      {isLoading && filteredData.length === 0 && <LoadingState />}

      {isEmpty && <EmptyState />}

      {hasData && (
        <>
          {/* Blog Tablosu */}
          <BlogTable
            blogs={filteredData}
            onDeleteClick={openDeleteModal}
            onFeaturedToggle={handleFeaturedToggle}
          />

          {/* Sayfalama */}
          <Pagination />
        </>
      )}

      {/* Silme Modalı */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        blogId={selectedId}
      />
    </main>
  );
}
