import { useEffect, useRef } from "react";
import { useSearch } from "./store";
import { Link } from "@/i18n/link";
import { Clock, Search, X } from "lucide-react";
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
      className="absolute right-0 left-0 z-50 mt-1 max-h-[70vh] overflow-auto rounded-lg border border-zinc-200 bg-white shadow-lg"
    >
      {/* Başlık */}
      <div className="sticky top-0 border-b border-zinc-100 bg-white">
        <div className="flex items-center justify-between p-3">
          <div>
            {searchQuery.title ? (
              <div className="text-sm">
                <span className="font-medium text-zinc-800">
                  "{searchQuery.title}"
                </span>
                <span className="ml-1 text-zinc-500">
                  için {totalResults} sonuç
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
            className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Yükleniyor */}
      {isLoading && searchResults.length === 0 && (
        <div className="flex h-32 items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="border-t-primary-600 h-5 w-5 animate-spin rounded-full border-2 border-zinc-300"></div>
            <span className="text-sm text-zinc-600">Arama yapılıyor...</span>
          </div>
        </div>
      )}

      {/* Sonuç bulunamadı */}
      {searchResults.length === 0 && !isLoading && searchQuery.title && (
        <div className="flex h-32 flex-col items-center justify-center gap-2 p-4 text-center">
          <Search size={24} className="text-zinc-400" />
          <p className="text-sm text-zinc-600">
            "{searchQuery.title}" için sonuç bulunamadı
          </p>
        </div>
      )}

      {/* Hata durumu */}
      {searchStatus.error && !isLoading && (
        <div className="flex h-32 flex-col items-center justify-center gap-2 p-4 text-center">
          <X size={24} className="text-red-500" />
          <p className="text-sm text-zinc-600">
            Arama yapılırken bir sorun oluştu
          </p>
          <p className="text-xs text-red-500">{searchStatus.error}</p>
        </div>
      )}

      {/* Sonuçlar tablosu */}
      {searchResults.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium tracking-wider whitespace-nowrap text-zinc-500 uppercase">
                  Blog
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium tracking-wider whitespace-nowrap text-zinc-500 uppercase">
                  Dil
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium tracking-wider whitespace-nowrap text-zinc-500 uppercase">
                  Tarih
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium tracking-wider whitespace-nowrap text-zinc-500 uppercase">
                  Okuma
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {searchResults.map((blog) => (
                <tr key={blog.id} className="hover:bg-zinc-50">
                  <td className="max-w-md px-4 py-2.5 whitespace-nowrap">
                    <Link
                      to={`/blog/${blog.slug}`}
                      onClick={closeDropdown}
                      className="group flex items-center"
                    >
                      {/* Küçük resim */}
                      <div className="h-8 w-8 shrink-0 overflow-hidden rounded">
                        {blog.content.image ? (
                          <img
                            src={blog.content.image}
                            alt=""
                            className="h-full w-full object-cover"
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
                      <p className="group-hover:text-primary-700 ml-2 max-w-xs truncate text-sm font-medium text-zinc-900">
                        {blog.content.title}
                      </p>
                    </Link>
                  </td>

                  <td className="px-4 py-2.5 text-sm whitespace-nowrap text-zinc-600">
                    {LANGUAGE_DICTONARY.find(
                      (lang) => lang.value === blog.language,
                    )?.label || blog.language}
                  </td>

                  <td className="px-4 py-2.5 text-sm whitespace-nowrap text-zinc-600">
                    {formatDate(blog.createdAt || "")}
                  </td>

                  <td className="px-4 py-2.5 text-sm whitespace-nowrap text-zinc-600">
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
      )}

      {/* Daha fazla yükleme */}
      {hasMoreResults && searchResults.length > 0 && (
        <div className="border-t border-zinc-100 p-2 text-center">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-1">
              <div className="border-t-primary-600 h-4 w-4 animate-spin rounded-full border-2 border-zinc-300"></div>
              <span className="text-xs text-zinc-600">Yükleniyor...</span>
            </div>
          ) : (
            <button
              onClick={loadMoreResults}
              className="w-full rounded py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-50"
            >
              Daha fazla sonuç göster
            </button>
          )}
        </div>
      )}

      {/* Filtreleme butonu */}
      <div className="sticky bottom-0 border-t border-zinc-100 bg-white p-2">
        <button
          onClick={openFilterModal}
          className="w-full rounded bg-zinc-100 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-200"
        >
          Filtreleri Düzenle
        </button>
      </div>
    </div>
  );
}
