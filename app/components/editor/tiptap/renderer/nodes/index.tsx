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
import { AlertBoxRenderer } from "../extensions/alert-box";
import { EnhancedImageRenderer } from "../extensions/image";
import { InstagramCardRenderer } from "../extensions/instagram-card";
import { InstagramCarouselRenderer } from "../extensions/instagram-carousel";

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
      return <EnhancedImageRenderer node={node} />;
    case "enhancedImage":
      return <EnhancedImageRenderer node={node} />;
    case "alertBox":
      return <AlertBoxRenderer node={node}>{children}</AlertBoxRenderer>;
    case "instagramCard":
      return <InstagramCardRenderer node={node} />;
    case "instagramCarousel":
      return <InstagramCarouselRenderer node={node} />;

    default:
      return null;
  }
};
