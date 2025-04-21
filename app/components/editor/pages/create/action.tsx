import { CreateBlogForm } from "@/components/editor/form";
import { useEditorContext } from "@/components/editor/store";
import { useTiptapContext } from "@/components/editor/tiptap/store";
import { LoadingBlocker } from "@/components/editor/ui/loading-blocker";
import { ConvertFormSchemaToCreateData } from "@/components/editor/validations/blog-form";
import { useNavigate } from "@/i18n/navigate";
import { useEffect } from "react";
import { toast } from "sonner";

export const CreateBlogAction = () => {
  const { editor } = useTiptapContext();
  const { createBlog, createStatus } = useEditorContext();
  const navigate = useNavigate();

  const handleCreateForm = async (values: BlogFormSchema) => {
    const status = await createBlog(
      ConvertFormSchemaToCreateData(values, editor),
    );

    if (!status) return;
    navigate({ to: "/editor" });
  };

  return (
    <>
      <LoadingBlocker
        loading={createStatus.loading}
        label="Blog Oluşturuluyor..."
      />

      <CreateBlogForm
        submitLabel="Blog Oluştur"
        initialAutoMode={true}
        onSubmit={(values) => handleCreateForm(values)}
      />
    </>
  );
};
