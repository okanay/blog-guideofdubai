import { useEffect } from "react";
import { toast } from "sonner";
import { CreateBlogForm } from "../form";
import { useEditorContext } from "../store";
import { useTiptapContext } from "../tiptap/store";
import { LoadingBlocker } from "../ui/loading-blocker";
import { ConvertFormSchemaToCreateData } from "../validations/blog-form";
import { useNavigate } from "@/i18n/navigate";

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
