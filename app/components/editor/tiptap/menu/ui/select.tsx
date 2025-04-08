import React, { useRef } from "react";

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
      aria-pressed={isActive}
      aria-label={label}
      data-tooltip-id="editor-tooltip"
      data-tooltip-content={label}
      className="relative rounded-md border border-transparent text-zinc-700 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-100 aria-pressed:border-zinc-300 aria-pressed:bg-zinc-100 aria-pressed:text-blue-600"
    >
      <button
        onClick={handleButtonClick}
        aria-pressed={isActive}
        aria-label={label}
        data-tooltip-id="editor-tooltip"
        data-tooltip-content={label}
        className="flex size-8 items-center justify-center p-1"
      >
        {icon}
      </button>
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
