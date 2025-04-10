// app/components/editor/create/form.tsx
import { Input, Textarea, Select, Checkbox, SeoPreview, SlugCreator, ImagePreview, ReadTime, BlogStatus, MultiSelect } from "@/components/editor/ui" // prettier-ignore
import { MoveRight } from "lucide-react";
import { useRef } from "react";

export function CreateBlogForm() {
  const titleRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

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
            id="content-title"
            label="Kart Başlığı"
            placeholder="Dikkat çekici ve içeriği yansıtan bir başlık"
            hint="Başlık blog kartında büyük puntolarla gösterilir ve dikkat çeken ilk unsurdur."
            isRequired={true}
            maxLength={40}
            showCharCount={true}
          />

          <Textarea
            label="Kart Açıklaması"
            id="content-description"
            placeholder="İçeriğinizin ana fikrini özetleyen kısa bir açıklama yazın"
            hint="Blog kartında başlığın altında küçük yazı ile gösterilir. Okuyucuyu içeriğe çekmek için önemlidir."
            maxLength={120}
            rows={3}
            isRequired={true}
            showCharCount={true}
          />

          <ImagePreview
            id="content-image"
            label="Kart Görseli"
            hint="Blog kartında görünecek görsel, boş bırakılırsa sosyal medya görseli kullanılır."
          />
          <p>kategoriler (multi-select)</p>
          <p>tag (multi-select)</p>
        </div>
      </div>

      {/* Diğer Ayarlar */}
      <div>
        <h2 className="mb-4 border-b border-zinc-200 pb-2 text-lg font-medium text-zinc-800">
          Diğer Ayarlar
        </h2>

        <div className="space-y-4">
          <p>dil seçimi (select)</p>
          <p>okuma Süresi (read-time)</p>
          <p>featured (checkbox)</p>
          <p>post initial status (blog-status)</p>
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
