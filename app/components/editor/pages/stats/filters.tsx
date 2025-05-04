import { useEditorContext } from "@/components/editor/store";
import { LANGUAGE_DICTONARY } from "@/i18n/config";
import {
  Search,
  Filter,
  RefreshCw,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Languages,
} from "lucide-react";
import { useState } from "react";

export function StatsFilters() {
  const { blogStats, setStatsFilter, clearStatsFilters, refreshStats } =
    useEditorContext();
  const { filters, loading, filteredData, originalData } = blogStats;
  const [isExpanded, setIsExpanded] = useState(false);

  const sortOptions = [
    { value: "views", label: "Görüntülenme", icon: "👁️" },
    { value: "likes", label: "Beğeni", icon: "👍" },
    { value: "shares", label: "Paylaşım", icon: "🔄" },
    { value: "comments", label: "Yorum", icon: "💬" },
    { value: "lastViewedAt", label: "Son Görüntülenme", icon: "🕒" },
    { value: "createdAt", label: "Oluşturma Tarihi", icon: "📅" },
  ];

  // Aktif filtre sayısı
  const activeFilterCount = [filters.language, filters.searchQuery].filter(
    Boolean,
  ).length;

  const hasActiveFilters =
    activeFilterCount > 0 ||
    filters.sortBy !== "views" ||
    filters.sortOrder !== "desc";

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all duration-300">
      {/* Başlık */}
      <div
        className={`flex cursor-pointer items-center justify-between bg-gradient-to-r from-zinc-50 to-zinc-100 px-6 py-4 transition-colors ${
          isExpanded ? "border-b border-zinc-200" : ""
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="from-primary-500 to-primary-600 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Filtreler ve Sıralama
            </h2>
            <p className="text-sm text-zinc-500">
              {filteredData.length.toLocaleString()} /{" "}
              {originalData.length.toLocaleString()} kayıt gösteriliyor
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className={`rounded-lg p-2 text-zinc-400 transition-transform duration-200 hover:bg-zinc-100 hover:text-zinc-600 ${
              isExpanded ? "rotate-180" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Filtre İçeriği */}
      {isExpanded && (
        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12">
            {/* Arama */}
            <div className="relative lg:col-span-5">
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Arama
              </label>
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Başlık veya slug'da ara..."
                  value={filters.searchQuery}
                  onChange={(e) =>
                    setStatsFilter("searchQuery", e.target.value)
                  }
                  className="focus:border-primary-500 focus:ring-primary-500/20 w-full rounded-lg border border-zinc-300 bg-white py-2.5 pr-4 pl-10 text-sm transition-colors placeholder:text-zinc-400 hover:border-zinc-400 focus:ring-2 focus:outline-none"
                />
                {filters.searchQuery && (
                  <button
                    onClick={() => setStatsFilter("searchQuery", "")}
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Dil Filtresi */}
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Dil
              </label>
              <div className="relative">
                <Languages className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <select
                  value={filters.language || ""}
                  onChange={(e) =>
                    setStatsFilter("language", e.target.value || null)
                  }
                  className="focus:border-primary-500 focus:ring-primary-500/20 w-full appearance-none rounded-lg border border-zinc-300 bg-white py-2.5 pr-10 pl-10 text-sm transition-colors hover:border-zinc-400 focus:ring-2 focus:outline-none"
                >
                  <option value="">Tüm Diller</option>
                  {LANGUAGE_DICTONARY.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
                  <svg
                    className="h-4 w-4 text-zinc-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Sıralama */}
            <div className="lg:col-span-3">
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Sıralama
              </label>
              <div className="relative">
                <ArrowUpDown className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <select
                  value={filters.sortBy}
                  onChange={(e) => setStatsFilter("sortBy", e.target.value)}
                  className="focus:border-primary-500 focus:ring-primary-500/20 w-full appearance-none rounded-lg border border-zinc-300 bg-white py-2.5 pr-10 pl-10 text-sm transition-colors hover:border-zinc-400 focus:ring-2 focus:outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
                  <svg
                    className="h-4 w-4 text-zinc-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Aksiyon Butonları */}
            <div className="flex items-end gap-2 lg:col-span-2">
              <button
                onClick={() =>
                  setStatsFilter(
                    "sortOrder",
                    filters.sortOrder === "asc" ? "desc" : "asc",
                  )
                }
                className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all ${
                  filters.sortOrder === "desc"
                    ? "border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400"
                    : "border-blue-500 bg-blue-50 text-blue-600"
                }`}
                title={
                  filters.sortOrder === "desc"
                    ? "Azalan sıralama"
                    : "Artan sıralama"
                }
              >
                {filters.sortOrder === "desc" ? "↓" : "↑"}
              </button>

              <button
                onClick={clearStatsFilters}
                disabled={!hasActiveFilters}
                className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all ${
                  hasActiveFilters
                    ? "border-red-200 bg-red-50 text-red-600 hover:border-red-300 hover:bg-red-100"
                    : "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400"
                }`}
                title="Filtreleri temizle"
              >
                <X className="h-4 w-4" />
              </button>

              <button
                onClick={() => refreshStats()}
                disabled={loading}
                className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-all ${
                  loading
                    ? "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400"
                    : "border-emerald-200 bg-emerald-50 text-emerald-600 hover:border-emerald-300 hover:bg-emerald-100"
                }`}
                title="Verileri yenile"
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Filtre sonucu bilgisi */}
          {filteredData.length === 0 && originalData.length > 0 && (
            <div className="mt-4 flex items-center justify-between rounded-lg bg-amber-50 p-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                  <Filter className="h-4 w-4 text-amber-600" />
                </div>
                <span className="font-medium text-amber-800">
                  Filtreleme kriterlerine uygun sonuç bulunamadı.
                </span>
              </div>
              <button
                onClick={clearStatsFilters}
                className="rounded-lg bg-amber-100 px-3 py-1.5 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-200"
              >
                Filtreleri temizle
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
