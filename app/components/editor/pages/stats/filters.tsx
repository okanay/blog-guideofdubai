import {
  Search,
  X,
  SlidersHorizontal,
  Filter,
  RefreshCw,
  ArrowUpDown,
  Languages,
} from "lucide-react";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { LANGUAGE_DICTONARY } from "@/i18n/config";
import { useEditorContext } from "@/components/editor/store";

export function StatsFilters() {
  const { blogStats, setStatsFilter, clearStatsFilters, refreshStats } =
    useEditorContext();

  const { filters, loading, filteredData, originalData } = blogStats;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sıralama seçenekleri
  const sortOptions = [
    { value: "views", label: "Görüntülenme" },
    { value: "likes", label: "Beğeni" },
    { value: "shares", label: "Paylaşım" },
    { value: "comments", label: "Yorum" },
    { value: "lastViewedAt", label: "Son Görüntülenme" },
    { value: "createdAt", label: "Oluşturma Tarihi" },
  ];

  // Sıralama yönü seçenekleri
  const directionOptions = [
    { value: "desc", label: "Azalan", icon: "↓" },
    { value: "asc", label: "Artan", icon: "↑" },
  ];

  // Aktif filtre var mı?
  const activeFilterCount = [filters.language, filters.searchQuery].filter(
    Boolean,
  ).length;
  const hasActiveFilters =
    activeFilterCount > 0 ||
    filters.sortBy !== "views" ||
    filters.sortOrder !== "desc";

  // Filtreleri sıfırla
  const resetFilters = () => {
    clearStatsFilters();
    refreshStats();
  };

  return (
    <div className="mb-6 flex flex-col gap-4">
      {/* Arama */}
      <div className="relative flex items-center">
        <Search size={18} className="absolute left-3 text-zinc-400" />
        <input
          type="text"
          value={filters.searchQuery}
          onChange={(e) => setStatsFilter("searchQuery", e.target.value)}
          placeholder="Başlık veya slug'da ara..."
          className="focus:border-primary-300 focus:ring-primary-100 w-full rounded-md border border-zinc-200 bg-zinc-50 py-2.5 pr-10 pl-10 text-sm transition-all outline-none focus:bg-white focus:ring-2"
        />
        {filters.searchQuery && (
          <button
            type="button"
            onClick={() => setStatsFilter("searchQuery", "")}
            className="absolute right-3 text-zinc-400 hover:text-zinc-600"
            tabIndex={-1}
            aria-label="Aramayı temizle"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filtreler, Temizle ve Yenile butonları */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50"
          >
            <SlidersHorizontal size={16} />
            Filtreler
          </button>
          <button
            type="button"
            onClick={resetFilters}
            disabled={!hasActiveFilters || loading}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 disabled:opacity-50"
          >
            <X size={16} />
            Temizle
          </button>
        </div>
        <button
          type="button"
          onClick={refreshStats}
          disabled={loading}
          className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-all ${
            loading
              ? "cursor-not-allowed border-zinc-200 bg-zinc-50 text-zinc-400"
              : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100"
          } `}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Yenile
        </button>
      </div>

      {/* Filtrelenen kayıt sayısı */}
      <div className="text-xs text-zinc-500">
        {filteredData.length.toLocaleString()} /{" "}
        {originalData.length.toLocaleString()} kayıt gösteriliyor
      </div>

      {/* Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title className="text-lg font-semibold text-zinc-800">
                Gelişmiş Filtreler
              </Dialog.Title>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600"
                aria-label="Kapat"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              {/* Dil */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-700">
                  <Languages size={14} />
                  Dil
                </label>
                <select
                  value={filters.language || ""}
                  onChange={(e) =>
                    setStatsFilter("language", e.target.value || null)
                  }
                  className="focus:border-primary-300 focus:ring-primary-100 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2"
                >
                  <option value="">Tüm Diller</option>
                  {LANGUAGE_DICTONARY.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Sıralama */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-700">
                  <ArrowUpDown size={14} />
                  Sıralama Ölçütü
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setStatsFilter("sortBy", e.target.value)}
                  className="focus:border-primary-300 focus:ring-primary-100 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Sıralama Yönü */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-700">
                  <ArrowUpDown size={14} />
                  Sıralama Yönü
                </label>
                <div className="flex w-full gap-2">
                  {directionOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setStatsFilter("sortOrder", option.value)}
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm transition-colors ${
                        filters.sortOrder === option.value
                          ? "border-primary-200 bg-primary-50 text-primary-700"
                          : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Modal Butonlar */}
            <div className="mt-6 flex justify-end gap-2 border-t border-zinc-100 pt-4">
              <button
                type="button"
                onClick={resetFilters}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 disabled:opacity-50"
              >
                <X size={16} />
                Temizle
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 inline-flex items-center gap-1.5 rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm transition-all focus:ring-2 focus:outline-none"
              >
                <Filter size={16} />
                Kapat
              </button>
            </div>
            {/* Sonuç yoksa uyarı */}
            {filteredData.length === 0 && originalData.length > 0 && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-amber-50 p-4 text-sm">
                <Filter className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-amber-800">
                  Filtreleme kriterlerine uygun sonuç bulunamadı.
                </span>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
