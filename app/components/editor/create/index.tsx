import { Editor } from "../tiptap";
import { useEditorContext } from "../store";
import { CreateBlogAction } from "./action";

export function CreateBlogPage() {
  const { view } = useEditorContext();

  return (
    <main className="flex min-h-screen flex-col">
      <div className="relative overflow-hidden bg-white pb-8">
        <div
          data-visible={view.mode === "form"}
          className="w-full px-4 transition-all duration-300 ease-in-out data-[visible=false]:invisible data-[visible=false]:absolute data-[visible=false]:opacity-0 data-[visible=true]:opacity-100"
        >
          <CreateBlogAction />
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
