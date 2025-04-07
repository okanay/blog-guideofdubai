import React from "react";
import { BlockquoteNode } from "./blockquote";
import { HardBreakNode } from "./break";
import { BulletListNode } from "./bullet-list";
import { DocNode } from "./doc";
import { HeadingNode } from "./heading";
import { HorizontalRuleNode } from "./horizontal-rule";
import { ImageNode } from "./image";
import { ListItemNode } from "./list-item";
import { OrderedListNode } from "./ordered-list";
import { ParagraphNode } from "./paragraph";
import { InfoNodeEditorRender } from "../extensions/info";

export const RenderNode: React.FC<{ node: any; children: React.ReactNode }> = ({
  node,
  children,
}) => {
  switch (node.type) {
    case "doc":
      return <DocNode>{children}</DocNode>;
    case "paragraph":
      return <ParagraphNode node={node}>{children}</ParagraphNode>;
    case "heading":
      return <HeadingNode node={node}>{children}</HeadingNode>;
    case "bulletList":
      return <BulletListNode>{children}</BulletListNode>;
    case "orderedList":
      return <OrderedListNode>{children}</OrderedListNode>;
    case "listItem":
      return <ListItemNode>{children}</ListItemNode>;
    case "blockquote":
      return <BlockquoteNode>{children}</BlockquoteNode>;
    case "horizontalRule":
      return <HorizontalRuleNode />;
    case "hardBreak":
      return <HardBreakNode />;
    case "image":
      return <ImageNode node={node} />;
    case "infoNode":
      return (
        <InfoNodeEditorRender node={node}>{children}</InfoNodeEditorRender>
      );
    default:
      return null;
  }
};
