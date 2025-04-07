interface StrikethroughMarkProps {
  node?: {
    attrs?: {
      color?: string;
      style?: string;
      thickness?: string;
    };
  };
  children: React.ReactNode;
}

export const StrikethroughMark: React.FC<StrikethroughMarkProps> = ({
  node,
  children,
}) => {
  // Stil özellikleri oluştur
  const style: React.CSSProperties = {
    textDecorationLine: "line-through",
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
  }

  // data-* özellikleri
  const dataAttributes: Record<string, string | undefined> = {};

  if (node?.attrs) {
    if (node.attrs.color) {
      dataAttributes["data-strike-color"] = node.attrs.color;
    }

    if (node.attrs.style && node.attrs.style !== "solid") {
      dataAttributes["data-strike-style"] = node.attrs.style;
    }

    if (node.attrs.thickness) {
      dataAttributes["data-strike-thickness"] = node.attrs.thickness;
    }
  }

  // Özel stiller varsa bunları uygula
  if (Object.keys(style).length > 1) {
    // 1'den fazla çünkü textDecorationLine her zaman var
    return (
      <s style={style} {...dataAttributes}>
        {children}
      </s>
    );
  }

  // Aksi halde standart <s> etiketi kullan
  return <s>{children}</s>;
};
