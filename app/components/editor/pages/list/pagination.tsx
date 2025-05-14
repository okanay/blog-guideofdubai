import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEditorContext } from "@/components/editor/store";

export function Pagination() {
  const {
    blogList,
    goToPage,
    setBlogPostsQuery,
    statusStates: { blogPosts },
  } = useEditorContext();

  const isLoading = blogPosts.loading;
  const limit = blogList.query.limit || 10;
  const totalCount = blogList.totalCount || 0;
  const totalPages =
    blogList.totalPages || Math.max(1, Math.ceil(totalCount / limit));
  const currentPage = blogList.currentPage || 1;

  // Sonraki ve önceki sayfa kontrolü
  const canGoNext = currentPage < totalPages && !isLoading;
  const canGoPrevious = currentPage > 1 && !isLoading;

  // Sayfa değiştirme işleyicileri
  const handleNextPage = () => {
    if (!canGoNext) return;
    goToPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (!canGoPrevious) return;
    goToPage(currentPage - 1);
  };

  // Belirli bir sayfaya gitme işleyicisi
  const handlePageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const page = parseInt(e.target.value, 10);
    goToPage(page);
  };

  // Limit değiştirme işleyicisi
  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    setBlogPostsQuery({ limit: newLimit, offset: 0 });
  };

  // Sayfa başına gösterim seçenekleri
  const limitOptions = [1, 5, 8, 10, 20, 50, 100];

  // Sayfa numarası seçimi için sayfa numaraları
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Çok fazla sayfa varsa, aralık göster
  const getPageOptions = () => {
    if (totalPages <= 10) {
      return pageNumbers;
    }

    // Sayfa sayısı fazlaysa, mantıklı bir aralık göster
    const pages = [];
    // İlk 3 sayfa
    for (let i = 1; i <= Math.min(3, totalPages); i++) {
      pages.push(i);
    }

    // Mevcut sayfaya yakın sayfalar
    const startPage = Math.max(4, currentPage - 1);
    const endPage = Math.min(totalPages - 3, currentPage + 1);

    if (startPage > 3) {
      pages.push(-1); // Ayırıcı
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i > 3 && i < totalPages - 2) {
        pages.push(i);
      }
    }

    if (endPage < totalPages - 3) {
      pages.push(-2); // Ayırıcı
    }

    // Son 3 sayfa
    for (let i = Math.max(totalPages - 2, 4); i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="border-primary-100 flex flex-col justify-between gap-5 border-t pt-8 pb-8 md:flex-row md:items-center">
      <div className="flex items-center justify-between gap-3 md:justify-start">
        {/* Önceki sayfa butonu */}
        <button
          onClick={handlePreviousPage}
          disabled={!canGoPrevious}
          className="text-primary hover:bg-primary-50 hover:text-primary-700 disabled:hover:text-primary flex h-9 w-9 items-center justify-center rounded-full bg-white transition-all disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
          title="Önceki sayfa"
          aria-label="Önceki sayfa"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>

        {/* Sayfa seçici - Mobilde açılır menü, geniş ekranda sayfa düğmeleri */}
        <div className="hidden items-center gap-1.5 md:flex">
          {getPageOptions().map((page, index) => {
            if (page < 0) {
              // Ayırıcı göster
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="text-primary-400 px-1"
                >
                  •••
                </span>
              );
            }

            return (
              <button
                key={`page-${page}`}
                onClick={() => goToPage(page)}
                disabled={page === currentPage || isLoading}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-all ${
                  page === currentPage
                    ? "bg-primary text-color-primary shadow-sm"
                    : "text-primary-800 hover:bg-primary-50 hover:text-primary-700 bg-white"
                }`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Mobil için sayfa seçici dropdown */}
        <div className="flex items-center md:hidden">
          <select
            value={currentPage}
            onChange={handlePageChange}
            disabled={isLoading}
            className="text-primary-800 ring-primary-100 focus:ring-primary-300 h-9 rounded-full border-none bg-white px-3 text-sm font-medium shadow-sm ring-1 focus:ring-2 focus:outline-none"
            aria-label="Sayfa seçin"
          >
            {pageNumbers.map((page) => (
              <option key={`select-page-${page}`} value={page}>
                Sayfa {page}
              </option>
            ))}
          </select>
        </div>

        {/* Sonraki sayfa butonu */}
        <button
          onClick={handleNextPage}
          disabled={!canGoNext}
          className="text-primary hover:bg-primary-50 hover:text-primary-700 disabled:hover:text-primary flex h-9 w-9 items-center justify-center rounded-full bg-white transition-all disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
          title="Sonraki sayfa"
          aria-label="Sonraki sayfa"
        >
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 md:justify-end">
        {/* Sayfa başına gösterim sayısı seçici */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="pageSize"
            className="text-primary-700 text-xs font-medium"
          >
            Sayfa başına:
          </label>
          <select
            id="pageSize"
            value={limit}
            onChange={handleLimitChange}
            disabled={isLoading}
            className="text-primary-800 ring-primary-100 focus:ring-primary-300 h-8 w-16 appearance-none rounded-full border-none bg-white text-center text-sm font-medium shadow-sm ring-1 focus:ring-2 focus:outline-none"
            aria-label="Sayfa başına gösterilecek öğe sayısı"
          >
            {limitOptions.map((option) => (
              <option key={`limit-${option}`} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Sayfa ve toplam bilgisi */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-primary-600">Sayfa</span>
          <span className="text-primary-800 font-semibold">{currentPage}</span>
          <span className="text-primary-400">/</span>
          <span className="text-primary-800 font-semibold">{totalPages}</span>
          <span className="bg-primary-50 text-primary-600 ml-1.5 rounded-full px-2 py-0.5 text-xs font-medium">
            {totalCount} kayıt
          </span>
        </div>
      </div>
    </div>
  );
}
