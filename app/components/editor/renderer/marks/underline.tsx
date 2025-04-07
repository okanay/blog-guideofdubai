// app/components/editor/renderer/marks/underline.tsx

interface UnderlineMarkProps {
  node?: {
    attrs?: {
      color?: string;
      style?: string;
      thickness?: string;
      offset?: string;
    };
  };
  children: React.ReactNode;
}

export const UnderlineMark: React.FC<UnderlineMarkProps> = ({
  node,
  children,
}) => {
  // Stil özellikleri oluştur
  const style: React.CSSProperties = {
    textDecorationLine: "underline",
  };

  if (node?.attrs) {
    if (node.attrs.color) {
      style.textDecorationColor = node.attrs.color;
    }

    if (node.attrs.style) {
      style.textDecorationStyle = node.attrs.style as any;
    }

    if (node.attrs.thickness) {
      style.textDecorationThickness = node.attrs.thickness;
    }

    if (node.attrs.offset) {
      style.textUnderlineOffset = node.attrs.offset;
    }
  }

  // data-* özellikleri
  const dataAttributes: Record<string, string | undefined> = {};

  if (node?.attrs) {
    if (node.attrs.color) {
      dataAttributes["data-underline-color"] = node.attrs.color;
    }

    if (node.attrs.style && node.attrs.style !== "solid") {
      dataAttributes["data-underline-style"] = node.attrs.style;
    }

    if (node.attrs.thickness) {
      dataAttributes["data-underline-thickness"] = node.attrs.thickness;
    }

    if (node.attrs.offset) {
      dataAttributes["data-underline-offset"] = node.attrs.offset;
    }
  }

  // Özel stiller varsa bunları uygula
  if (Object.keys(style).length > 1) {
    // 1'den fazla çünkü textDecorationLine her zaman var
    return (
      <u style={style} {...dataAttributes}>
        {children}
      </u>
    );
  }

  // Aksi halde standart <u> etiketi kullan
  return <u>{children}</u>;
};
