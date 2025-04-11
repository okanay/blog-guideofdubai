import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { Globe, Share2 } from "lucide-react";
import { ReactNode } from "react";

type PreviewMode = "google" | "social";

const SEO_LIMITS = {
  GOOGLE_TITLE: 60,
  GOOGLE_DESCRIPTION: 160,
  SOCIAL_TITLE: 60,
  SOCIAL_DESCRIPTION: 160,
} as const;

function getInputValueById(id: string | undefined): string {
  if (!id) return "";
  const element = document.getElementById(id) as
    | HTMLInputElement
    | HTMLTextAreaElement
    | null;
  return element?.value || "";
}

function truncateText(text: string, limit: number): string {
  return text.length > limit ? `${text.substring(0, limit)}...` : text;
}

function useSeoPreview({
  initialTitle,
  initialDescription,
  initialSlug,
  initialImage,
  titleInput,
  descriptionInput,
  slugInput,
  imageInput,
}: UseSeoPreviewParams) {
  const [previewData, setPreviewData] = useState({
    title: initialTitle,
    description: initialDescription,
    slug: initialSlug,
    image: initialImage,
  });

  useEffect(() => {
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

    updatePreview();

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

    const elements = [
      titleInput?.id,
      descriptionInput?.id,
      slugInput?.id,
      imageInput?.id,
    ]
      .filter(Boolean)
      .map((id) => document.getElementById(id as string))
      .filter(Boolean);

    elements.forEach((element) => {
      observer.observe(element as Element, {
        attributes: true,
        childList: true,
        subtree: true,
      });
      element?.addEventListener("input", updatePreview);
    });

    return () => {
      observer.disconnect();
      elements.forEach((element) => {
        element?.removeEventListener("input", updatePreview);
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

  return previewData;
}

export function GoogleSearchPreview({
  title,
  description,
  slug,
  baseUrl,
}: GoogleSearchPreviewProps) {
  const url = slug ? `${baseUrl}/${slug}` : baseUrl;
  const displayTitle = truncateText(
    title || "Sayfa Başlığı",
    SEO_LIMITS.GOOGLE_TITLE,
  );
  const displayDescription = truncateText(
    description ||
      "Sayfa açıklaması burada görünecek. Google arama sonuçlarında gösterilen metin.",
    SEO_LIMITS.GOOGLE_DESCRIPTION,
  );

  return (
    <div className="flex flex-col gap-1 rounded-md border border-zinc-200 p-4">
      <div className="flex items-center gap-1 text-xs text-green-800">
        <img
          src="/metadata/favicons/favicon.ico"
          alt="Favicon"
          className="h-4 w-4"
          loading="lazy"
        />
        <span className="line-clamp-1">{url}</span>
      </div>
      <h3 className="line-clamp-1 text-base font-medium text-blue-700 hover:underline">
        {displayTitle} | Guide Of Dubai
      </h3>
      <p className="line-clamp-2 text-sm text-zinc-700">{displayDescription}</p>
      <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-xs text-zinc-500">
        <span>10 Nis 2025</span>
        <span>•</span>
        <span>Diğer sayfalardan benzer sonuçlar</span>
      </div>
    </div>
  );
}

export function SocialMediaPreview({
  title,
  description,
  slug,
  baseUrl,
  image,
}: SocialMediaPreviewProps) {
  const [imageStatus, setImageStatus] = useState<
    "loading" | "error" | "success"
  >(image ? "loading" : "error");

  const url = slug ? `${baseUrl}/${slug}` : baseUrl;
  const displayTitle = truncateText(
    title || "Sosyal Medya Paylaşım Başlığı",
    SEO_LIMITS.SOCIAL_TITLE,
  );
  const displayDescription = truncateText(
    description || "Sosyal medya paylaşımlarında gösterilecek açıklama metni.",
    SEO_LIMITS.SOCIAL_DESCRIPTION,
  );

  useEffect(() => {
    setImageStatus(image ? "loading" : "error");
  }, [image]);

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-lg border border-zinc-300 shadow-sm sm:max-w-[400px]">
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
            onError={() => setImageStatus("error")}
            onLoad={() => setImageStatus("success")}
            loading="lazy"
          />
        </div>
      )}
      {imageStatus === "error" && <div className="h-2 w-full bg-zinc-200" />}
      <div className="flex flex-col gap-1 p-3">
        <div className="line-clamp-1 text-xs text-zinc-500 uppercase">
          {url}
        </div>
        <h3 className="line-clamp-1 text-base font-bold text-zinc-800">
          {displayTitle}
        </h3>
        <p className="line-clamp-2 text-sm text-zinc-600">
          {displayDescription}
        </p>
      </div>
    </div>
  );
}

export function SeoPreview({
  title = "",
  description = "",
  slug = "",
  image = "",
  baseUrl = "example.com",
  titleInput,
  descriptionInput,
  slugInput,
  imageInput,
  containerClassName,
  defaultMode = "google",
}: SeoPreviewProps) {
  const [mode, setMode] = useState<PreviewMode>(defaultMode);

  const previewData = useSeoPreview({
    initialTitle: title,
    initialDescription: description,
    initialSlug: slug,
    initialImage: image,
    titleInput,
    descriptionInput,
    slugInput,
    imageInput,
  });

  return (
    <div className={twMerge("flex flex-col gap-3", containerClassName)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-700">SEO Önizleme</h3>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-md border border-zinc-200">
            <PreviewModeButton
              mode="google"
              currentMode={mode}
              onClick={() => setMode("google")}
              icon={<Globe size={12} />}
              label="Google"
            />
            <PreviewModeButton
              mode="social"
              currentMode={mode}
              onClick={() => setMode("social")}
              icon={<Share2 size={12} />}
              label="Sosyal Medya"
            />
          </div>
        </div>
      </div>
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

function PreviewModeButton({
  mode,
  currentMode,
  onClick,
  icon,
  label,
}: PreviewModeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors",
        currentMode === mode
          ? "bg-primary text-white"
          : "bg-zinc-50 text-zinc-700 hover:bg-zinc-100",
      )}
      type="button"
    >
      {icon} {label}
    </button>
  );
}

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

interface UseSeoPreviewParams {
  initialTitle: string;
  initialDescription: string;
  initialSlug: string;
  initialImage: string;
  titleInput?: { id: string; value: string };
  descriptionInput?: { id: string; value: string };
  slugInput?: { id: string; value: string };
  imageInput?: { id: string; value: string };
}

interface GoogleSearchPreviewProps {
  title: string;
  description: string;
  slug: string;
  baseUrl: string;
}

interface SocialMediaPreviewProps {
  title: string;
  description: string;
  slug: string;
  baseUrl: string;
  image?: string;
}

interface PreviewModeButtonProps {
  mode: PreviewMode;
  currentMode: PreviewMode;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}
