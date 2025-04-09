import { twMerge } from "tailwind-merge";

interface Props extends React.ComponentProps<"textarea"> {}

export const Textarea = ({ ref, className, ...props }: Props) => {
  return <textarea {...props} ref={ref} className={twMerge("", className)} />;
};

Textarea.displayName = "Blog-Textarea";
