import React from "react";
import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react"; // prettier-ignore
import { AlertCircle, AlertTriangle, CheckCircle, Info, LucideIcon } from "lucide-react"; // prettier-ignore
import { mergeAttributes, Node, NodeViewProps } from "@tiptap/core";
import { twMerge } from "tailwind-merge";

// 1. TİP TANIMLAMALARI VE ARAYÜZLER -----------------------------------------

// Alert kutusu tip tanımlaması
export type AlertType = "information" | "warning" | "danger" | "success";

// Alert kutusu config yapısı için type
export interface AlertConfigItem {
  icon: LucideIcon;
  colorClass: string;
  label: string;
  description: string;
}

// Alert Box props için temel arayüz
export interface AlertBoxBaseProps {
  type: AlertType;
  title?: string;
  children?: React.ReactNode;
  className?: string; // Ekstra stil vermek için opsiyonel className
}

// 2. ORTAK KONFİGÜRASYON -----------------------------------------------------

// Tüm alert tipleri için ortak konfigürasyon
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
    icon: AlertCircle,
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

// 3. ORTAK UI BİLEŞENLERİ ---------------------------------------------------

/**
 * Ortak AlertBox UI bileşeni
 * Hem extension hem de menü preview için kullanılabilir
 */
export const AlertBoxUI: React.FC<AlertBoxBaseProps> = ({
  type = "information",
  title,
  children,
  className,
}) => {
  const config = ALERT_CONFIG[type as AlertType];
  const Icon = config.icon;
  const colorClass = config.colorClass;

  // Başlık varsa klasik görünüm
  if (title && title.trim()) {
    return (
      <div
        className={twMerge(
          `rounded border-l-4 border-${colorClass}-500 bg-${colorClass}-50 px-4 py-2 font-medium shadow-sm`,
          className,
        )}
      >
        <div className="mb-1 flex items-center">
          <Icon className={`mr-1.5 text-${colorClass}-500`} size={16} />
          <div className={`text-sm font-semibold text-${colorClass}-700`}>
            {title}
          </div>
        </div>
        <div className={`text-${colorClass}-700 text-xs`}>{children}</div>
      </div>
    );
  }

  // Başlık yoksa kompakt görünüm
  return (
    <div
      className={twMerge(
        `rounded border-l-4 border-${colorClass}-500 bg-${colorClass}-50 px-4 py-2 font-medium shadow-sm`,
        className,
      )}
    >
      <div className="flex items-start gap-2">
        <Icon className={`text-${colorClass}-500 flex-shrink-0`} size={18} />
        <div className={`text-${colorClass}-700 text-xs`}>{children}</div>
      </div>
    </div>
  );
};

/**
 * Menü önizlemesi için dummy içerikli AlertBox
 */
export const AlertBoxPreview: React.FC<Omit<AlertBoxBaseProps, "children">> = (
  props,
) => {
  return <AlertBoxUI {...props}>Burada kutu içeriği gösterilecek.</AlertBoxUI>;
};

// 4. TIPTAP EXTENSION VE NODE VIEW ------------------------------------------

/**
 * TipTap AlerBox Extension
 * Editörde bilgi, uyarı ve tehlike kutuları eklemeyi sağlar
 */
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

/**
 * Editör içinde görüntüleme için NodeView bileşeni
 */
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
    <AlertBoxUI type={type as AlertType} title={title}>
      {children}
    </AlertBoxUI>
  );
};

// 5. YARDIMCI BİLEŞENLER ----------------------------------------------------

// Kolaylık için ayrı tiplere özel bileşenler
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
