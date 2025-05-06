import React from "react";
import {
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  OctagonAlert,
  LucideIcon,
} from "lucide-react";
import { mergeAttributes, Node, NodeViewProps } from "@tiptap/core";
import { twMerge } from "tailwind-merge";

// Alert tipleri
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

// Alert tiplerinin konfigürasyonu
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

// Tailwind sınıfları
export const ALERT_CLASSES = {
  borderClasses: {
    information: "border-l-4 border-sky-500",
    warning: "border-l-4 border-amber-500",
    danger: "border-l-4 border-rose-500",
    success: "border-l-4 border-lime-500",
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
    information: "text-sky-800",
    warning: "text-amber-800",
    danger: "text-rose-800",
    success: "text-lime-800",
  },
  textClasses: {
    information: "text-sky-700",
    warning: "text-amber-700",
    danger: "text-rose-700",
    success: "text-lime-700",
  },
};

// Modern ve Prose uyumlu Alert Box UI
export const AlertBoxUI: React.FC<AlertBoxBaseProps> = ({
  type = "information",
  title,
  children,
  className,
}) => {
  const config = ALERT_CONFIG[type as AlertType];
  const Icon = config.icon;

  const borderClass = ALERT_CLASSES.borderClasses[type];
  const bgClass = ALERT_CLASSES.bgClasses[type];
  const iconClass = ALERT_CLASSES.iconClasses[type];
  const titleClass = ALERT_CLASSES.titleClasses[type];
  const textClass = ALERT_CLASSES.textClasses[type];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={twMerge(
        `not-prose relative flex w-full overflow-hidden rounded-lg ${borderClass} ${bgClass} px-4 py-3 font-sans shadow transition-shadow duration-200 hover:shadow-md`,
        className,
      )}
      data-alert-box=""
      data-type={type}
      data-title={title || ""}
    >
      <div className="flex-shrink-0 pt-0.5">
        <Icon className={`${iconClass} size-5`} aria-hidden="true" />
      </div>
      <div className="ml-3 flex min-w-0 flex-col">
        {title && title.trim() && (
          <div
            className={`mb-0.5 text-base leading-snug font-semibold ${titleClass}`}
          >
            {title}
          </div>
        )}
        <div
          className={`${textClass} prose prose-sm prose-a:underline prose-a:text-inherit not-prose text-sm leading-relaxed`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

// Önizleme için örnek kutu
export const AlertBoxPreview: React.FC<Omit<AlertBoxBaseProps, "children">> = (
  props,
) => {
  return <AlertBoxUI {...props}>Burada kutu içeriği gösterilecek.</AlertBoxUI>;
};

// Tiptap Node tanımı
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
          return {
            type: node.getAttribute("data-type") || "information",
            title: node.getAttribute("data-title") || "",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const customAttrs = {
      "data-alert-box": "",
      "data-type": HTMLAttributes.type || "information",
      "data-title": HTMLAttributes.title || "",
    };
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

// Tiptap editöründe node görünümü
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

// Render için (ör: SSR veya dışarıda)
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

// Kısa yollar
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
