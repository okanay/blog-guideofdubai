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

  // Context'ten verileri alma
  const {
    fetchedBlogs,
    visibleBlogIds,
    totalBlogCount,
    statusStates: { blogPosts },
    blogPostsQuery,
  } = useEditorContext();

  const limit = blogPostsQuery.limit || 10;
  const startIndex = blogPostsQuery.offset || 0;
  const endIndex = startIndex + limit;
  const pageVisibleIds = visibleBlogIds.slice(0, endIndex - startIndex);

  // ID'lere göre blog nesnelerini al
  const visibleBlogs = pageVisibleIds
    .map((id) => fetchedBlogs[id])
    .filter(Boolean);

  // Sayfa yükleme durumlarını belirleyen değişkenler
  const isLoading = blogPosts.loading;
  const isEmpty = !isLoading && totalBlogCount === 0;
  const hasData = !isLoading && totalBlogCount > 0;

  const openDeleteModal = (id: string) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Komponenti */}
      <BlogListHeader />

      <main className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <BlogFilters />
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
                  onDeleteClick={openDeleteModal}
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
          </div>
        </div>
      </main>
    </div>
  );
}
