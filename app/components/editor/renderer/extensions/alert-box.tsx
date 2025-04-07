import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import React from "react";
import { mergeAttributes, Node, NodeViewProps } from "@tiptap/core";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

// Bilgi kutusu tipleri
type AlertType = "information" | "warning" | "danger";

// Alert kutusu özelliklerinin tipi
type AlertBoxProps = {
  title: string;
  children: React.ReactNode;
};

// Tüm render bileşenlerini ortak konfigürasyonla eşleştiren yapı
const ALERT_CONFIG = {
  information: {
    icon: Info,
    colorClass: "blue",
    label: "Bilgi",
  },
  warning: {
    icon: AlertTriangle,
    colorClass: "amber",
    label: "Uyarı",
  },
  danger: {
    icon: AlertCircle,
    colorClass: "red",
    label: "Tehlike",
  },
};

/**
 * Genel Alert Kutusu Bileşeni
 * Tüm alert tiplerini tek bir bileşenle render eder
 */
const AlertBox: React.FC<AlertBoxProps & { type: AlertType }> = ({
  title,
  children,
  type = "information",
}) => {
  const config = ALERT_CONFIG[type];
  const Icon = config.icon;
  const color = config.colorClass;

  return (
    <div
      className={`mb-4 rounded-md border-l-4 border-${color}-500 bg-${color}-50 p-4 shadow-sm`}
    >
      <div className="mb-2 flex items-center">
        <Icon className={`mr-2 text-${color}-500`} size={20} />
        <h3 className={`font-semibold text-${color}-700`}>{title}</h3>
      </div>
      <div className={`text-${color}-700 text-sm`}>{children}</div>
    </div>
  );
};

/**
 * TipTap AlerBox Extension
 * Editörde bilgi, uyarı ve tehlike kutuları eklemeyi sağlar
 */
export const AlerBox = Node.create({
  name: "alertBox", // Daha genel ve açıklayıcı isim
  group: "block",
  content: "inline*",

  addAttributes() {
    return {
      type: {
        default: "information",
        renderHTML: (attributes) => ({
          "data-type": attributes.type,
        }),
      },
      title: {
        default: "Bilgi",
        renderHTML: (attributes) => ({
          "data-title": attributes.title,
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-alert-box]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ "data-alert-box": "" }, HTMLAttributes),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AlertBoxEditorView);
  },
});

/**
 * Editör içinde görüntüleme için NodeView bileşeni
 */
const AlertBoxEditorView: React.FC<NodeViewProps> = ({ node }) => {
  const type = node.attrs.type || "information";
  const title = node.attrs.title || "Bilgi";

  return (
    <NodeViewWrapper>
      <AlertBox type={type as AlertType} title={title}>
        <NodeViewContent />
      </AlertBox>
    </NodeViewWrapper>
  );
};

/**
 * Önizleme/Render için kullanılan bileşen
 */
export const AlertBoxRenderer = ({
  node,
  children,
}: {
  node: any;
  children: React.ReactNode;
}) => {
  const type = node.attrs.type || "information";
  const title = node.attrs.title || "Bilgi";

  return (
    <AlertBox type={type as AlertType} title={title}>
      {children}
    </AlertBox>
  );
};

export const DangerBox: React.FC<AlertBoxProps> = (props) => (
  <AlertBox {...props} type="danger" />
);

export const InfoBox: React.FC<AlertBoxProps> = (props) => (
  <AlertBox {...props} type="information" />
);

export const WarningBox: React.FC<AlertBoxProps> = (props) => (
  <AlertBox {...props} type="warning" />
);
