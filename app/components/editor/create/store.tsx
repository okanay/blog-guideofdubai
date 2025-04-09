// app/components/editor/create/store.tsx
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";

interface CreateBlogState {
  // Mod yönetimi
  view: {
    mode: BlogViewMode;
    setMode: (mode: BlogViewMode) => void;
  };

  // Gönderim durumu
  submitting: {
    status: boolean;
    setStatus: (status: boolean) => void;
  };
}

export function CreateBlogProvider({ children }: CreateBlogProviderProps) {
  const [store] = useState(() =>
    createStore<CreateBlogState>()(
      immer((set) => ({
        // Mod yönetimi
        view: {
          mode: "form",
          setMode: (mode: BlogViewMode) =>
            set((state) => {
              state.view.mode = mode;
            }),
        },

        // Gönderim durumu
        submitting: {
          status: false,
          setStatus: (status) =>
            set((state) => {
              state.submitting.status = status;
            }),
        },
      })),
    ),
  );

  return (
    <CreateBlogContext.Provider value={store}>
      {children}
    </CreateBlogContext.Provider>
  );
}

export function useCreateBlog() {
  const context = useContext(CreateBlogContext);

  if (!context) {
    throw new Error(
      "useCreateBlog hook must be used within a CreateBlogProvider",
    );
  }

  return useStore(context, (state) => state);
}

const CreateBlogContext = createContext<CreateBlogContextType>(undefined);
type CreateBlogContextType = StoreApi<CreateBlogState> | undefined;
type CreateBlogProviderProps = PropsWithChildren;
