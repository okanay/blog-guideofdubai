import React from "react";
import { mergeAttributes, Node, NodeViewProps } from "@tiptap/core";
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

export const InfoNode = Node.create({
  name: "infoNode",
  group: "block",
  content: "inline*",

  addAttributes() {
    return {
      type: {
        default: "information",
        renderHTML: (attributes) => {
          return {
            type: attributes.type,
          };
        },
      },
      title: {
        default: "Whats the information?",
        renderHTML: (attributes) => {
          return {
            title: attributes.title,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "info-node",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["info-node", mergeAttributes(HTMLAttributes), 0];
  },
  addNodeView() {
    return ReactNodeViewRenderer(InfoNodeEditorView);
  },
});

export const InfoNodeEditorView: React.FC<NodeViewProps> = ({ node }) => {
  const type = node.attrs.type || "information";
  const title = node.attrs.title || "Whats the information?";

  return (
    <NodeViewWrapper>
      {type === "danger" && (
        <DangerNodeComponent title={title}>
          <NodeViewContent />
        </DangerNodeComponent>
      )}

      {type === "information" && (
        <InformationNodeComponent title={title}>
          <NodeViewContent />
        </InformationNodeComponent>
      )}

      {type === "warning" && (
        <WarningNodeComponent title={title}>
          <NodeViewContent />
        </WarningNodeComponent>
      )}
    </NodeViewWrapper>
  );
};

export const InfoNodeEditorRender = ({
  node,
  children,
}: {
  node: any;
  children: React.ReactNode;
}) => {
  const type = node.attrs.type || "information";
  const title = node.attrs.title || "Whats the information?";

  switch (type) {
    case "danger":
      return (
        <DangerNodeComponent title={title}>{children}</DangerNodeComponent>
      );
    case "information":
      return (
        <InformationNodeComponent title={title}>
          {children}
        </InformationNodeComponent>
      );
    case "warning":
      return (
        <WarningNodeComponent title={title}>{children}</WarningNodeComponent>
      );
    default:
      return (
        <InformationNodeComponent title={title}>
          {children}
        </InformationNodeComponent>
      );
  }
};

type InfoNodeAttributes = {
  title: string;
  children: React.ReactNode;
};

const DangerNodeComponent: React.FC<InfoNodeAttributes> = ({
  title,
  children,
}) => {
  return (
    <div className="mb-4 border-l-4 border-red-500 bg-red-100 p-4">
      <div className="mb-2 flex items-center">
        <AlertCircle className="mr-2 text-red-500" size={24} />
        <h3 className="font-semibold text-red-700">{title}</h3>
      </div>
      <div className="text-red-700">{children}</div>
    </div>
  );
};

const InformationNodeComponent: React.FC<InfoNodeAttributes> = ({
  title,
  children,
}) => {
  return (
    <div className="mb-4 border-l-4 border-blue-500 bg-blue-100 p-4">
      <div className="mb-2 flex items-center">
        <Info className="mr-2 text-blue-500" size={24} />
        <h3 className="font-semibold text-blue-700">{title}</h3>
      </div>
      <div className="text-blue-700">{children}</div>
    </div>
  );
};

const WarningNodeComponent: React.FC<InfoNodeAttributes> = ({
  title,
  children,
}) => {
  return (
    <div className="mb-4 border-l-4 border-amber-500 bg-amber-100 p-4">
      <div className="mb-2 flex items-center">
        <AlertTriangle className="mr-2 text-amber-500" size={24} />
        <h3 className="font-semibold text-amber-700">{title}</h3>
      </div>
      <div className="text-amber-700">{children}</div>
    </div>
  );
};
