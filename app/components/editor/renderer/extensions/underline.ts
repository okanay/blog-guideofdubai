// app/components/editor/renderer/extensions/-underline.ts
// Bu uzantı, normal Underline uzantısını değiştirir ve HTML semantiğini korurken
// gelişmiş stil özellikleri ekler (renk, kalınlık, stil, offset)
import { Mark, mergeAttributes } from "@tiptap/core";

export interface UnderlineOptions {
  /**
   * HTML attributes to add to the underline element.
   * @default {}
   */
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    Underline: {
      /**
       * Set an underline mark with custom styles
       */
      setUnderline: (attributes?: {
        color?: string;
        style?: string;
        thickness?: string;
        offset?: string;
      }) => ReturnType;

      /**
       * Toggle an underline mark with custom styles
       */
      toggleUnderline: () => ReturnType;

      /**
       * Unset an underline mark
       */
      unsetUnderline: () => ReturnType;
    };
  }
}

/**
 *  Underline extension that supports custom styling
 */
export const Underline = Mark.create<UnderlineOptions>({
  name: "Underline",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element) => {
          return element.getAttribute("data-underline-color");
        },
        renderHTML: (attributes) => {
          if (!attributes.color) {
            return {};
          }

          return {
            "data-underline-color": attributes.color,
          };
        },
      },

      style: {
        default: "solid",
        parseHTML: (element) => {
          return element.getAttribute("data-underline-style") || "solid";
        },
        renderHTML: (attributes) => {
          if (!attributes.style || attributes.style === "solid") {
            return {};
          }

          return {
            "data-underline-style": attributes.style,
          };
        },
      },

      thickness: {
        default: null,
        parseHTML: (element) => {
          return element.getAttribute("data-underline-thickness");
        },
        renderHTML: (attributes) => {
          if (!attributes.thickness) {
            return {};
          }

          return {
            "data-underline-thickness": attributes.thickness,
          };
        },
      },

      offset: {
        default: null,
        parseHTML: (element) => {
          return element.getAttribute("data-underline-offset");
        },
        renderHTML: (attributes) => {
          if (!attributes.offset) {
            return {};
          }

          return {
            "data-underline-offset": attributes.offset,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "u[data-underline-color], u[data-underline-style], u[data-underline-thickness], u[data-underline-offset]",
      },
      {
        tag: "u",
      },
      {
        style: "text-decoration",
        consuming: false,
        getAttrs: (style) => {
          return (style as string).includes("underline") ? {} : false;
        },
      },
      {
        style: "text-decoration-line",
        consuming: false,
        getAttrs: (style) => {
          return (style as string).includes("underline") ? {} : false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // Stil özelliğini oluştur
    const styles: string[] = [];

    // Her zaman underline ekle
    styles.push("text-decoration-line: underline");

    if (HTMLAttributes.color) {
      styles.push(`text-decoration-color: ${HTMLAttributes.color}`);
    }

    if (HTMLAttributes.style && HTMLAttributes.style !== "solid") {
      styles.push(`text-decoration-style: ${HTMLAttributes.style}`);
    }

    if (HTMLAttributes.thickness) {
      styles.push(`text-decoration-thickness: ${HTMLAttributes.thickness}`);
    }

    if (HTMLAttributes.offset) {
      styles.push(`text-underline-offset: ${HTMLAttributes.offset}`);
    }

    // data-* özelliklerini ve style özelliğini birleştir
    const styleObj = styles.length ? { style: styles.join("; ") } : {};

    return [
      "u",
      mergeAttributes(
        this.options.HTMLAttributes,
        {
          "data-underline-color": HTMLAttributes.color,
          "data-underline-style":
            HTMLAttributes.style !== "solid" ? HTMLAttributes.style : null,
          "data-underline-thickness": HTMLAttributes.thickness,
          "data-underline-offset": HTMLAttributes.offset,
        },
        styleObj,
      ),
      0,
    ];
  },

  addCommands() {
    return {
      setUnderline:
        (attributes = {}) =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes);
        },

      toggleUnderline:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name);
        },

      unsetUnderline:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-u": () => this.editor.commands.toggleUnderline(),
      "Mod-U": () => this.editor.commands.toggleUnderline(),
    };
  },
});
