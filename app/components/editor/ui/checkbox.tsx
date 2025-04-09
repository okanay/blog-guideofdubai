import { twMerge } from "tailwind-merge";

interface Props extends React.ComponentProps<"input"> {}

export const Checkbox = ({ ref, className, ...props }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <input
        {...props}
        type="checkbox"
        ref={ref}
        className={twMerge("", className)}
      />
      <span>Label</span>
    </div>
  );
};

Checkbox.displayName = "Blog-Checkbox";
