export const GetTextAlignStyle = (node: any): React.CSSProperties => {
  if (node.attrs?.textAlign && node.attrs.textAlign !== "left") {
    return {
      textAlign: node.attrs.textAlign as
        | "left"
        | "center"
        | "right"
        | "justify",
    };
  }
  return {};
};
