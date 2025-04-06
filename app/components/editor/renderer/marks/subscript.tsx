import React from "react";

export const SubscriptMark: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <sub>{children}</sub>;
};
