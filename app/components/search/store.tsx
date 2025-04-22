import { createContext, PropsWithChildren, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:3000";

// Tip tanımlamaları
interface SearchQueryOptions {
  title?: string;
  language?: string;
  categoryValue?: string;
  tagValue?: string;
  limit?: number;
  offset?: number;
}

interface SearchStatus {
  loading: boolean;
  error: string | null;
}

// Status durumu için yardımcı fonksiyon
function createStatusState(
  status: "idle" | "loading" | "success" | "error" = "idle",
  error: string | null = null,
): StatusState {
  return { status, error, loading: status === "loading", message: error || "" };
}

interface SearchState {
  // Arama durumu
  searchStatus: SearchStatus;
  searchQuery: SearchQueryOptions;
  updateSearchQuery: (query: Partial<SearchQueryOptions>) => void;
  resetSearchQuery: () => void;

  // Arama sonuçları
  searchResults: BlogPostCardView[];
  totalResults: number;
  hasMoreResults: boolean;

  // Modal ve dropdown kontrolleri
  isDropdownOpen: boolean;
  isFilterModalOpen: boolean;
  openDropdown: () => void;
  closeDropdown: () => void;
  openFilterModal: () => void;
  closeFilterModal: () => void;

  // Kategoriler ve etiketler
  categories: Category[];
  tags: Tag[];
  categoriesLoaded: boolean;
  tagsLoaded: boolean;
  statusStates: {
    categories: StatusState;
    tags: StatusState;
    search: StatusState;
    latestBlog: StatusState;
  };

  // En son blog gönderisi
  latestBlog: BlogPostCardView | null;
  fetchLatestBlog: () => Promise<BlogPostCardView | null>;

  // Veri yükleme fonksiyonları
  loadCategories: () => Promise<Category[] | undefined>;
  loadTags: () => Promise<Tag[] | undefined>;

  // Arama işlemleri
  search: (query?: string) => Promise<void>;
  loadMoreResults: () => Promise<void>;
}

// HTTP İstek Yardımcısı
async function apiFetch<T = any>(
  endpoint: string,
  params: Record<string, any> = {},
): Promise<{
  success: boolean;
  data?: T;
  error?: string;
}> {
  try {
    // Query parametrelerini URL'ye ekle
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const url = `${API_URL}${endpoint}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || "İşlem sırasında bir hata oluştu",
      };
    }

    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Beklenmedik bir hata oluştu";
    return { success: false, error: message };
  }
}

// Varsayılan arama sorgusu
const DEFAULT_SEARCH_QUERY: SearchQueryOptions = {
  title: "",
  language: "",
  categoryValue: "",
  tagValue: "",
  limit: 10,
  offset: 0,
};

// Store oluşturma
export function SearchProvider({ children }: PropsWithChildren) {
  const [store] = useState(() =>
    createStore<SearchState>()(
      immer((set, get) => ({
        // Arama durumu
        searchStatus: {
          loading: false,
          error: null,
        },
        searchQuery: { ...DEFAULT_SEARCH_QUERY },

        // Dropdown ve modal durumları
        isDropdownOpen: false,
        isFilterModalOpen: false,

        // Arama sonuçları
        searchResults: [],
        totalResults: 0,
        hasMoreResults: false,

        // Kategori ve etiket verileri
        categories: [],
        tags: [],
        categoriesLoaded: false,
        tagsLoaded: false,

        // En son blog
        latestBlog: null,

        // Status durumları
        statusStates: {
          categories: createStatusState(),
          tags: createStatusState(),
          search: createStatusState(),
          latestBlog: createStatusState(),
        },

        // Modal ve dropdown kontrolleri
        openDropdown: () => set({ isDropdownOpen: true }),
        closeDropdown: () => set({ isDropdownOpen: false }),
        openFilterModal: () => {
          // Filtreleme modalı açılırken kategorileri ve etiketleri yükle (eğer daha önce yüklenmediyse)
          const state = get();
          if (!state.categoriesLoaded) {
            state.loadCategories();
          }
          if (!state.tagsLoaded) {
            state.loadTags();
          }

          set({ isFilterModalOpen: true, isDropdownOpen: false });
        },
        closeFilterModal: () => set({ isFilterModalOpen: false }),

        // En son blog gönderisini çekme
        fetchLatestBlog: async () => {
          // Eğer zaten çekilmişse ve başarılıysa, tekrar çekmeye gerek yok
          const { latestBlog, statusStates } = get();
          if (latestBlog && statusStates.latestBlog.status === "success") {
            return latestBlog;
          }

          set((state) => {
            state.statusStates.latestBlog = createStatusState("loading");
          });

          try {
            const result = await apiFetch<{
              success: boolean;
              blogs: BlogPostCardView[];
              count: number;
            }>("/blog/cards", {
              limit: 1,
              sortBy: "createdAt",
              sortDirection: "desc",
              status: "published", // Sadece yayınlanmış blog gönderilerini al
            });

            if (!result.success || !result.data || !result.data.blogs?.length) {
              throw new Error(result.error || "En son blog yüklenemedi");
            }

            const latestBlogPost = result.data.blogs[0];

            set((state) => {
              state.latestBlog = latestBlogPost;
              state.statusStates.latestBlog = createStatusState("success");
            });

            return latestBlogPost;
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "En son blog yüklenemedi";

            set((state) => {
              state.statusStates.latestBlog = createStatusState(
                "error",
                errorMessage,
              );
            });

            return null;
          }
        },

        // Kategorileri yükleme
        loadCategories: async () => {
          const { categoriesLoaded } = get();

          // Eğer kategoriler zaten yüklendiyse, tekrar yüklemeye gerek yok
          if (categoriesLoaded) {
            return get().categories;
          }

          console.log("Kategoriler yükleniyor...", categoriesLoaded);

          set((state) => {
            state.statusStates.categories = createStatusState("loading");
          });

          const result = await apiFetch<{ categories: Category[] }>(
            "/blog/categories",
          );

          set((state) => {
            if (result.success && result.data) {
              state.categories = result.data.categories || [];
              state.categoriesLoaded = true;
              state.statusStates.categories = createStatusState("success");
            } else {
              state.statusStates.categories = createStatusState(
                "error",
                result.error || "Kategoriler yüklenemedi",
              );
            }
          });

          return result.success ? result.data?.categories : undefined;
        },

        // Etiketleri yükleme
        loadTags: async () => {
          const { tagsLoaded } = get();

          // Eğer etiketler zaten yüklendiyse, tekrar yüklemeye gerek yok
          if (tagsLoaded) {
            return get().tags;
          }

          set((state) => {
            state.statusStates.tags = createStatusState("loading");
          });

          const result = await apiFetch<{ tags: Tag[] }>("/blog/tags");

          set((state) => {
            if (result.success && result.data) {
              state.tags = result.data.tags || [];
              state.tagsLoaded = true;
              state.statusStates.tags = createStatusState("success");
            } else {
              state.statusStates.tags = createStatusState(
                "error",
                result.error || "Etiketler yüklenemedi",
              );
            }
          });

          return result.success ? result.data?.tags : undefined;
        },

        // Sorgu güncelleme
        updateSearchQuery: (query: Partial<SearchQueryOptions>) => {
          set((state) => {
            state.searchQuery = { ...state.searchQuery, ...query };
            // Eğer offset harici bir değer değiştiyse, offset'i sıfırla
            if (Object.keys(query).some((key) => key !== "offset")) {
              state.searchQuery.offset = 0;
            }
          });
        },

        // Sorgu sıfırlama
        resetSearchQuery: () => {
          set((state) => {
            state.searchQuery = { ...DEFAULT_SEARCH_QUERY };
            state.searchResults = [];
            state.totalResults = 0;
            state.hasMoreResults = false;
          });
        },

        // Arama işlemi
        search: async (query?: string) => {
          try {
            // Eğer bir query dizesi verilmişse, title olarak ayarla
            if (query !== undefined) {
              set((state) => {
                state.searchQuery.title = query;
                state.searchQuery.offset = 0; // Yeni arama için offset'i sıfırla
              });
            }

            set((state) => {
              state.searchStatus.loading = true;
              state.searchStatus.error = null;
              state.statusStates.search = createStatusState("loading");
            });

            const searchQuery = get().searchQuery;

            // API isteği
            const result = await apiFetch<{
              success: boolean;
              blogs: BlogPostCardView[];
              count: number;
            }>("/blog/cards", searchQuery);

            if (!result.success || !result.data) {
              throw new Error(
                result.error || "Arama yapılırken bir hata oluştu",
              );
            }

            const blogs = result.data.blogs || [];
            const fetchedCount = blogs?.length || 0;
            const limit = searchQuery.limit || 10;

            set((state) => {
              // Eğer offset 0 ise yeni arama, değilse ekleme
              if (searchQuery.offset === 0) {
                state.searchResults = blogs;
              } else {
                state.searchResults = [...state.searchResults, ...blogs];
              }

              state.totalResults = result.data.count;
              state.hasMoreResults = fetchedCount === limit && fetchedCount > 0;
              state.searchStatus.loading = false;
              state.statusStates.search = createStatusState("success");
            });
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Arama yapılırken bir hata oluştu";

            set((state) => {
              state.searchStatus.loading = false;
              state.searchStatus.error = errorMessage;
              state.statusStates.search = createStatusState(
                "error",
                errorMessage,
              );
            });
          }
        },

        // Daha fazla sonuç yükleme
        loadMoreResults: async () => {
          const { searchQuery, searchStatus, hasMoreResults } = get();

          // Yükleme yapılıyorsa veya daha fazla sonuç yoksa işlemi iptal et
          if (searchStatus.loading || !hasMoreResults) return;

          try {
            // Offset değerini güncelle
            const newOffset =
              (searchQuery.offset || 0) + (searchQuery.limit || 10);

            set((state) => {
              state.searchQuery.offset = newOffset;
            });

            // Arama işlemini başlat
            await get().search();
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Daha fazla sonuç yüklenirken bir hata oluştu";

            set((state) => {
              state.searchStatus.error = errorMessage;
              state.statusStates.search = createStatusState(
                "error",
                errorMessage,
              );
            });
          }
        },
      })),
    ),
  );

  return (
    <SearchContext.Provider value={store}>{children}</SearchContext.Provider>
  );
}

// Hook
export function useSearch() {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error("useSearch hook must be used within a SearchProvider");
  }

  return useStore(context, (state) => state);
}

// Context
const SearchContext = createContext<StoreApi<SearchState> | undefined>(
  undefined,
);
