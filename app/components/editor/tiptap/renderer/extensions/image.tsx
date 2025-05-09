import React from "react";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { mergeAttributes, Node, NodeViewProps } from "@tiptap/core";
import { twMerge } from "tailwind-merge";

// Types
type ImageSize = "small" | "medium" | "large" | "fullscreen";
type ImageAlignment = "left" | "center" | "right";
type ImageFit = "cover" | "contain" | "fill" | "none";

// Style configurations
const styles = {
  size: {
    small: "w-[75%] w-full sm:w-[50%]",
    medium: "w-[75%] sm:w-[75%]",
    large: "w-full sm:w-[90%]",
    fullscreen: "w-full max-w-[100%] !mx-[-1rem] md:!mx-[-2rem] lg:!mx-[-4rem]",
  },
  alignment: {
    left: "md:mr-auto", // mr-auto yerine md:mr-auto
    center: "mx-auto",
    right: "md:ml-auto", // Burayı değiştirdik: ml-auto ekledik
  },
  objectFit: {
    cover: "object-cover",
    contain: "object-cover sm:object-contain",
    fill: "object-cover sm:object-fill",
    none: "object-cover sm:object-none",
  },
} as const;

// Helper function to get image classes
const getImageClasses = ({
  size,
  alignment,
  objectFit,
}: {
  size: ImageSize;
  alignment: ImageAlignment;
  objectFit: ImageFit;
}) => {
  // Büyük veya tam ekran görseller için strong center alignment
  const shouldForceCenter = size === "large" || size === "fullscreen";
  const finalAlignment = shouldForceCenter ? "center" : alignment;

  return {
    figure: twMerge(
      "group relative block mb-4",
      size !== "fullscreen" && "rounded-lg",
      finalAlignment === "center" && "flex justify-center",
    ),
    container: twMerge(
      "relative overflow-hidden",
      size !== "fullscreen" && "rounded-lg",
      styles.size[size],
      styles.alignment[finalAlignment],
      finalAlignment === "center" && "md:mx-auto",
    ),
    image: twMerge("w-full rounded-lg", styles.objectFit[objectFit]),
    caption: twMerge(
      "relative -mt-4 text-center",
      size === "fullscreen" && "max-w-3xl mx-auto",
    ),
  };
};

// Extension Node
export const EnhancedImage = Node.create({
  name: "enhancedImage",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      size: { default: "fullscreen" },
      alignment: { default: "center" },
      objectFit: { default: "cover" },
      caption: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "figure.enhanced-image" }, { tag: "img" }];
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

// Image component shared between View and Renderer
const ImageComponent = ({
  src,
  alt,
  title,
  size,
  alignment,
  objectFit,
  caption,
}: {
  src: string;
  alt?: string;
  title?: string;
  size: ImageSize;
  alignment: ImageAlignment;
  objectFit: ImageFit;
  caption?: string;
}) => {
  const classes = getImageClasses({ size, alignment, objectFit });

  return (
    <figure className={classes.figure}>
      <div className={classes.container}>
        <img
          src={src}
          alt={alt || ""}
          title={title}
          className={classes.image}
          loading="lazy"
          style={{ aspectRatio: "16/9" }}
        />

        {caption && (
          <div className={classes.caption}>
            <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
            <span className="relative inline-block bg-white px-4 text-xs font-medium text-zinc-500">
              {caption}
            </span>
          </div>
        )}
      </div>
    </figure>
  );
};

// Editor View Component
const EnhancedImageView: React.FC<NodeViewProps> = ({ node }) => {
  const { src, alt, title, size, alignment, objectFit, caption } = node.attrs;
  return (
    <NodeViewWrapper>
      <ImageComponent
        src={src}
        alt={alt}
        title={title}
        size={size}
        alignment={alignment}
        objectFit={objectFit}
        caption={caption}
      />
    </NodeViewWrapper>
  );
};

// Renderer Component
export const EnhancedImageRenderer = ({ node }: { node: any }) => {
  return <ImageComponent {...node.attrs} />;
};
