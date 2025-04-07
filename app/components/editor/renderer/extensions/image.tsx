import React from "react";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { mergeAttributes, Node, NodeViewProps } from "@tiptap/core";

// Görsel boyut tipleri
type ImageSize = "small" | "medium" | "large";

// Görsel hizalama tipleri
type ImageAlignment = "left" | "center" | "right";

// EnhancedImage özellikleri
type EnhancedImageProps = {
  src: string;
  alt: string;
  title?: string;
  size: ImageSize;
  alignment: ImageAlignment;
  caption?: string;
};

/**
 * Gelişmiş Görsel Bileşeni
 * Görsel, boyut, hizalama ve alt yazı özelliklerini içerir
 */
const EnhancedImage: React.FC<EnhancedImageProps> = ({
  src,
  alt,
  title,
  size,
  alignment,
  caption,
}) => {
  // Görsel boyutuna göre sınıfları belirle - responsive değerler
  const sizeClasses = {
    small: "w-full sm:w-2/3 md:w-1/2 lg:w-2/5", // Daha küçük
    medium: "w-full sm:w-3/4 md:w-2/3 lg:w-3/5", // Orta boyut
    large: "w-full md:w-5/6 lg:w-4/5", // Büyük boyut
  };

  // Görsel hizalamaya göre sınıfları belirle - mobil uyumlu
  const alignmentClasses = {
    left: "md:float-left md:mr-4 md:mb-2 mb-4", // Sadece orta ve büyük ekranlarda float
    center: "mx-auto", // Merkez - tüm ekranlarda
    right: "md:float-right md:ml-4 md:mb-2 mb-4", // Sadece orta ve büyük ekranlarda float
  };

  // Görsel container için stil sınıfları
  const containerClasses = `my-4 ${alignmentClasses[alignment]}`;

  // Küçük ekranlarda görsel her zaman tam genişlikte olsun
  const imgClasses = `
    rounded-lg aspect-video object-cover
    ${sizeClasses[size]}
    ${alignment === "center" ? "mx-auto" : ""}
  `;

  return (
    <figure className={containerClasses}>
      <div className="overflow-hidden">
        <img src={src} alt={alt} title={title} className={imgClasses} />
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-zinc-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

/**
 * TipTap EnhancedImage Extension
 * Editörde gelişmiş görsel özellikleri eklemeyi sağlar
 */
export const EnhancedImageExtension = Node.create({
  name: "enhancedImage",
  group: "block",
  selectable: true,
  draggable: true,
  atom: true, // Atomik node (içerik olarak değiştirilemez)

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: "",
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
        tag: "figure[data-enhanced-image]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // Burada HTML çıktısını yapılandırıyoruz
    const { caption, ...attrs } = HTMLAttributes;

    return [
      "figure",
      mergeAttributes(
        { "data-enhanced-image": "" },
        {
          class: `enhanced-image enhanced-image-${attrs.alignment || "center"} enhanced-image-${attrs.size || "medium"}`,
        },
      ),
      [
        "div",
        { class: "enhanced-image-container" },
        [
          "img",
          {
            src: attrs.src,
            alt: attrs.alt,
            title: attrs.title,
            class: "enhanced-image-img",
          },
        ],
      ],
      caption
        ? ["figcaption", { class: "enhanced-image-caption" }, caption]
        : "",
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(EnhancedImageEditorView);
  },
});

/**
 * Editör içinde görüntüleme için NodeView bileşeni
 */
const EnhancedImageEditorView: React.FC<NodeViewProps> = ({ node }) => {
  const { src, alt, title, size, alignment, caption } = node.attrs;

  return (
    <NodeViewWrapper>
      <EnhancedImage
        src={src}
        alt={alt}
        title={title}
        size={size}
        alignment={alignment}
        caption={caption}
      />
    </NodeViewWrapper>
  );
};

/**
 * Önizleme/Render için kullanılan bileşen
 */
export const EnhancedImageRenderer = ({ node }: { node: any }) => {
  const { src, alt, title, size, alignment, caption } = node.attrs;

  return (
    <EnhancedImage
      src={src}
      alt={alt}
      title={title}
      size={size}
      alignment={alignment}
      caption={caption}
    />
  );
};
