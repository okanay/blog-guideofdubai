// app/components/editor/renderer/marks/underline.tsx

interface UnderlineMarkProps {
  node?: {
    attrs?: {
      color?: string;
      underlineStyle?: string;
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
  const style = {
    textDecorationStyle: node?.attrs?.underlineStyle || "",
    textDecorationThickness: node?.attrs?.thickness || "",
    textUnderlineOffset: node?.attrs?.offset || "",
    textDecorationColor: node?.attrs?.color || "",
  };

  return <u style={style as React.CSSProperties}>{children}</u>;
};
