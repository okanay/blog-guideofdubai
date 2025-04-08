import React from "react";
import { GetTextAlignStyle } from "../marks/text-align";

interface HeadingNodeProps {
  node: {
    attrs?: {
      level?: number;
      textAlign?: "left" | "center" | "right" | "justify";
    };
  };
  children: React.ReactNode;
}

export const HeadingNode: React.FC<HeadingNodeProps> = ({ node, children }) => {
  const level = node.attrs?.level || 1;
  const tagName =
    `h${Math.min(Math.max(level, 1), 6)}` as keyof React.JSX.IntrinsicElements;
  const style = GetTextAlignStyle(node);

  return React.createElement(tagName, { style }, children);
};
