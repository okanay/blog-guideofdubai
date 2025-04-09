// app/components/editor/create/form.tsx
import { Input, Textarea, Select, Checkbox, SeoPreview, SlugCreator, Image, ReadTime, BlogStatus, MultiSelect } from "@/components/editor/ui" // prettier-ignore
import { MoveRight } from "lucide-react";

export function CreateBlogForm() {
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
            label="SEO Başlığı"
            placeholder="SEO Başlığı"
            hint="SEO başlığı, google gibi arama motolarının içeriği daha iyi değerlendirmesine yardımcı olur."
            isRequired={true}
          />
          <p>slug-creator (slug-creator)</p>
          <p>seo description (text-area)</p>
          <p>open-graph görseli (image)</p>
          <p>preview google search (seo-preview)</p>
        </div>
      </div>

      {/* İçerik Ayarları */}
      <div>
        <h2 className="mb-4 border-b border-zinc-200 pb-2 text-lg font-medium text-zinc-800">
          İçerik Ayarları
        </h2>

        <div className="space-y-6">
          {/* Başlık */}
          <p>content title (input)</p>
          <p>content description (text-area)</p>
          <p>kategoriler (multi-select)</p>
          <p>tag (multi-select)</p>
          <p>okuma Süresi (read-time)</p>
        </div>
      </div>

      {/* Diğer Ayarlar */}
      <div>
        <h2 className="mb-4 border-b border-zinc-200 pb-2 text-lg font-medium text-zinc-800">
          Diğer Ayarlar
        </h2>

        <div className="space-y-4">
          <p>dil seçimi (select)</p>
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
