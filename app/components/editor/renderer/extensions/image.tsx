import React from "react";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { mergeAttributes, Node, NodeViewProps } from "@tiptap/core";

// Görsel boyut ve hizalama tipleri
type ImageSize = "small" | "medium" | "large";
type ImageAlignment = "left" | "center" | "right";

/**
 * TipTap EnhancedImage Extension
 * Gelişmiş görsel eklemeyi sağlar (boyut, hizalama ve alt yazı özellikleriyle)
 */
export const EnhancedImage = Node.create({
  name: "enhancedImage",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      size: {
        default: "medium",
      },
      alignment: {
        default: "center",
      },
      caption: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure.enhanced-image",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "figure",
      mergeAttributes({ class: "enhanced-image" }, HTMLAttributes),
      [
        "img",
        {
          src: HTMLAttributes.src,
          alt: HTMLAttributes.alt,
          title: HTMLAttributes.title,
        },
      ],
      ["figcaption", {}, HTMLAttributes.caption],
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(EnhancedImageView);
  },
});

/**
 * Editör içinde görüntüleme için NodeView bileşeni
 */
const EnhancedImageView: React.FC<NodeViewProps> = ({ node }) => {
  const { src, alt, title, size, alignment, caption } = node.attrs;

  // Boyut sınıfları
  const sizeClasses = {
    small: "w-1/2",
    medium: "w-2/3",
    large: "w-5/6",
  };

  // Mobil için merkez hizalama, masaüstü için seçilen hizalama
  const alignmentClasses = {
    left: "md:float-left md:mr-4",
    center: "mx-auto",
    right: "md:float-right md:ml-4",
  };

  return (
    <NodeViewWrapper>
      <figure
        className={`md:clearfix relative my-6 block ${
          alignment === "center" ? "flex justify-center" : ""
        }`}
      >
        <div
          className={`${sizeClasses[size as ImageSize]} ${
            alignmentClasses[alignment as ImageAlignment]
          } md:${alignment === "center" ? "mx-auto" : ""}`}
        >
          <img
            src={src}
            alt={alt || ""}
            title={title || undefined}
            className="w-full rounded-md object-cover"
          />
          {caption && (
            <figcaption className="mt-2 text-center text-sm text-zinc-500">
              {caption}
            </figcaption>
          )}
        </div>
      </figure>
    </NodeViewWrapper>
  );
};

/**
 * Önizleme/Render için kullanılan bileşen
 */
export const EnhancedImageRenderer = ({ node }: { node: any }) => {
  const { src, alt, title, size, alignment, caption } = node.attrs;

  // Boyut sınıfları
  const sizeClasses = {
    small: "w-1/2",
    medium: "w-2/3",
    large: "w-5/6",
  };

  // Mobil için merkez hizalama, masaüstü için seçilen hizalama
  const alignmentClasses = {
    left: "md:float-left md:mr-4",
    center: "mx-auto",
    right: "md:float-right md:ml-4",
  };

  return (
    <figure
      className={`md:clearfix relative my-6 block ${
        alignment === "center" ? "flex justify-center" : ""
      }`}
    >
      <div
        className={`${sizeClasses[size as ImageSize]} ${
          alignmentClasses[alignment as ImageAlignment]
        } md:${alignment === "center" ? "mx-auto" : ""}`}
      >
        <img
          src={src}
          alt={alt || ""}
          title={title || undefined}
          className="w-full rounded-md object-cover"
        />
        {caption && (
          <figcaption className="mt-2 text-center text-sm text-zinc-500">
            {caption}
          </figcaption>
        )}
      </div>
    </figure>
  );
};
