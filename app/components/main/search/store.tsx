// app/components/main/search/store.tsx
import { DEFAULT_LANGUAGE } from "@/i18n/config";
import { createContext, useContext, useState, useEffect } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useQueryClient, QueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:3000";

// Tip tanımlamaları
interface SearchQueryOptions {
  title?: string;
  language?: string;
  category?: string;
  status?: string;
  tag?: string;
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

// Yeni blog listeleme tipleri
interface BlogListState {
  blogs: BlogPostCardView[];
  loading: boolean;
  initialLoading: boolean;
  hasMore: boolean;
  totalCount: number;
  error: string | null;
  pagination: {
    limit: number;
    offset: number;
  };
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
    blogList: StatusState;
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

  // YENİ: Blog listeleme işlemleri
  blogList: BlogListState;
  fetchBlogs: (options?: {
    isInitial?: boolean;
    language?: string;
    limit?: number;
    category?: string;
    tag?: string;
    filter?: string;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
  }) => Promise<void>;
  loadMoreBlogs: () => Promise<void>;
  resetBlogList: () => Promise<void>;
}

// TanStack Query key factories
const queryKeys = {
  blogs: {
    all: ["blogs"] as const,
    lists: () => [...queryKeys.blogs.all, "list"] as const,
    list: (filters: any) => [...queryKeys.blogs.lists(), filters] as const,
    featured: (language: string) =>
      [...queryKeys.blogs.all, "featured", language] as const,
    latest: (language: string) =>
      [...queryKeys.blogs.all, "latest", language] as const,
    search: (query: SearchQueryOptions) =>
      [...queryKeys.blogs.all, "search", query] as const,
  },
  metadata: {
    categories: ["metadata", "categories"] as const,
    tags: ["metadata", "tags"] as const,
  },
};

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
    // Add query parameters to the URL
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
        error:
          data.message ||
          data.error ||
          "An error occurred during the operation",
      };
    }

    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return { success: false, error: message };
  }
}

// Varsayılan arama sorgusu
const DEFAULT_SEARCH_QUERY: SearchQueryOptions = {
  title: "",
  language: "",
  category: "",
  status: "published",
  tag: "",
  limit: 4,
  offset: 0,
};

// Varsayılan blog listesi durumu
const DEFAULT_BLOG_LIST_STATE: BlogListState = {
  blogs: [],
  loading: false,
  initialLoading: true,
  hasMore: true,
  totalCount: 0,
  error: null,
  pagination: {
    limit: 8,
    offset: 0,
  },
};

type Props = {
  children: React.ReactNode;
  language: string;
};

// SearchProvider - Ana dış provider
export function SearchProvider({
  children,
  language = DEFAULT_LANGUAGE,
}: Props) {
  const queryClient = useQueryClient();
  const [store] = useState(() => createSearchStore(language, queryClient));

  return (
    <SearchContext.Provider value={store}>{children}</SearchContext.Provider>
  );
}

// Zustand store oluşturma fonksiyonu
function createSearchStore(language: string, queryClient: QueryClient) {
  return createStore<SearchState>()(
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

      // YENİ: Blog listeleme durumu
      blogList: { ...DEFAULT_BLOG_LIST_STATE },

      // Status durumları
      statusStates: {
        categories: createStatusState(),
        tags: createStatusState(),
        search: createStatusState(),
        latestBlog: createStatusState(),
        blogList: createStatusState(),
      },

      // Modal and dropdown controls
      openDropdown: () => set({ isDropdownOpen: true }),
      closeDropdown: () => set({ isDropdownOpen: false }),
      openFilterModal: () => {
        // Load categories and tags when opening the filter modal (if not already loaded)
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

      // Fetch the latest blog post
      fetchLatestBlog: async () => {
        // If already fetched and successful, no need to fetch again
        const { latestBlog, statusStates } = get();
        if (latestBlog && statusStates.latestBlog.status === "success") {
          return latestBlog;
        }

        set((state) => {
          state.statusStates.latestBlog = createStatusState("loading");
          return state;
        });

        try {
          // React Query ile veriyi getir
          const latestBlogPost = await queryClient.fetchQuery({
            queryKey: queryKeys.blogs.latest(language),
            queryFn: async () => {
              const result = await apiFetch<{
                success: boolean;
                blogs: BlogPostCardView[];
                count: number;
              }>("/blog/cards", {
                limit: 1,
                language,
                sortBy: "createdAt",
                sortDirection: "desc",
                status: "published", // Fetch only published blog posts
              });

              if (
                !result.success ||
                !result.data ||
                !result.data.blogs?.length
              ) {
                throw new Error(
                  result.error || "Failed to load the latest blog",
                );
              }

              return result.data.blogs[0];
            },
            staleTime: 1000 * 60 * 5, // 5 dakika boyunca önbellekte tut
          });

          set((state) => {
            state.latestBlog = latestBlogPost;
            state.statusStates.latestBlog = createStatusState("success");
            return state;
          });

          return latestBlogPost;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to load the latest blog";

          set((state) => {
            state.statusStates.latestBlog = createStatusState(
              "error",
              errorMessage,
            );
            return state;
          });

          return null;
        }
      },

      // YENİ: Blog listeleme fonksiyonları
      // Blog listesi yükleme fonksiyonu
      fetchBlogs: async (options = {}) => {
        const { isInitial = false } = options;
        const { blogList } = get();
        const currentLanguage = options.language || language;

        if (isInitial) {
          set((state) => {
            state.blogList.initialLoading = true;
            state.blogList.pagination = {
              limit: options.limit || 8,
              offset: 0,
            };
            state.statusStates.blogList = createStatusState("loading");
            return state;
          });
        } else {
          set((state) => {
            state.blogList.loading = true;
            state.statusStates.blogList = createStatusState("loading");
            return state;
          });
        }

        try {
          // QueryParams hazırla
          const params: Record<string, any> = {
            language: currentLanguage,
            limit: options.limit || blogList.pagination.limit,
            offset: isInitial ? 0 : blogList.pagination.offset,
            sortBy: options.sortBy || "createdAt",
            sortDirection: options.sortDirection || "desc",
            status: "published",
          };

          // Ek filtreler
          if (options.category) params.category = options.category;
          if (options.tag) params.tag = options.tag;
          if (options.filter) params.title = options.filter;

          // React Query ile veriyi getir
          const result = await queryClient.fetchQuery({
            queryKey: queryKeys.blogs.list(params),
            queryFn: async () => {
              const apiResult = await apiFetch<{
                success: boolean;
                blogs: BlogPostCardView[];
                count: number;
              }>("/blog/cards", params);

              if (!apiResult.success || !apiResult.data) {
                throw new Error(apiResult.error || "Failed to load blog posts");
              }

              return {
                blogs: apiResult.data.blogs || [],
                count: apiResult.data.count || 0,
              };
            },
            staleTime: 1000 * 60 * 5, // 5 dakika boyunca önbellekte tut
          });

          const blogs = result.blogs;
          const count = result.count;
          const currentLimit = options.limit || blogList.pagination.limit;

          set((state) => {
            // İlk yükleme mi yoksa daha fazla blog mu?
            if (isInitial) {
              state.blogList.blogs = blogs;
            } else {
              state.blogList.blogs = [...state.blogList.blogs, ...blogs];
            }

            // Daha fazla blog yüklenebilir mi?
            state.blogList.hasMore = blogs.length >= currentLimit;
            state.blogList.totalCount = count;

            // Offset güncelleme
            if (!isInitial) {
              state.blogList.pagination.offset +=
                state.blogList.pagination.limit;
            } else {
              state.blogList.pagination.offset = currentLimit;
            }

            // Durum güncelleme
            state.blogList.loading = false;
            state.blogList.initialLoading = false;
            state.blogList.error = null;
            state.statusStates.blogList = createStatusState("success");
            return state;
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An error occurred while loading blog posts";

          set((state) => {
            state.blogList.loading = false;
            state.blogList.initialLoading = false;
            state.blogList.error = errorMessage;
            state.blogList.hasMore = false;
            state.statusStates.blogList = createStatusState(
              "error",
              errorMessage,
            );
            return state;
          });

          console.error("Blog yüklenirken hata oluştu:", error);
        }
      },

      // Daha fazla blog yükleme
      loadMoreBlogs: async () => {
        const { blogList } = get();
        if (!blogList.loading && blogList.hasMore) {
          await get().fetchBlogs();
        }
      },

      // Blog listesini sıfırlama
      resetBlogList: async () => {
        set((state) => {
          state.blogList = { ...DEFAULT_BLOG_LIST_STATE };
          return state;
        });

        // Varsayılan değerlerle yeni bir fetch yap
        await get().fetchBlogs({ isInitial: true });
      },

      // Load categories
      loadCategories: async () => {
        const { categoriesLoaded } = get();

        // If categories are already loaded, no need to load again
        if (categoriesLoaded) {
          return get().categories;
        }

        set((state) => {
          state.statusStates.categories = createStatusState("loading");
          return state;
        });

        try {
          // React Query ile veriyi getir
          const categories = await queryClient.fetchQuery({
            queryKey: queryKeys.metadata.categories,
            queryFn: async () => {
              const result = await apiFetch<{ categories: Category[] }>(
                "/blog/categories",
              );

              if (!result.success || !result.data) {
                throw new Error(result.error || "Failed to load categories");
              }

              return result.data.categories || [];
            },
            staleTime: 1000 * 60 * 15, // 15 dakika boyunca önbellekte tut
          });

          set((state) => {
            state.categories = categories;
            state.categoriesLoaded = true;
            state.statusStates.categories = createStatusState("success");
            return state;
          });

          return categories;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Failed to load categories";

          set((state) => {
            state.statusStates.categories = createStatusState(
              "error",
              errorMessage,
            );
            return state;
          });

          return undefined;
        }
      },

      // Load tags
      loadTags: async () => {
        const { tagsLoaded } = get();

        // If tags are already loaded, no need to load again
        if (tagsLoaded) {
          return get().tags;
        }

        set((state) => {
          state.statusStates.tags = createStatusState("loading");
          return state;
        });

        try {
          // React Query ile veriyi getir
          const tags = await queryClient.fetchQuery({
            queryKey: queryKeys.metadata.tags,
            queryFn: async () => {
              const result = await apiFetch<{ tags: Tag[] }>("/blog/tags");

              if (!result.success || !result.data) {
                throw new Error(result.error || "Failed to load tags");
              }

              return result.data.tags || [];
            },
            staleTime: 1000 * 60 * 15, // 15 dakika boyunca önbellekte tut
          });

          set((state) => {
            state.tags = tags;
            state.tagsLoaded = true;
            state.statusStates.tags = createStatusState("success");
            return state;
          });

          return tags;
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Failed to load tags";

          set((state) => {
            state.statusStates.tags = createStatusState("error", errorMessage);
            return state;
          });

          return undefined;
        }
      },

      // Update search query
      updateSearchQuery: (query: Partial<SearchQueryOptions>) => {
        set((state) => {
          state.searchQuery = { ...state.searchQuery, ...query };
          // Reset offset if any value other than offset changes
          if (Object.keys(query).some((key) => key !== "offset")) {
            state.searchQuery.offset = 0;
          }
          return state;
        });
      },

      // Reset search query
      resetSearchQuery: () => {
        set((state) => {
          state.searchQuery = { ...DEFAULT_SEARCH_QUERY };
          state.searchResults = [];
          state.totalResults = 0;
          state.hasMoreResults = false;
          return state;
        });
      },

      // Perform search
      search: async (query?: string) => {
        try {
          // If a query string is provided, set it as the title
          if (query !== undefined) {
            set((state) => {
              state.searchQuery.title = query;
              state.searchQuery.offset = 0; // Reset offset for new search
              return state;
            });
          }

          set((state) => {
            state.searchStatus.loading = true;
            state.searchStatus.error = null;
            state.statusStates.search = createStatusState("loading");
            return state;
          });

          const searchQuery = get().searchQuery;

          // React Query ile arama yap
          const result = await queryClient.fetchQuery({
            queryKey: queryKeys.blogs.search(searchQuery),
            queryFn: async () => {
              const apiResult = await apiFetch<{
                success: boolean;
                blogs: BlogPostCardView[];
                count: number;
              }>("/blog/cards", searchQuery);

              if (!apiResult.success || !apiResult.data) {
                throw new Error(
                  apiResult.error || "An error occurred during the search",
                );
              }

              return {
                blogs: apiResult.data.blogs || [],
                count: apiResult.data.count || 0,
              };
            },
            staleTime: 1000 * 60 * 3, // 3 dakika boyunca önbellekte tut
          });

          const blogs = result.blogs;
          const fetchedCount = blogs?.length || 0;
          const limit = searchQuery.limit || 10;

          set((state) => {
            // If offset is 0, it's a new search; otherwise, append results
            if (searchQuery.offset === 0) {
              state.searchResults = blogs;
            } else {
              state.searchResults = [...state.searchResults, ...blogs];
            }

            state.totalResults = result.count;
            state.hasMoreResults = fetchedCount === limit && fetchedCount > 0;
            state.searchStatus.loading = false;
            state.statusStates.search = createStatusState("success");
            return state;
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An error occurred during the search";

          set((state) => {
            state.searchStatus.loading = false;
            state.searchStatus.error = errorMessage;
            state.statusStates.search = createStatusState(
              "error",
              errorMessage,
            );
            return state;
          });
        }
      },

      // Load more results
      loadMoreResults: async () => {
        const { searchQuery, searchStatus, hasMoreResults } = get();

        // Cancel operation if loading or no more results
        if (searchStatus.loading || !hasMoreResults) return;

        try {
          // Update offset value
          const newOffset =
            (searchQuery.offset || 0) + (searchQuery.limit || 10);

          set((state) => {
            state.searchQuery.offset = newOffset;
            return state;
          });

          // Start search operation
          await get().search();
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An error occurred while loading more results";

          set((state) => {
            state.searchStatus.error = errorMessage;
            state.statusStates.search = createStatusState(
              "error",
              errorMessage,
            );
            return state;
          });
        }
      },
    })),
  );
}

// React Query Hooks (Zustand'ı ve React Query'yi birleştiren Custom Hooks)
// Bu hook'ları SearchProvider ile sarılı bileşenlerde kullanabilirsiniz

// Kategorileri getiren hook
export function useCategories() {
  const { loadCategories, categories, categoriesLoaded, statusStates } =
    useSearch();
  const queryClient = useQueryClient();

  // İlk render'da kategorileri yükle
  useEffect(() => {
    if (!categoriesLoaded) {
      loadCategories();
    }
  }, [categoriesLoaded, loadCategories]);

  // Cache'i manuel olarak geçersiz kılma fonksiyonu
  const invalidateCategories = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.metadata.categories });
    loadCategories();
  };

  return {
    categories,
    loading: statusStates.categories.loading,
    error: statusStates.categories.error,
    invalidateCategories,
  };
}

// Etiketleri getiren hook
export function useTags() {
  const { loadTags, tags, tagsLoaded, statusStates } = useSearch();
  const queryClient = useQueryClient();

  // İlk render'da etiketleri yükle
  useEffect(() => {
    if (!tagsLoaded) {
      loadTags();
    }
  }, [tagsLoaded, loadTags]);

  // Cache'i manuel olarak geçersiz kılma fonksiyonu
  const invalidateTags = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.metadata.tags });
    loadTags();
  };

  return {
    tags,
    loading: statusStates.tags.loading,
    error: statusStates.tags.error,
    invalidateTags,
  };
}

// En son blog gönderisini getiren hook
export function useLatestBlog() {
  const { fetchLatestBlog, latestBlog, statusStates } = useSearch();
  const queryClient = useQueryClient();

  // İlk render'da en son blog'u yükle
  useEffect(() => {
    if (!latestBlog) {
      fetchLatestBlog();
    }
  }, [latestBlog, fetchLatestBlog]);

  // Cache'i manuel olarak geçersiz kılma fonksiyonu
  const invalidateLatestBlog = (language: string) => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.blogs.latest(language),
    });
    fetchLatestBlog();
  };

  return {
    latestBlog,
    loading: statusStates.latestBlog.loading,
    error: statusStates.latestBlog.error,
    invalidateLatestBlog,
  };
}

// Blog listesini getiren hook (Zustand'dan mevcut veriyi kullanır ve ihtiyaç duyulduğunda yeni veriler yükler)
export function useBlogList() {
  const { blogList, fetchBlogs, loadMoreBlogs, resetBlogList, statusStates } =
    useSearch();
  const queryClient = useQueryClient();

  // Cache'i manuel olarak geçersiz kılma fonksiyonu
  const invalidateBlogList = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.blogs.lists() });
    resetBlogList();
  };

  return {
    ...blogList,
    loading: blogList.loading || statusStates.blogList.loading,
    error: blogList.error || statusStates.blogList.error,
    fetchBlogs,
    loadMoreBlogs,
    resetBlogList,
    invalidateBlogList,
  };
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
