import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState, FormEvent } from "react";
import { SearchProvider, useSearch } from "./store";
import { SearchResultsDropdown } from "./dropdown";
import { SearchFilterModal } from "./modal";

// Ana arama çubuğu bileşeni
interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

// app/components/search/index.tsx dosyasındaki SearchBar bileşeni güncellenmiş hali

function SearchBar({
  className = "",
  placeholder = "Best Dubai Restaurant..",
}: SearchBarProps) {
  const {
    searchQuery,
    search,
    updateSearchQuery,
    openDropdown,
    openFilterModal,
    isDropdownOpen,
    closeDropdown,
    resetSearchQuery, // Bu fonksiyonu kullanacağız
  } = useSearch();

  const [inputValue, setInputValue] = useState(searchQuery.title || "");
  const inputRef = useRef<HTMLInputElement>(null);

  // Input değiştiğinde arama yap (debounce ile)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchQuery.title) {
        updateSearchQuery({ title: inputValue });

        // Eğer input boşsa, arama yapmayız ve sonuçları temizleriz
        if (inputValue) {
          search();
          if (!isDropdownOpen) {
            openDropdown();
          }
        } else {
          // Input boşsa sonuçları temizle
          resetSearchQuery();
          closeDropdown();
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [
    inputValue,
    searchQuery.title,
    search,
    updateSearchQuery,
    openDropdown,
    isDropdownOpen,
    closeDropdown,
    resetSearchQuery,
  ]);

  // Form gönderildiğinde
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateSearchQuery({ title: inputValue });

    // Sadece inputta değer varsa arama yap
    if (inputValue) {
      search();
      if (!isDropdownOpen) {
        openDropdown();
      }
    } else {
      // Input boşsa sonuçları temizle
      resetSearchQuery();
      closeDropdown();
    }
  };

  // Input temizleme
  const handleClearInput = () => {
    setInputValue("");
    // Input temizlendiğinde sonuçları da temizle
    resetSearchQuery();
    closeDropdown();

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`relative ${className} w-full`}>
      <form
        onSubmit={handleSubmit}
        className="group flex w-full rounded-full ring ring-zinc-200 ring-offset-2 focus-within:!border-zinc-200 focus-within:!ring-zinc-400"
      >
        <button
          type="button"
          onClick={openFilterModal}
          className="relative flex flex-shrink-0 items-center justify-center gap-2 rounded-l-full border border-zinc-200 bg-zinc-100 px-4 transition-[opacity_colors] duration-300 hover:cursor-pointer hover:border-zinc-300 hover:bg-zinc-200 focus:opacity-75 focus:outline-none sm:w-24 sm:px-2"
        >
          <span className="hidden sm:block">Filter</span>
          <SlidersHorizontal className="size-4" />
        </button>

        <div className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            id="search-input"
            name="search-param"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => {
              // Sadece inputta değer varsa dropdown'ı aç
              if (inputValue) {
                openDropdown();
              }
            }}
            className="w-full flex-grow border-y border-r border-zinc-200 bg-white px-4 py-3 focus:outline-none"
          />

          {inputValue && (
            <button
              type="button"
              onClick={handleClearInput}
              className="absolute top-0 right-0 bottom-0 flex items-center justify-center px-3 text-zinc-400 hover:text-zinc-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="bg-primary flex items-center gap-1.5 rounded-r-full px-4 py-2 font-medium tracking-wide text-white transition-[opacity] duration-500 ease-in-out hover:opacity-75 focus:outline-none"
        >
          <span className="hidden sm:block">Search</span>
          <Search className="size-4 translate-x-[-10%] sm:translate-x-0" />
        </button>
      </form>

      {/* Arama Sonuçları Dropdown */}
      <SearchResultsDropdown />
    </div>
  );
}

// Tam arama komponenti (Provider ile birlikte)
export function SearchBarWithProvider(props: SearchBarProps) {
  return (
    <>
      <SearchBar {...props} />
      <SearchFilterModal />
    </>
  );
}

// Temel bileşenleri dışa aktar
export {
  SearchProvider,
  useSearch,
  SearchBar,
  SearchResultsDropdown,
  SearchFilterModal,
};
