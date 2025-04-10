import { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { Tag, Plus, X, Check, ChevronDown, Tags } from "lucide-react";
import RichButtonModal from "../tiptap/menu/ui/modal";

interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label?: string;
  id?: string;
  options: MultiSelectOption[];
  isRequired?: boolean;
  isError?: boolean;
  errorMessage?: string;
  hint?: string;
  placeholder?: string;
  containerClassName?: string;
  value?: string[] | null;
  onChange?: (values: string[] | null) => void;
  allowCustomOption?: boolean;
  customOptionPlaceholder?: string;
  searchPlaceholder?: string;
}

export const MultiSelect = ({
  label,
  id,
  options: initialOptions,
  isRequired = false,
  isError = false,
  errorMessage,
  hint,
  placeholder = "Seçenekler seçmek için tıklayın",
  containerClassName,
  value = null,
  onChange,
  allowCustomOption = true,
  customOptionPlaceholder = "Yeni kategori ekle...",
  searchPlaceholder = "Kategorilerde ara...",
}: MultiSelectProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [options, setOptions] = useState<MultiSelectOption[]>(initialOptions);
  const [selectedValues, setSelectedValues] = useState<string[]>(value || []);
  const [customOptionText, setCustomOptionText] = useState("");
  const [searchText, setSearchText] = useState("");

  // Dışarıdan gelen değerleri izle
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValues(value || []);
    }
  }, [value]);

  // Modal dışına tıklandığında kapatma
  const closeModal = () => {
    setIsModalOpen(false);
    setSearchText("");
  };

  // Seçili değerleri değiştir ve parent'a bildir
  const handleValueChange = (newValues: string[]) => {
    setSelectedValues(newValues);
    if (onChange) {
      onChange(newValues.length ? newValues : null);
    }
  };

  // Opsiyon seçme/seçimi kaldırma
  const toggleOption = (optionValue: string) => {
    const newSelectedValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((val) => val !== optionValue)
      : [...selectedValues, optionValue];

    handleValueChange(newSelectedValues);
  };

  // Dışarıdan seçili bir değeri kaldır
  const removeSelectedValue = (optionValue: string) => {
    const newSelectedValues = selectedValues.filter(
      (val) => val !== optionValue,
    );
    handleValueChange(newSelectedValues);
  };

  // Yeni özel kategori ekle
  const addCustomOption = () => {
    if (!customOptionText.trim()) return;

    // Aynı değere sahip bir seçenek var mı kontrol et
    const exists = options.some(
      (option) =>
        option.value.toLowerCase() === customOptionText.trim().toLowerCase(),
    );

    if (!exists) {
      const newOption: MultiSelectOption = {
        value: customOptionText.trim(),
        label: customOptionText.trim(),
      };

      // Seçeneklere ekle ve otomatik olarak seç
      setOptions([...options, newOption]);
      handleValueChange([...selectedValues, newOption.value]);
    } else {
      // Zaten var olan bir seçeneği seç
      const existingValue = options.find(
        (option) =>
          option.value.toLowerCase() === customOptionText.trim().toLowerCase(),
      )?.value;

      if (existingValue && !selectedValues.includes(existingValue)) {
        handleValueChange([...selectedValues, existingValue]);
      }
    }

    // Input'u temizle
    setCustomOptionText("");
  };

  // Arama sonucuna göre filtrelenmiş seçenekler
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchText.toLowerCase()),
  );

  // Seçili etiketleri bul ve göster
  const selectedOptions = options.filter((option) =>
    selectedValues.includes(option.value),
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
        {selectedOptions.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {selectedOptions.map((option) => (
              <div
                key={option.value}
                className="group flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-1 text-xs"
              >
                <Tag size={12} className="text-zinc-500" />
                <span>{option.label}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedValue(option.value);
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
              />
              <button
                type="button"
                onClick={addCustomOption}
                disabled={!customOptionText.trim()}
                className="flex items-center gap-1 rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={14} />
                Ekle
              </button>
            </div>
          )}

          {/* Seçenekler listesi */}
          <div className="max-h-60 overflow-y-auto rounded-md border border-zinc-200">
            {filteredOptions.length > 0 ? (
              <div className="flex flex-col divide-y divide-zinc-100">
                {filteredOptions.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggleOption(option.value)}
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
                      <span>{option.label}</span>
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
                <span className="font-medium">{selectedValues.length}</span>{" "}
                kategori seçildi
              </p>
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
      </RichButtonModal>
    </div>
  );
};

MultiSelect.displayName = "Blog-MultiSelect";
