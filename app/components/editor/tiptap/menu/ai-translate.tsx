import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useTiptapContext } from "../store";
import RichButtonModal from "./ui/modal";
import { LoadingBlocker } from "../../ui/loading-blocker";
import MenuButton from "./ui/button";

export const LANGUAGES = [
  { code: "English", label: "İngilizce" },
  { code: "Turkish", label: "Türkçe" },
  { code: "German", label: "Almanca" },
  { code: "French", label: "Fransızca" },
];

const AITranslateHTML = () => {
  const { translateContent } = useTiptapContext();
  const [isActive, setIsActive] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState(""); // Kullanıcı seçimi
  const [targetLanguage, setTargetLanguage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Hedef dil seçeneklerinden kaynak dili çıkar
  const targetLanguageOptions = LANGUAGES.filter(
    (lang) => lang.code !== sourceLanguage,
  );

  const handleTranslate = async () => {
    if (!targetLanguage || !sourceLanguage) return;
    setIsLoading(true);
    await translateContent(targetLanguage, sourceLanguage);
    setIsLoading(false);
    setIsActive(false);
    setSourceLanguage("");
    setTargetLanguage("");
  };

  return (
    <>
      <MenuButton
        onClick={() => setIsActive(true)}
        isActive={isActive}
        label="AI Çeviri"
      >
        <Sparkles className="size-5" />
      </MenuButton>

      <RichButtonModal
        isOpen={isActive}
        onClose={() => {
          setIsActive(false);
          setSourceLanguage("");
          setTargetLanguage("");
        }}
        title={
          (
            <div className="flex flex-col">
              <span className="flex items-center gap-2 text-lg font-bold">
                <Sparkles className="text-primary" size={22} />
                AI Destekli Blog Çevirisi
              </span>
              <span className="flex text-sm text-gray-600">
                Blog içeriğinizi seçtiğiniz dile otomatik olarak çevirin.
                Orijinal dil ile hedef dil aynı olamaz.
              </span>
            </div>
          ) as any
        }
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Mevcut Blog Dili
            </label>
            <select
              className="w-full rounded border px-3 py-2"
              value={sourceLanguage}
              onChange={(e) => {
                setSourceLanguage(e.target.value);
                // Eğer hedef dil, yeni kaynak dil ile aynıysa sıfırla
                if (e.target.value === targetLanguage) setTargetLanguage("");
              }}
            >
              <option value="">Dil seçin</option>
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Çevirmek İstediğiniz Dil
            </label>
            <select
              className="w-full rounded border px-3 py-2"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              disabled={!sourceLanguage}
            >
              <option value="">Dil seçin</option>
              {targetLanguageOptions.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
          <button
            className="bg-primary-600 hover:bg-primary-700 w-full rounded py-2 font-semibold text-white transition"
            disabled={!targetLanguage || !sourceLanguage || isLoading}
            onClick={handleTranslate}
          >
            {isLoading ? "Çeviriliyor..." : "Çevir"}
          </button>
        </div>
      </RichButtonModal>

      <LoadingBlocker loading={isLoading} label="AI ile çeviri yapılıyor..." />
    </>
  );
};

export { AITranslateHTML };
