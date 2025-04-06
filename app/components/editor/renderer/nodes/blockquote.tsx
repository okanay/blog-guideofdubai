import React from "react";

export const BlockquoteNode: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <blockquote>{children}</blockquote>;
};
