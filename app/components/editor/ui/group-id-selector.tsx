import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import {
  Lock,
  Unlock,
  Search,
  X,
  Loader2,
  Link2,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import RichButtonModal from "../tiptap/menu/ui/modal";
import { useEditorContext } from "../store";
import { slugify } from "../helper";
import useThrottle from "@/hooks/use-throttle";
import { ALL_LANGUAGE_DICTONARY } from "@/i18n/config";

interface GroupIDSelectorProps extends React.ComponentProps<"input"> {
  label?: string;
  modalTitle?: string;
  isRequired?: boolean;
  errorMessage?: string;
  hint?: string;
  containerClassName?: string;

  // Auto mode
  isAutoMode?: boolean;
  initialAutoMode?: boolean;
  followRef?: React.RefObject<HTMLInputElement>;
}

type GroupModeType = "search" | "custom";

export const GroupIDSelector = ({
  label = "Grup ID",
  modalTitle = "Blog Grup ID Seçimi",
  id,
  isRequired = false,
  errorMessage,
  hint = "Dil versiyonları arasındaki ilişki için kullanılır",
  isAutoMode = true,
  initialAutoMode = true,
  followRef,
  containerClassName,
  ...props
}: GroupIDSelectorProps) => {
  // State yönetimi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoMode, setAutoMode] = useState({
    status: isAutoMode,
    value: initialAutoMode,
  });
  const [groupModeState, setGroupModeState] = useState<GroupModeType>("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  // Throttle search query
  const throttledSearchQuery = useThrottle(searchQuery, 500);

  // Editor context'inden gerekli değerleri al
  const {
    fetchBlogPosts,
    blogList,
    statusStates: { blogPosts },
    setBlogPostsQuery,
  } = useEditorContext();

  const inputId =
    id || `group-id-${Math.random().toString(36).substring(2, 9)}`;

  // Auto mode için followRef yaklaşımı
  useEffect(() => {
    if (!autoMode.status || !autoMode.value || !followRef?.current) return;

    // Takip edilen input değiştiğinde dinleme işlevi
    const handleFollowInputChange = () => {
      if (!autoMode.value || !followRef.current) return;

      const followValue = followRef.current.value;
      const newSlug = slugify(followValue);

      // Değer değiştiyse ve followRef'ten geliyorsa
      if (props.onChange && newSlug !== props.value) {
        // Simulasyon event'i
        const simulatedEvent = {
          target: {
            name: props.name,
            value: newSlug,
          },
        } as any;

        props.onChange(simulatedEvent);
      }
    };

    // İlk yükleme için değeri al
    if (followRef.current.value) {
      handleFollowInputChange();
    }

    // Event listener'ı ekle
    followRef.current.addEventListener("input", handleFollowInputChange);

    // Cleanup
    return () => {
      followRef.current?.removeEventListener("input", handleFollowInputChange);
    };
  }, [
    autoMode.status,
    autoMode.value,
    followRef,
    props.name,
    props.onChange,
    props.value,
  ]);

  // Throttled search query'i izle ve değiştiğinde API çağrısı yap
  useEffect(() => {
    if (isModalOpen && groupModeState === "search") {
      setBlogPostsQuery({
        title: throttledSearchQuery,
        limit: 5,
        offset: 0,
      });
      fetchBlogPosts(true);
    }
  }, [
    throttledSearchQuery,
    isModalOpen,
    groupModeState,
    setBlogPostsQuery,
    fetchBlogPosts,
  ]);

  // Input değişikliği (manuel mod)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (autoMode.value) return;

    // Girilen değeri slugify ile formatlayalım
    const newValue = slugify(e.target.value);

    if (e.target.value !== newValue) {
      e.target.value = newValue;
    }

    // Orijinal onChange olayını çağır
    if (props.onChange) {
      props.onChange(e);
    }
  };

  // Blog arama işlemi
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Blog seçme işlemi
  const selectBlog = (groupId: string) => {
    setIsModalOpen(false);
    setSelectedBlogId(null);

    if (props.onChange) {
      props.onChange({
        target: {
          name: props.name,
          value: groupId,
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  // Modal açma
  const openModal = () => {
    setIsModalOpen(true);
    setGroupModeState("search");
  };

  // UI durumları
  const isLoading = blogPosts.loading;
  const isEmpty = !isLoading && blogList.totalCount === 0;
  const hasData = !isLoading && blogList.totalCount > 0;

  return (
    <div className={twMerge("flex flex-col gap-1.5", containerClassName)}>
      {/* Label ve Auto Mode Toggle */}
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-zinc-700"
          >
            {label}
            {isRequired && <span className="ml-1 text-red-500">*</span>}
          </label>
          {isAutoMode && (
            <button
              type="button"
              onClick={() =>
                setAutoMode((prev) => ({ ...prev, value: !prev.value }))
              }
              className="flex items-center gap-1.5 rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 transition-colors duration-200 hover:bg-zinc-200 hover:text-zinc-800"
            >
              {autoMode.value ? (
                <>
                  <Lock size={12} className="text-amber-500" /> Düzenlemeyi Aç
                </>
              ) : (
                <>
                  <Unlock size={12} className="text-green-500" /> Otomatik
                  Düzenle
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Input Field */}
      <div
        className={twMerge(
          "group relative flex items-center rounded-md border border-zinc-300 transition-all focus-within:border-zinc-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-zinc-100",
          autoMode.value &&
            "pointer-events-none cursor-not-allowed bg-zinc-50 text-zinc-500",
          errorMessage ? "border-red-500 bg-red-50" : "",
        )}
      >
        <div className="pointer-events-none absolute left-3 text-zinc-400">
          <Link2 size={16} />
        </div>

        <input
          {...props}
          id={inputId}
          onChange={handleInputChange}
          className={twMerge(
            "w-full resize-y rounded-md bg-transparent py-2 pr-14 pl-10 outline-none",
            props.className || "",
          )}
          readOnly={autoMode.value}
        />

        <div className="absolute right-2 flex items-center gap-2">
          <button
            type="button"
            onClick={openModal}
            className="flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-200 hover:text-zinc-700"
            title="Blog listesinden seç"
          >
            <ExternalLink size={14} className="mr-0.5" /> Seç
          </button>
        </div>
      </div>

      {/* Hint veya Hata Mesajı */}
      {(errorMessage || hint) && (
        <p
          className={`text-xs ${errorMessage ? "text-red-500" : "text-zinc-500"}`}
        >
          {errorMessage || hint}
        </p>
      )}

      {/* Blog Seçme Modalı */}
      <RichButtonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        maxWidth="max-w-xl"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            {/* Arama alanı */}
            <div className="relative w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={16} className="text-zinc-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Blog başlıklarında ara..."
                className="focus:border-primary focus:ring-primary h-10 w-full rounded-md border border-zinc-300 px-10 focus:ring-1 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Yenileme butonu */}
            <button
              type="button"
              onClick={() => fetchBlogPosts(true)}
              disabled={isLoading}
              className="flex h-10 items-center gap-2 rounded-md bg-zinc-100 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-200 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <RefreshCw size={16} />
              )}
              {isLoading ? "Yükleniyor..." : "Yenile"}
            </button>
          </div>

          {/* Yükleme durumu */}
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 size={24} className="text-primary animate-spin" />
              <span className="ml-2 text-zinc-600">Bloglar yükleniyor...</span>
            </div>
          )}

          {/* Boş durum */}
          {isEmpty && !isLoading && (
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-8 text-center">
              <p className="text-zinc-600">Herhangi bir blog bulunamadı.</p>
              {searchQuery && (
                <p className="mt-1 text-zinc-500">
                  "{searchQuery}" için blog bulunamadı. Lütfen başka bir arama
                  terimi deneyin.
                </p>
              )}
            </div>
          )}

          {/* Blog listesi */}
          {hasData && !isLoading && (
            <div className="max-h-96 overflow-y-auto rounded-md border border-zinc-200">
              <table className="min-w-full divide-y divide-zinc-200">
                <thead className="bg-zinc-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase"
                    >
                      Blog Başlığı
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-center text-xs font-medium tracking-wider text-zinc-500 uppercase"
                    >
                      Dil
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-center text-xs font-medium tracking-wider text-zinc-500 uppercase"
                    >
                      İşlem
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 bg-white">
                  {Object.keys(blogList.originalData).map((key) => {
                    const blog = blogList.originalData[key];
                    return (
                      <tr
                        key={blog.id}
                        className={`hover:bg-zinc-50 ${
                          selectedBlogId === blog.id ? "bg-primary-50" : ""
                        }`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-zinc-200">
                              {blog.content.image ? (
                                <img
                                  src={blog.content.image}
                                  alt={blog.content.title}
                                  className="h-full w-full object-cover"
                                />
                              ) : null}
                            </div>
                            <div className="ml-3 max-w-xs">
                              <p className="max-w-50 truncate text-sm font-medium text-zinc-900">
                                {blog.content.title}
                              </p>
                              <p className="max-w-50 truncate text-sm text-zinc-500">
                                {blog.groupId}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            {ALL_LANGUAGE_DICTONARY.find(
                              (lang) => lang.value === blog.language,
                            )?.label || "Bilinmeyen Dil"}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-center text-sm font-medium whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => selectBlog(blog.groupId)}
                            className="bg-primary hover:bg-primary-dark inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium text-white"
                          >
                            Dili Bağla
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </RichButtonModal>
    </div>
  );
};

GroupIDSelector.displayName = "Blog-GroupIDSelector";
