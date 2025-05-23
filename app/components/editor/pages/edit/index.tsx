import { Editor } from "@/components/editor/tiptap";
import { useEditorContext } from "@/components/editor/store";
import { EditBlogAction } from "./action";

export function EditBlogPage({ initialData }) {
  const { view } = useEditorContext();

  return (
    <main className="flex min-h-screen flex-col">
      <div className="relative overflow-hidden bg-white pb-8">
        <div
          data-visible={view.mode === "form"}
          className="w-full px-4 transition-all duration-300 ease-in-out data-[visible=false]:invisible data-[visible=false]:absolute data-[visible=false]:opacity-0 data-[visible=true]:opacity-100"
        >
          <EditBlogAction initialData={initialData} />
        </div>

        <div
          data-visible={view.mode === "editor"}
          className="w-full transition-all duration-300 ease-in-out data-[visible=false]:invisible data-[visible=false]:absolute data-[visible=false]:opacity-0 data-[visible=true]:opacity-100"
        >
          <Editor />
        </div>
      </div>
    </main>
  );
}
