// app/components/editor/create/store.tsx
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { toast } from "sonner";
import { createStore, StoreApi, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";

const API_URL =
  import.meta.env.VITE_APP_BACKEND_URL || "http://localhost:8080/";

const createStatusState = (
  status: StatusState["status"] = "idle",
  message?: string,
): StatusState => ({
  status,
  message,
  loading: status === "loading",
  error: status === "error" ? message || null : null,
});

type Props = PropsWithChildren & {
  children: React.ReactNode;
  activeBlogData: BlogSchema;
};

interface DataState {
  // Mevcut durum özellikleri
  view: {
    mode: BlogViewMode;
    setMode: (mode: BlogViewMode) => void;
  };
  activeBlogData: BlogSchema;
  setActiveBlogData: (values: BlogSchema) => void;

  createBlog: (blog: any) => Promise<boolean>;
  createStatus: StatusState;

  categories: Category[];
  addCategory: (category: Category) => Promise<void>;
  refreshCategories: () => Promise<void>;
  categoryStatus: StatusState;

  tags: Tag[];
  addTag: (tag: Tag) => Promise<void>;
  refreshTags: () => Promise<void>;
  tagStatus: StatusState;

  // Yeni blog post listesi özellikleri
  blogPosts: BlogPostCardView[];
  blogPostsTotal: number;
  blogPostsStatus: StatusState;
  blogPostsQuery: BlogCardQueryOptions;
  setBlogPostsQuery: (query: Partial<BlogCardQueryOptions>) => void;
  fetchBlogPosts: () => Promise<void>;
  clearBlogPosts: () => void;

  deleteBlogStatus: StatusState;
  deleteBlog: (id: string) => Promise<boolean>;

  changeBlogStatusStatus: StatusState;
  changeBlogStatus: (id: string, status: BlogStatus) => Promise<boolean>;
}

export function EditorProvider({ children, activeBlogData }: Props) {
  const [store] = useState(() =>
    createStore<DataState>()(
      immer((set, get) => ({
        view: {
          mode: "form",
          setMode: (mode: BlogViewMode) =>
            set((state) => {
              state.view.mode = mode;
            }),
        },
        activeBlogData: { ...activeBlogData },
        setActiveBlogData: (values: BlogSchema) =>
          set((state) => {
            state.activeBlogData = values;
          }),

        createStatus: createStatusState(),
        categoryStatus: createStatusState(),
        tagStatus: createStatusState(),
        blogPostsStatus: createStatusState(),
        deleteBlogStatus: createStatusState(),
        changeBlogStatusStatus: createStatusState(),

        categories: [],
        tags: [],
        blogPosts: [],
        blogPostsTotal: 0,
        blogPostsQuery: {
          limit: 10,
          offset: 0,
          sortBy: "createdAt",
          sortDirection: "desc",
        },

        createBlog: async (blog: any) => {
          set((state) => {
            state.createStatus = createStatusState("loading");
          });

          try {
            const response = await fetch(`${API_URL}/auth/blog`, {
              method: "POST",
              body: JSON.stringify(blog),
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
              const errorMessage =
                data.message || "Blog oluşturulurken bir hata oluştu";

              set((state) => {
                state.createStatus = createStatusState("error", errorMessage);
              });

              toast.error("Blog Oluşturulamadı", {
                description: errorMessage,
              });

              return false;
            }

            set((state) => {
              state.createStatus = createStatusState("success");
            });

            toast.success("Blog Başarıyla Oluşturuldu", {
              description: "Blog içeriğiniz başarıyla kaydedildi.",
            });

            return true;
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Beklenmedik bir hata oluştu lütfen tekrar deneyin.";

            set((state) => {
              state.createStatus = createStatusState("error", errorMessage);
            });

            toast.error("Blog Oluşturulamadı", {
              description: errorMessage,
            });

            return false;
          }
        },

        addCategory: async (category: Category) => {
          set((state) => {
            state.categoryStatus = createStatusState("loading");
          });

          try {
            const response = await fetch(`${API_URL}/auth/blog/category`, {
              method: "POST",
              body: JSON.stringify(category),
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });

            if (!response.ok) {
              const errorMessage = "Kategori eklerken bir hata oluştu";
              throw new Error(errorMessage);
            }

            const newCategory = await response.json();

            set((state) => {
              state.categories.push(newCategory);
              state.categoryStatus = createStatusState("success");
            });

            return newCategory;
          } catch (error) {
            console.error("Failed to add category:", error);

            const errorMessage =
              error instanceof Error
                ? error.message
                : "Kategori eklerken bir hata oluştu";

            set((state) => {
              state.categoryStatus = createStatusState("error", errorMessage);
            });

            throw error;
          }
        },

        addTag: async (tag: Tag) => {
          set((state) => {
            state.tagStatus = createStatusState("loading");
          });

          try {
            const response = await fetch(`${API_URL}/auth/blog/tag`, {
              method: "POST",
              body: JSON.stringify(tag),
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });

            if (!response.ok) {
              const errorMessage = "Etiket eklerken bir hata oluştu";
              throw new Error(errorMessage);
            }

            const newTag = await response.json();

            set((state) => {
              state.tags.push(newTag);
              state.tagStatus = createStatusState("success");
            });

            return newTag;
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Etiket eklerken bir hata oluştu";

            set((state) => {
              state.tagStatus = createStatusState("error", errorMessage);
            });

            throw error;
          }
        },

        refreshCategories: async () => {
          set((state) => {
            state.categoryStatus = createStatusState("loading");
          });

          try {
            const response = await fetch(`${API_URL}/auth/blog/categories`, {
              headers: { "Content-Type": "application/json" },
              method: "GET",
              credentials: "include",
            });

            if (!response.ok) {
              const errorMessage =
                "Kategori listesi yenilenirken bir hata oluştu";
              throw new Error(errorMessage);
            }

            const data = await response.json();

            set((state) => {
              state.categories = data.categories ?? [];
              state.categoryStatus = createStatusState("success");
            });

            return data.categories;
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Kategori listesi yenilenirken bir hata oluştu";

            set((state) => {
              state.categoryStatus = createStatusState("error", errorMessage);
            });

            throw error;
          }
        },

        refreshTags: async () => {
          set((state) => {
            state.tagStatus = createStatusState("loading");
          });

          try {
            const response = await fetch(`${API_URL}/auth/blog/tags`, {
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });

            if (!response.ok) {
              const errorMessage =
                "Etiket listesi yenilenirken bir hata oluştu";
              throw new Error(errorMessage);
            }

            const data = await response.json();

            set((state) => {
              state.tags = data.tags ?? [];
              state.tagStatus = createStatusState("success");
            });

            return data.tags;
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Etiket listesi yenilenirken bir hata oluştu";

            set((state) => {
              state.tagStatus = createStatusState("error", errorMessage);
            });

            throw error;
          }
        },

        setBlogPostsQuery: (query: Partial<BlogCardQueryOptions>) => {
          set((state) => {
            state.blogPostsQuery = { ...state.blogPostsQuery, ...query };

            // Yeni sorgu yapıldığında offset'i sıfırla
            if (
              query.limit ||
              query.language ||
              query.title ||
              query.status ||
              query.featured
            ) {
              state.blogPostsQuery.offset = 0;
            }
          });
        },

        fetchBlogPosts: async () => {
          set((state) => {
            state.blogPostsStatus = createStatusState("loading");
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
            const url = `${API_URL}/blog/cards${queryString ? `?${queryString}` : ""}`;

            const response = await fetch(url, {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });

            if (!response.ok) {
              throw new Error("Blog listesi alınırken bir hata oluştu");
            }

            const data = await response.json();

            if (!data.success) {
              throw new Error(
                data.error || "Blog listesi alınırken bir hata oluştu",
              );
            }

            set((state) => {
              // Eğer offset 0 ise mevcut listeyi temizle, değilse mevcut listeye ekle (sonsuz kaydırma için)
              const isFirstPage = state.blogPostsQuery.offset === 0;
              state.blogPosts = isFirstPage
                ? data.blogs
                : [...state.blogPosts, ...data.blogs];
              state.blogPostsTotal = data.count;
              state.blogPostsStatus = createStatusState("success");
            });
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Blog listesi alınırken bir hata oluştu";

            set((state) => {
              state.blogPostsStatus = createStatusState("error", errorMessage);
            });

            toast.error("Blog Listesi Yüklenemedi", {
              description: errorMessage,
            });
          }
        },

        clearBlogPosts: () => {
          set((state) => {
            state.blogPosts = [];
            state.blogPostsTotal = 0;
            state.blogPostsQuery = {
              limit: 10,
              offset: 0,
              sortBy: "createdAt",
              sortDirection: "desc",
            };
          });
        },

        changeBlogStatus: async (id: string, status: BlogStatus) => {
          set((state) => {
            state.changeBlogStatusStatus = createStatusState("loading");
          });

          try {
            const response = await fetch(`${API_URL}/auth/blog/status`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id, status }),
              credentials: "include",
            });

            if (!response.ok) {
              throw new Error("Blog durumu değiştirilirken bir hata oluştu");
            }

            const data = await response.json();

            if (!data.success) {
              throw new Error(
                data.error || "Blog durumu değiştirilirken bir hata oluştu",
              );
            }

            set((state) => {
              // Blog durumunu güncelle
              state.blogPosts = state.blogPosts.map((post) =>
                post.id === id ? { ...post, status } : post,
              );
              state.changeBlogStatusStatus = createStatusState("success");
            });

            toast.success("Blog durumu başarıyla güncellendi");
            return true;
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Blog durumu değiştirilirken bir hata oluştu";

            set((state) => {
              state.changeBlogStatusStatus = createStatusState(
                "error",
                errorMessage,
              );
            });

            toast.error("Blog Durumu Değiştirilemedi", {
              description: errorMessage,
            });

            return false;
          }
        },

        deleteBlog: async (id: string) => {
          set((state) => {
            state.deleteBlogStatus = createStatusState("loading");
          });

          try {
            const response = await fetch(`${API_URL}/auth/blog/${id}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });

            if (!response.ok) {
              throw new Error("Blog silinirken bir hata oluştu");
            }

            const data = await response.json();

            if (!data.success) {
              throw new Error(data.error || "Blog silinirken bir hata oluştu");
            }

            set((state) => {
              // Silinen blog'u listeden kaldır
              state.blogPosts = state.blogPosts.filter(
                (post) => post.id !== id,
              );
              state.blogPostsTotal = Math.max(0, state.blogPostsTotal - 1);
              state.deleteBlogStatus = createStatusState("success");
            });

            toast.success("Blog başarıyla silindi");
            return true;
          } catch (error) {
            const errorMessage =
              error instanceof Error
                ? error.message
                : "Blog silinirken bir hata oluştu";

            set((state) => {
              state.deleteBlogStatus = createStatusState("error", errorMessage);
            });

            toast.error("Blog Silinemedi", {
              description: errorMessage,
            });

            return false;
          }
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
