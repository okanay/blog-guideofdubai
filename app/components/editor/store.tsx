import { createContext, PropsWithChildren, useContext, useState } from "react";
import { toast } from "sonner";
import { createStore, StoreApi, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { API_URL, createStatusState } from "./helper";

// HTTP İstek Yardımcıları
// ------------------------------------
type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface FetchOptions {
  method: HttpMethod;
  endpoint: string;
  body?: any;
  credentials?: RequestCredentials;
  successMessage?: string;
  errorMessage?: string;
}

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

// Store Tipleri
// ------------------------------------
interface DataState {
  // Blog Görünüm Modu
  view: {
    mode: BlogViewMode;
    setMode: (mode: BlogViewMode) => void;
  };

  // Status durumları
  statusStates: {
    create: StatusState;
    update: StatusState;
    delete: StatusState;
    changeStatus: StatusState;
    categories: StatusState;
    tags: StatusState;
    blogPosts: StatusState;
  };

  // Blog İşlemleri
  createBlog: (blog: any) => Promise<boolean>;
  updateBlog: (blog: any) => Promise<boolean>;
  deleteBlog: (id: string) => Promise<boolean>;
  changeBlogStatus: (id: string, status: BlogStatus) => Promise<boolean>;

  // Kategori İşlemleri
  categories: Category[];
  addCategory: (category: SelectOption) => Promise<Category | undefined>;
  refreshCategories: () => Promise<Category[] | undefined>;

  // Etiket İşlemleri
  tags: Tag[];
  addTag: (tag: SelectOption) => Promise<Tag | undefined>;
  refreshTags: () => Promise<Tag[] | undefined>;

  // Blog Listesi
  fetchedBlogs: { [key: string]: BlogPostCardView }; // Tüm fetch edilmiş bloglar (ID bazlı)
  visibleBlogIds: string[]; // Görüntülenen blog ID'leri
  totalBlogCount: number; // Toplam blog sayısı
  lastFetchCount: number; // Son fetch işleminde kaç blog getirdiği
  hasMoreBlogs: boolean; // Daha fazla blog var mı
  blogPostsQuery: BlogCardQueryOptions;
  setBlogPostsQuery: (query: Partial<BlogCardQueryOptions>) => void;
  fetchBlogPosts: () => Promise<void>;
  clearBlogPosts: () => void;
}

// Store İmplementasyonu
// ------------------------------------
export function EditorProvider({ children }: PropsWithChildren) {
  const [store] = useState(() =>
    createStore<DataState>()(
      immer((set, get) => ({
        // Görünüm Modu
        view: {
          mode: "form",
          setMode: (mode: BlogViewMode) =>
            set((state) => {
              state.view.mode = mode;
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
        },

        // Veri durumları
        categories: [],
        tags: [],
        fetchedBlogs: {},
        visibleBlogIds: [],
        totalBlogCount: 0,
        lastFetchCount: 0,
        hasMoreBlogs: true,

        // Varsayılan blog sorgusu
        blogPostsQuery: {
          limit: 20,
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
              state.fetchedBlogs = {};
              state.visibleBlogIds = [];
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
            if (result.success && blog.id && state.fetchedBlogs[blog.id]) {
              state.fetchedBlogs[blog.id] = {
                ...state.fetchedBlogs[blog.id],
                ...blog,
              };
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
            if (result.success && state.fetchedBlogs[id]) {
              state.fetchedBlogs[id].status = status;
            }
          });

          return result.success;
        },

        // Blog silme
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

          // Başarılı ise blog listesini yenile
          if (result.success) {
            await get().fetchBlogPosts();
          }

          return result.success;
        },

        // Kategori ekleme
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

        // Etiket ekleme
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

        // Blog sorgu parametrelerini ayarlama
        setBlogPostsQuery: (query: Partial<BlogCardQueryOptions>) => {
          const currentQuery = get().blogPostsQuery;
          const newQuery = { ...currentQuery, ...query };

          // Offset dışında bir filtre değişimi olduysa, veri temizlenir
          if (
            Object.keys(query).some(
              (key) =>
                key !== "offset" &&
                query[key as keyof BlogCardQueryOptions] !== undefined &&
                query[key as keyof BlogCardQueryOptions] !==
                  currentQuery[key as keyof BlogCardQueryOptions],
            )
          ) {
            set((state) => {
              state.fetchedBlogs = {}; // Önbelleği temizle
              state.visibleBlogIds = []; // Görüntülenen blogları temizle
              state.blogPostsQuery = { ...newQuery, offset: 0 }; // Offset'i sıfırla
            });
          } else {
            set((state) => {
              state.blogPostsQuery = newQuery;
            });
          }
        },

        // Blog gönderilerini getirme
        fetchBlogPosts: async () => {
          set((state) => {
            state.statusStates.blogPosts = createStatusState("loading");
          });

          try {
            const query = get().blogPostsQuery;
            const queryParams = new URLSearchParams();

            // Query parametrelerini ekle
            if (query.id) queryParams.append("id", query.id);
            if (query.title) queryParams.append("title", query.title);
            if (query.language) queryParams.append("language", query.language);
            if (query.categoryValue)
              queryParams.append("category", query.categoryValue);
            if (query.tagValue) queryParams.append("tag", query.tagValue);
            if (query.featured) queryParams.append("featured", "true");
            if (query.status) queryParams.append("status", query.status);
            if (query.limit)
              queryParams.append("limit", query.limit.toString());
            if (query.offset)
              queryParams.append("offset", query.offset.toString());
            if (query.sortBy) queryParams.append("sortBy", query.sortBy);
            if (query.sortDirection)
              queryParams.append("sortDirection", query.sortDirection);

            const queryString = queryParams.toString();
            const endpoint = `/blog/cards${queryString ? `?${queryString}` : ""}`;

            const result = await apiFetch<{
              success: boolean;
              blogs: BlogPostCardView[];
              count: number;
            }>({
              method: "GET",
              endpoint,
              errorMessage: "Blog listesi alınırken bir hata oluştu",
            });

            if (!result.success || !result.data) {
              throw new Error(
                result.error || "Blog listesi alınırken bir hata oluştu",
              );
            }

            // Gelen blogları işle
            const blogs = result.data.blogs || []; // Eğer blogs null ise boş dizi kullan
            const fetchedCount = blogs?.length || 0; // Güvenli erişim

            set((state) => {
              // Yeni fetch edilen blogları, fetchedBlogs içine ekle
              const updatedFetchedBlogs = { ...state.fetchedBlogs };

              blogs.forEach((blog) => {
                updatedFetchedBlogs[blog.id] = blog;
              });

              // Görünür blog ID'lerini güncelle (append yaparak)
              const newBlogIds = blogs.map((blog) => blog.id);

              // Eğer offset 0 ise (ilk sayfa), visible ID'leri sıfırla
              const visibleIds =
                query.offset === 0
                  ? newBlogIds
                  : [...state.visibleBlogIds, ...newBlogIds];

              // Son fetch sayısını ve daha fazla blog olup olmadığını güncelle
              const hasMore = fetchedCount === (query.limit || 10);

              state.fetchedBlogs = updatedFetchedBlogs;
              state.visibleBlogIds = visibleIds;
              state.totalBlogCount = result.data.count;
              state.lastFetchCount = fetchedCount;
              state.hasMoreBlogs = hasMore;
              state.statusStates.blogPosts = createStatusState("success");
            });
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Blog listesi alınırken bir hata oluştu";

            set((state) => {
              state.statusStates.blogPosts = createStatusState(
                "error",
                errorMessage,
              );
            });

            toast.error("Blog Listesi Yüklenemedi", {
              description: errorMessage,
            });
          }
        },

        // Blog listesini temizleme
        clearBlogPosts: () => {
          set((state) => {
            state.fetchedBlogs = {};
            state.visibleBlogIds = [];
            state.totalBlogCount = 0;
            state.lastFetchCount = 0;
            state.hasMoreBlogs = true;
            state.blogPostsQuery = {
              limit: 10,
              offset: 0,
              sortBy: "createdAt",
              sortDirection: "desc",
            };
          });
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
