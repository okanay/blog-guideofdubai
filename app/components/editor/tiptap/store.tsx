import { Editor } from "@tiptap/react";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { toast } from "sonner";
import { createStore, StoreApi, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { API_URL } from "../helper";
import { useEditor } from "./config";

type Props = PropsWithChildren & {
  initialContent?: string;
};

interface DataState {
  editor: Editor;
  view: {
    mode: TiptapViewMode;
    setMode: (mode: TiptapViewMode) => void;
  };
  translateContent: (
    targetLanguage: string,
    sourceLanguage: string,
  ) => Promise<void>;
}

const TiptapContext = createContext<TiptapContextType>(undefined);

type TiptapContextType = StoreApi<DataState> | undefined;

export function TiptapProvider({ children, initialContent = "" }: Props) {
  const editor = useEditor(initialContent);

  const [store] = useState(() =>
    createStore<DataState>()(
      immer((set, get) => ({
        editor,
        view: {
          mode: "edit",
          setMode: (mode: TiptapViewMode) =>
            set((state) => {
              state.view.mode = mode;
            }),
        },
        translateContent: async (targetLanguage, sourceLanguage) => {
          if (!editor) {
            toast.error("Editör bulunamadı.");
            return;
          }

          try {
            // Editörden hem HTML hem de JSON içeriğini al
            const html = editor.getHTML();
            const json = JSON.stringify(editor.getJSON());
            const useJSON = true; // JSON kullanmak istiyorsanız true, HTML tercih ediyorsanız false yapın

            // İstek verisini hazırla
            const requestBody = {
              sourceLanguage,
              targetLanguage,
              html,
              tiptapJSON: json,
            };

            // API isteğini yap
            const res = await fetch(`${API_URL}/auth/ai/translate`, {
              credentials: "include",
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(requestBody),
            });

            const data = await res.json();

            if (!res.ok) {
              // Rate limit hatası kontrolü
              if (data.error === "rate_limit_exceeded") {
                // Rate limit hata mesajını göster
                toast.error(
                  data.message ||
                    "İstek limiti aşıldı. Lütfen daha sonra tekrar deneyin.",
                );
                console.log("Rate limit details:", data.data);
                return;
              }
              // Diğer hata durumları
              throw new Error(data.message || "Çeviri başarısız.");
            }

            console.log("Translation Response Data:", data);

            // Çevrilen içeriği editöre yükle - JSON veya HTML formatına göre
            if (useJSON && data.data.translatedJSON) {
              // JSON içeriği editöre yükle - daha güvenilir
              try {
                const parsedJSON = JSON.parse(data.data.translatedJSON);
                editor.commands.setContent(parsedJSON);

                // Eğer Instagram carousel gibi özel bileşenler varsa, editörü güncelle
                editor.view.updateState(editor.state);
              } catch (parseError) {
                console.error("JSON parse hatası:", parseError);
                throw new Error(
                  "Çevrilen JSON içeriği yüklenirken hata oluştu.",
                );
              }
            } else if (data.data.translatedHTML) {
              // HTML içeriği editöre yükle - alternatif çözüm
              editor.commands.setContent(data.data.translatedHTML);
            } else {
              throw new Error("Çevrilen içerik bulunamadı.");
            }

            // Maliyet ve token bilgilerini loglayalım
            if (data.data.cost) {
              console.log("Translation cost:", data.data.cost);
            }

            toast.success(
              `Çeviri tamamlandı. (${data.data.tokensUsed} token kullanıldı)`,
            );
          } catch (e: any) {
            toast.error(e.message || "Çeviri sırasında hata oluştu.");
            console.error("Translation error:", e);
          }
        },
      })),
    ),
  );

  return (
    <TiptapContext.Provider value={store as StoreApi<DataState>}>
      {children}
    </TiptapContext.Provider>
  );
}

export const useTiptapContext = () => {
  const context = useContext(TiptapContext);

  if (!context) {
    throw new Error(
      "useTiptapContext hook must be used within an TiptapProvider",
    );
  }

  const editor = useStore(context, (state) => state);
  return editor;
};
