import { useState, useRef, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { Check, ChevronDown, Plus, Search, X } from "lucide-react";
import RichButtonModal from "../tiptap/menu/ui/modal";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  id?: string;
  options: SelectOption[];
  isRequired?: boolean;
  isError?: boolean;
  errorMessage?: string;
  hint?: string;
  placeholder?: string;
  containerClassName?: string;
  value?: string | null;
  onChange?: (value: string | null) => void;
  allowCustomOption?: boolean;
  customOptionPlaceholder?: string;
  searchPlaceholder?: string;
}

export const Select = ({
  label,
  id,
  options: initialOptions,
  isRequired = false,
  isError = false,
  errorMessage,
  hint,
  placeholder = "Seçim yapın",
  containerClassName,
  value = null,
  onChange,
  allowCustomOption = true,
  customOptionPlaceholder = "Yeni seçenek ekle...",
  searchPlaceholder = "Seçeneklerde ara...",
}: SelectProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [options, setOptions] = useState<SelectOption[]>(initialOptions);
  const [selectedValue, setSelectedValue] = useState<string | null>(value);
  const [customOptionText, setCustomOptionText] = useState("");
  const [searchText, setSearchText] = useState("");

  const inputId =
    id || `enhanced-select-${Math.random().toString(36).substring(2, 9)}`;

  // Dışarıdan gelen değerleri izle
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  // Modal dışına tıklandığında kapatma
  const closeModal = () => {
    setIsModalOpen(false);
    setSearchText("");
  };

  // Seçili değeri değiştir ve parent'a bildir
  const handleValueChange = (newValue: string | null) => {
    setSelectedValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  // Opsiyon seçme
  const selectOption = (optionValue: string) => {
    handleValueChange(optionValue);
    setIsModalOpen(false);
  };

  // Seçimi temizle
  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleValueChange(null);
  };

  // Yeni özel seçenek ekle
  const addCustomOption = () => {
    if (!customOptionText.trim()) return;

    // Aynı değere sahip bir seçenek var mı kontrol et
    const exists = options.some(
      (option) =>
        option.value.toLowerCase() === customOptionText.trim().toLowerCase(),
    );

    if (!exists) {
      const newOption: SelectOption = {
        value: customOptionText.trim(),
        label: customOptionText.trim(),
      };

      // Seçeneklere ekle ve otomatik olarak seç
      setOptions([...options, newOption]);
      handleValueChange(newOption.value);
      setIsModalOpen(false);
    } else {
      // Zaten var olan bir seçeneği seç
      const existingValue = options.find(
        (option) =>
          option.value.toLowerCase() === customOptionText.trim().toLowerCase(),
      )?.value;

      if (existingValue) {
        handleValueChange(existingValue);
        setIsModalOpen(false);
      }
    }

    // Input'u temizle
    setCustomOptionText("");
  };

  // Arama sonucuna göre filtrelenmiş seçenekler
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchText.toLowerCase()),
  );

  // Seçili etiketi bul ve göster
  const selectedOption = options.find(
    (option) => option.value === selectedValue,
  );

  return (
    <div className={twMerge("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <div className="flex items-center justify-between">
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-zinc-700"
          >
            {label}
            {isRequired && <span className="ml-1 text-red-500">*</span>}
          </label>
        </div>
      )}

      {/* Ana select alanı - tıklanabilir */}
      <div
        onClick={() => setIsModalOpen(true)}
        className={twMerge(
          "flex h-10 cursor-pointer items-center justify-between rounded-md border border-zinc-300 bg-white px-3 transition-colors hover:border-zinc-400",
          isError && "border-red-500 ring-2 ring-red-100",
        )}
      >
        {selectedOption ? (
          <div className="flex w-full items-center justify-between">
            <span className="text-sm text-zinc-800">
              {selectedOption.label}
            </span>
            <button
              type="button"
              onClick={clearSelection}
              className="mr-2 ml-2 flex items-center gap-1 rounded-full border border-red-200 bg-red-500 p-0.5 px-2 py-1 text-xs text-zinc-50 hover:bg-red-600 hover:text-red-100"
            >
              <X size={14} /> <span>Kaldır</span>
            </button>
          </div>
        ) : (
          <span className="text-sm text-zinc-500">{placeholder}</span>
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
        title="Seçenek"
        maxWidth="max-w-md"
      >
        <div className="flex flex-col gap-4">
          {/* Arama input'u */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={16} className="text-zinc-400" />
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full rounded-md border border-zinc-300 py-2 pr-8 pl-10 text-sm focus:border-zinc-500 focus:ring-2 focus:ring-zinc-100 focus:outline-none"
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

          {/* Özel seçenek ekleme */}
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
                  const isSelected = selectedValue === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => selectOption(option.value)}
                      className={twMerge(
                        "flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-zinc-50",
                        isSelected && "bg-zinc-50",
                      )}
                    >
                      <div
                        className={twMerge(
                          "flex size-5 flex-shrink-0 items-center justify-center rounded-full border border-zinc-300",
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
                    "{searchText}" için hiçbir sonuç bulunamadı
                  </p>
                )}
                {allowCustomOption && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomOptionText(searchText);
                      setSearchText("");
                    }}
                    className="mt-3 flex items-center gap-1 rounded-md bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-200"
                  >
                    <Plus size={12} />"{searchText}" ekle
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Alt butonlar */}
          <div className="border-t border-zinc-200 pt-3">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  handleValueChange(null);
                  setIsModalOpen(false);
                }}
                className="text-sm text-zinc-500 hover:text-zinc-700"
              >
                Seçimi temizle
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="bg-primary-500 hover:bg-primary-600 rounded-md px-4 py-2 text-sm font-medium text-white"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      </RichButtonModal>
    </div>
  );
};

Select.displayName = "Blog-Select";
