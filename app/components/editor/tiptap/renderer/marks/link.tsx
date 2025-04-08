import React from "react";

interface LinkMarkProps {
  mark: {
    attrs?: {
      href?: string;
      target?: string;
      rel?: string;
    };
  };
  children: React.ReactNode;
}

export const LinkMark: React.FC<LinkMarkProps> = ({ mark, children }) => {
  return (
    <a
      href={mark.attrs?.href}
      target={mark.attrs?.target || "_blank"}
      rel={mark.attrs?.rel || "noopener noreferrer"}
    >
      {children}
    </a>
  );
};
