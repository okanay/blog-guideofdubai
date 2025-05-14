import { createContext, PropsWithChildren, useContext, useState } from "react";
import { toast } from "sonner";
import { createStore, StoreApi, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { API_URL, createStatusState } from "./helper";

interface DataState {
  // 1. Görünüm modları
  view: {
    mode: BlogViewMode;
    setMode: (mode: BlogViewMode) => void;
  };
  cacheView: {
    mode: boolean;
    setMode: (mode: boolean) => void;
  };

  // 2. Status durumları
  statusStates: {
    create: StatusState;
    update: StatusState;
    delete: StatusState;
    changeStatus: StatusState;
    categories: StatusState;
    tags: StatusState;
    blogPosts: StatusState;
    featured: StatusState;
  };

  // 3. Blog istatistikleri
  blogStats: {
    data: BlogStats[];
    originalData: BlogStats[];
    filteredData: BlogStats[];
    loading: boolean;
    error: string | null;
    cached: boolean;
    lastFetch: number | null;
    filters: {
      language: string | null;
      sortBy: keyof BlogStats;
      sortOrder: "asc" | "desc";
      searchQuery: string;
      dateRange: {
        start: Date | null;
        end: Date | null;
      };
    };
  };
  fetchBlogStats: (forceRefresh?: boolean) => Promise<void>;
  applyStatsFilters: () => void;
  setStatsFilter: (key: string, value: any) => void;
  clearStatsFilters: () => void;
  refreshStats: () => Promise<void>;

  // 4. Blog işlemleri (CRUD)
  createBlog: (blog: any) => Promise<boolean>;
  updateBlog: (blog: any) => Promise<boolean>;
  deleteBlog: (id: string) => Promise<boolean>;
  changeBlogStatus: (id: string, status: string) => Promise<boolean>;

  // 5. Kategori işlemleri
  categories: Category[];
  addCategory: (category: SelectOption) => Promise<Category | undefined>;
  refreshCategories: () => Promise<Category[] | undefined>;

  // 6. Etiket işlemleri
  tags: Tag[];
  addTag: (tag: SelectOption) => Promise<Tag | undefined>;
  refreshTags: () => Promise<Tag[] | undefined>;

  // 7. Blog Listesi (yeni yapı)
  blogList: {
    originalData: BlogPostCardView[];
    filteredData: BlogPostCardView[];
    loading: boolean;
    error: string | null;
    cached: boolean;
    lastFetch: number | null;
    totalCount: number; // API'dan gelen toplam kayıt sayısı
    totalPages: number; // Hesaplanmış toplam sayfa sayısı
    currentPage: number; // Geçerli sayfa (1'den başlar)
    query: BlogCardQueryOptions;
    filters: {
      searchQuery: string;
      language: string | null;
      category: string | null;
      tag: string | null;
      status: string | null;
      featured: boolean | null;
      sortBy: keyof BlogPostCardView;
      sortOrder: "asc" | "desc";
    };
  };
  fetchBlogPosts: (forceRefresh?: boolean) => Promise<void>;
  setBlogPostsFilter: (
    key: keyof DataState["blogList"]["filters"],
    value: any,
  ) => void;
  clearBlogPostsFilters: () => void;
  setBlogPostsQuery: (query: Partial<BlogCardQueryOptions>) => void;
  applyBlogPostsFilters: () => void;
  clearBlogPosts: () => void;
  goToPage: (page: number) => void; // Yeni fonksiyon: Sayfa değiştirme

  // 8. Featured işlemleri
  featuredBlogs: { [language: string]: BlogPostCardView[] };
  fetchFeaturedBlogs: (language: string) => Promise<void>;
  addToFeatured: (blogId: string, language: string) => Promise<boolean>;
  removeFromFeatured: (blogId: string) => Promise<boolean>;
  updateFeaturedOrdering: (
    language: string,
    blogIds: string[],
  ) => Promise<boolean>;
  checkFeaturedStatus: (blogId: string, language: string) => Promise<boolean>;
}

interface FetchOptions {
  method: string;
  endpoint: string;
  body?: any;
  params?: Record<string, any>;
  credentials?: RequestCredentials;
  successMessage?: string;
  errorMessage?: string;
  skipToast?: boolean;
}

// 1. Global apiFetch fonksiyonu
async function apiFetch<T = any>({
  method,
  endpoint,
  body,
  params,
  credentials = "include",
  successMessage,
  errorMessage,
  skipToast = false,
}: FetchOptions): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    // Query parametrelerini ekle
    let url = `${API_URL}${endpoint}`;

    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      });

      const queryString = searchParams.toString();
      if (queryString) {
        url += `${url.includes("?") ? "&" : "?"}${queryString}`;
      }
    }

    const options: RequestInit = {
      method,
      headers: { "Content-Type": "application/json" },
      credentials,
    };

    if (body && method !== "GET") {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      const message =
        data.message ||
        data.error ||
        errorMessage ||
        "İşlem sırasında bir hata oluştu";

      if (errorMessage && !skipToast) {
        toast.error(errorMessage, { description: message });
      }
      return { success: false, error: message };
    }

    if (successMessage && !skipToast) {
      toast.success(successMessage, {
        description: "İşlem başarıyla tamamlandı",
      });
    }

    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Beklenmedik bir hata oluştu";
    if (errorMessage && !skipToast) {
      toast.error(errorMessage, { description: message });
    }
    return { success: false, error: message };
  }
}

// 2. Yardımcı fonksiyonlar - status durumlarını güncelleme için
const setStatusLoading = (
  set: any,
  statusKey: keyof DataState["statusStates"],
) => {
  set((state: any) => {
    state.statusStates[statusKey] = createStatusState("loading");
  });
};

const setStatusResult = (
  set: any,
  statusKey: keyof DataState["statusStates"],
  success: boolean,
  error?: string,
) => {
  set((state: any) => {
    state.statusStates[statusKey] = createStatusState(
      success ? "success" : "error",
      error,
    );
  });
};

export function EditorProvider({ children }: PropsWithChildren) {
  const [store] = useState(() =>
    createStore<DataState>()(
      immer((set, get) => ({
        // Görünüm modları ve diğer özellikler aynı kalır
        view: {
          mode: "form",
          setMode: (mode: BlogViewMode) =>
            set((state) => {
              state.view.mode = mode;
            }),
        },
        cacheView: {
          mode: false,
          setMode: (mode: boolean) =>
            set((state) => {
              state.cacheView.mode = mode;
            }),
        },

        // Status durumları
        statusStates: {
          create: createStatusState(),
          update: createStatusState(),
          delete: createStatusState(),
          changeStatus: createStatusState(),
          categories: createStatusState(),
          tags: createStatusState(),
          blogPosts: createStatusState(),
          featured: createStatusState(),
        },

        // Blog istatistikleri yapısı aynı kalır
        blogStats: {
          data: [],
          originalData: [],
          filteredData: [],
          loading: false,
          error: null,
          cached: false,
          lastFetch: null,
          filters: {
            language: null,
            sortBy: "views",
            sortOrder: "desc",
            searchQuery: "",
            dateRange: {
              start: null,
              end: null,
            },
          },
        },

        // Blog istatistikleri getirme - Global fetch kullanımı
        fetchBlogStats: async (forceRefresh = false) => {
          const state = get();

          // Cache kontrolü - daha önceki verileri kullan
          if (state.blogStats.cached && !forceRefresh) {
            const now = Date.now();
            const lastFetch = state.blogStats.lastFetch || 0;
            const cacheTime = 5 * 60 * 1000; // 5 dakika

            if (now - lastFetch < cacheTime) {
              return;
            }
          }

          set((state) => {
            state.blogStats.loading = true;
            state.blogStats.error = null;
          });

          try {
            // Tüm blog istatistiklerini getir
            const result = await apiFetch<BlogStatsResponse>({
              method: "GET",
              endpoint: "/auth/blog/stats",
              params: {
                limit: 100000,
                offset: 0,
              },
              errorMessage: "İstatistikler alınamadı",
            });

            if (result.success && result.data) {
              set((state) => {
                state.blogStats.data = result.data.stats;
                state.blogStats.originalData = result.data.stats;
                state.blogStats.cached = true;
                state.blogStats.lastFetch = Date.now();
                state.blogStats.loading = false;
              });

              // Filtreleri uygula
              get().applyStatsFilters();
            } else {
              throw new Error(result.error || "API yanıtı başarısız");
            }
          } catch (error) {
            set((state) => {
              state.blogStats.loading = false;
              state.blogStats.error =
                error instanceof Error ? error.message : "Bilinmeyen hata";
            });
            toast.error("İstatistikler yüklenemedi", {
              description:
                error instanceof Error ? error.message : "Bilinmeyen hata",
            });
          }
        },

        // Filtre fonksiyonları aynı
        applyStatsFilters: () => {
          // Mevcut uygulamayla aynı kalır
          const state = get();
          let filtered = [...state.blogStats.originalData];
          const filters = state.blogStats.filters;

          // Filtre işlemleri...
          if (filters.language) {
            filtered = filtered.filter(
              (item) => item.language === filters.language,
            );
          }

          if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase().trim();
            if (query.length > 0) {
              filtered = filtered.filter(
                (item) =>
                  item.title?.toLowerCase().includes(query) ||
                  false ||
                  item.slug?.toLowerCase().includes(query) ||
                  false,
              );
            }
          }

          // Diğer filtreler ve sıralamalar...

          set((state) => {
            state.blogStats.filteredData = filtered;
          });
        },

        setStatsFilter: (key: string, value: any) => {
          // Mevcut uygulamayla aynı kalır
          set((state) => {
            if (key.includes(".")) {
              const keys = key.split(".");
              let current: any = state.blogStats.filters;
              for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
              }
              current[keys[keys.length - 1]] = value;
            } else {
              (state.blogStats.filters as any)[key] = value;
            }
          });

          get().applyStatsFilters();
        },

        clearStatsFilters: () => {
          // Mevcut uygulamayla aynı kalır
          set((state) => {
            state.blogStats.filters = {
              language: null,
              sortBy: "views",
              sortOrder: "desc",
              searchQuery: "",
              dateRange: {
                start: null,
                end: null,
              },
            };
          });

          get().applyStatsFilters();
        },

        refreshStats: async () => {
          set((state) => {
            state.blogStats.loading = true;
          });

          await get().fetchBlogStats(true);
        },

        // Blog Listesi yapısı aynı kalır
        blogList: {
          originalData: [],
          filteredData: [],
          loading: false,
          error: null,
          cached: false,
          lastFetch: null,
          totalCount: 0,
          totalPages: 0,
          currentPage: 1,
          query: {
            limit: 8,
            offset: 0,
            sortBy: "createdAt",
            sortDirection: "desc",
          },
          filters: {
            searchQuery: "",
            language: null,
            category: null,
            tag: null,
            status: null,
            featured: null,
            sortBy: "createdAt",
            sortOrder: "desc",
          },
        },

        // Blog listesi getiren fonksiyon - Global fetch kullanımı
        fetchBlogPosts: async (forceRefresh = false) => {
          const state = get();
          if (state.blogList.cached && !forceRefresh) {
            const now = Date.now();
            if (
              state.blogList.lastFetch &&
              now - state.blogList.lastFetch < 5 * 60 * 1000
            ) {
              return;
            }
          }

          set((state) => {
            state.blogList.loading = true;
            state.blogList.error = null;
          });

          try {
            const { query, filters } = get().blogList;

            // Tüm parametreleri birleştir
            const params = {
              ...query,
              title: filters.searchQuery || undefined,
              language: filters.language || undefined,
              category: filters.category || undefined,
              tag: filters.tag || undefined,
              status: filters.status || undefined,
              featured: filters.featured ? "true" : undefined,
            };

            const result = await apiFetch<{
              blogs: BlogPostCardView[] | undefined | null;
              count: number | undefined | null;
              total: number | undefined | null;
            }>({
              method: "GET",
              endpoint: "/blog/cards",
              params,
              errorMessage: "Blog listesi alınırken hata oluştu",
            });

            // Her durumda dizi olarak ata
            const blogs = Array.isArray(result.data?.blogs)
              ? result.data!.blogs
              : [];

            // Toplam kayıt sayısını al
            const total =
              typeof result.data?.total === "number"
                ? result.data.total
                : typeof result.data?.count === "number"
                  ? result.data.count
                  : 0;

            // Toplam sayfa sayısını hesapla
            const limit = query.limit || 8;
            const totalPages = Math.max(1, Math.ceil(total / limit));

            // Mevcut sayfayı hesapla
            const currentPage = Math.floor(query.offset / limit) + 1;

            // Eğer dönen veri boş ve offset > 0 ise, son sayfaya git
            if (blogs.length === 0 && query.offset > 0 && total > 0) {
              // Son sayfanın offset'ini hesapla
              const lastPageOffset = Math.max(0, (totalPages - 1) * limit);

              if (lastPageOffset !== query.offset) {
                set((state) => {
                  state.blogList.query.offset = lastPageOffset;
                  state.blogList.currentPage = totalPages;
                });

                // Tekrar fetch et
                await get().fetchBlogPosts(true);
                return;
              }
            }

            set((state) => {
              state.blogList.originalData = blogs;
              state.blogList.totalCount = total;
              state.blogList.totalPages = totalPages;
              state.blogList.currentPage = currentPage;
              state.blogList.cached = true;
              state.blogList.lastFetch = Date.now();
              state.blogList.loading = false;
            });

            get().applyBlogPostsFilters();
          } catch (error) {
            set((state) => {
              state.blogList.loading = false;
              state.blogList.error =
                error instanceof Error ? error.message : "Bilinmeyen hata";
            });
            toast.error("Blog Listesi Yüklenemedi", {
              description:
                error instanceof Error ? error.message : "Bilinmeyen hata",
            });
          }
        },

        // Blog Listesi filtreleme ve sayfalama fonksiyonları
        goToPage: (page: number) => {
          // Mevcut uygulamayla aynı kalır
          const { limit } = get().blogList.query;
          const totalPages = get().blogList.totalPages;

          if (page < 1) page = 1;
          if (page > totalPages) page = totalPages;

          const offset = (page - 1) * limit;

          set((state) => {
            state.blogList.currentPage = page;
            state.blogList.query.offset = offset;
          });

          get().fetchBlogPosts(true);
        },

        applyBlogPostsFilters: () => {
          // Mevcut uygulamayla aynı kalır
          const { originalData } = get().blogList;
          const { filters } = get().blogList;
          let filtered = [...originalData];

          // Sıralama işlemi
          filtered.sort((a, b) => {
            const aValue = a[filters.sortBy];
            const bValue = b[filters.sortBy];
            if (typeof aValue === "string") {
              return filters.sortOrder === "asc"
                ? (aValue as string).localeCompare(bValue as string)
                : (bValue as string).localeCompare(aValue as string);
            } else {
              return filters.sortOrder === "asc"
                ? (aValue as number) - (bValue as number)
                : (bValue as number) - (aValue as number);
            }
          });

          set((state) => {
            state.blogList.filteredData = filtered;
          });
        },

        setBlogPostsFilter: (key, value) => {
          // Mevcut uygulamayla aynı kalır
          set((state) => {
            (state.blogList.filters as any)[key] = value;
            state.blogList.query.offset = 0;
            state.blogList.currentPage = 1;
          });
          get().fetchBlogPosts(true);
        },

        clearBlogPostsFilters: () => {
          // Mevcut uygulamayla aynı kalır
          set((state) => {
            state.blogList.filters = {
              searchQuery: "",
              language: null,
              category: null,
              tag: null,
              status: null,
              featured: null,
              sortBy: "createdAt",
              sortOrder: "desc",
            };
            state.blogList.query.offset = 0;
            state.blogList.currentPage = 1;
          });
          get().fetchBlogPosts(true);
        },

        setBlogPostsQuery: (query) => {
          // Mevcut uygulamayla aynı kalır
          const oldLimit = get().blogList.query.limit;
          const newLimit = query.limit || oldLimit;

          if (newLimit !== oldLimit && query.limit) {
            const currentOffset = get().blogList.query.offset;
            const currentPage = Math.floor(currentOffset / oldLimit) + 1;
            const newOffset = (currentPage - 1) * newLimit;

            set((state) => {
              state.blogList.query = {
                ...state.blogList.query,
                ...query,
                offset: newOffset,
              };
            });
          } else {
            set((state) => {
              state.blogList.query = { ...state.blogList.query, ...query };

              if (query.offset !== undefined) {
                state.blogList.currentPage =
                  Math.floor(query.offset / state.blogList.query.limit) + 1;
              }
            });
          }

          get().fetchBlogPosts(true);
        },

        clearBlogPosts: () => {
          // Mevcut uygulamayla aynı kalır
          set((state) => {
            state.blogList.originalData = [];
            state.blogList.filteredData = [];
            state.blogList.cached = false;
            state.blogList.lastFetch = null;
            state.blogList.totalCount = 0;
            state.blogList.totalPages = 0;
            state.blogList.currentPage = 1;
            state.blogList.query = {
              limit: 8,
              offset: 0,
              sortBy: "createdAt",
              sortDirection: "desc",
            };
          });
        },

        // CRUD işlemleri - Global fetch kullanımı
        createBlog: async (blog: any) => {
          setStatusLoading(set, "create");

          const result = await apiFetch({
            method: "POST",
            endpoint: "/auth/blog",
            body: blog,
            successMessage: "Blog Başarıyla Oluşturuldu",
            errorMessage: "Blog Oluşturulamadı",
          });

          setStatusResult(set, "create", result.success, result.error);

          // Başarılı ise cache'i temizle
          if (result.success) {
            set((state: any) => {
              state.clearBlogPosts();
              state.clearStatsFilters();
              state.clearBlogPostsFilters();
            });
          }

          return result.success;
        },

        updateBlog: async (blog: any) => {
          setStatusLoading(set, "update");

          const result = await apiFetch({
            method: "PATCH",
            endpoint: "/auth/blog",
            body: blog,
            successMessage: "Blog Başarıyla Güncellendi",
            errorMessage: "Blog Güncellenemedi",
          });

          setStatusResult(set, "update", result.success, result.error);

          // Başarılı ise verileri yenile
          if (result.success) {
            set((state: any) => {
              state.fetchBlogPosts(true);
              state.fetchBlogStats(true);
              state.clearStatsFilters();
              state.clearBlogPostsFilters();
            });
          }

          return result.success;
        },

        deleteBlog: async (id: string) => {
          setStatusLoading(set, "delete");

          const result = await apiFetch({
            method: "DELETE",
            endpoint: `/auth/blog/${id}`,
            successMessage: "Blog başarıyla silindi",
            errorMessage: "Blog Silinemedi",
          });

          setStatusResult(set, "delete", result.success, result.error);

          // Başarılıysa blogList cache'ini sıfırla ve yeni veri çek
          if (result.success) {
            set((state: any) => {
              state.blogList.cached = false;
              state.blogList.originalData = [];
              state.blogList.filteredData = [];
              state.blogList.totalCount = 0;
              state.blogList.lastFetch = null;
            });
            await get().fetchBlogPosts(true);
          }

          return result.success;
        },

        changeBlogStatus: async (id: string, status: BlogStatus) => {
          setStatusLoading(set, "changeStatus");

          const result = await apiFetch({
            method: "PATCH",
            endpoint: "/auth/blog/status",
            body: { id, status },
            successMessage: "Blog durumu başarıyla güncellendi",
            errorMessage: "Blog Durumu Değiştirilemedi",
          });

          setStatusResult(set, "changeStatus", result.success, result.error);

          // Başarılı ise blog durumunu güncelle
          if (result.success) {
            set((state: any) => {
              state.fetchBlogPosts(true);
              state.fetchBlogStats(true);
              state.clearStatsFilters();
              state.clearBlogPostsFilters();
            });
          }

          return result.success;
        },

        // Kategori işlemleri - Global fetch kullanımı
        categories: [],
        addCategory: async (category: SelectOption) => {
          setStatusLoading(set, "categories");

          const result = await apiFetch<Category>({
            method: "POST",
            endpoint: "/auth/blog/category",
            body: category,
            errorMessage: "Kategori eklenirken bir hata oluştu",
          });

          setStatusResult(set, "categories", result.success, result.error);

          if (result.success && result.data) {
            set((state: any) => {
              state.categories.push(result.data);
            });
          }

          return result.data;
        },

        refreshCategories: async () => {
          setStatusLoading(set, "categories");

          const result = await apiFetch<{ categories: Category[] }>({
            method: "GET",
            endpoint: "/blog/categories",
            errorMessage: "Kategori listesi yenilenirken bir hata oluştu",
          });

          setStatusResult(set, "categories", result.success, result.error);

          if (result.success && result.data) {
            set((state: any) => {
              state.categories = result.data.categories || [];
            });
          }

          return result.success ? result.data?.categories : undefined;
        },

        // Etiket işlemleri - Global fetch kullanımı
        tags: [],
        addTag: async (tag: SelectOption) => {
          setStatusLoading(set, "tags");

          const result = await apiFetch<Tag>({
            method: "POST",
            endpoint: "/auth/blog/tag",
            body: tag,
            errorMessage: "Etiket eklerken bir hata oluştu",
          });

          setStatusResult(set, "tags", result.success, result.error);

          if (result.success && result.data) {
            set((state: any) => {
              state.tags.push(result.data);
            });
          }

          return result.data;
        },

        refreshTags: async () => {
          setStatusLoading(set, "tags");

          const result = await apiFetch<{ tags: Tag[] }>({
            method: "GET",
            endpoint: "/blog/tags",
            errorMessage: "Etiket listesi yenilenirken bir hata oluştu",
          });

          setStatusResult(set, "tags", result.success, result.error);

          if (result.success && result.data) {
            set((state: any) => {
              state.tags = result.data.tags || [];
            });
          }

          return result.success ? result.data?.tags : undefined;
        },

        // Featured blog işlemleri - Global fetch kullanımı
        featuredBlogs: {},
        fetchFeaturedBlogs: async (language: string) => {
          setStatusLoading(set, "featured");

          const result = await apiFetch<{
            success: boolean;
            blogs: BlogPostCardView[];
            count: number;
            cached: boolean;
          }>({
            method: "GET",
            endpoint: "/blog/featured",
            params: {
              language,
              limit: 100000,
              offset: 0,
            },
            errorMessage: "Featured bloglar alınırken bir hata oluştu",
          });

          setStatusResult(set, "featured", result.success, result.error);

          if (result.success && result.data) {
            set((state: any) => {
              state.featuredBlogs[language] = result.data.blogs || [];
            });
          }
        },

        addToFeatured: async (blogId: string, language: string) => {
          setStatusLoading(set, "featured");

          const result = await apiFetch({
            method: "POST",
            endpoint: "/auth/blog/featured",
            body: { blogId, language },
            successMessage: "Blog featured listesine eklendi",
            errorMessage: "Blog featured listesine eklenemedi",
          });

          if (result.success) {
            // Blog listesinde ilgili blog varsa, featured özelliğini true olarak ayarla
            set((state: any) => {
              // Önce originalData içinde güncelleme yapalım
              const blogIndex = state.blogList.originalData.findIndex(
                (blog: any) => blog.id === blogId,
              );
              if (blogIndex !== -1) {
                state.blogList.originalData[blogIndex].featured = true;
              }

              // Sonra filteredData içinde de güncelleme yapalım
              const filteredBlogIndex = state.blogList.filteredData.findIndex(
                (blog: any) => blog.id === blogId,
              );
              if (filteredBlogIndex !== -1) {
                state.blogList.filteredData[filteredBlogIndex].featured = true;
              }

              // language'a ait featuredBlogs dizisi yoksa oluşturalım
              if (!state.featuredBlogs[language]) {
                state.featuredBlogs[language] = [];
              }

              // Eğer bu blog featured listesinde yoksa, onu listenin başına ekleyelim
              const featuredIndex = state.featuredBlogs[language].findIndex(
                (blog: any) => blog.id === blogId,
              );
              if (featuredIndex === -1) {
                // Blog detaylarını bulmak için blogList'ten alalım
                const blogDetails = state.blogList.originalData.find(
                  (blog: any) => blog.id === blogId,
                );
                if (blogDetails) {
                  state.featuredBlogs[language].unshift({
                    ...blogDetails,
                    featured: true,
                  });
                }
              }
            });
          }

          setStatusResult(set, "featured", result.success, result.error);
          return result.success;
        },

        removeFromFeatured: async (blogId: string) => {
          setStatusLoading(set, "featured");

          const result = await apiFetch({
            method: "DELETE",
            endpoint: `/auth/blog/featured/${blogId}`,
            successMessage: "Blog featured listesinden çıkarıldı",
            errorMessage: "Blog featured listesinden çıkarılamadı",
          });

          if (result.success) {
            // Blog listesinde ilgili blog varsa, featured özelliğini false olarak ayarla
            set((state: any) => {
              // Önce originalData içinde güncelleme yapalım
              const blogIndex = state.blogList.originalData.findIndex(
                (blog: any) => blog.id === blogId,
              );
              if (blogIndex !== -1) {
                state.blogList.originalData[blogIndex].featured = false;
              }

              // Sonra filteredData içinde de güncelleme yapalım
              const filteredBlogIndex = state.blogList.filteredData.findIndex(
                (blog: any) => blog.id === blogId,
              );
              if (filteredBlogIndex !== -1) {
                state.blogList.filteredData[filteredBlogIndex].featured = false;
              }

              // Tüm diller için featuredBlogs listelerinden bu blogu kaldır
              Object.keys(state.featuredBlogs).forEach((lang) => {
                state.featuredBlogs[lang] = state.featuredBlogs[lang].filter(
                  (blog: any) => blog.id !== blogId,
                );
              });
            });
          }

          setStatusResult(set, "featured", result.success, result.error);
          return result.success;
        },

        updateFeaturedOrdering: async (language: string, blogIds: string[]) => {
          setStatusLoading(set, "featured");

          const result = await apiFetch({
            method: "PATCH",
            endpoint: "/auth/blog/featured/ordering",
            body: { language, blogIds },
            successMessage: "Sıralama güncellendi",
            errorMessage: "Sıralama güncellenemedi",
          });

          setStatusResult(set, "featured", result.success, result.error);
          return result.success;
        },

        checkFeaturedStatus: async (blogId: string, language: string) => {
          const result = await apiFetch<{
            success: boolean;
            isFeatured: boolean;
          }>({
            method: "GET",
            endpoint: `/blog/featured/${blogId}/status`,
            params: { language },
            errorMessage: "Featured durumu alınamadı",
            skipToast: true, // Status kontrolünde hata toast'u göstermek istemeyebiliriz
          });

          return result.data?.isFeatured || false;
        },
      })),
    ),
  );

  return (
    <EditorContext.Provider value={store}>{children}</EditorContext.Provider>
  );
}

export function useEditorContext() {
  const context = useContext(EditorContext);

  if (!context) {
    throw new Error("useEditor hook must be used within a EditorProvider");
  }

  return useStore(context, (state) => state);
}

const EditorContext = createContext<EditorContextType>(undefined);
type EditorContextType = StoreApi<DataState> | undefined;
