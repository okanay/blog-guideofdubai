import { DEFAULT_LANGUAGE } from "@/i18n/config";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";

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
  limit: 10,
  offset: 0,
};

type Props = {
  children: React.ReactNode;
  language: string;
};

// Store oluşturma
export function SearchProvider({
  children,
  language = DEFAULT_LANGUAGE,
}: Props) {
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
          });

          try {
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

            if (!result.success || !result.data || !result.data.blogs?.length) {
              throw new Error(result.error || "Failed to load the latest blog");
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
                : "Failed to load the latest blog";

            set((state) => {
              state.statusStates.latestBlog = createStatusState(
                "error",
                errorMessage,
              );
            });

            return null;
          }
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
                result.error || "Failed to load categories",
              );
            }
          });

          return result.success ? result.data?.categories : undefined;
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
                result.error || "Failed to load tags",
              );
            }
          });

          return result.success ? result.data?.tags : undefined;
        },

        // Update search query
        updateSearchQuery: (query: Partial<SearchQueryOptions>) => {
          set((state) => {
            state.searchQuery = { ...state.searchQuery, ...query };
            // Reset offset if any value other than offset changes
            if (Object.keys(query).some((key) => key !== "offset")) {
              state.searchQuery.offset = 0;
            }
          });
        },

        // Reset search query
        resetSearchQuery: () => {
          set((state) => {
            state.searchQuery = { ...DEFAULT_SEARCH_QUERY };
            state.searchResults = [];
            state.totalResults = 0;
            state.hasMoreResults = false;
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
              });
            }

            set((state) => {
              state.searchStatus.loading = true;
              state.searchStatus.error = null;
              state.statusStates.search = createStatusState("loading");
            });

            const searchQuery = get().searchQuery;

            // API request
            const result = await apiFetch<{
              success: boolean;
              blogs: BlogPostCardView[];
              count: number;
            }>("/blog/cards", searchQuery);

            if (!result.success || !result.data) {
              throw new Error(
                result.error || "An error occurred during the search",
              );
            }

            const blogs = result.data.blogs || [];
            const fetchedCount = blogs?.length || 0;
            const limit = searchQuery.limit || 10;

            set((state) => {
              // If offset is 0, it's a new search; otherwise, append results
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
                : "An error occurred during the search";

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
