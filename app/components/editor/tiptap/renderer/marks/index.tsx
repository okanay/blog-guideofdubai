// app/components/editor/renderer/marks/index.tsx
import React from "react";
import { BoldMark } from "./bold";
import { ItalicMark } from "./italic";
import { UnderlineMark } from "./underline";
import { SubscriptMark } from "./subscript";
import { SuperscriptMark } from "./superscript";
import { LinkMark } from "./link";
import { TextStyleMark } from "./text-style";
import { StrikeThroughMark } from "./strike-through";
import { HighlightMark } from "./highlight";

export const RenderMarks = (
  node: any,
  children: React.ReactNode,
): React.ReactNode => {
  if (!node.marks || node.marks.length === 0) return children;

  return node.marks.reduce((result: React.ReactNode, mark: any) => {
    switch (mark.type) {
      case "bold":
        return <BoldMark>{result}</BoldMark>;
      case "italic":
        return <ItalicMark>{result}</ItalicMark>;
      case "subscript":
        return <SubscriptMark>{result}</SubscriptMark>;
      case "superscript":
        return <SuperscriptMark>{result}</SuperscriptMark>;
      case "link":
        return <LinkMark mark={mark}>{result}</LinkMark>;
      case "textStyle":
        return TextStyleMark(mark, result);
      case "underline":
        return <UnderlineMark node={mark}>{result}</UnderlineMark>;
      case "strikethrough":
        return <StrikeThroughMark node={mark}>{result}</StrikeThroughMark>;
      case "highlight":
        return <HighlightMark node={mark}>{result}</HighlightMark>;
      default:
        return result;
    }
  }, children);
};
