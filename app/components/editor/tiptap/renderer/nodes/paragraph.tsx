import React from "react";
import { GetTextAlignStyle } from "../marks/text-align";

interface ParagraphNodeProps {
  node: any;
  children: React.ReactNode;
}

export const ParagraphNode: React.FC<ParagraphNodeProps> = ({
  node,
  children,
}) => {
  // Basit kontrol: Node'un content property'si var mı ve boş değil mi?
  const isEmpty = !node.content || node.content.length === 0;

  // Eğer boşsa <br> döndür, değilse normal <p> içinde children'ı göster
  return isEmpty ? <br /> : <p style={GetTextAlignStyle(node)}>{children}</p>;
};
