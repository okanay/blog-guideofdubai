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

  useEffect(() => {
    if (createStatus.status === "error") {
      toast.error("Blog oluşturulurken bir hata oluştu.", {
        description: createStatus.error,
      });
    }

    if (createStatus.status === "success") {
      toast.success("Blog başarıyla oluşturuldu.");
      navigate({ to: "/editor" });
    }
  }, [createStatus]);

  return (
    <>
      <LoadingBlocker
        loading={createStatus.loading}
        label="Blog Oluşturuluyor..."
      />

      <CreateBlogForm
        submitLabel="Blog Oluştur"
        initialAutoMode={true}
        onSubmit={(values: BlogFormSchema) => {
          createBlog(ConvertFormSchemaToCreateData(values, editor));
        }}
      />
    </>
  );
};
