import React from "react";

export const OrderedListNode: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ol>{children}</ol>;
};
