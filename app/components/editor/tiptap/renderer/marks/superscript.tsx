import React from "react";

export const SuperscriptMark: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <sup>{children}</sup>;
};
