import { useEffect, useRef, useState } from "react";
import {
  X,
  ChevronDown,
  FilterIcon,
  FolderIcon,
  GlobeIcon,
  RefreshCcw,
  TagIcon,
  Loader2,
} from "lucide-react";
import { useSearch } from "./store";
import useClickOutside from "@/hooks/use-click-outside";
import { LANGUAGE_DICTONARY } from "@/i18n/config";

export function SearchFilterModal() {
  const {
    isFilterModalOpen,
    closeFilterModal,
    searchQuery,
    updateSearchQuery,
    search,
    categories,
    tags,
    statusStates,
  } = useSearch();

  // Düzenlenen filtreler için geçici state
  const [filters, setFilters] = useState({
    language: searchQuery.language || "",
    category: searchQuery.category || "",
    tag: searchQuery.tag || "",
  });

  // Filtre değişikliklerini yakala
  useEffect(() => {
    setFilters({
      language: searchQuery.language || "",
      category: searchQuery.category || "",
      tag: searchQuery.tag || "",
    });
  }, [searchQuery, isFilterModalOpen]);

  // Filtreleri uygula
  const applyFilters = () => {
    updateSearchQuery({
      language: filters.language,
      category: filters.category,
      tag: filters.tag,
    });

    if (searchQuery.title) {
      search();
    }

    closeFilterModal();
  };

  // Filtreleri sıfırla
  const handleReset = () => {
    setFilters({
      language: "",
      category: "",
      tag: "",
    });
  };

  const ref = useClickOutside<HTMLDivElement>(() => {
    closeFilterModal();
  });

  // Durum göstergeleri
  const isCategoriesLoading = statusStates.categories.status === "loading";
  const isTagsLoading = statusStates.tags.status === "loading";

  if (!isFilterModalOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <div ref={ref} className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-5 py-4">
          <h3 className="text-base font-medium text-zinc-900">Filtering</h3>
          <button
            onClick={closeFilterModal}
            className="text-zinc-400 hover:text-zinc-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-2">
          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <GlobeIcon size={16} className="text-zinc-500" />
              <label className="text-sm font-medium text-zinc-700">
                Language
              </label>
            </div>
            <div className="relative">
              <select
                className="w-full appearance-none rounded-md border border-zinc-200 bg-white py-2 pr-8 pl-3 text-sm"
                value={filters.language}
                onChange={(e) =>
                  setFilters({ ...filters, language: e.target.value })
                }
              >
                <option value="">All Languages</option>
                {LANGUAGE_DICTONARY.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400"
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <FolderIcon size={16} className="text-zinc-500" />
              <label className="text-sm font-medium text-zinc-700">
                Category
              </label>
              {isCategoriesLoading && (
                <Loader2 size={14} className="animate-spin text-zinc-400" />
              )}
            </div>
            <div className="relative">
              <select
                className="w-full appearance-none rounded-md border border-zinc-200 bg-white py-2 pr-8 pl-3 text-sm"
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
                disabled={isCategoriesLoading}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.value}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400"
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center gap-2">
              <TagIcon size={16} className="text-zinc-500" />
              <label className="text-sm font-medium text-zinc-700">Tag</label>
              {isTagsLoading && (
                <Loader2 size={14} className="animate-spin text-zinc-400" />
              )}
            </div>
            <div className="relative">
              <select
                className="w-full appearance-none rounded-md border border-zinc-200 bg-white py-2 pr-8 pl-3 text-sm"
                value={filters.tag}
                onChange={(e) =>
                  setFilters({ ...filters, tag: e.target.value })
                }
                disabled={isTagsLoading}
              >
                <option value="">All Tags</option>
                {tags.map((tag) => (
                  <option key={tag.name} value={tag.name}>
                    {tag.value}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400"
              />
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-zinc-100 px-5 py-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700"
          >
            <RefreshCcw size={14} />
            <span>Reset</span>
          </button>

          <button
            onClick={applyFilters}
            className="bg-primary-600 flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium text-white"
          >
            <FilterIcon size={14} />
            <span>Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
}
