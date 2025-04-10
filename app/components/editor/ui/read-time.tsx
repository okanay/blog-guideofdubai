import { useState, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { Clock, Lock, Unlock, RotateCcw } from "lucide-react";
import { calculateContentStats } from "../helper";

interface ReadTimeProps {
  label?: string;
  id?: string;
  isRequired?: boolean;
  isError?: boolean;
  errorMessage?: string;
  hint?: string;
  containerClassName?: string;
  value?: number | null;
  onChange?: (value: number | null) => void;
  htmlContent?: string;
  defaultWordsPerMinute?: number;
}

export const ReadTime = ({
  label = "Okuma Süresi",
  id,
  isRequired = false,
  isError = false,
  errorMessage,
  hint = "Dakika cinsinden ortalama okuma süresi",
  containerClassName,
  value: externalValue,
  onChange,
  htmlContent = "",
  defaultWordsPerMinute = 200,
}: ReadTimeProps) => {
  const [isAuto, setIsAuto] = useState(true);

  const [readTime, setReadTime] = useState<number | null>(
    externalValue || null,
  );

  const [stats, setStats] = useState<{
    wordCount: number;
    characterCount: number;
    autoReadTime: number;
  }>({
    wordCount: 0,
    characterCount: 0,
    autoReadTime: externalValue,
  });

  const inputId =
    id || `read-time-${Math.random().toString(36).substring(2, 9)}`;
  const inputRef = useRef<HTMLInputElement>(null);

  const updateReadTime = (newValue: number | null) => {
    setReadTime(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.trim();

    if (inputValue === "") {
      updateReadTime(null);
      return;
    }

    const numericValue = parseInt(inputValue, 10);
    if (!isNaN(numericValue) && numericValue >= 1) {
      updateReadTime(numericValue);
    }
  };

  const toggleMode = () => {
    if (isAuto) {
      // Otomatikten manuele geçerken mevcut değeri koru
      setIsAuto(false);
    } else {
      // Manuelden otomatiğe geçerken, otomatik hesaplanan değeri kullan
      setIsAuto(true);
      updateReadTime(stats.autoReadTime);
    }
  };

  const resetToAuto = () => {
    updateReadTime(stats.autoReadTime);
  };

  useEffect(() => {
    if (isAuto) {
      const value = calculateContentStats(htmlContent);
      setStats({
        wordCount: value.wordCount,
        characterCount: value.characterCount,
        autoReadTime: value.readTime,
      });

      setReadTime(value.readTime);
    }
  }, [htmlContent]);

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
          <button
            type="button"
            onClick={toggleMode}
            className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-700"
          >
            {isAuto ? (
              <>
                <Lock size={12} /> Otomatik
              </>
            ) : (
              <>
                <Unlock size={12} /> Manuel
              </>
            )}
          </button>
        </div>
      )}

      <div
        className={twMerge(
          "relative flex items-center rounded-md border border-zinc-300 bg-white transition-colors",
          isError && "border-red-500 ring-2 ring-red-100",
        )}
      >
        <div className="pointer-events-none absolute left-3 text-zinc-400">
          <Clock size={16} />
        </div>

        <input
          id={inputId}
          ref={inputRef}
          type="number"
          min="1"
          value={readTime || externalValue || 0}
          onChange={handleManualChange}
          placeholder="Dakika"
          disabled={isAuto}
          className={twMerge(
            "w-full rounded-md bg-transparent py-2 pr-20 pl-9 outline-none",
            isAuto &&
              "pointer-events-none cursor-not-allowed bg-zinc-50 text-zinc-500",
          )}
        />

        <div className="absolute right-2 flex items-center gap-1.5">
          <span className="text-xs text-zinc-500">dakika</span>

          {!isAuto && (
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
        <p
          className={twMerge(
            "text-xs text-zinc-500",
            isError && "text-red-500",
          )}
        >
          {isError ? errorMessage : hint}
        </p>

        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <span title="Kelime sayısı">{stats.wordCount} kelime</span>
          <span>•</span>
          <span title="Karakter sayısı">{stats.characterCount} karakter</span>
          {!isAuto && stats.autoReadTime !== readTime && (
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
