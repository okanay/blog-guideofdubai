import React from "react";
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"; // prettier-ignore
import { AlertTriangle, CheckCircle, Info, LucideIcon, OctagonAlert } from "lucide-react"; // prettier-ignore
import { mergeAttributes, Node, NodeViewProps } from "@tiptap/core";
import { twMerge } from "tailwind-merge";

export type AlertType = "information" | "warning" | "danger" | "success";

export interface AlertConfigItem {
  icon: LucideIcon;
  colorClass: string;
  label: string;
  description: string;
}

export interface AlertBoxBaseProps {
  type: AlertType;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export const ALERT_CONFIG: Record<AlertType, AlertConfigItem> = {
  information: {
    icon: Info,
    colorClass: "sky",
    label: "Bilgi",
    description: "Kullanıcıya bilgi vermek için",
  },
  warning: {
    icon: AlertTriangle,
    colorClass: "amber",
    label: "Uyarı",
    description: "Kullanıcıyı uyarmak için",
  },
  danger: {
    icon: OctagonAlert,
    colorClass: "rose",
    label: "Tehlike",
    description: "Önemli hata veya risk bildirmek için",
  },
  success: {
    icon: CheckCircle,
    colorClass: "lime",
    label: "Başarılı",
    description: "İşlem başarıyla tamamlandı",
  },
};

// Tailwind sınıflarını önceden tanımlayalım
export const ALERT_CLASSES = {
  borderClasses: {
    information: "border-sky-500",
    warning: "border-amber-500",
    danger: "border-rose-500",
    success: "border-lime-500",
  },
  bgClasses: {
    information: "bg-sky-50",
    warning: "bg-amber-50",
    danger: "bg-rose-50",
    success: "bg-lime-50",
  },
  iconClasses: {
    information: "text-sky-500",
    warning: "text-amber-500",
    danger: "text-rose-500",
    success: "text-lime-500",
  },
  titleClasses: {
    information: "text-sky-700",
    warning: "text-amber-700",
    danger: "text-rose-700",
    success: "text-lime-700",
  },
  textClasses: {
    information: "text-sky-700",
    warning: "text-amber-700",
    danger: "text-rose-700",
    success: "text-lime-700",
  },
};

export const AlertBoxUI: React.FC<AlertBoxBaseProps> = ({
  type = "information",
  title,
  children,
  className,
}) => {
  const config = ALERT_CONFIG[type as AlertType];
  const Icon = config.icon;

  // Sınıf adlarını direk olarak kullanalım
  const borderClass = ALERT_CLASSES.borderClasses[type];
  const bgClass = ALERT_CLASSES.bgClasses[type];
  const iconClass = ALERT_CLASSES.iconClasses[type];
  const titleClass = ALERT_CLASSES.titleClasses[type];
  const textClass = ALERT_CLASSES.textClasses[type];

  // Başlık varsa klasik görünüm
  if (title && title.trim()) {
    return (
      <div
        className={twMerge(
          `rounded ${borderClass} ${bgClass} px-4 py-2 font-medium shadow-sm`,
          className,
        )}
      >
        <div className="mb-1 flex items-center">
          <Icon className={`mr-1.5 ${iconClass}`} size={16} />
          <div className={`text-sm font-semibold ${titleClass}`}>{title}</div>
        </div>
        <div className={`${textClass} text-xs`}>{children}</div>
      </div>
    );
  }

  // Başlık yoksa kompakt görünüm
  return (
    <div
      className={twMerge(
        `rounded ${borderClass} ${bgClass} px-4 py-2 font-medium shadow-sm`,
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <Icon className={`${iconClass} flex-shrink-0`} size={18} />
        <div className={`${textClass} text-xs`}>{children}</div>
      </div>
    </div>
  );
};

export const AlertBoxPreview: React.FC<Omit<AlertBoxBaseProps, "children">> = (
  props,
) => {
  return <AlertBoxUI {...props}>Burada kutu içeriği gösterilecek.</AlertBoxUI>;
};

export const AlerBox = Node.create({
  name: "alertBox",
  group: "block",
  content: "inline*",

  addAttributes() {
    return {
      type: {
        default: "information",
      },
      title: {
        default: "",
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

const AlertBoxEditorView: React.FC<NodeViewProps> = ({ node }) => {
  const type = node.attrs.type || "information";
  const title = node.attrs.title || "";

  return (
    <NodeViewWrapper>
      <AlertBoxUI type={type as AlertType} title={title}>
        <NodeViewContent />
      </AlertBoxUI>
    </NodeViewWrapper>
  );
};

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
    <AlertBoxUI type={type as AlertType} title={title}>
      {children}
    </AlertBoxUI>
  );
};

export const DangerBox: React.FC<Omit<AlertBoxBaseProps, "type">> = (props) => (
  <AlertBoxUI {...props} type="danger" />
);

export const InfoBox: React.FC<Omit<AlertBoxBaseProps, "type">> = (props) => (
  <AlertBoxUI {...props} type="information" />
);

export const WarningBox: React.FC<Omit<AlertBoxBaseProps, "type">> = (
  props,
) => <AlertBoxUI {...props} type="warning" />;

export const SuccessBox: React.FC<Omit<AlertBoxBaseProps, "type">> = (
  props,
) => <AlertBoxUI {...props} type="success" />;
