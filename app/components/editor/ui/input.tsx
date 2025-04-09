import { twMerge } from "tailwind-merge";

interface Props extends React.ComponentProps<"input"> {}

export const Input = ({ ref, className, ...props }: Props) => {
  return (
    <input
      {...props}
      ref={ref}
      className={twMerge(
        "rounded-md border border-gray-300 px-3 py-2",
        className,
      )}
    />
  );
};

Input.displayName = "Blog-Input";
