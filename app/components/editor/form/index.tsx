import { GroupIDSelector, ImagePreview, Input, MultiSelect, ReadTime, Select, SeoPreview, SlugCreator, Textarea, Toggle } from "@/components/editor/ui"; // prettier-ignore
import { ALL_LANGUAGE_DICTONARY } from "@/i18n/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { extractErrorMessages } from "../helper";
import { useEditorContext } from "../store";
import { useTiptapContext } from "../tiptap/store";
import { BlogFormSchema } from "../validations/blog-create";
import { BLOG_OPTIONS } from "../constants";
import SEOAnalyzer from "../ui/seo-analyzer";

type Props = {
  initialData: BlogFormSchema;
  initialAutoMode: boolean;
  onSubmit: (data: BlogFormSchema) => void;
  submitLabel: string;
};

export function CreateBlogForm({
  initialData,
  submitLabel,
  initialAutoMode,
  onSubmit,
}: Props) {
  const { editor } = useTiptapContext();
  const {
    tags,
    addTag,
    statusStates,
    categories,
    addCategory,
    refreshCategories,
    refreshTags,
  } = useEditorContext();

  // prettier-ignore
  const { handleSubmit, control, formState: { errors }, getValues, setValue, watch} = useForm<BlogFormSchema>({
    resolver: zodResolver(BlogFormSchema),
    mode: "onSubmit",
    reValidateMode: "onBlur",
    defaultValues: { ...initialData },
  });

  const seoTitleRef = useRef<HTMLInputElement>(null);
  const seoDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const seoImageRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);

  const processSubmit = (data: BlogFormSchema) => {
    onSubmit(data);
  };

  const handleFormSubmit = handleSubmit(processSubmit, (validationErrors) => {
    const allErrorMessages = extractErrorMessages(validationErrors);
    const errorCount = allErrorMessages.length;

    if (errorCount > 0) {
      toast.error("Form Doğrulama Hataları", {
        description: (
          <ul className="mt-2 ml-4 list-disc text-sm">
            {allErrorMessages.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        ),
        duration: 4000,
      });
    }
  });

  return (
    <form
      onSubmit={handleFormSubmit}
      className="mx-auto flex max-w-3xl flex-col gap-y-6 py-6"
    >
      <div className="mb-4">
        <h1 className="mb-1 text-2xl font-bold text-zinc-900">
          Blog İçerik Yönetimi
        </h1>
        <p className="text-sm text-zinc-500">
          Bloglarınız için SEO dostu içerik ve görsel ayarlarını düzenleyin.
          İçerik girmek için "İçerik" sekmesini kullanabilirsiniz.
        </p>
      </div>

      {/* SEO Ayarları */}
      <div>
        <div className="flex flex-wrap items-center justify-between pb-2">
          <h2 className="text-lg font-medium text-zinc-800">
            SEO Optimizasyonu
          </h2>
          <SEOAnalyzer
            getValues={getValues}
            language={watch("language") as Language}
          />
        </div>

        <div className="space-y-4">
          <Controller
            name="metadata.title"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="metadata.title"
                label="SEO Başlığı"
                placeholder="Google ve diğer arama motorlarında görünecek başlık."
                hint="Blog içeriğini kısaca açıklayacak bir başlık belirleyin."
                isRequired={true}
                maxLength={120}
                errorMessage={errors.metadata?.title?.message}
                ref={(e) => {
                  field.ref(e);
                  seoTitleRef.current = e;
                }}
              />
            )}
          />

          <Controller
            name="slug"
            control={control}
            render={({ field }) => (
              <SlugCreator
                {...field}
                label="URL Yapısı"
                id="slug"
                hint="Arama motorları ve kullanıcılar için kolay okunabilir URL"
                isRequired={true}
                errorMessage={errors.slug?.message}
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
            name="metadata.description"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                label="SEO Açıklaması"
                id="metadata.description"
                placeholder="Google ve diğer arama motorlarında görünecek açıklama metni"
                hint="Kullanıcıyı tıklamaya yönlendirecek, anahtar kelimeler içeren etkili bir açıklama yazın"
                maxLength={200}
                rows={3}
                isRequired={true}
                errorMessage={errors.metadata?.description?.message}
                ref={(e) => {
                  field.ref(e);
                  seoDescriptionRef.current = e;
                }}
              />
            )}
          />

          <Controller
            name="metadata.image"
            control={control}
            render={({ field }) => (
              <ImagePreview
                {...field}
                id="metadata.image"
                label="Sosyal Medya Görseli"
                hint="Sosyal medya platformlarında link olarak paylaşıldığında görünecek görsel (1200x630px önerilir)"
                isRequired={true}
                errorMessage={errors.metadata?.image?.message}
                ref={(e) => {
                  field.ref(e);
                  seoImageRef.current = e;
                }}
              />
            )}
          />

          <SeoPreview
            titleInput={{ id: "metadata.title", value: "" }}
            descriptionInput={{
              id: "metadata.description",
              value: "",
            }}
            slugInput={{ id: "slug", value: "" }}
            imageInput={{
              id: "metadata.image",
              value: "",
            }}
            defaultMode="google"
            baseUrl="https://guideofdubai.com/blog"
          />
        </div>
      </div>

      {/* İçerik Ayarları */}
      <div>
        <h2 className="mb-4 border-b border-zinc-200 pb-2 text-lg font-medium text-zinc-800">
          Blog Kart Bilgileri
        </h2>

        <div className="space-y-6">
          <Controller
            name="content.title"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="content.title"
                label="Kart Başlığı"
                placeholder="İlgi çekici ve konuyu net ifade eden başlık"
                hint="Listeleme sayfalarında blog kartında büyük punto ile görünür"
                isRequired={true}
                errorMessage={errors.content?.title?.message}
                maxLength={120}
                isAutoMode={true}
                initialAutoMode={initialAutoMode}
                followRef={seoTitleRef}
              />
            )}
          />

          <Controller
            name="content.description"
            control={control}
            rules={{ required: "Kart açıklaması gereklidir" }}
            render={({ field }) => (
              <Textarea
                {...field}
                id="content.description"
                label="Kart Özeti"
                placeholder="İçeriğin ana değerini ve faydalarını vurgulayan özet"
                hint="Kullanıcıyı içeriği okumaya teşvik edecek kısa ve öz bir açıklama"
                isRequired={true}
                errorMessage={errors.content?.description?.message}
                maxLength={200}
                rows={3}
                isAutoMode={true}
                initialAutoMode={initialAutoMode}
                followRef={seoDescriptionRef}
              />
            )}
          />

          <Controller
            name="content.image"
            control={control}
            rules={{ required: "Kart görseli gereklidir." }}
            render={({ field }) => (
              <ImagePreview
                {...field}
                id="content.image"
                label="Kart Görseli"
                placeholder="https://example.com/images/blog-image.jpg"
                hint="Blog listelerinde gösterilecek kapak görseli (1200x630px önerilir)"
                isRequired={true}
                isAutoMode={true}
                initialAutoMode={initialAutoMode}
                followRef={seoImageRef}
                followValue={watch("metadata.image")}
                errorMessage={errors.content?.image?.message}
              />
            )}
          />

          <Controller
            name="categories"
            control={control}
            render={({ field }) => (
              <MultiSelect
                label="Kategoriler"
                id="categories"
                options={categories}
                onAddCustomOption={addCategory}
                onFetchOptions={refreshCategories}
                onRefreshOptions={refreshCategories}
                modalStatus={statusStates.categories}
                value={field.value as any}
                onChange={(newValue) => field.onChange(newValue)}
                isRequired={true}
                isError={!!errors.categories}
                errorMessage={errors.categories?.message}
                placeholder="Uygun kategorileri seçin"
                hint="İçeriğin hangi ana başlıklar altında sınıflandırılacağını belirleyin"
              />
            )}
          />

          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <MultiSelect
                label="Etiketler"
                id="tags"
                options={tags}
                onAddCustomOption={addTag}
                onFetchOptions={refreshTags}
                onRefreshOptions={refreshTags}
                modalStatus={statusStates.tags}
                value={field.value as any}
                onChange={(newValue) => field.onChange(newValue)}
                hint="İçerikle ilgili anahtar kelimeleri seçin, arama ve filtreleme işlemlerinde kullanılır"
                placeholder="İlgili etiketleri seçin veya ekleyin"
                allowCustomOption={true}
                isRequired={false}
                customOptionPlaceholder="Yeni etiket ekle..."
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
          İçerik Özellikleri
        </h2>

        <div className="space-y-4">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                label="İçerik Durumu"
                id="status"
                options={BLOG_OPTIONS.map(({ label3, value }) => ({
                  name: value,
                  value: label3,
                }))}
                value={field.value}
                onChange={(newValue) => field.onChange(newValue)}
                hint="Blogun başlangıç durumunu seçin. Örneğin, taslak olarak başlatabilirsiniz."
                isRequired={true}
                allowCustomOption={false}
                placeholder="İçerik durumunu seçin"
                isError={!!errors.status}
                errorMessage={errors.status?.message}
              />
            )}
          />

          <Controller
            name="language"
            control={control}
            render={({ field }) => (
              <Select
                label="İçerik Dili"
                id="language"
                options={ALL_LANGUAGE_DICTONARY.map(({ label, value }) => ({
                  name: value,
                  value: label,
                }))}
                value={field.value}
                onChange={(newValue) => field.onChange(newValue)}
                hint="Doğru dil seçimi, içeriğin doğru hedef kitleye ulaşmasını sağlar"
                isRequired={true}
                allowCustomOption={false}
                placeholder="Yazı dilini seçin"
                isError={!!errors.language}
                errorMessage={errors.language?.message}
              />
            )}
          />

          <Controller
            name="groupId"
            control={control}
            render={({ field }) => (
              <GroupIDSelector
                {...field}
                ref={field.ref as any}
                label="Blog Dil Bağlantısı"
                id="groupId"
                modalTitle="Blog Dil Bağlantısı."
                hint="Eğer bu blog var olan bir bloğun farklı dildeki bir versiyonu ise, o blog ile eşleştirin."
                isRequired={true}
                errorMessage={errors.groupId?.message}
                isAutoMode={initialAutoMode}
                initialAutoMode={initialAutoMode}
                followRef={seoTitleRef}
              />
            )}
          />

          <Controller
            name="content.readTime"
            control={control}
            render={({ field }) => (
              <ReadTime
                label="Okuma Süresi"
                id="content.readTime"
                isRequired={true}
                value={field.value}
                initialAutoMode={initialAutoMode}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                htmlContent={editor.getHTML()}
                hint="İçeriğin tahmini okuma süresi (dakika cinsinden)"
                errorMessage={errors.content?.readTime?.message}
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
