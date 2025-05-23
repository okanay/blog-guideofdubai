import { Editor } from "@/components/editor/tiptap";
import { useEditorContext } from "@/components/editor/store";
import { CreateBlogAction } from "./action";
import { DEFAULT_BLOG_FORM_VALUES } from "../../form/default";

export function CreateBlogPage() {
  const { view } = useEditorContext();

  return (
    <main className="flex min-h-screen flex-col">
      <div className="relative overflow-hidden bg-white pb-8">
        <div
          data-visible={view.mode === "form"}
          className="w-full px-4 transition-all duration-300 ease-in-out data-[visible=false]:invisible data-[visible=false]:absolute data-[visible=false]:opacity-0 data-[visible=true]:opacity-100"
        >
          <CreateBlogAction initialData={DEFAULT_BLOG_FORM_VALUES} />
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
