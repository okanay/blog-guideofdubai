// app/components/editor/ui/group-id-selector.tsx
import { useState, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import {
  Lock,
  Unlock,
  Search,
  X,
  Loader2,
  Link2,
  ExternalLink,
} from "lucide-react";
import RichButtonModal from "../tiptap/menu/ui/modal";
import { useEditorContext } from "../store";
import { slugify } from "../helper";
import useThrottle from "@/hooks/use-throttle";

interface GroupIDSelectorProps extends React.ComponentProps<"input"> {
  label?: string;
  modalTitle?: string;
  isRequired?: boolean;
  isError?: boolean;
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
  ref,
  className,
  label = "Grup ID",
  modalTitle = "Blog Grup ID Seçimi",
  id,
  value = "",
  onChange,
  onBlur,
  name,

  isRequired = false,
  isError = false,
  errorMessage,
  hint = "Dil versiyonları arasındaki ilişki için kullanılır",

  isAutoMode = true,
  initialAutoMode = true,
  followRef,

  containerClassName,
  ...props
}: GroupIDSelectorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuto, setIsAuto] = useState(initialAutoMode);
  const [internalValue, setInternalValue] = useState<string>(
    (value as string) || "",
  );
  const [groupModeState, setGroupModeState] = useState<GroupModeType>("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  // Throttle search query
  const throttledSearchQuery = useThrottle(searchQuery, 2000);

  const {
    fetchBlogPosts,
    blogPosts,
    blogPostsTotal,
    blogPostsStatus,
    setBlogPostsQuery,
  } = useEditorContext();

  const elementRef = useRef<HTMLInputElement | null>(null);
  const inputId =
    id || `group-id-${Math.random().toString(36).substring(2, 9)}`;

  // Dışarıdan gelen value değişirse iç state'i güncelle
  useEffect(() => {
    if (value !== undefined && value !== null) {
      setInternalValue(value as string);
    }
  }, [value]);

  // Auto mode için followRef yaklaşımı
  useEffect(() => {
    if (!isAutoMode || !followRef?.current) return;

    // Takip edilen input değiştiğinde dinleme işlevi
    const handleFollowInputChange = () => {
      if (!isAuto || !followRef.current) return;

      const followValue = followRef.current.value;
      const newSlug = slugify(followValue);

      if (newSlug !== internalValue) {
        setInternalValue(newSlug);

        // onChange olayını tetikle
        if (onChange) {
          onChange({
            target: {
              name,
              value: newSlug,
            },
          } as React.ChangeEvent<HTMLInputElement>);
        }
      }
    };

    // İlk yükleme için değeri al
    if (isAuto && followRef.current) {
      const initialFollowValue = followRef.current.value;
      const newSlug = slugify(initialFollowValue);

      setInternalValue(newSlug);

      if (onChange && newSlug !== internalValue) {
        onChange({
          target: {
            name,
            value: newSlug,
          },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    }

    // input event listener kullanarak gerçek zamanlı takip et
    followRef.current.addEventListener("input", handleFollowInputChange);

    // Temizleme fonksiyonu
    return () => {
      followRef.current?.removeEventListener("input", handleFollowInputChange);
    };
  }, [isAuto, followRef, onChange, name, isAutoMode]);

  // Throttled search query'i izle ve değiştiğinde API çağrısı yap
  useEffect(() => {
    if (isModalOpen && groupModeState === "search") {
      setBlogPostsQuery({
        title: throttledSearchQuery,
        limit: 5,
        offset: 0,
      });
      fetchBlogPosts();
    }
  }, [
    throttledSearchQuery,
    isModalOpen,
    groupModeState,
    setBlogPostsQuery,
    fetchBlogPosts,
  ]);

  // Auto modu değiştirme fonksiyonu
  const toggleAutoMode = () => {
    const newAutoMode = !isAuto;
    setIsAuto(newAutoMode);

    // Auto mod açıldığında, takip edilen değeri al
    if (newAutoMode && followRef?.current) {
      const followValue = followRef.current.value;
      const newSlug = slugify(followValue);

      if (newSlug !== internalValue) {
        setInternalValue(newSlug);

        if (onChange) {
          onChange({
            target: {
              name,
              value: newSlug,
            },
          } as React.ChangeEvent<HTMLInputElement>);
        }
      }
    }
  };

  // Blog arama işlemi - sadece yerel state'i güncelle
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // API çağrısı throttle ile yapılıyor
  };

  // Blog seçme işlemi
  const selectBlog = (groupId: string) => {
    setInternalValue(groupId);
    setIsModalOpen(false);
    setSelectedBlogId(null);

    if (onChange) {
      onChange({
        target: {
          name,
          value: groupId,
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  // Input değişikliği (manuel mod)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isAuto) return;

    // Girilen değeri slugify ile formatlayalım
    const newValue = slugify(e.target.value);
    setInternalValue(newValue);

    if (onChange) {
      // onChange'e formatlanmış değeri gönderelim
      const simulatedEvent = {
        ...e,
        target: {
          ...e.target,
          value: newValue,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(simulatedEvent);
    }
  };

  // Modal açma
  const openModal = () => {
    setIsModalOpen(true);
    setGroupModeState("search");
  };

  // UI durumları
  const status = isError ? "error" : "default";
  const isLoading = blogPostsStatus.loading;
  const isEmpty = !isLoading && blogPostsTotal === 0;
  const hasData = !isLoading && blogPostsTotal > 0;

  // Input referansını birleştirme
  const handleRef = (element: HTMLInputElement | null) => {
    // İç referansı ayarla
    elementRef.current = element;

    // Dışarıdan gelen ref'i ayarla (forwardRef)
    if (typeof ref === "function") {
      ref(element);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLInputElement | null>).current =
        element;
    }
  };

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
              onClick={toggleAutoMode}
              className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-700"
            >
              {isAuto ? (
                <>
                  <Lock size={12} /> Düzenlemeyi Aç
                </>
              ) : (
                <>
                  <Unlock size={12} /> Otomatik Düzenle
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Input Field */}
      <div
        data-status={status}
        className={twMerge(
          "relative flex items-center rounded-md border border-zinc-300 transition-all",
          "data-[status=error]:border-red-500 data-[status=error]:ring-2 data-[status=error]:ring-red-100",
        )}
      >
        <div className="pointer-events-none absolute left-3 text-zinc-400">
          <Link2 size={16} />
        </div>

        <input
          {...props}
          id={inputId}
          ref={handleRef}
          value={internalValue}
          onChange={handleInputChange}
          className={twMerge(
            "w-full rounded-md bg-transparent py-2 pr-20 pl-9 outline-none",
            isAuto &&
              "pointer-events-none cursor-not-allowed bg-zinc-50 text-zinc-500",
            className,
          )}
          readOnly={isAuto}
          onBlur={onBlur}
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
          className={twMerge(
            "text-xs text-zinc-500",
            isError && "text-red-500",
          )}
        >
          {isError ? errorMessage : hint}
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
          {/* Tab Seçenekleri */}
          <div className="flex overflow-hidden rounded-md border border-zinc-200">
            <button
              type="button"
              onClick={() => setGroupModeState("search")}
              className={`relative flex h-10 flex-1 items-center justify-center gap-2 px-4 text-sm font-medium transition-all ${
                groupModeState === "search"
                  ? "bg-primary text-white"
                  : "bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <Search size={16} /> Bloglardan Seç
              {groupModeState === "search" && (
                <span className="bg-primary-600 absolute right-0 bottom-0 left-0 h-0.5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setGroupModeState("custom")}
              className={`relative flex h-10 flex-1 items-center justify-center gap-2 px-4 text-sm font-medium transition-all ${
                groupModeState === "custom"
                  ? "bg-primary text-white"
                  : "bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <Link2 size={16} /> Özel ID Gir
              {groupModeState === "custom" && (
                <span className="bg-primary-600 absolute right-0 bottom-0 left-0 h-0.5" />
              )}
            </button>
          </div>

          {/* Arama Modu İçeriği */}
          {groupModeState === "search" && (
            <>
              {/* Arama alanı */}
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search size={16} className="text-zinc-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Blog başlıklarında ara..."
                  className="focus:border-primary focus:ring-primary w-full rounded-md border border-zinc-300 px-10 py-2 focus:ring-1 focus:outline-none"
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

              {/* Yükleme durumu */}
              {isLoading && (
                <div className="flex items-center justify-center p-8">
                  <Loader2 size={24} className="text-primary animate-spin" />
                  <span className="ml-2 text-zinc-600">
                    Bloglar yükleniyor...
                  </span>
                </div>
              )}

              {/* Boş durum */}
              {isEmpty && !isLoading && (
                <div className="rounded-md border border-zinc-200 bg-zinc-50 p-8 text-center">
                  <p className="text-zinc-600">Herhangi bir blog bulunamadı.</p>
                  {searchQuery && (
                    <p className="mt-1 text-zinc-500">
                      "{searchQuery}" için blog bulunamadı. Lütfen başka bir
                      arama terimi deneyin.
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
                          className="hidden px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase md:table-cell"
                        >
                          Grup ID
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
                      {blogPosts.map((blog) => (
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
                                <p className="truncate text-sm font-medium text-zinc-900">
                                  {blog.content.title}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                              {blog.language === "tr"
                                ? "Türkçe"
                                : blog.language === "en"
                                  ? "İngilizce"
                                  : blog.language}
                            </span>
                          </td>
                          <td className="hidden px-4 py-3 text-sm whitespace-nowrap text-zinc-600 md:table-cell">
                            <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs">
                              {blog.groupId}
                            </code>
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
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Yenileme butonu */}
              <div className="flex justify-center border-t border-zinc-100 pt-4">
                <button
                  type="button"
                  onClick={() => fetchBlogPosts()}
                  disabled={isLoading}
                  className="flex items-center gap-2 rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Search size={16} />
                  )}
                  {isLoading ? "Yükleniyor..." : "Blogları Yenile"}
                </button>
              </div>
            </>
          )}

          {/* Özel ID Modu İçeriği */}
          {groupModeState === "custom" && (
            <div className="flex flex-col gap-4 p-4">
              <div>
                <label
                  htmlFor="custom-group-id"
                  className="mb-1 block text-sm font-medium text-zinc-700"
                >
                  Özel Grup ID
                </label>
                <input
                  type="text"
                  id="custom-group-id"
                  value={internalValue}
                  onChange={(e) => {
                    const newValue = e.target.value;
                    setInternalValue(newValue);
                  }}
                  placeholder="Örnek: my-custom-group-id"
                  className="focus:border-primary focus:ring-primary w-full rounded-md border border-zinc-300 px-3 py-2 focus:ring-1 focus:outline-none"
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Grup ID'si sadece küçük harfler, rakamlar ve tire içerebilir.
                </p>
              </div>

              <div className="flex justify-end border-t border-zinc-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (onChange) {
                      onChange({
                        target: {
                          name,
                          value: internalValue,
                        },
                      } as React.ChangeEvent<HTMLInputElement>);
                    }
                    setIsModalOpen(false);
                  }}
                  className="bg-primary hover:bg-primary-dark rounded-md px-4 py-2 text-sm font-medium text-white"
                >
                  Değeri Kaydet
                </button>
              </div>
            </div>
          )}
        </div>
      </RichButtonModal>
    </div>
  );
};

GroupIDSelector.displayName = "Blog-GroupIDSelector";
