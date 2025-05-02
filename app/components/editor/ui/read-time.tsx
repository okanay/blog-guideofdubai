import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { Clock, Lock, Unlock, RotateCcw } from "lucide-react";
import { calculateContentStats } from "../helper";

interface ReadTimeProps {
  label?: string;
  id?: string;
  isRequired?: boolean;
  errorMessage?: string;
  hint?: string;
  containerClassName?: string;
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  isAutoMode?: boolean;
  initialAutoMode?: boolean;
  name?: string;
  htmlContent?: string;
  defaultWordsPerMinute?: number;
}

interface ContentStats {
  wordCount: number;
  characterCount: number;
  autoReadTime: number;
}

export const ReadTime = ({
  label = "Okuma Süresi",
  id,
  isRequired = false,
  errorMessage,
  hint = "Dakika cinsinden ortalama okuma süresi",
  containerClassName,
  value,
  onChange,
  onBlur,
  isAutoMode = true,
  initialAutoMode = false,
  htmlContent = "",
  defaultWordsPerMinute = 225,
  ...props
}: ReadTimeProps) => {
  // State yönetimi
  const [autoMode, setAutoMode] = useState({
    status: isAutoMode,
    value: initialAutoMode,
  });

  const [stats, setStats] = useState<ContentStats>({
    wordCount: 0,
    characterCount: 0,
    autoReadTime: value || 1,
  });

  const inputId =
    id || `read-time-${Math.random().toString(36).substring(2, 9)}`;

  // HTML içeriği değiştiğinde istatistikleri güncelle
  useEffect(() => {
    const contentStats = calculateContentStats(
      htmlContent,
      defaultWordsPerMinute,
    );

    setStats({
      wordCount: contentStats.wordCount,
      characterCount: contentStats.characterCount,
      autoReadTime: contentStats.readTime,
    });

    // Otomatik moddaysa, okuma süresini güncelle
    if (autoMode.value) {
      onChange(contentStats.readTime);
    }
  }, [htmlContent, defaultWordsPerMinute, autoMode.value, onChange]);

  // Manuel değişiklik işleme
  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.trim();
    if (inputValue === "") {
      onChange(1); // Minimum 1 dakika
      return;
    }

    const numericValue = parseInt(inputValue, 10);
    if (!isNaN(numericValue) && numericValue >= 1) {
      onChange(numericValue);
    }
  };

  // Otomatik modu değiştir
  const toggleAutoMode = () => {
    setAutoMode((prev) => {
      const newValue = !prev.value;

      // Otomatik moda geçildiğinde değeri güncelle
      if (newValue) {
        onChange(stats.autoReadTime);
      }

      return { ...prev, value: newValue };
    });
  };

  // Otomatik hesaplanan değere sıfırla
  const resetToAuto = () => {
    setAutoMode((prev) => ({ ...prev, value: true }));
    onChange(stats.autoReadTime);
  };

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

      <div
        className={twMerge(
          "relative flex items-center rounded-md border border-zinc-300 bg-white transition-colors",
          "focus-within:border-zinc-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-zinc-100",
          errorMessage && "border-red-500 bg-red-50 ring-2 ring-red-100",
        )}
      >
        <div className="pointer-events-none absolute left-3 text-zinc-400">
          <Clock size={16} />
        </div>

        <input
          {...props}
          id={inputId}
          type="number"
          min="1"
          value={autoMode.value ? stats.autoReadTime : value || ""}
          onChange={handleManualChange}
          onBlur={onBlur}
          placeholder="Dakika"
          readOnly={autoMode.value}
          className={twMerge(
            "w-full rounded-md bg-transparent py-2 pr-20 pl-9 outline-none",
            autoMode.value &&
              "pointer-events-none cursor-not-allowed bg-zinc-50 text-zinc-500",
          )}
        />

        <div className="absolute right-2 flex items-center gap-1.5">
          <span className="text-xs text-zinc-500">dakika</span>

          {!autoMode.value && (
            <button
              type="button"
              onClick={resetToAuto}
              title="Otomatik hesaplanan değere sıfırla"
              className="rounded border border-zinc-200 bg-zinc-100 p-1 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-700"
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>

      {/* İstatistikler ve ipucu */}
      <div className="flex items-center justify-between">
        {/* Hata mesajı veya ipucu */}
        {(errorMessage || hint) && (
          <p
            className={`text-xs ${errorMessage ? "text-red-500" : "text-zinc-500"}`}
          >
            {errorMessage || hint}
          </p>
        )}

        {/* İstatistikler */}
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span title="Kelime sayısı">{stats.wordCount} kelime</span>
          <span>•</span>
          <span title="Karakter sayısı">{stats.characterCount} karakter</span>
          {!autoMode.value && (
            <>
              <span>•</span>
              <span title="Otomatik hesaplanan okuma süresi" className="italic">
                (auto: {stats.autoReadTime} dk)
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

ReadTime.displayName = "Blog-ReadTime";
