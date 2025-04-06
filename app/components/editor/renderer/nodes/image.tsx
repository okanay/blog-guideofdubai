import React from "react";

interface ImageNodeProps {
  node: {
    attrs?: {
      src?: string;
      alt?: string;
      title?: string;
      width?: number | string;
      height?: number | string;
    };
  };
}

export const ImageNode: React.FC<ImageNodeProps> = ({ node }) => {
  return (
    <img
      src={node.attrs?.src}
      alt={node.attrs?.alt || ""}
      title={node.attrs?.title || ""}
      width={node.attrs?.width}
      height={node.attrs?.height}
    />
  );
};
