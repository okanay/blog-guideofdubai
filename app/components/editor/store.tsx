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
    totalCount: number;
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

// API fetch helper
async function apiFetch<T = any>({
  method,
  endpoint,
  body,
  credentials = "include",
  successMessage,
  errorMessage,
}: FetchOptions): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const url = `${API_URL}${endpoint}`;
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

      if (errorMessage) {
        toast.error(errorMessage, { description: message });
      }
      return { success: false, error: message };
    }

    if (successMessage) {
      toast.success(successMessage, {
        description: "İşlem başarıyla tamamlandı",
      });
    }

    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Beklenmedik bir hata oluştu";
    if (errorMessage) {
      toast.error(errorMessage, { description: message });
    }
    return { success: false, error: message };
  }
}

export function EditorProvider({ children }: PropsWithChildren) {
  const [store] = useState(() =>
    createStore<DataState>()(
      immer((set, get) => ({
        // Görünüm modları
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
        // Blog istatistikleri
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

        fetchBlogStats: async (forceRefresh = false) => {
          const state = get();

          // Cache kontrolü
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
            const response = await fetch(
              `${API_URL}/auth/blog/stats?limit=100000&offset=0`,
              {
                method: "GET",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
              },
            );

            if (!response.ok) {
              throw new Error("İstatistikler alınamadı");
            }

            const data: BlogStatsResponse = await response.json();

            if (data.success) {
              set((state) => {
                state.blogStats.originalData = data.stats; // Ana veriyi sakla
                state.blogStats.cached = true;
                state.blogStats.lastFetch = Date.now();
                state.blogStats.loading = false;
              });

              // Filtreleri uygula
              get().applyStatsFilters();
            } else {
              throw new Error("API yanıtı başarısız");
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

        applyStatsFilters: () => {
          const state = get();
          // Ana verinin kopyasını al
          let filtered = [...state.blogStats.originalData];
          const filters = state.blogStats.filters;

          // Dil filtresi
          if (filters.language) {
            filtered = filtered.filter(
              (item) => item.language === filters.language,
            );
          }

          // Arama filtresi
          if (filters.searchQuery) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(
              (item) =>
                item.title.toLowerCase().includes(query) ||
                item.slug.toLowerCase().includes(query),
            );
          }

          // Tarih aralığı filtresi
          if (filters.dateRange.start || filters.dateRange.end) {
            filtered = filtered.filter((item) => {
              const itemDate = new Date(item.lastViewedAt);
              if (filters.dateRange.start && itemDate < filters.dateRange.start)
                return false;
              if (filters.dateRange.end && itemDate > filters.dateRange.end)
                return false;
              return true;
            });
          }

          // Sıralama
          filtered.sort((a, b) => {
            const aValue = a[filters.sortBy];
            const bValue = b[filters.sortBy];

            if (typeof aValue === "string") {
              return filters.sortOrder === "asc"
                ? aValue.localeCompare(bValue as string)
                : (bValue as string).localeCompare(aValue);
            } else {
              return filters.sortOrder === "asc"
                ? (aValue as number) - (bValue as number)
                : (bValue as number) - (aValue as number);
            }
          });

          // Sadece filtrelenmiş veriyi güncelle, ana veri aynı kalsın
          set((state) => {
            state.blogStats.filteredData = filtered;
          });
        },

        setStatsFilter: (key: string, value: any) => {
          set((state) => {
            if (key.includes(".")) {
              const keys = key.split(".");
              let current: any = state.blogStats.filters;
              for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
              }
              current[keys[keys.length - 1]] = value;
            } else {
              state.blogStats.filters[key] = value;
            }
          });
          // Her filtre değişikliğinde filtreleri uygula
          get().applyStatsFilters();
        },

        clearStatsFilters: () => {
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
          // Filtreleri temizledikten sonra tüm veriyi göster
          get().applyStatsFilters();
        },

        refreshStats: async () => {
          // Force refresh ile yeni veri çek
          await get().fetchBlogStats(true);
        },

        // Veri durumları
        categories: [],
        tags: [],
        fetchedBlogs: {},
        featuredBlogs: {},
        visibleBlogIds: [],
        totalBlogCount: 0,
        lastFetchCount: 0,
        hasMoreBlogs: true,

        // Varsayılan blog sorgusu
        blogPostsQuery: {
          limit: 50,
          offset: 0,
          sortBy: "createdAt",
          sortDirection: "desc",
        },

        // Blog oluşturma
        createBlog: async (blog: any) => {
          set((state) => {
            state.statusStates.create = createStatusState("loading");
          });

          const result = await apiFetch({
            method: "POST",
            endpoint: "/auth/blog",
            body: blog,
            successMessage: "Blog Başarıyla Oluşturuldu",
            errorMessage: "Blog Oluşturulamadı",
          });

          set((state) => {
            state.statusStates.create = createStatusState(
              result.success ? "success" : "error",
              result.error,
            );

            // Başarılı ise cache'i temizle
            if (result.success) {
              state.clearBlogPosts();
              state.clearStatsFilters();
              state.clearBlogPostsFilters();
            }
          });

          return result.success;
        },

        // Blog güncelleme
        updateBlog: async (blog: any) => {
          set((state) => {
            state.statusStates.update = createStatusState("loading");
          });

          const result = await apiFetch({
            method: "PATCH",
            endpoint: "/auth/blog",
            body: blog,
            successMessage: "Blog Başarıyla Güncellendi",
            errorMessage: "Blog Güncellenemedi",
          });

          set((state) => {
            state.statusStates.update = createStatusState(
              result.success ? "success" : "error",
              result.error,
            );

            // Eğer başarılı ise ve blog ID'si tanımlıysa, fetchedBlogs'da güncelle
            if (result.success) {
              state.fetchBlogPosts(true);
              state.fetchBlogStats(true);
              state.clearStatsFilters();
              state.clearBlogPostsFilters();
            }
          });

          return result.success;
        },

        // Blog durumu değiştirme
        changeBlogStatus: async (id: string, status: BlogStatus) => {
          set((state) => {
            state.statusStates.changeStatus = createStatusState("loading");
          });

          const result = await apiFetch({
            method: "PATCH",
            endpoint: "/auth/blog/status",
            body: { id, status },
            successMessage: "Blog durumu başarıyla güncellendi",
            errorMessage: "Blog Durumu Değiştirilemedi",
          });

          set((state) => {
            state.statusStates.changeStatus = createStatusState(
              result.success ? "success" : "error",
              result.error,
            );

            // Başarılı ise blog durumunu güncelle
            if (result.success) {
              state.fetchBlogPosts(true);
              state.fetchBlogStats(true);
              state.clearStatsFilters();
              state.clearBlogPostsFilters();
            }
          });

          return result.success;
        },

        addCategory: async (category: SelectOption) => {
          set((state) => {
            state.statusStates.categories = createStatusState("loading");
          });

          const result = await apiFetch<Category>({
            method: "POST",
            endpoint: "/auth/blog/category",
            body: category,
            errorMessage: "Kategori eklenirken bir hata oluştu",
          });

          set((state) => {
            state.statusStates.categories = createStatusState(
              result.success ? "success" : "error",
              result.error,
            );

            if (result.success && result.data) {
              state.categories.push(result.data);
            }
          });

          return result.data;
        },

        // Kategorileri yenileme
        refreshCategories: async () => {
          set((state) => {
            state.statusStates.categories = createStatusState("loading");
          });

          const result = await apiFetch<{ categories: Category[] }>({
            method: "GET",
            endpoint: "/blog/categories",
            errorMessage: "Kategori listesi yenilenirken bir hata oluştu",
          });

          set((state) => {
            state.statusStates.categories = createStatusState(
              result.success ? "success" : "error",
              result.error,
            );

            if (result.success && result.data) {
              state.categories = result.data.categories || [];
            }
          });

          return result.success ? result.data?.categories : undefined;
        },

        addTag: async (tag: SelectOption) => {
          set((state) => {
            state.statusStates.tags = createStatusState("loading");
          });

          const result = await apiFetch<Tag>({
            method: "POST",
            endpoint: "/auth/blog/tag",
            body: tag,
            errorMessage: "Etiket eklerken bir hata oluştu",
          });

          set((state) => {
            state.statusStates.tags = createStatusState(
              result.success ? "success" : "error",
              result.error,
            );

            if (result.success && result.data) {
              state.tags.push(result.data);
            }
          });

          return result.data;
        },

        // Etiketleri yenileme
        refreshTags: async () => {
          set((state) => {
            state.statusStates.tags = createStatusState("loading");
          });

          const result = await apiFetch<{ tags: Tag[] }>({
            method: "GET",
            endpoint: "/blog/tags",
            errorMessage: "Etiket listesi yenilenirken bir hata oluştu",
          });

          set((state) => {
            state.statusStates.tags = createStatusState(
              result.success ? "success" : "error",
              result.error,
            );

            if (result.success && result.data) {
              state.tags = result.data.tags || [];
            }
          });

          return result.success ? result.data?.tags : undefined;
        },

        blogList: {
          originalData: [],
          filteredData: [],
          loading: false,
          error: null,
          cached: false,
          lastFetch: null,
          totalCount: 0,
          query: {
            limit: 50,
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

            const params = new URLSearchParams();
            Object.entries(query).forEach(([key, value]) => {
              if (value !== undefined && value !== null) {
                params.append(key, String(value));
              }
            });

            if (filters.searchQuery)
              params.append("title", filters.searchQuery);
            if (filters.language) params.append("language", filters.language);
            if (filters.category) params.append("category", filters.category);
            if (filters.tag) params.append("tag", filters.tag);
            if (filters.status) params.append("status", filters.status);
            if (filters.featured) params.append("featured", "true");

            const endpoint = `/blog/cards?${params.toString()}`;
            const result = await apiFetch<{
              blogs: BlogPostCardView[] | undefined | null;
              count: number | undefined | null;
            }>({
              method: "GET",
              endpoint,
              errorMessage: "Blog listesi alınırken hata oluştu",
            });

            // Her durumda dizi olarak ata
            const blogs = Array.isArray(result.data?.blogs)
              ? result.data!.blogs
              : [];

            const count =
              typeof result.data?.count === "number" && result.data.count >= 0
                ? result.data.count
                : 0;

            // Eğer offset > 0 ve gelen veri boşsa, offset'i bir önceki sayfaya çekip tekrar fetch et
            if (blogs.length === 0 && query.offset && query.offset > 0) {
              // Sonsuz döngüye girmemek için offset zaten 0 ise tekrar fetch etme
              const newOffset = Math.max(0, query.offset - (query.limit || 10));
              if (newOffset !== query.offset) {
                set((state) => {
                  state.blogList.query.offset = newOffset;
                });
                // Tekrar fetch et (forceRefresh=true ile)
                await get().fetchBlogPosts(true);
                return;
              }
            }

            set((state) => {
              state.blogList.originalData = blogs;
              state.blogList.totalCount = count;
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

        applyBlogPostsFilters: () => {
          const { originalData, filters } = get().blogList;
          let filtered = [...originalData];

          if (filters.searchQuery) {
            const q = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(
              (item) =>
                item.content.title.toLowerCase().includes(q) ||
                item.slug.toLowerCase().includes(q),
            );
          }

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
          set((state) => {
            (state.blogList.filters as any)[key] = value;
            state.blogList.query.offset = 0;
          });
          get().fetchBlogPosts(true);
        },

        clearBlogPostsFilters: () => {
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
          });
          get().fetchBlogPosts(true);
        },

        setBlogPostsQuery: (query) => {
          set((state) => {
            state.blogList.query = { ...state.blogList.query, ...query };
          });
          get().fetchBlogPosts(true);
        },

        deleteBlog: async (id: string) => {
          set((state) => {
            state.statusStates.delete = createStatusState("loading");
          });

          const result = await apiFetch({
            method: "DELETE",
            endpoint: `/auth/blog/${id}`,
            successMessage: "Blog başarıyla silindi",
            errorMessage: "Blog Silinemedi",
          });

          set((state) => {
            state.statusStates.delete = createStatusState(
              result.success ? "success" : "error",
              result.error,
            );
          });

          // Başarılıysa blogList cache'ini sıfırla ve yeni veri çek
          if (result.success) {
            set((state) => {
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

        clearBlogPosts: () => {
          set((state) => {
            state.blogList.originalData = [];
            state.blogList.filteredData = [];
            state.blogList.cached = false;
            state.blogList.lastFetch = null;
            state.blogList.totalCount = 0;
            state.blogList.query = {
              limit: 50,
              offset: 0,
              sortBy: "createdAt",
              sortDirection: "desc",
            };
          });
        },

        fetchFeaturedBlogs: async (language: string) => {
          set((state) => {
            state.statusStates.featured = createStatusState("loading");
          });

          const result = await apiFetch<{
            success: boolean;
            blogs: BlogPostCardView[];
            count: number;
            cached: boolean;
          }>({
            method: "GET",
            endpoint: `/blog/featured?language=${language}&limit=100000&offset=0`,
            errorMessage: "Featured bloglar alınırken bir hata oluştu",
          });

          set((state) => {
            state.statusStates.featured = createStatusState(
              result.success ? "success" : "error",
              result.error,
            );

            if (result.success && result.data) {
              state.featuredBlogs[language] = result.data.blogs || [];
            }
          });
        },

        addToFeatured: async (blogId: string, language: string) => {
          set((state) => {
            state.statusStates.featured = createStatusState("loading");
          });

          const result = await apiFetch({
            method: "POST",
            endpoint: "/auth/blog/featured",
            body: { blogId, language },
            successMessage: "Blog featured listesine eklendi",
            errorMessage: "Blog featured listesine eklenemedi",
          });

          set((state) => {
            state.statusStates.featured = createStatusState(
              result.success ? "success" : "error",
              result.error,
            );
          });

          return result.success;
        },

        removeFromFeatured: async (blogId: string) => {
          set((state) => {
            state.statusStates.featured = createStatusState("loading");
          });

          const result = await apiFetch({
            method: "DELETE",
            endpoint: `/auth/blog/featured/${blogId}`,
            successMessage: "Blog featured listesinden çıkarıldı",
            errorMessage: "Blog featured listesinden çıkarılamadı",
          });

          set((state) => {
            state.statusStates.featured = createStatusState(
              result.success ? "success" : "error",
              result.error,
            );
          });

          return result.success;
        },

        updateFeaturedOrdering: async (language: string, blogIds: string[]) => {
          set((state) => {
            state.statusStates.featured = createStatusState("loading");
          });

          const result = await apiFetch({
            method: "PATCH",
            endpoint: "/auth/blog/featured/ordering",
            body: { language, blogIds },
            successMessage: "Sıralama güncellendi",
            errorMessage: "Sıralama güncellenemedi",
          });

          set((state) => {
            state.statusStates.featured = createStatusState(
              result.success ? "success" : "error",
              result.error,
            );
          });

          return result.success;
        },

        checkFeaturedStatus: async (blogId: string, language: string) => {
          const result = await apiFetch<{
            success: boolean;
            isFeatured: boolean;
          }>({
            method: "GET",
            endpoint: `/blog/featured/${blogId}/status?language=${language}`,
            errorMessage: "Featured durumu alınamadı",
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
