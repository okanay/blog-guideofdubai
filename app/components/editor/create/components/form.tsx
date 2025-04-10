// app/components/editor/create/form.tsx
import { useRef, useState } from "react";
import { useTiptapContext } from "../../tiptap/store";
import { Input, Textarea, Select,  SeoPreview, SlugCreator, ImagePreview, ReadTime, MultiSelect } from "@/components/editor/ui" // prettier-ignore
import { MoveRight } from "lucide-react";
import { DEFAULT_CATEGORY_OPTIONS, DEFAULT_TAG_OPTIONS } from "../../constants";
import { DEFAULT_LANGUAGE, LANGUAGE_DICTONARY } from "@/i18n/config";

export function CreateBlogForm() {
  const { editor } = useTiptapContext();
  const titleRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const [readTime, setReadTime] = useState<number | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string | null>(null); // prettier-ignore
  const [selectedTags, setSelectedTags] = useState<string[] | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(
    DEFAULT_LANGUAGE,
  );

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-y-6 py-6">
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
            ref={titleRef}
            id="seo-title"
            label="Başlık"
            placeholder="SEO Başlığı"
            hint="SEO başlığı, google gibi arama motolarının içeriği daha iyi değerlendirmesine yardımcı olur."
            isRequired={true}
            maxLength={60}
          />
          <SlugCreator
            label="URL"
            id="seo-slug"
            ref={slugRef}
            followRef={titleRef}
            hint="Makalenin URL'de görünecek benzersiz tanımlayıcısı"
            isRequired={true}
            checkSlug={async (slug) => {
              return false;
            }}
          />
          <Textarea
            ref={descriptionRef}
            label="Açıklaması"
            id="seo-description"
            placeholder="Google arama sonuçlarında görünecek açıklama"
            hint="Hedef kelimelerinizi içeren, kullanıcıyı sayfaya çekecek bir açıklama yazın."
            maxLength={160}
            rows={3}
            isRequired={true}
          />
          <ImagePreview
            ref={imageRef}
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
            id="blog-title"
            label="Kart Başlığı"
            placeholder="Dikkat çekici ve içeriği yansıtan bir başlık"
            hint="Başlık blog kartında büyük puntolarla gösterilir ve dikkat çeken ilk unsurdur."
            isRequired={true}
            maxLength={40}
            showCharCount={true}
          />

          <Textarea
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
            id="blog-image"
            label="Kart Görseli"
            hint="Blog kartında görünecek görsel, boş bırakılırsa sosyal medya görseli kullanılır."
            autoMode={true}
            followId="seo-image"
            followRef={imageRef}
          />
          <Select
            label="Blog Kategorileri"
            id="blog-categories"
            options={DEFAULT_CATEGORY_OPTIONS}
            value={selectedCategories}
            onChange={setSelectedCategories}
            hint="Blog yazınıza uygun kategorileri seçin veya yeni ekleyin"
            isRequired={true}
            allowCustomOption={true}
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
            allowCustomOption={true}
            isRequired={true}
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
        </div>
      </div>

      {/* Alt Butonlar */}
      <div className="flex justify-end pt-4">
        <button className="bg-primary-500 hover:bg-primary-600 focus:ring-primary-200 flex items-center gap-1.5 rounded-md px-6 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none">
          İçerik Ekle
          <MoveRight size={16} />
        </button>
      </div>
    </div>
  );
}
