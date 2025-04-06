import React from "react";

export const StrikeMark: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <s>{children}</s>;
};
