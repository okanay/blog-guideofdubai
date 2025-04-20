import { useEffect } from "react";
import { toast } from "sonner";
import { CreateBlogForm } from "../form";
import { useTiptapContext } from "../tiptap/store";
import { useEditorContext } from "../store";
import { ConvertFormSchemaToCreateData } from "../validations/blog-form";
import { LoadingBlocker } from "../ui/loading-blocker";

export const CreateBlogAction = () => {
  const { editor } = useTiptapContext();
  const { createBlog, createStatus } = useEditorContext();

  // Form gönderim işleyicisi
  const handleOnSubmit = async (values: BlogFormSchema) => {
    const safeData = ConvertFormSchemaToCreateData(values, editor);

    if (!safeData.success) return;

    await createBlog(safeData.data);
  };

  // İşlem durumunu izle ve bildirimleri göster
  useEffect(() => {
    if (createStatus.status === "error") {
      toast.error("Blog oluşturulurken bir hata oluştu.", {
        description: createStatus.error,
      });
    }

    if (createStatus.status === "success") {
      toast.success("Blog başarıyla oluşturuldu.");
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
        onSubmit={handleOnSubmit}
      />
    </>
  );
};
