import { DEFAULT_CATEGORY_OPTIONS, DEFAULT_TAG_OPTIONS } from "../constants"; // prettier-ignore
import { ImagePreview, Input, MultiSelect, ReadTime, Select, SeoPreview, SlugCreator, Textarea, Toggle } from "@/components/editor/ui"; // prettier-ignore
import { LANGUAGE_DICTONARY } from "@/i18n/config";
import { Controller, useForm } from "react-hook-form";
import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../validations/blog";
import { useTiptapContext } from "../tiptap/store";

type Props = {
  initialValues: Blog;
  initialAutoMode: boolean;

  onSubmit: (data: Blog) => void;
  submitLabel: string;
};

export function CreateBlogForm({
  initialValues,
  submitLabel,
  initialAutoMode,
  onSubmit,
}: Props) {
  const { editor } = useTiptapContext();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Blog>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: { ...initialValues },
  });

  const seoTitleRef = useRef<HTMLInputElement>(null);
  const seoDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const seoImageRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
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
        <h2 className="mb-4 border-b border-zinc-200 pb-2 text-lg font-medium text-zinc-800">
          SEO Optimizasyonu
        </h2>

        <div className="space-y-4">
          <Controller
            name="seoTitle"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="seo-title"
                label="SEO Başlığı"
                isRequired={true}
                maxLength={60}
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
                label="URL Yapısı"
                id="seo-slug"
                hint="Arama motorları ve kullanıcılar için kolay okunabilir URL"
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
                label="Meta Açıklama"
                id="seo-description"
                placeholder="Google ve diğer arama motorlarında görünecek açıklama metni"
                hint="Kullanıcıyı tıklamaya yönlendirecek, anahtar kelimeler içeren etkili bir açıklama yazın"
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
                hint="Sosyal medya platformlarında link olarak paylaşıldığında görünecek görsel (1200x630px önerilir)"
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
          Blog Kart Bilgileri
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
                placeholder="İlgi çekici ve konuyu net ifade eden başlık"
                hint="Listeleme sayfalarında blog kartında büyük punto ile görünür"
                isRequired={true}
                isError={!!errors.blogTitle}
                errorMessage={errors.blogTitle?.message}
                showCharCount={true}
                maxLength={60}
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
                label="Kart Özeti"
                placeholder="İçeriğin ana değerini ve faydalarını vurgulayan özet"
                hint="Kullanıcıyı içeriği okumaya teşvik edecek kısa ve öz bir açıklama"
                isRequired={true}
                isError={!!errors.blogDescription}
                errorMessage={errors.blogDescription?.message}
                showCharCount={true}
                maxLength={160}
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
                placeholder="https://example.com/images/blog-image.jpg"
                hint="Blog listelerinde gösterilecek kapak görseli (1200x630px önerilir)"
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
                label="Kategoriler"
                id="blog-categories"
                options={DEFAULT_CATEGORY_OPTIONS}
                value={field.value}
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
                id="blog-tags"
                options={DEFAULT_TAG_OPTIONS}
                value={field.value}
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
            name="language"
            control={control}
            render={({ field }) => (
              <Select
                label="İçerik Dili"
                id="blog-language"
                options={LANGUAGE_DICTONARY}
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
                hint="İçeriğin tahmini okuma süresi (dakika cinsinden)"
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
                label="Öne Çıkarılmış İçerik"
                description="Bu içerik ana sayfada ve kategori sayfalarında öncelikli olarak gösterilir"
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
