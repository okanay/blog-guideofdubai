import React from "react";

export const BoldMark: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <strong>{children}</strong>;
};
