// app/components/editor/create/ui/tag-input.tsx
import React, { useState, useRef, KeyboardEvent } from "react";
import { twMerge } from "tailwind-merge";
import { X, Plus } from "lucide-react";

export interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  isRequired?: boolean;
  maxTags?: number;
  id?: string;
  className?: string;
  disabled?: boolean;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags = [],
  onChange,
  label,
  placeholder = "Yeni etiket ekle...",
  helperText,
  error,
  containerClassName,
  labelClassName,
  isRequired = false,
  maxTags = 10,
  id = "tag-input",
  className,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (
      // Boş değilse
      trimmedTag !== "" &&
      // Aynı etiket zaten yoksa
      !tags.includes(trimmedTag) &&
      // Maximum etiket sayısını aşmadıysa
      tags.length < maxTags &&
      // Disabled değilse
      !disabled
    ) {
      const newTags = [...tags, trimmedTag];
      onChange(newTags);
    }
    setInputValue("");
  };

  const removeTag = (index: number) => {
    if (disabled) return;

    const newTags = [...tags];
    newTags.splice(index, 1);
    onChange(newTags);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const containerStyles = twMerge("mb-4", containerClassName);

  const inputContainerStyles = twMerge(
    "flex flex-wrap items-center gap-2 rounded-md border bg-white p-2 focus-within:ring-2",
    error
      ? "border-red-300 focus-within:border-red-400 focus-within:ring-red-100"
      : "border-zinc-300 focus-within:border-primary-400 focus-within:ring-primary-100",
    disabled && "bg-zinc-50 cursor-not-allowed",
    className,
  );

  return (
    <div className={containerStyles}>
      {label && (
        <label
          htmlFor={id}
          className={twMerge(
            "mb-1.5 block text-sm font-medium text-zinc-700",
            labelClassName,
          )}
        >
          {label}
          {isRequired && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div className={inputContainerStyles}>
        {/* Mevcut etiketler */}
        {tags.map((tag, index) => (
          <div
            key={`${tag}-${index}`}
            className={twMerge(
              "flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs",
              disabled ? "text-zinc-500" : "text-zinc-700",
            )}
          >
            <span>{tag}</span>
            {!disabled && (
              <button
                type="button"
                className="ml-1 text-zinc-500 hover:text-zinc-700"
                onClick={() => removeTag(index)}
                aria-label={`${tag} etiketini kaldır`}
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}

        {/* Yeni etiket eklemek için input */}
        {tags.length < maxTags && !disabled && (
          <div className="flex min-w-[100px] flex-1">
            <input
              ref={inputRef}
              id={id}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => addTag(inputValue)}
              placeholder={tags.length === 0 ? placeholder : ""}
              className="flex-1 bg-transparent px-1 py-0.5 text-sm focus:outline-none"
              aria-invalid={error ? "true" : "false"}
              aria-describedby={helperText ? `${id}-description` : undefined}
              disabled={disabled}
            />
          </div>
        )}

        {/* Etiket ekle butonu */}
        {inputValue && !disabled && (
          <button
            type="button"
            onClick={() => addTag(inputValue)}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 hover:bg-zinc-300"
            aria-label="Etiket ekle"
          >
            <Plus size={14} />
          </button>
        )}
      </div>

      {/* Hata mesajı veya yardım metni */}
      {error ? (
        <p className="mt-1 text-xs text-red-500" id={`${id}-error`}>
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-zinc-500" id={`${id}-description`}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
};
