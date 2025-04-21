import { ConvertBlogSchemaToFormSchema, ConvertFormSchemaToUpdateData } from "@/components/editor/validations/convert"; // prettier-ignore
import { useNavigate } from "@/i18n/navigate";
import { CreateBlogForm } from "@/components/editor/form";
import { useEditorContext } from "@/components/editor/store";
import { useTiptapContext } from "@/components/editor/tiptap/store";
import { LoadingBlocker } from "@/components/editor/ui/loading-blocker";

export const EditBlogAction = (props: { initialData: BlogSchema }) => {
  const navigate = useNavigate();
  const { editor } = useTiptapContext();
  const { updateBlog, updateStatus, refreshCategories, refreshTags } =
    useEditorContext();

  const handleUpdateForm = async (values: BlogFormSchema) => {
    const status = await updateBlog({
      ...ConvertFormSchemaToUpdateData(props.initialData.id, values, editor),
    });

    if (!status) return;
    navigate({ to: "/editor" });
  };

  return (
    <>
      <LoadingBlocker
        loading={updateStatus.loading}
        label="Blog Güncelleniyor..."
      />

      <CreateBlogForm
        initialData={ConvertBlogSchemaToFormSchema(props.initialData)}
        submitLabel="Blog Güncelle"
        initialAutoMode={false}
        onSubmit={(values) => handleUpdateForm(values)}
      />
    </>
  );
};
