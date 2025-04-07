import React from "react";
import { BoldMark } from "./bold";
import { ItalicMark } from "./italic";
import { UnderlineMark } from "./underline";
import { StrikeMark } from "./strike";
import { SubscriptMark } from "./subscript";
import { SuperscriptMark } from "./superscript";
import { LinkMark } from "./link";
import { TextStyleMark } from "./text-style";

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
      case "underline":
        return <UnderlineMark>{result}</UnderlineMark>;
      case "strike":
        return <StrikeMark>{result}</StrikeMark>;
      case "subscript":
        return <SubscriptMark>{result}</SubscriptMark>;
      case "superscript":
        return <SuperscriptMark>{result}</SuperscriptMark>;
      case "link":
        return <LinkMark mark={mark}>{result}</LinkMark>;
      case "textStyle":
        return TextStyleMark(mark, result);
      default:
        return result;
    }
  }, children);
};
