import React from "react";
import { fontWeightOptions } from "../texts/font-weight";

interface Props {
  mark: {
    attrs?: {
      weight?: string;
      index?: number;
    };
  };
  children: React.ReactNode;
}

export const FontWeightMark: React.FC<Props> = ({ mark, children }) => {
  const index = mark.attrs?.index || 0;
  const tailwind = fontWeightOptions[index]?.className || fontWeightOptions[0].className; // prettier-ignore

  return <span className={tailwind}>{children}</span>;
};
