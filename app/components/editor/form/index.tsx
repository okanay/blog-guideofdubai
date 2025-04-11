import { DEFAULT_BLOG_FORM_VALUES } from "./default";
import { DEFAULT_CATEGORY_OPTIONS, DEFAULT_TAG_OPTIONS } from "../constants"; // prettier-ignore
import { ImagePreview, Input, MultiSelect, ReadTime, Select, SeoPreview, SlugCreator, Textarea, Toggle } from "@/components/editor/ui"; // prettier-ignore
import { LANGUAGE_DICTONARY } from "@/i18n/config";
import { Controller, useForm } from "react-hook-form";
import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./validation";
import { useTiptapContext } from "../tiptap/store";

type Props = {
  initialValues?: FormSchema;
  onSubmit?: (data: FormSchema) => void;
  submitLabel?: string;
  initialAutoMode?: boolean;
};

export function CreateBlogForm({
  initialValues = DEFAULT_BLOG_FORM_VALUES,
  submitLabel = "Yayınla",
  initialAutoMode = true,
  onSubmit = (data: FormSchema) => {
    console.log(data);
  },
}: Props) {
  const { editor } = useTiptapContext();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: { ...initialValues },
  });

  const seoTitleRef = useRef<HTMLInputElement>(null);
  const seoDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const seoImageRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);

  console.log("render");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex max-w-3xl flex-col gap-y-6 py-6"
    >
      <div className="mb-4">
        <h1 className="mb-1 text-2xl font-bold text-zinc-900">
          Blog Detayları
        </h1>
        <p className="text-sm text-zinc-500">
          Blog yazınızın başlığı, açıklaması ve diğer detaylarını ayarlayın.
          İçerik eklemek için "İçerik" sekmesine geçebilirsiniz.
        </p>
      </div>

      {/* SEO Ayarları */}
      <div>
        <h2 className="mb-4 border-b border-zinc-200 pb-2 text-lg font-medium text-zinc-800">
          SEO Ayarları
        </h2>

        <div className="space-y-4">
          <Controller
            name="seoTitle"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="seo-title"
                label="Başlık"
                isRequired={true}
                maxLength={40}
                showCharCount={true}
                isError={!!errors.seoTitle}
                errorMessage={errors.seoTitle?.message}
                ref={(e) => {
                  field.ref(e);
                  seoTitleRef.current = e;
                }}
              />
            )}
          />

          <Controller
            name="seoSlug"
            control={control}
            render={({ field }) => (
              <SlugCreator
                {...field}
                label="URL"
                id="seo-slug"
                hint="Makalenin URL'de görünecek benzersiz tanımlayıcısı"
                isRequired={true}
                isError={!!errors.seoSlug}
                errorMessage={errors.seoSlug?.message}
                isAutoMode={true}
                initialAutoMode={initialAutoMode}
                followRef={seoTitleRef}
                ref={(e) => {
                  field.ref(e);
                  slugRef.current = e;
                }}
              />
            )}
          />

          <Controller
            name="seoDescription"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                label="Açıklaması"
                id="seo-description"
                placeholder="Arama motorları için açıklama."
                hint="Hedef kelimelerinizi içeren, kullanıcıyı sayfaya çekecek bir açıklama yazın."
                maxLength={160}
                rows={3}
                isRequired={true}
                isError={!!errors.seoDescription}
                errorMessage={errors.seoDescription?.message}
                ref={(e) => {
                  field.ref(e);
                  seoDescriptionRef.current = e;
                }}
              />
            )}
          />

          <Controller
            name="seoImage"
            control={control}
            render={({ field }) => (
              <ImagePreview
                {...field}
                id="seo-image"
                label="Sosyal Medya Görseli"
                hint="Sosyal medyada paylaşıldığında görünecek görsel"
                maxLength={160}
                isRequired={true}
                isError={!!errors.seoImage}
                errorMessage={errors.seoImage?.message}
                ref={(e) => {
                  field.ref(e);
                  seoImageRef.current = e;
                }}
              />
            )}
          />

          <SeoPreview
            titleInput={{ id: "seo-title", value: "" }}
            descriptionInput={{
              id: "seo-description",
              value: "",
            }}
            slugInput={{ id: "seo-slug", value: "" }}
            imageInput={{
              id: "seo-image",
              value: "",
            }}
            defaultMode="google"
            baseUrl="https://blog.guideofdubai.com/tr"
          />
        </div>
      </div>

      {/* İçerik Ayarları */}
      <div>
        <h2 className="mb-4 border-b border-zinc-200 pb-2 text-lg font-medium text-zinc-800">
          İçerik Ayarları
        </h2>

        <div className="space-y-6">
          <Controller
            name="blogTitle"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="blog-title"
                label="Kart Başlığı"
                placeholder="Dikkat çekici ve içeriği yansıtan bir başlık"
                hint="Başlık blog kartında büyük puntolarla gösterilir"
                isRequired={true}
                isError={!!errors.blogTitle}
                errorMessage={errors.blogTitle?.message}
                showCharCount={true}
                maxLength={40}
                isAutoMode={true}
                initialAutoMode={initialAutoMode}
                followRef={seoTitleRef}
              />
            )}
          />

          <Controller
            name="blogDescription"
            control={control}
            rules={{ required: "Kart açıklaması gereklidir" }}
            render={({ field }) => (
              <Textarea
                {...field}
                id="blog-description"
                label="Kart Açıklaması"
                placeholder="İçeriğinizin ana fikrini özetleyen kısa bir açıklama yazın"
                hint="Blog kartında başlığın altında küçük yazı ile gösterilir"
                isRequired={true}
                isError={!!errors.blogDescription}
                errorMessage={errors.blogDescription?.message}
                showCharCount={true}
                maxLength={120}
                rows={3}
                isAutoMode={true}
                initialAutoMode={initialAutoMode}
                followRef={seoDescriptionRef}
              />
            )}
          />

          <Controller
            name="blogImage"
            control={control}
            rules={{ required: "Kart görseli gereklidir." }}
            render={({ field }) => (
              <ImagePreview
                {...field}
                id="blog-image"
                label="Kart Görseli"
                placeholder="https://www.example.com/image.png"
                hint="Blog kartında görünecek görsel, boş bırakılırsa sosyal medya görseli kullanılır."
                isRequired={true}
                isError={!!errors.blogImage}
                errorMessage={errors.blogImage?.message}
                isAutoMode={true}
                initialAutoMode={initialAutoMode}
                followRef={seoImageRef}
              />
            )}
          />

          <Controller
            name="categories"
            control={control}
            render={({ field }) => (
              <MultiSelect
                label="Blog Kategorileri"
                id="blog-categories"
                options={DEFAULT_CATEGORY_OPTIONS}
                value={field.value}
                onChange={(newValue) => field.onChange(newValue)}
                isRequired={true}
                isError={!!errors.categories}
                errorMessage={errors.categories?.message}
              />
            )}
          />

          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <MultiSelect
                label="Blog Etiketleri"
                id="blog-tags"
                options={DEFAULT_TAG_OPTIONS}
                value={field.value}
                onChange={(newValue) => field.onChange(newValue)}
                hint="Blog yazınıza uygun etiketleri seçin, arama yaparken kullanıcı deneyimini kolaylaştırır."
                placeholder="Etiket seçin..."
                allowCustomOption={false}
                isRequired={false}
                customOptionPlaceholder="Özel etiket ekle..."
                searchPlaceholder="Etiketlerde ara..."
                isError={!!errors.tags}
                errorMessage={errors.tags?.message}
              />
            )}
          />
        </div>
      </div>

      {/* Diğer Ayarlar */}
      <div>
        <h2 className="mb-4 border-b border-zinc-200 pb-2 text-lg font-medium text-zinc-800">
          Diğer Ayarlar
        </h2>

        <div className="space-y-4">
          <Controller
            name="language"
            control={control}
            render={({ field }) => (
              <Select
                label="Blog Dili"
                id="blog-language"
                options={LANGUAGE_DICTONARY}
                value={field.value}
                onChange={(newValue) => field.onChange(newValue)}
                hint="Blog yazınızın dilini seçin."
                isRequired={true}
                allowCustomOption={false}
                placeholder="Dil seçimi yapın."
                isError={!!errors.language}
                errorMessage={errors.language?.message}
              />
            )}
          />
          <Controller
            name="readTime"
            control={control}
            render={({ field }) => (
              <ReadTime
                label="Okuma Süresi"
                id="blog-read-time"
                isRequired={true}
                value={field.value}
                initialAutoMode={initialAutoMode}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                htmlContent={editor.getHTML()}
                hint="Makalenin okunması için gereken tahmini süre"
                isError={!!errors.readTime}
                errorMessage={errors.readTime?.message}
              />
            )}
          />

          <Controller
            name="featured"
            control={control}
            render={({ field }) => (
              <Toggle
                ref={field.ref as any}
                label="Öne Çıkar"
                description="Bu içeriğin öncelikli olarak görüntülenmesini sağlar."
                checked={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                isError={!!errors.featured}
                errorMessage={errors.featured?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="fixed right-8 bottom-8 flex flex-col items-center justify-center">
        <button
          type="submit"
          className="bg-primary flex items-center gap-2 rounded px-8 py-2 text-lg font-semibold text-white shadow-xl transition-transform duration-300 hover:scale-105"
        >
          <span>{submitLabel}</span>
        </button>
      </div>
    </form>
  );
}
