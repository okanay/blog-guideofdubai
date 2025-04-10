import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { Globe, Share2, RefreshCw } from "lucide-react";

// Alt bileşenler için type tanımları
type PreviewMode = "google" | "social";

interface SeoPreviewProps {
  title?: string;
  description?: string;
  slug?: string;
  image?: string;
  baseUrl?: string;
  titleInput?: { id: string; value: string };
  descriptionInput?: { id: string; value: string };
  slugInput?: { id: string; value: string };
  imageInput?: { id: string; value: string };
  containerClassName?: string;
  defaultMode?: PreviewMode;
}

export function SeoPreview({
  title: initialTitle = "",
  description: initialDescription = "",
  slug: initialSlug = "",
  image: initialImage = "",
  baseUrl = "example.com",
  titleInput,
  descriptionInput,
  slugInput,
  imageInput,
  containerClassName,
  defaultMode = "google",
}: SeoPreviewProps) {
  // State yönetimi
  const [mode, setMode] = useState<PreviewMode>(defaultMode);
  const [previewData, setPreviewData] = useState({
    title: initialTitle,
    description: initialDescription,
    slug: initialSlug,
    image: initialImage,
  });

  // Input değerlerini izle ve değişiklik olduğunda güncelle
  useEffect(() => {
    function getInputValueById(id: string | undefined): string {
      if (!id) return "";
      const element = document.getElementById(id) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | null;
      return element?.value || "";
    }

    // Önizlemeyi güncelleyen fonksiyon
    function updatePreview() {
      const newData = {
        title: titleInput
          ? getInputValueById(titleInput.id) || titleInput.value || initialTitle
          : initialTitle,
        description: descriptionInput
          ? getInputValueById(descriptionInput.id) ||
            descriptionInput.value ||
            initialDescription
          : initialDescription,
        slug: slugInput
          ? getInputValueById(slugInput.id) || slugInput.value || initialSlug
          : initialSlug,
        image: imageInput
          ? getInputValueById(imageInput.id) || imageInput.value || initialImage
          : initialImage,
      };

      setPreviewData(newData);
    }

    // İlk render'da önizlemeyi güncelle
    updatePreview();

    // İzleyici fonksiyonu
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "value"
        ) {
          updatePreview();
        }
      }
    });

    // İnput elementlerini izle
    [titleInput?.id, descriptionInput?.id, slugInput?.id, imageInput?.id]
      .filter(Boolean)
      .forEach((id) => {
        const element = document.getElementById(id as string);
        if (element) {
          observer.observe(element, {
            attributes: true,
            childList: true,
            subtree: true,
          });

          // Input event listener ekle
          element.addEventListener("input", updatePreview);
        }
      });

    // Cleanup fonksiyonu
    return () => {
      observer.disconnect();

      [titleInput?.id, descriptionInput?.id, slugInput?.id, imageInput?.id]
        .filter(Boolean)
        .forEach((id) => {
          const element = document.getElementById(id as string);
          if (element) {
            element.removeEventListener("input", updatePreview);
          }
        });
    };
  }, [
    initialTitle,
    initialDescription,
    initialSlug,
    initialImage,
    titleInput,
    descriptionInput,
    slugInput,
    imageInput,
  ]);

  return (
    <div className={twMerge("flex flex-col gap-3", containerClassName)}>
      {/* Başlık ve mod seçimi */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-700">SEO Önizleme</h3>

        <div className="flex items-center gap-2">
          {/* Mod değiştirme butonları */}
          <div className="flex overflow-hidden rounded-md border border-zinc-200">
            <button
              onClick={() => setMode("google")}
              className={twMerge(
                "flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors",
                mode === "google"
                  ? "bg-primary text-white"
                  : "bg-zinc-50 text-zinc-700 hover:bg-zinc-100",
              )}
              type="button"
            >
              <Globe size={12} /> Google
            </button>
            <button
              onClick={() => setMode("social")}
              className={twMerge(
                "flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors",
                mode === "social"
                  ? "bg-primary text-white"
                  : "bg-zinc-50 text-zinc-700 hover:bg-zinc-100",
              )}
              type="button"
            >
              <Share2 size={12} /> Sosyal Medya
            </button>
          </div>
        </div>
      </div>

      {/* Önizleme içeriği */}
      <div className="overflow-hidden bg-white">
        {mode === "google" ? (
          <GoogleSearchPreview
            title={previewData.title}
            description={previewData.description}
            slug={previewData.slug}
            baseUrl={baseUrl}
          />
        ) : (
          <SocialMediaPreview
            title={previewData.title}
            description={previewData.description}
            slug={previewData.slug}
            baseUrl={baseUrl}
            image={previewData.image}
          />
        )}
      </div>
    </div>
  );
}

// Google Arama Sonuçları Önizleme Alt Bileşeni
interface GoogleSearchPreviewProps {
  title: string;
  description: string;
  slug: string;
  baseUrl: string;
}

function GoogleSearchPreview({
  title,
  description,
  slug,
  baseUrl,
}: GoogleSearchPreviewProps) {
  // URL oluştur
  const url = slug ? `${baseUrl}/${slug}` : baseUrl;

  // Karakter sınırları
  const titleLimit = 60;
  const descriptionLimit = 160;

  // Kesilen metinler
  const displayTitle =
    title.length > titleLimit
      ? `${title.substring(0, titleLimit)}...`
      : title || "Sayfa Başlığı";

  const displayDescription =
    description.length > descriptionLimit
      ? `${description.substring(0, descriptionLimit)}...`
      : description ||
        "Sayfa açıklaması burada görünecek. Google arama sonuçlarında gösterilen metin.";

  return (
    <div className="flex flex-col gap-1 rounded-md border border-zinc-200 p-4">
      {/* Favicon ve URL */}
      <div className="flex items-center gap-1 text-xs text-green-800">
        <img
          src="/metadata/favicons/favicon.ico"
          alt="Favicon"
          className="h-4 w-4"
          loading="lazy"
        />
        <span>{url}</span>
      </div>

      {/* Başlık */}
      <h3 className="text-base font-medium text-blue-700 hover:underline">
        {displayTitle} | Guide Of Dubai
      </h3>

      {/* Açıklama */}
      <p className="text-sm text-zinc-700">{displayDescription}</p>

      {/* Meta bilgiler (opsiyonel) */}
      <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-zinc-500">
        <span>10 Nis 2025</span>
        <span>•</span>
        <span>Diğer sayfalardan benzer sonuçlar</span>
      </div>
    </div>
  );
}

interface SocialMediaPreviewProps {
  title: string;
  description: string;
  slug: string;
  baseUrl: string;
  image?: string;
}

function SocialMediaPreview({
  title,
  description,
  slug,
  baseUrl,
  image,
}: SocialMediaPreviewProps) {
  const url = slug ? `${baseUrl}/${slug}` : baseUrl;

  const [imageStatus, setImageStatus] = useState<
    "loading" | "error" | "success"
  >(image ? "loading" : "error");

  const titleLimit = 70;
  const descriptionLimit = 200;

  const displayTitle =
    title.length > titleLimit
      ? `${title.substring(0, titleLimit)}...`
      : title || "Sosyal Medya Paylaşım Başlığı";

  const displayDescription =
    description.length > descriptionLimit
      ? `${description.substring(0, descriptionLimit)}...`
      : description ||
        "Sosyal medya paylaşımlarında gösterilecek açıklama metni. Bu metin Facebook, Twitter, LinkedIn gibi platformlarda görünür.";

  // Görsel değiştiğinde durumu güncelle
  useEffect(() => {
    if (image) {
      setImageStatus("loading");
    } else {
      setImageStatus("error");
    }
  }, [image]);

  // Görsel yükleme hatası işleyicisi
  const handleImageError = () => {
    setImageStatus("error");
  };

  // Görsel yükleme başarılı işleyicisi
  const handleImageLoad = () => {
    setImageStatus("success");
  };

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg border border-zinc-300 shadow-sm sm:max-w-[400px]">
      {/* Görsel - sadece bir görsel URL'si varsa ve başarıyla yüklendiyse göster */}
      {imageStatus !== "error" && image && (
        <div className="relative w-full bg-zinc-100">
          {imageStatus === "loading" && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-100">
              <span className="text-sm text-zinc-500">Yükleniyor...</span>
            </div>
          )}
          <img
            src={image}
            alt="Sosyal Medya Görseli"
            className="h-[200px] w-full object-cover"
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        </div>
      )}

      {/* Görsel yoksa veya yüklenmediyse daha kompakt görünüm */}
      {imageStatus === "error" && (
        <div className="h-2 w-full bg-zinc-200"></div>
      )}

      {/* İçerik */}
      <div className="flex flex-col gap-1 p-3">
        {/* URL - gri metin */}
        <div className="text-xs text-zinc-500 uppercase">{url}</div>

        {/* Başlık */}
        <h3 className="line-clamp-2 text-base font-bold text-zinc-800">
          {displayTitle}
        </h3>

        {/* Açıklama */}
        <p className="line-clamp-3 text-sm text-zinc-600">
          {displayDescription}
        </p>
      </div>
    </div>
  );
}

export default SocialMediaPreview;
