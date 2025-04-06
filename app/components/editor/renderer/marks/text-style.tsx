import React from "react";

export const TextStyleMark = (
  mark: any,
  children: React.ReactNode,
): React.ReactNode => {
  const style: React.CSSProperties = {};
  if (mark.attrs?.color) style.color = mark.attrs.color;
  if (mark.attrs?.fontFamily) style.fontFamily = mark.attrs.fontFamily;

  return <span style={style}>{children}</span>;
};
