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

  // Başlık varsa klasik görünüm
  if (title && title.trim()) {
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
  }

  // Başlık yoksa kompakt görünüm
  return (
    <div
      className={`mb-4 rounded-md border-l-4 border-${color}-500 bg-${color}-50 p-4 shadow-sm`}
    >
      <div className="flex items-center gap-2">
        <Icon className={`text-${color}-500 flex-shrink-0`} size={18} />
        <div className={`text-${color}-700 text-sm`}>{children}</div>
      </div>
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
        // Doğrudan HTML özniteliklerine aktarmak yerine, renderHTML'e bırak
      },
      title: {
        default: "",
        // Doğrudan HTML özniteliklerine aktarmak yerine, renderHTML'e bırak
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-alert-box]",
        getAttrs: (node) => {
          if (!(node instanceof HTMLElement)) return {};

          // HTML'den data özelliklerini alıp doğru şekilde çözümle
          return {
            type: node.getAttribute("data-type") || "information",
            title: node.getAttribute("data-title") || "",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // Önce kendi özel data özelliklerimizi hazırlayalım
    const customAttrs = {
      "data-alert-box": "",
      "data-type": HTMLAttributes.type || "information",
      "data-title": HTMLAttributes.title || "",
    };

    // Şimdi bu özel özellikleri tüm HTML özellikleriyle birleştirelim
    // Ancak type ve title'ı çift eklemekten kaçınalım
    const { type, title, ...rest } = HTMLAttributes;

    return [
      "div",
      mergeAttributes(customAttrs, rest),
      0, // İçerik
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
  const title = node.attrs.title || "";

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
  const title = node.attrs.title || "";

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
