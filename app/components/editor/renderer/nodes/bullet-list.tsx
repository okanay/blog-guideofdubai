import React from "react";

export const BulletListNode: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ul>{children}</ul>;
};
