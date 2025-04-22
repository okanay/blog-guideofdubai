import { useEffect, useRef } from "react";
import { useSearch } from "./store";
import { Link } from "@/i18n/link";
import { Clock, Search, X, ArrowRight } from "lucide-react";
import { LANGUAGE_DICTONARY } from "@/i18n/config";
import { formatDate } from "@/components/editor/helper";

export function SearchResultsDropdown() {
  const {
    isDropdownOpen,
    closeDropdown,
    searchResults,
    totalResults,
    hasMoreResults,
    loadMoreResults,
    searchStatus,
    searchQuery,
    openFilterModal,
  } = useSearch();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const isLoading = searchStatus.loading;

  // Dropdown dışına tıklandığında kapatma
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, closeDropdown]);

  // ESC tuşuyla kapatma
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDropdown();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen, closeDropdown]);

  if (!isDropdownOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="animate-in fade-in-0 slide-in-from-top-4 absolute right-0 left-0 z-50 mt-2 max-h-[75vh] overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl transition-all duration-300"
    >
      {/* Başlık */}
      <div className="sticky top-0 z-10 border-b border-zinc-100 bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between p-3">
          <div>
            {searchQuery.title ? (
              <div className="text-sm font-medium text-zinc-800">
                <span className="text-primary-600">"{searchQuery.title}"</span>
                <span className="ml-1.5 text-zinc-500">
                  için{" "}
                  <span className="font-semibold text-zinc-700">
                    {totalResults}
                  </span>{" "}
                  sonuç
                </span>
              </div>
            ) : (
              <div className="text-sm text-zinc-500">
                Arama yapmak için yukarıdaki arama kutusunu kullanın
              </div>
            )}
          </div>
          <button
            onClick={closeDropdown}
            className="rounded-full p-1.5 text-zinc-400 transition-colors duration-200 hover:bg-zinc-100 hover:text-zinc-600 active:bg-zinc-200"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="max-h-[calc(75vh-120px)] overflow-auto">
        {/* Yükleniyor */}
        {isLoading && searchResults.length === 0 && (
          <div className="flex h-44 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 h-full w-full rounded-full border-2 border-zinc-100 opacity-75"></div>
                <div className="border-primary-500 absolute inset-0 h-full w-full animate-spin rounded-full border-t-2"></div>
              </div>
              <span className="text-sm font-medium text-zinc-600">
                Arama yapılıyor...
              </span>
            </div>
          </div>
        )}

        {/* Sonuç bulunamadı */}
        {searchResults.length === 0 && !isLoading && searchQuery.title && (
          <div className="flex h-44 flex-col items-center justify-center gap-3 p-4 text-center">
            <div className="rounded-full bg-zinc-100 p-3">
              <Search size={22} className="text-zinc-400" />
            </div>
            <div>
              <p className="font-medium text-zinc-700">
                "{searchQuery.title}" için sonuç bulunamadı
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Farklı anahtar kelimelerle tekrar deneyin
              </p>
            </div>
          </div>
        )}

        {/* Hata durumu */}
        {searchStatus.error && !isLoading && (
          <div className="flex h-44 flex-col items-center justify-center gap-3 p-4 text-center">
            <div className="rounded-full bg-red-50 p-3">
              <X size={22} className="text-red-500" />
            </div>
            <div>
              <p className="font-medium text-zinc-700">
                Arama yapılırken bir sorun oluştu
              </p>
              <p className="mt-1 text-sm text-red-500">{searchStatus.error}</p>
            </div>
          </div>
        )}

        {/* Sonuçlar - Mobil ve Masaüstü için ayrı görünümler */}
        {searchResults.length > 0 && (
          <>
            {/* Mobil görünüm */}
            <div className="divide-y divide-zinc-100 md:hidden">
              {searchResults.map((blog) => (
                <div
                  key={blog.id}
                  className="group relative transition-colors duration-200 hover:bg-zinc-50"
                >
                  <Link
                    to={`/blog/${blog.slug}`}
                    onClick={closeDropdown}
                    className="block p-3"
                  >
                    <div className="flex items-start gap-3">
                      {/* Küçük resim */}
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md">
                        {blog.content.image ? (
                          <img
                            src={blog.content.image}
                            alt=""
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-zinc-100">
                            <span className="text-[10px] text-zinc-400">
                              Resim
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-1">
                        {/* Başlık */}
                        <p className="group-hover:text-primary-600 line-clamp-2 font-medium text-zinc-900">
                          {blog.content.title}
                        </p>

                        {/* Alt bilgiler */}
                        <div className="flex items-center gap-3 text-xs text-zinc-500">
                          <span className="flex items-center gap-1">
                            <Clock size={10} />
                            {blog.content.readTime} dk
                          </span>
                          <span>
                            {LANGUAGE_DICTONARY.find(
                              (lang) => lang.value === blog.language,
                            )?.label || blog.language}
                          </span>
                          <span>{formatDate(blog.createdAt || "")}</span>
                        </div>
                      </div>

                      <div className="absolute top-1/2 right-3 -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <ArrowRight size={16} className="text-primary-500" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Masaüstü görünüm - Tablo */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="sticky top-0 bg-zinc-50/80 backdrop-blur-sm">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-xs font-medium tracking-wider whitespace-nowrap text-zinc-500 uppercase">
                        Blog
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium tracking-wider whitespace-nowrap text-zinc-500 uppercase">
                        Dil
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium tracking-wider whitespace-nowrap text-zinc-500 uppercase">
                        Tarih
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-medium tracking-wider whitespace-nowrap text-zinc-500 uppercase">
                        Okuma
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {searchResults.map((blog) => (
                      <tr
                        key={blog.id}
                        className="group transition-colors duration-200 hover:bg-zinc-50"
                      >
                        <td className="max-w-md px-4 py-3 whitespace-nowrap">
                          <Link
                            to={`/blog/${blog.slug}`}
                            onClick={closeDropdown}
                            className="group flex items-center"
                          >
                            {/* Küçük resim */}
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md">
                              {blog.content.image ? (
                                <img
                                  src={blog.content.image}
                                  alt=""
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-zinc-100">
                                  <span className="text-[8px] text-zinc-400">
                                    Resim
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Başlık */}
                            <p className="group-hover:text-primary-600 ml-3 max-w-xs truncate text-sm font-medium text-zinc-900 transition-colors duration-200">
                              {blog.content.title}
                            </p>
                          </Link>
                        </td>

                        <td className="px-4 py-3 text-sm whitespace-nowrap text-zinc-600">
                          {LANGUAGE_DICTONARY.find(
                            (lang) => lang.value === blog.language,
                          )?.label || blog.language}
                        </td>

                        <td className="px-4 py-3 text-sm whitespace-nowrap text-zinc-600">
                          {formatDate(blog.createdAt || "")}
                        </td>

                        <td className="px-4 py-3 text-sm whitespace-nowrap text-zinc-600">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {blog.content.readTime} dk
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Daha fazla yükleme */}
        {hasMoreResults && searchResults.length > 0 && (
          <div className="border-t border-zinc-100 p-3 text-center">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-1">
                <div className="border-t-primary-500 h-4 w-4 animate-spin rounded-full border-2 border-zinc-200"></div>
                <span className="text-xs font-medium text-zinc-600">
                  Yükleniyor...
                </span>
              </div>
            ) : (
              <button
                onClick={loadMoreResults}
                className="w-full rounded-md bg-zinc-50 py-2 text-xs font-medium text-zinc-700 transition-colors duration-200 hover:bg-zinc-100 active:bg-zinc-200"
              >
                Daha fazla sonuç göster
              </button>
            )}
          </div>
        )}
      </div>

      {/* Filtreleme butonu */}
      <div className="sticky bottom-0 border-t border-zinc-100 bg-white p-3 shadow-md">
        <button
          onClick={openFilterModal}
          className="bg-primary-50 text-primary-600 hover:bg-primary-100 active:bg-primary-200 w-full rounded-md py-2 text-xs font-medium transition-colors duration-200"
        >
          Filtreleri Düzenle
        </button>
      </div>
    </div>
  );
}
