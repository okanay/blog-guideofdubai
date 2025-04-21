import { Search, Filter, ChevronsUpDown, X, Star, RefreshCw, SlidersHorizontal, ArrowDownAZ, ArrowUpAZ, Layout, Tag, Calendar, Type, Languages, Layers } from "lucide-react"; // prettier-ignore
import { useState, useEffect } from "react";
import { LANGUAGE_DICTONARY } from "@/i18n/config";
import { BLOG_OPTIONS } from "@/components/editor/constants";
import { useEditorContext } from "@/components/editor/store";

export function BlogFilters() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);

  const {
    blogPostsQuery,
    setBlogPostsQuery,
    categories,
    tags,
    fetchBlogPosts,
    refreshTags,
    refreshCategories,
    statusStates: { blogPosts },
  } = useEditorContext();

  const isLoading = blogPosts.loading;

  const sortOptions = [
    {
      value: "created_at",
      label: "Oluşturma Tarihi",
      icon: <Calendar size={14} />,
    },
    {
      value: "updated_at",
      label: "Güncelleme Tarihi",
      icon: <RefreshCw size={14} />,
    },
    { value: "metadata.title", label: "Başlık", icon: <Type size={14} /> },
  ];

  const directionOptions = [
    {
      value: "desc",
      label: "Normal Sıralama",
      icon: <ArrowDownAZ size={14} />,
    },
    {
      value: "asc",
      label: "Tersten Sıralama",
      icon: <ArrowUpAZ size={14} />,
    },
  ];

  const [filters, setFilters] = useState({
    title: blogPostsQuery.title || "",
    language: blogPostsQuery.language || "",
    categoryValue: blogPostsQuery.categoryValue || "",
    tagValue: blogPostsQuery.tagValue || "",
    status: blogPostsQuery.status || "",
    featured: blogPostsQuery.featured || false,
    sortBy: blogPostsQuery.sortBy || "created_at",
    sortDirection: blogPostsQuery.sortDirection || "desc",
    limit: blogPostsQuery.limit || 20,
  });

  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setBlogPostsQuery({
      ...filters,
      status: filters.status as BlogStatus,
    });
    fetchBlogPosts();
  };

  const resetFilters = () => {
    const defaultFilters = {
      title: "",
      language: "",
      categoryValue: "",
      tagValue: "",
      status: "",
      featured: false,
      limit: 20,
      sortBy: "created_at",
      sortDirection: "desc",
    };

    setFilters(defaultFilters as any);
    setBlogPostsQuery({
      ...(defaultFilters as any),
    });
    fetchBlogPosts();
  };

  useEffect(() => {
    const hasChanges =
      filters.title !== blogPostsQuery.title ||
      filters.language !== blogPostsQuery.language ||
      filters.categoryValue !== blogPostsQuery.categoryValue ||
      filters.tagValue !== blogPostsQuery.tagValue ||
      filters.status !== blogPostsQuery.status ||
      filters.featured !== blogPostsQuery.featured ||
      filters.sortBy !== blogPostsQuery.sortBy ||
      filters.sortDirection !== blogPostsQuery.sortDirection ||
      filters.limit !== blogPostsQuery.limit;

    setHasPendingChanges(hasChanges);
  }, [filters, blogPostsQuery]);

  useEffect(() => {
    resetFilters();
    refreshTags();
    refreshCategories();
  }, []);

  return (
    <div className="mb-6 border border-zinc-200 bg-white">
      {/* Filtreleme Başlığı - Her zaman görünür */}
      <div
        className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-zinc-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="bg-primary-50 text-primary-600 flex h-8 w-8 items-center justify-center rounded-full">
            <SlidersHorizontal size={16} />
          </div>
          <div>
            <h3 className="font-medium text-zinc-800">Filtreleme ve Arama</h3>
            <p className="text-xs text-zinc-500">
              {hasPendingChanges
                ? "Uygulanmamış değişiklikler var"
                : "Blog yazılarını filtrele ve sırala"}
            </p>
          </div>

          {hasPendingChanges && (
            <span className="bg-primary-100 text-primary-800 ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold">
              !
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasPendingChanges && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                applyFilters();
              }}
              className="bg-primary-100 text-primary-700 hover:bg-primary-200 rounded-full px-3 py-1 text-xs font-medium transition-colors"
            >
              Uygula
            </button>
          )}
          <ChevronsUpDown
            size={18}
            className={`text-zinc-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Filtreleme İçeriği - Genişletildiğinde görünür */}
      {isExpanded && (
        <div className="border-t border-zinc-100 p-4">
          {/* Arama Alanı */}
          <div className="mb-4">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={16} className="text-zinc-400" />
              </div>
              <input
                type="text"
                value={filters.title}
                onChange={(e) => updateFilter("title", e.target.value)}
                placeholder="Blog başlığında ara..."
                className="focus:border-primary-300 focus:ring-primary-100 w-full rounded-md border border-zinc-200 bg-zinc-50 py-2.5 pr-10 pl-10 text-sm transition-all focus:bg-white focus:ring-2 focus:outline-none"
              />
              {filters.title && (
                <button
                  type="button"
                  onClick={() => updateFilter("title", "")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Ana Filtreler */}
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Hızlı Filtreler - İlk satır */}
            <div className="col-span-full mb-2 flex flex-wrap gap-2">
              <button
                onClick={() => updateFilter("featured", !filters.featured)}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  filters.featured
                    ? "border-amber-200 bg-amber-50 text-amber-700"
                    : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                <Star
                  size={14}
                  className={
                    filters.featured ? "fill-amber-500 text-amber-500" : ""
                  }
                />
                Öne Çıkanlar
              </button>

              {BLOG_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    updateFilter(
                      "status",
                      filters.status === option.value ? "" : option.value,
                    )
                  }
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    filters.status === option.value
                      ? option.config.color
                      : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Dil Filtresi */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-700">
                <Languages size={14} />
                Dil
              </label>
              <select
                value={filters.language}
                onChange={(e) => updateFilter("language", e.target.value)}
                className="focus:border-primary-300 focus:ring-primary-100 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:ring-2 focus:outline-none"
              >
                <option value="">Tüm Diller</option>
                {LANGUAGE_DICTONARY.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Kategori Filtresi */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-700">
                <Layout size={14} className="text-zinc-500" />
                Kategori
              </label>
              <select
                value={filters.categoryValue}
                onChange={(e) => updateFilter("categoryValue", e.target.value)}
                className="focus:border-primary-300 focus:ring-primary-100 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:ring-2 focus:outline-none"
              >
                <option value="">Tüm Kategoriler</option>
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.value}
                  </option>
                ))}
              </select>
            </div>

            {/* Etiket Filtresi */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-700">
                <Tag size={14} className="text-zinc-500" />
                Etiket
              </label>
              <select
                value={filters.tagValue}
                onChange={(e) => updateFilter("tagValue", e.target.value)}
                className="focus:border-primary-300 focus:ring-primary-100 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:ring-2 focus:outline-none"
              >
                <option value="">Tüm Etiketler</option>
                {tags.map((tag) => (
                  <option key={tag.name} value={tag.name}>
                    {tag.value}
                  </option>
                ))}
              </select>
            </div>

            {/* Sıralama Alanı */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-zinc-700">
                <ArrowDownAZ size={14} className="text-zinc-500" />
                Sıralama Ölçütü
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter("sortBy", e.target.value)}
                className="focus:border-primary-300 focus:ring-primary-100 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm transition-all focus:ring-2 focus:outline-none"
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
                <ArrowUpAZ size={14} className="text-zinc-500" />
                Sıralama Yönü
              </label>
              <div className="flex w-full gap-2">
                {directionOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => updateFilter("sortDirection", option.value)}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm transition-colors ${
                      filters.sortDirection === option.value
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
                {[5, 10, 20, 50, 100].map((limit) => (
                  <button
                    key={limit}
                    onClick={() => updateFilter("limit", limit)}
                    className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      filters.limit === limit
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

          {/* Butonlar */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-100 pt-4">
            <div className="text-xs text-zinc-500">
              {hasPendingChanges ? (
                <span className="flex items-center gap-1.5">
                  <span className="bg-primary-400 inline-block h-2 w-2 rounded-full"></span>
                  Değişiklikleriniz henüz uygulanmadı
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-400"></span>
                  Tüm filtreler güncel
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={resetFilters}
                disabled={isLoading}
                className="group focus:ring-primary-200 inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X
                  size={16}
                  className="text-zinc-400 group-hover:text-zinc-500"
                />
                Sıfırla
              </button>

              <button
                type="button"
                onClick={applyFilters}
                disabled={isLoading || !hasPendingChanges}
                className="group bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 inline-flex items-center gap-1.5 rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm transition-all focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Yükleniyor</span>
                  </>
                ) : (
                  <>
                    <Filter size={16} className="group-hover:animate-pulse" />
                    <span>Filtreleri Uygula</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
