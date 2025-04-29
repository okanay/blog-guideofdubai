import React, { useState, useEffect } from "react";
import { LANGUAGE_DICTONARY } from "@/i18n/config";
import { useLanguage } from "@/i18n/use-language";
import { Globe, X, Check } from "lucide-react";

interface LanguageSwitcherProps {
  className?: string;
  buttonClassName?: string;
}

// Dil bayraklarını daha ayrıntılı olarak tanımlayalım
const LanguageFlags = {
  tr: (active: boolean) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 480"
      className="h-6 w-6"
    >
      <g fillRule="evenodd">
        <path fill="#e30a17" d="M0 0h640v480H0z"></path>
        <path
          fill="#fff"
          d="M407 247.5c0 66.2-54.6 119.9-122 119.9s-122-53.7-122-120 54.6-119.8 122-119.8 122 53.7 122 119.9"
        ></path>
        <path
          fill="#e30a17"
          d="M413 247.5c0 53-43.6 95.9-97.5 95.9s-97.6-43-97.6-96 43.7-95.8 97.6-95.8 97.6 42.9 97.6 95.9z"
        ></path>
        <path
          fill="#fff"
          d="m430.7 191.5-1 44.3-41.3 11.2 40.8 14.5-1 40.7 26.5-31.8 40.2 14-23.2-34.1 28.3-33.9-43.5 12-25.8-37z"
        ></path>
      </g>
    </svg>
  ),
  en: (active: boolean) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 480"
      className="h-6 w-6"
    >
      <path fill="#fff" d="M0 0h640v480H0z"></path>
      <path fill="#ce1124" d="M281.6 0h76.8v480h-76.8z"></path>
      <path fill="#ce1124" d="M0 201.6h640v76.8H0z"></path>
    </svg>
  ),
};

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = () => {
  const { language, changeLanguage } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ESC tuşuyla modalı kapatma
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscKey);
      // Modal açıkken body scroll'u engelle
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Dil seçimi fonksiyonu
  const selectLanguage = (lang: string) => {
    changeLanguage(lang as Language);
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`group hover:border-primary-200 hover:text-primary-600 flex h-11 items-center space-x-2 rounded border border-zinc-200 bg-zinc-50 px-3 text-zinc-700 transition-all`}
        aria-label="Dil değiştir"
      >
        <Globe size={18} className="text-primary-500" />
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-gray-900/40 backdrop-blur-[2px] transition-all duration-300 ease-in-out"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="animate-fade-scale w-full max-w-xs transform rounded-lg bg-white shadow-xl transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Başlık */}
            <div className="from-primary-600 to-primary-500 flex items-center justify-between rounded-t-lg bg-gradient-to-r p-4 text-white shadow-md">
              <div className="flex items-center">
                <Globe size={20} className="mr-2" />
                <span className="text-lg font-medium">Language </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-white transition-all duration-200 hover:bg-white/20 focus:ring-2 focus:ring-white/50 focus:outline-none active:scale-95"
              >
                <X size={18} />
              </button>
            </div>

            {/* Dil Seçenekleri */}
            <div className="p-4">
              {LANGUAGE_DICTONARY.map((lang) => (
                <div
                  key={lang.value}
                  className={`group hover:border-primary-100 hover:bg-primary-50 mb-2 flex cursor-pointer items-center rounded-lg border border-transparent px-4 py-3.5 transition-all duration-200 active:scale-[0.98] ${
                    language === lang.value
                      ? "border-primary-200 bg-primary-50"
                      : ""
                  }`}
                  onClick={() => selectLanguage(lang.value)}
                >
                  <div
                    className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full ${
                      language === lang.value
                        ? "bg-primary-100 text-primary-600"
                        : "bg-gray-100 text-gray-600"
                    } group-hover:bg-primary-100 group-hover:text-primary-600 transition-all duration-200`}
                  >
                    {/* Bayrak ikonu */}
                    {LanguageFlags[lang.value] ? (
                      LanguageFlags[lang.value](language === lang.value)
                    ) : (
                      <Globe size={24} />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className="font-medium text-gray-950">
                      {lang.label}
                    </span>
                  </div>

                  <div className="ml-auto">
                    <div
                      className={`bg-primary-500 flex h-5 w-5 items-center justify-center rounded-full text-white ${
                        language === lang.value ? "opacity-100" : "opacity-0"
                      } transition-opacity duration-200`}
                    >
                      <Check size={12} strokeWidth={3} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LanguageSwitcher;
