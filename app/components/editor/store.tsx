// app/components/editor/create/store.tsx
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";

type Props = PropsWithChildren & {
  children: React.ReactNode;
  initialFormValues: BlogSchema;
};

interface DataState {
  view: {
    mode: BlogViewMode;
    setMode: (mode: BlogViewMode) => void;
  };
  formValues: BlogSchema;
  setFormValues: (values: BlogSchema) => void;

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
}

const API_URL =
  import.meta.env.VITE_APP_BACKEND_URL + "/auth" ||
  "http://localhost:8080/auth";

export function EditorProvider({ children, initialFormValues }: Props) {
  const [store] = useState(() =>
    createStore<DataState>()(
      immer((set) => ({
        view: {
          mode: "form",
          setMode: (mode: BlogViewMode) =>
            set((state) => {
              state.view.mode = mode;
            }),
        },
        formValues: { ...initialFormValues },
        setFormValues: (values: BlogSchema) =>
          set((state) => {
            state.formValues = values;
          }),

        categoryStatus: {
          loading: false,
          error: null,
        },
        createBlog: async (blog: any) => {
          set((state) => {
            state.categoryStatus.loading = true;
            state.categoryStatus.error = null;
          });

          try {
            const response = await fetch(`${API_URL}/blog`, {
              method: "POST",
              body: JSON.stringify(blog),
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });

            if (!response.ok) {
              set((state) => {
                state.categoryStatus.error =
                  "Blog oluşturulurken bir hata oluştu";
                state.categoryStatus.loading = false;
              });
              return false;
            }

            set((state) => {
              state.categoryStatus.loading = false;
              state.categoryStatus.error = null;
            });

            return true;
          } catch (error) {
            set((state) => {
              state.categoryStatus.error =
                "Blog oluşturulurken bir hata oluştu";
              state.categoryStatus.loading = false;
            });
            return false;
          }
        },

        categories: [],
        createStatus: {
          loading: false,
          error: null,
        },
        refreshCategories: async () => {
          // Sadece kategori yüklenme durumunu güncelle
          set((state) => {
            state.categoryStatus.loading = true;
            state.categoryStatus.error = null;
          });

          try {
            const response = await fetch(`${API_URL}/blog/categories`, {
              headers: { "Content-Type": "application/json" },
              method: "GET",
              credentials: "include",
            });

            if (!response.ok) {
              set((state) => {
                state.categoryStatus.error =
                  "Kategori listesi yenilenirken bir hata oluştu";
                state.categoryStatus.loading = false;
              });
              return;
            }

            const data = await response.json();

            set((state) => {
              state.categories = data.categories ?? [];
              state.categoryStatus.loading = false;
            });
          } catch (error) {
            set((state) => {
              state.categoryStatus.error =
                "Kategori listesi yenilenirken bir hata oluştu";
              state.categoryStatus.loading = false;
            });
          }
        },
        addCategory: async (category: Category) => {
          // Sadece kategori yüklenme durumunu güncelle
          set((state) => {
            state.categoryStatus.loading = true;
            state.categoryStatus.error = null;
          });

          try {
            const response = await fetch(`${API_URL}/blog/category`, {
              method: "POST",
              body: JSON.stringify(category),
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });

            if (!response.ok) {
              set((state) => {
                state.categoryStatus.error =
                  "Kategori eklerken bir hata oluştu";
                state.categoryStatus.loading = false;
              });
              return;
            }

            const newCategory = await response.json();

            set((state) => {
              state.categories.push(newCategory);
              state.categoryStatus.loading = false;
            });
          } catch (error) {
            console.error("Failed to add category:", error);
            set((state) => {
              state.categoryStatus.error = "Kategori eklerken bir hata oluştu";
              state.categoryStatus.loading = false;
            });
            return;
          }
        },

        tags: [],
        tagStatus: {
          loading: false,
          error: null,
        },
        refreshTags: async () => {
          // Sadece tag yüklenme durumunu güncelle
          set((state) => {
            state.tagStatus.loading = true;
            state.tagStatus.error = null;
          });

          try {
            const response = await fetch(`${API_URL}/blog/tags`, {
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });

            if (!response.ok) {
              set((state) => {
                state.tagStatus.error =
                  "Etiket listesi yenilenirken bir hata oluştu";
                state.tagStatus.loading = false;
              });
            }

            const data = await response.json();

            set((state) => {
              state.tags = data.tags ?? [];
              state.tagStatus.loading = false;
            });
          } catch (error) {
            set((state) => {
              state.tagStatus.error =
                "Etiket listesi yenilenirken bir hata oluştu";
              state.tagStatus.loading = false;
            });
          }
        },
        addTag: async (tag: Tag) => {
          // Sadece tag yüklenme durumunu güncelle
          set((state) => {
            state.tagStatus.loading = true;
            state.tagStatus.error = null;
          });

          try {
            const response = await fetch(`${API_URL}/blog/tag`, {
              method: "POST",
              body: JSON.stringify(tag),
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });

            if (!response.ok) {
              set((state) => {
                state.tagStatus.error = "Etiket eklerken bir hata oluştu";
                state.tagStatus.loading = false;
              });
            }

            const newTag = await response.json();

            set((state) => {
              state.tags.push(newTag);
              state.tagStatus.loading = false;
            });
          } catch (error) {
            set((state) => {
              state.tagStatus.error = "Etiket eklerken bir hata oluştu";
              state.tagStatus.loading = false;
            });
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
