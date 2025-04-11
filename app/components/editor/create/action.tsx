import { CreateBlogForm } from "../form";
import { useTiptapContext } from "../tiptap/store";
import { useEditorContext } from "../store";
import { SafeBlogCreateData } from "../validations/create";

export const CreateBlogAction = () => {
  const { editor } = useTiptapContext();
  const { formValues } = useEditorContext();

  const handleOnSubmit = async (values: Blog) => {
    const safeData = await SafeBlogCreateData(values, editor);
    if (!safeData.success) return;
    const data = safeData.data;
    console.log(data);
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
