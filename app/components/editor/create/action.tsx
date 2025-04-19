import { CreateBlogForm } from "../form";
import { useTiptapContext } from "../tiptap/store";
import { useEditorContext } from "../store";
import { BlogCreateData } from "../validations/form";

export const CreateBlogAction = () => {
  const { editor } = useTiptapContext();
  const { formValues, createBlog, createStatus } = useEditorContext();

  const handleOnSubmit = async (values: BlogFormSchema) => {
    const safeData = await BlogCreateData(values, editor);
    if (!safeData.success || createStatus.loading) return;
    const status = await createBlog(safeData.data);
  };

  return (
    <CreateBlogForm
      initialValues={formValues}
      submitLabel="Blog Oluştur"
      initialAutoMode={true}
      onSubmit={handleOnSubmit}
    />
  );
};
