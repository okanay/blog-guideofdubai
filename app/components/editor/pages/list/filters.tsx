import {
  Search,
  X,
  SlidersHorizontal,
  Star,
  Filter,
  RefreshCw,
  ArrowDownAZ,
  ArrowUpAZ,
  Layout,
  Tag,
  Calendar,
  Type,
  Languages,
  Layers,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { ALL_LANGUAGE_DICTONARY } from "@/i18n/config";
import { BLOG_OPTIONS } from "@/components/editor/constants";
import { useEditorContext } from "@/components/editor/store";

export function BlogFilters() {
  const {
    blogList,
    setBlogPostsFilter,
    setBlogPostsQuery,
    clearBlogPostsFilters,
    categories,
    tags,
    fetchBlogPosts,
    refreshTags,
    refreshCategories,
    statusStates: { blogPosts },
  } = useEditorContext();

  const isLoading = blogPosts.loading;

  // Filtre seçenekleri
  const sortOptions = [
    {
      value: "createdAt",
      label: "Oluşturma Tarihi",
      icon: <Calendar size={14} />,
    },
    {
      value: "updatedAt",
      label: "Güncelleme Tarihi",
      icon: <RefreshCw size={14} />,
    },
    { value: "title", label: "Başlık", icon: <Type size={14} /> },
  ];

  const directionOptions = [
    {
      value: "desc",
      label: "Normal ",
      icon: <ArrowDownAZ size={14} />,
    },
    { value: "asc", label: "Tersten", icon: <ArrowUpAZ size={14} /> },
  ];

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtreleri sıfırla
  const resetFilters = () => {
    clearBlogPostsFilters();
    fetchBlogPosts();
  };

  // Kategori ve etiketleri ilk açılışta yenile
  useEffect(() => {
    refreshTags();
    refreshCategories();
  }, []);

  // JSX
  return (
    <div className="mb-6 flex flex-col gap-4">
      {/* Başlığa göre arama */}
      <div className="relative flex items-center">
        <Search size={18} className="absolute left-3 text-zinc-400" />
        <input
          type="text"
          value={blogList.filters.searchQuery}
          onChange={(e) => setBlogPostsFilter("searchQuery", e.target.value)}
          placeholder="Blog başlığında ara..."
          className="focus:border-primary-300 focus:ring-primary-100 w-full rounded-md border border-zinc-200 bg-zinc-50 py-2.5 pr-10 pl-10 text-sm transition-all outline-none focus:bg-white focus:ring-2"
        />
        {blogList.filters.searchQuery && (
          <button
            type="button"
            onClick={() => setBlogPostsFilter("searchQuery", "")}
            className="absolute right-3 text-zinc-400 hover:text-zinc-600"
            tabIndex={-1}
            aria-label="Başlık aramasını temizle"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filtreler ve Temizle butonları */}
      <div className="flex items-center justify-between gap-2">
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
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 disabled:opacity-50"
        >
          <X size={16} />
          Temizle
        </button>
      </div>

      {/* Modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
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
              {/* Hızlı Filtreler */}
              <div className="col-span-full mb-2 flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    setBlogPostsFilter("featured", !blogList.filters.featured)
                  }
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    blogList.filters.featured
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  <Star
                    size={14}
                    className={
                      blogList.filters.featured
                        ? "fill-amber-500 text-amber-500"
                        : ""
                    }
                  />
                  Öne Çıkanlar
                </button>
                {BLOG_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() =>
                      setBlogPostsFilter(
                        "status",
                        blogList.filters.status === option.value
                          ? ""
                          : option.value,
                      )
                    }
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      blogList.filters.status === option.value
                        ? option.config.color
                        : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {/* Dil */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-700">
                  <Languages size={14} />
                  Dil
                </label>
                <select
                  value={blogList.filters.language || ""}
                  onChange={(e) =>
                    setBlogPostsFilter("language", e.target.value)
                  }
                  className="focus:border-primary-300 focus:ring-primary-100 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2"
                >
                  <option value="">Tüm Diller</option>
                  {ALL_LANGUAGE_DICTONARY.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Kategori */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-700">
                  <Layout size={14} />
                  Kategori
                </label>
                <select
                  value={blogList.filters.category || ""}
                  onChange={(e) =>
                    setBlogPostsFilter("category", e.target.value)
                  }
                  className="focus:border-primary-300 focus:ring-primary-100 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2"
                >
                  <option value="">Tüm Kategoriler</option>
                  {categories.map((category) => (
                    <option key={category.name} value={category.name}>
                      {category.value}
                    </option>
                  ))}
                </select>
              </div>
              {/* Etiket */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-700">
                  <Tag size={14} />
                  Etiket
                </label>
                <select
                  value={blogList.filters.tag || ""}
                  onChange={(e) => setBlogPostsFilter("tag", e.target.value)}
                  className="focus:border-primary-300 focus:ring-primary-100 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:ring-2"
                >
                  <option value="">Tüm Etiketler</option>
                  {tags.map((tag) => (
                    <option key={tag.name} value={tag.name}>
                      {tag.value}
                    </option>
                  ))}
                </select>
              </div>
              {/* Sıralama */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-700">
                  <ArrowDownAZ size={14} />
                  Sıralama Ölçütü
                </label>
                <select
                  value={blogList.filters.sortBy}
                  onChange={(e) => setBlogPostsFilter("sortBy", e.target.value)}
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
                  <ArrowUpAZ size={14} />
                  Sıralama Yönü
                </label>
                <div className="flex w-full gap-2">
                  {directionOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setBlogPostsFilter("sortOrder", option.value)
                      }
                      className={`flex flex-1 items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm transition-colors ${
                        blogList.filters.sortOrder === option.value
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
              {/* Gösterim Sayısı */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-700">
                  <Layers size={14} />
                  Gösterim Sayısı
                </label>
                <div className="flex flex-wrap gap-2">
                  {[1, 5, 10, 20, 50, 100].map((limit) => (
                    <button
                      key={limit}
                      onClick={() => setBlogPostsQuery({ limit })}
                      className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        blogList.query.limit === limit
                          ? "border-primary-200 bg-primary-50 text-primary-700"
                          : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      {limit}
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
                disabled={isLoading}
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
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
