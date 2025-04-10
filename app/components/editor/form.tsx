// app/components/editor/create/form.tsx
import { useRef, useState } from "react";
import { useTiptapContext } from "./tiptap/store";
import { Input, Textarea, Select,  SeoPreview, SlugCreator, ImagePreview, ReadTime, MultiSelect, Toggle } from "@/components/editor/ui" // prettier-ignore
import { DEFAULT_CATEGORY_OPTIONS, DEFAULT_TAG_OPTIONS } from "./constants";
import { DEFAULT_LANGUAGE, LANGUAGE_DICTONARY } from "@/i18n/config";
import { Send } from "lucide-react";

export function CreateBlogForm() {
  const { editor } = useTiptapContext();

  const seoTitleRef = useRef<HTMLInputElement>(null);
  const seoDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const seoImageRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);

  const blogTitleRef = useRef<HTMLInputElement>(null);
  const blogDescriptionRef = useRef<HTMLTextAreaElement>(null);
  const blogImageRef = useRef<HTMLInputElement>(null);

  const [readTime, setReadTime] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[] | null>(null); // prettier-ignore
  const [selectedTags, setSelectedTags] = useState<string[] | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(DEFAULT_LANGUAGE); // prettier-ignore
  const [featured, setFeatured] = useState<boolean>(false);

  return (
    <form className="mx-auto flex max-w-3xl flex-col gap-y-6 py-6">
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
          <Input
            ref={seoTitleRef}
            id="seo-title"
            label="Başlık"
            placeholder="Arama motorları için başlık."
            hint="SEO başlığı, google gibi arama motolarının içeriği daha iyi değerlendirmesine yardımcı olur."
            isRequired={true}
            maxLength={60}
          />
          <SlugCreator
            label="URL"
            id="seo-slug"
            ref={slugRef}
            followRef={seoTitleRef}
            hint="Makalenin URL'de görünecek benzersiz tanımlayıcısı"
            isRequired={true}
            checkSlug={async (slug) => {
              return false;
            }}
          />
          <Textarea
            ref={seoDescriptionRef}
            label="Açıklaması"
            id="seo-description"
            placeholder="Arama motorları için açıklama."
            hint="Hedef kelimelerinizi içeren, kullanıcıyı sayfaya çekecek bir açıklama yazın."
            maxLength={160}
            rows={3}
            isRequired={true}
          />
          <ImagePreview
            ref={seoImageRef}
            id="seo-image"
            label="Sosyal Medya Görseli"
            hint="Sosyal medyada paylaşıldığında görünecek görsel"
            isRequired={true}
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
            baseUrl="guideofdubai.com/blog"
          />
        </div>
      </div>

      {/* İçerik Ayarları */}
      <div>
        <h2 className="mb-4 border-b border-zinc-200 pb-2 text-lg font-medium text-zinc-800">
          İçerik Ayarları
        </h2>

        <div className="space-y-6">
          <Input
            ref={blogTitleRef}
            id="blog-title"
            label="Kart Başlığı"
            placeholder="Dikkat çekici ve içeriği yansıtan bir başlık"
            hint="Başlık blog kartında büyük puntolarla gösterilir ve dikkat çeken ilk unsurdur."
            isRequired={true}
            maxLength={40}
            showCharCount={true}
          />

          <Textarea
            ref={blogDescriptionRef}
            label="Kart Açıklaması"
            id="blog-description"
            placeholder="İçeriğinizin ana fikrini özetleyen kısa bir açıklama yazın"
            hint="Blog kartında başlığın altında küçük yazı ile gösterilir. Okuyucuyu içeriğe çekmek için önemlidir."
            maxLength={120}
            rows={3}
            isRequired={true}
            showCharCount={true}
          />

          <ImagePreview
            ref={blogImageRef}
            id="blog-image"
            label="Kart Görseli"
            hint="Blog kartında görünecek görsel, boş bırakılırsa sosyal medya görseli kullanılır."
            autoMode={true}
            followId="seo-image"
            followRef={seoImageRef}
          />
          <MultiSelect
            label="Blog Kategorileri"
            id="blog-categories"
            options={DEFAULT_CATEGORY_OPTIONS}
            value={selectedCategories}
            onChange={setSelectedCategories}
            hint="Blog yazınıza uygun kategorileri seçin veya yeni ekleyin"
            isRequired={true}
            allowCustomOption={false}
            customOptionPlaceholder="Yeni kategori ekle..."
            placeholder="Kategori seçimi yapın."
          />
          <MultiSelect
            label="Blog Etiketleri"
            id="blog-tags"
            options={DEFAULT_TAG_OPTIONS}
            value={selectedTags}
            onChange={setSelectedTags}
            hint="Blog yazınıza uygun etiketleri seçin, arama yaparken kullanıcı deneyimini kolaylaştırır."
            placeholder="Etiket seçin..."
            allowCustomOption={false}
            isRequired={false}
            customOptionPlaceholder="Özel etiket ekle..."
            searchPlaceholder="Etiketlerde ara..."
          />
        </div>
      </div>

      {/* Diğer Ayarlar */}
      <div>
        <h2 className="mb-4 border-b border-zinc-200 pb-2 text-lg font-medium text-zinc-800">
          Diğer Ayarlar
        </h2>

        <div className="space-y-4">
          <Select
            label="Blog Dili"
            id="blog-language"
            options={LANGUAGE_DICTONARY}
            value={selectedLanguage}
            onChange={setSelectedLanguage}
            hint="Blog yazınızın dilini seçin."
            isRequired={true}
            allowCustomOption={false}
            placeholder="Dil seçimi yapın."
          />
          <ReadTime
            label="Okuma Süresi"
            id="blog-read-time"
            value={readTime}
            onChange={setReadTime}
            htmlContent={editor.getHTML()}
            defaultWordsPerMinute={1}
            hint="Makalenin okunması için gereken tahmini süre"
          />

          <Toggle
            label="Öne Çıkar"
            description="Bu içeriğin öncelikli olarak görüntülenmesini sağlar."
            state={featured}
            setState={setFeatured}
          />
        </div>
      </div>

      <div className="fixed right-4 bottom-4 flex flex-col items-center justify-center">
        <button className="bg-primary flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-opacity duration-300 hover:opacity-75">
          <span>Oluştur</span>
          <Send size={14} />
        </button>
      </div>
    </form>
  );
}
