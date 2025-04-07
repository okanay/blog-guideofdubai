interface HighlightMarkProps {
  node?: {
    attrs?: {
      backgroundColor?: string;
      color?: string;
      padding?: string;
      borderRadius?: string;
      border?: string;
    };
  };
  children: React.ReactNode;
}

export const HighlightMark: React.FC<HighlightMarkProps> = ({
  node,
  children,
}) => {
  const style = {
    backgroundColor: node?.attrs?.backgroundColor || "",
    color: node?.attrs?.color || "",
    padding: node?.attrs?.padding || "",
    borderRadius: node?.attrs?.borderRadius || "",
    border: node?.attrs?.border || "",
  } as React.CSSProperties;

  return <mark style={style}>{children}</mark>;
};
