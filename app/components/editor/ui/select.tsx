import { twMerge } from "tailwind-merge";

interface Props extends React.ComponentProps<"select"> {}

export const Select = ({ ref, className, ...props }: Props) => {
  return <select {...props} ref={ref} className={twMerge("", className)} />;
};

Select.displayName = "Blog-Select";
