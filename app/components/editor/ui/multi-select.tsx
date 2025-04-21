import { slugify } from "../helper";
import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import {
  Tag,
  Plus,
  X,
  Check,
  ChevronDown,
  Tags,
  Loader2,
  RefreshCw,
} from "lucide-react";
import RichButtonModal from "../tiptap/menu/ui/modal";

interface ValueOptions {
  name: string; // Slug değeri (örn: "rent-a-car")
  value: string; // Görüntülenecek isim (örn: "Rent A Car")
}

interface StatusState {
  loading: boolean;
  error: string | null;
}

interface MultiSelectProps {
  label?: string;
  id?: string;
  options: ValueOptions[];
  isRequired?: boolean;
  isError?: boolean;
  errorMessage?: string;
  hint?: string;
  placeholder?: string;
  containerClassName?: string;
  value: ValueOptions[];
  onChange?: (values: ValueOptions[] | null) => void;
  allowCustomOption?: boolean;
  customOptionPlaceholder?: string;
  searchPlaceholder?: string;

  // Dışarıdan gelen fonksiyonlar ve durumlar
  onAddCustomOption: (option: SelectOption) => Promise<any>;
  onFetchOptions: () => Promise<any>;
  onRefreshOptions: () => Promise<any>;
  modalStatus: StatusState;
}

export const MultiSelect = ({
  label,
  options: initialOptions,
  value,
  isRequired = false,
  isError = false,
  errorMessage,
  hint,
  placeholder = "Seçenekler seçmek için tıklayın",
  containerClassName,
  onChange,
  allowCustomOption = true,
  customOptionPlaceholder = "Yeni kategori ekle...",
  searchPlaceholder = "Kategorilerde ara...",
  // Dışarıdan gelen fonksiyonlar ve durumlar
  onAddCustomOption,
  onFetchOptions,
  onRefreshOptions,
  modalStatus,
}: MultiSelectProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [options, setOptions] = useState<ValueOptions[]>(initialOptions);
  const [selectedValues, setSelectedValues] = useState<ValueOptions[]>(value);
  const [customOptionText, setCustomOptionText] = useState("");
  const [searchText, setSearchText] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  // Ilk render da fetch atarak yenile.
  useEffect(() => {
    onFetchOptions();
  }, []);

  // Dışarıdan gelen değerleri izle
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValues(value || []);
    }
  }, [value]);

  // Dışarıdan gelen seçenekleri izle
  useEffect(() => {
    setOptions(initialOptions);
  }, [initialOptions]);

  // Dışarıdan gelen hataları izle
  useEffect(() => {
    setLocalError(modalStatus.error);
  }, [modalStatus.error]);

  // Modal dışına tıklandığında kapatma
  const closeModal = () => {
    setIsModalOpen(false);
    setSearchText("");
    setLocalError(null);
  };

  // Seçili değerleri değiştir ve parent'a bildir
  const handleValueChange = (newValues: ValueOptions[]) => {
    setSelectedValues(newValues);
    if (onChange) {
      onChange(newValues.length ? newValues : null);
    }
  };

  const handleClearSelection = () => {
    handleValueChange([]);
  };

  // Opsiyon seçme/seçimi kaldırma
  const toggleOption = (option: ValueOptions) => {
    const isSelected = selectedValues.some((item) => item.name === option.name);

    const newSelectedValues = isSelected
      ? selectedValues.filter((item) => item.name !== option.name)
      : [...selectedValues, option];

    handleValueChange(newSelectedValues);
  };

  // Dışarıdan seçili bir değeri kaldır
  const removeSelectedValue = (optionName: string) => {
    const newSelectedValues = selectedValues.filter(
      (val) => val.name !== optionName,
    );
    handleValueChange(newSelectedValues);
  };

  const addCustomOption = async () => {
    if (!customOptionText.trim()) return;
    setLocalError(null);

    const displayValue = customOptionText.trim();
    const slugName = slugify(displayValue);

    // Güvenli kontrol - değer kontrolü
    const exists = options.some(
      (option) =>
        option &&
        option.value &&
        typeof option.value === "string" &&
        option.value.toLowerCase() === displayValue.toLowerCase(),
    );

    if (exists) {
      setCustomOptionText("");
      setLocalError("Bu seçenek zaten mevcut");
      return;
    }

    if (!onAddCustomOption) return;

    try {
      await onAddCustomOption({
        name: slugName, // Slug değeri
        name: displayValue, // Görüntülenecek isim
      });

      // Input'u başarılı eklemeden sonra temizle
      setCustomOptionText("");
    } catch (error) {
      console.error("Failed to add custom option:", error);
      setLocalError(
        error instanceof Error
          ? error.message
          : "Ekleme sırasında bir hata oluştu",
      );
      return; // Hata durumunda fonksiyondan çık
    }

    // finally yerine try bloğundan sonra - hata olmadığında çalışsın
    if (onRefreshOptions) {
      try {
        await onRefreshOptions(); // await kullanıldığına dikkat edin
      } catch (refreshError) {
        console.error("Failed to refresh options:", refreshError);
        // Yenileme hatası olursa kullanıcıya bildir (isteğe bağlı)
        setLocalError("Seçenekler yenilenirken bir hata oluştu");
      }
    }
  };

  const filteredOptions = options.filter((option) =>
    option?.value?.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div className={twMerge("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-700">
            {label}
            {isRequired && <span className="ml-1 text-red-500">*</span>}
          </label>
        </div>
      )}

      {/* Ana input alanı - tıklanabilir */}
      <div
        onClick={() => setIsModalOpen(true)}
        className={twMerge(
          "flex min-h-10 cursor-pointer flex-wrap items-center rounded-md border border-zinc-300 bg-white p-1.5 transition-colors hover:border-zinc-400",
          isError && "border-red-500 ring-2 ring-red-100",
        )}
      >
        {selectedValues.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {selectedValues.map((option, index) => (
              <div
                key={option.name + index + "MultiSelect-Options"}
                className="group flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-xs"
              >
                <Tag size={12} className="text-zinc-500" />
                <span>{option.value}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedValue(option.name);
                  }}
                  className="rounded-full p-0.5 text-zinc-400 hover:bg-zinc-200 hover:text-red-500"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-1.5 text-sm text-zinc-500">
            <Tags size={16} />
            <span>{placeholder}</span>
          </div>
        )}

        <div className="ml-auto flex items-center">
          <ChevronDown size={18} className="text-zinc-400" />
        </div>
      </div>

      {/* Hata mesajı veya ipucu */}
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

      {/* Seçenek Modalı */}
      <RichButtonModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Kategoriler"
        maxWidth="max-w-md"
      >
        <div className="flex flex-col gap-4">
          {/* Arama input'u */}
          <div className="relative">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full rounded-md border border-zinc-300 py-2 pr-8 pl-3 text-sm focus:border-zinc-500 focus:ring-2 focus:ring-zinc-100 focus:outline-none"
            />
            {searchText && (
              <button
                type="button"
                onClick={() => setSearchText("")}
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Hata mesajı */}
          {localError && (
            <div className="rounded-md bg-red-50 p-2 text-sm text-red-600">
              {localError}
            </div>
          )}

          {/* Özel kategori ekleme */}
          {allowCustomOption && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customOptionText}
                onChange={(e) => setCustomOptionText(e.target.value)}
                placeholder={customOptionPlaceholder}
                className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:ring-2 focus:ring-zinc-100 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customOptionText.trim()) {
                    e.preventDefault();
                    addCustomOption();
                  }
                }}
                disabled={modalStatus.loading}
              />

              <button
                type="button"
                onClick={() => addCustomOption()}
                disabled={!customOptionText.trim() || modalStatus.loading}
                className="flex h-10 items-center gap-1 rounded-md bg-zinc-100 px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {modalStatus.loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Plus size={14} />
                )}
                Ekle
              </button>
              <button
                type="button"
                onClick={() => onRefreshOptions()}
                disabled={modalStatus.loading}
                className="flex h-10 items-center gap-1 rounded-md bg-zinc-100 px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {modalStatus.loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <RefreshCw size={14} />
                )}
              </button>
            </div>
          )}

          {/* Seçenekler listesi */}
          <div className="max-h-60 overflow-y-auto rounded-md border border-zinc-200">
            {modalStatus.loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-zinc-500" />
                <span className="ml-2 text-sm text-zinc-500">
                  Yükleniyor...
                </span>
              </div>
            ) : filteredOptions.length > 0 ? (
              <div className="flex flex-col divide-y divide-zinc-100">
                {filteredOptions.map((option) => {
                  const isSelected = selectedValues.some(
                    (item) => item.name === option.name,
                  );
                  return (
                    <button
                      key={option.name}
                      type="button"
                      onClick={() => toggleOption(option)}
                      className={twMerge(
                        "flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-zinc-50",
                        isSelected && "bg-zinc-50",
                      )}
                    >
                      <div
                        className={twMerge(
                          "flex size-5 flex-shrink-0 items-center justify-center rounded border border-zinc-300",
                          isSelected && "border-primary-500 bg-primary-500",
                        )}
                      >
                        {isSelected && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                      <span>{option.value}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-sm text-zinc-500">Sonuç bulunamadı</p>
                {searchText && (
                  <p className="mt-1 text-xs text-zinc-400">
                    "{searchText}" için hiçbir kategori bulunamadı
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Seçim özeti */}
          <div className="border-t border-zinc-200 pt-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-500">
                <span className="font-medium">{selectedValues.length}</span> öge
                seçildi
              </p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="text-sm text-zinc-500 hover:text-zinc-700"
                >
                  {selectedValues.length >= 2
                    ? "Seçimleri temizle"
                    : "Seçimi temizle"}
                </button>

                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-primary-500 hover:bg-primary-600 rounded-md px-4 py-2 text-sm font-medium text-white"
                >
                  Tamam
                </button>
              </div>
            </div>
          </div>
        </div>
      </RichButtonModal>
    </div>
  );
};

MultiSelect.displayName = "Blog-MultiSelect";
