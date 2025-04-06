import React from "react";

export const ListItemNode: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <li>{children}</li>;
};
