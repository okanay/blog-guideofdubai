import React from "react";

export const TextStyleMark = (
  mark: { attrs?: Record<string, any> },
  children: React.ReactNode,
): React.ReactNode => {
  if (!mark.attrs) return children;

  const style: React.CSSProperties = Object.entries(mark.attrs)
    .filter(([_, value]) => value !== null && value !== undefined)
    .reduce((acc, [key, value]) => {
      acc[key as keyof React.CSSProperties] = value;
      return acc;
    }, {} as React.CSSProperties);

  if (Object.keys(style).length === 0) {
    return children;
  }

  return <span style={style}>{children}</span>;
};
