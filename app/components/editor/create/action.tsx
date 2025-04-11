import { CreateBlogForm } from "../form";
import { DEFAULT_BLOG_FORM_VALUES } from "../form/default";
import { useTiptapContext } from "../tiptap/store";

export const CreateBlogAction = () => {
  const { editor } = useTiptapContext();

  const handleOnSubmit = async (data: FormSchema) => {};

  return (
    <CreateBlogForm
      initialValues={DEFAULT_BLOG_FORM_VALUES}
      submitLabel="Blog Oluştur"
      initialAutoMode={true}
      onSubmit={handleOnSubmit}
    />
  );
};
