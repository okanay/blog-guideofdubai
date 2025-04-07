// app/components/editor/renderer/marks/strike-through.tsx

interface StrikeThroughMarkProps {
  node?: {
    attrs?: {
      color?: string;
      strikeStyle?: string;
      thickness?: string;
      offset?: string;
    };
  };
  children: React.ReactNode;
}

export const StrikeThroughMark: React.FC<StrikeThroughMarkProps> = ({
  node,
  children,
}) => {
  const style = {
    textDecorationStyle: node?.attrs?.strikeStyle || "",
    textDecorationThickness: node?.attrs?.thickness || "",
    textStrikeThroughOffset: node?.attrs?.offset || "",
    textDecorationColor: node?.attrs?.color || "",
  };

  return <s style={style as React.CSSProperties}>{children}</s>;
};
