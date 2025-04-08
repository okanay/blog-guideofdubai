import React from "react";

export const ItalicMark: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <em>{children}</em>;
};
