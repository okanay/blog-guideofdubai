// app/components/editor/create/store.tsx
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";

const API_URL =
  import.meta.env.VITE_APP_BACKEND_URL + "/auth" ||
  "http://localhost:8080/auth";

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
  initialFormValues: BlogSchema;
};

interface DataState {
  view: {
    mode: BlogViewMode;
    setMode: (mode: BlogViewMode) => void;
  };
  formValues: BlogSchema;
  setFormValues: (values: BlogSchema) => void;

  createBlog: (blog: any) => Promise<void>;
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

        createStatus: createStatusState(),
        categoryStatus: createStatusState(),
        tagStatus: createStatusState(),

        categories: [],
        tags: [],

        createBlog: async (blog: any) => {
          set((state) => {
            state.createStatus = createStatusState("loading");
          });

          try {
            const response = await fetch(`${API_URL}/blog`, {
              method: "POST",
              body: JSON.stringify(blog),
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
              set((state) => {
                state.createStatus = createStatusState(
                  "error",
                  data.error || "Blog oluşturulurken bir hata oluştu",
                );
              });

              return;
            }

            set((state) => {
              state.createStatus = createStatusState("success");
            });

            return data;
          } catch (error) {
            set((state) => {
              state.createStatus = createStatusState(
                "error",
                "Beklenmedik bir hata oluştu lütfen tekrar deneyin.",
              );
            });
          }
        },

        addCategory: async (category: Category) => {
          set((state) => {
            state.categoryStatus = createStatusState("loading");
          });

          try {
            const response = await fetch(`${API_URL}/blog/category`, {
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
            const response = await fetch(`${API_URL}/blog/tag`, {
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
            const response = await fetch(`${API_URL}/blog/categories`, {
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
            const response = await fetch(`${API_URL}/blog/tags`, {
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
