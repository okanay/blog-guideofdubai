import React from "react";

export const UnderlineMark: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <u>{children}</u>;
};
