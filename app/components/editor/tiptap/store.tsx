import { immer } from "zustand/middleware/immer";
import { useEditor } from "./config";
import { Editor } from "@tiptap/react";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { createStore, StoreApi, useStore } from "zustand";

type Props = PropsWithChildren & {
  initialContent?: string;
};

interface DataState {
  editor: Editor;
  view: {
    mode: ViewMode;
    setMode: (mode: ViewMode) => void;
  };
}

export function EditorProvider({ children, initialContent = "" }: Props) {
  const editor = useEditor(initialContent);

  const [store] = useState(() =>
    createStore<DataState>()(
      immer((set, get) => ({
        editor,
        view: {
          mode: "edit",
          setMode: (mode: ViewMode) =>
            set((state) => {
              state.view.mode = mode;
            }),
        },
      })),
    ),
  );

  return (
    <EditorContext.Provider value={store as StoreApi<DataState>}>
      {children}
    </EditorContext.Provider>
  );
}

export const useTiptapContext = () => {
  const context = useContext(EditorContext);

  if (!context) {
    throw new Error(
      "useTiptapContext hook must be used within an EditorProvider",
    );
  }

  const editor = useStore(context, (state) => state);
  return editor;
};

const EditorContext = createContext<EditorContextType>(undefined);

type EditorContextType = StoreApi<DataState> | undefined;
type Set = (fn: (state: DataState) => void) => void;
type Get = () => DataState;
