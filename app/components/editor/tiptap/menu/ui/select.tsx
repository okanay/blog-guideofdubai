import React, { useRef } from "react";
import { twMerge } from "tailwind-merge";

type Option = {
  label: string;
  value: string | number;
};

type SelectButtonProps = {
  options: Option[];
  value: string | number;
  onChange: (value: string | number) => void;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
};

const SelectButton: React.FC<SelectButtonProps> = ({
  options,
  value,
  onChange,
  icon,
  label,
  isActive = false,
}) => {
  const selectRef = useRef<HTMLSelectElement>(null);

  const handleButtonClick = () => {
    if (selectRef.current) {
      selectRef.current.focus();
      // Modern tarayıcılarda "click()" yeteri kadar güvenilir olmayabilir
      // Bu yüzden HTMLSelectElement'in click() metodunu manuel olarak tetikliyoruz
      selectRef.current.dispatchEvent(new MouseEvent("mousedown"));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div
      className={twMerge(
        "group relative rounded-md border transition-all duration-200",
        "hover:border-zinc-300 hover:bg-zinc-100",
        isActive
          ? "border-zinc-300 bg-zinc-100 text-blue-600"
          : "border-transparent text-zinc-700",
      )}
    >
      <button
        onClick={handleButtonClick}
        aria-pressed={isActive}
        aria-label={label}
        className="flex size-8 items-center justify-center p-1"
      >
        {icon}
      </button>

      {/* Tooltip - MenuButton'dakine benzer */}
      <span className="pointer-events-none absolute top-full left-1/2 z-50 -translate-x-1/2 translate-y-[10px] rounded bg-zinc-800 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
        {label}
      </span>

      <select
        ref={selectRef}
        value={value}
        onChange={handleSelectChange}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        aria-hidden="true"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export { SelectButton };
