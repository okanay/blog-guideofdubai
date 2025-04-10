// app/components/editor/create/store.tsx
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";

interface DataState {
  view: {
    mode: BlogViewMode;
    setMode: (mode: BlogViewMode) => void;
  };
}

export function EditorProvider({ children }: EditorProviderProps) {
  const [store] = useState(() =>
    createStore<DataState>()(
      immer((set) => ({
        // Mod yönetimi
        view: {
          mode: "form",
          setMode: (mode: BlogViewMode) =>
            set((state) => {
              state.view.mode = mode;
            }),
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
type EditorProviderProps = PropsWithChildren;
