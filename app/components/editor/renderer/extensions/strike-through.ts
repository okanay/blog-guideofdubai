// app/components/editor/renderer/extensions/strikethrough.ts
// Bu uzantı, normal Strike uzantısını değiştirir ve HTML semantiğini korurken
// gelişmiş stil özellikleri ekler (renk, kalınlık, stil)
import { Mark, mergeAttributes } from "@tiptap/core";

export interface StrikethroughOptions {
  /**
   * HTML attributes to add to the strikethrough element.
   * @default {}
   */
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    Strikethrough: {
      /**
       * Set a strikethrough mark with custom styles
       */
      setStrikethrough: (attributes?: {
        color?: string;
        style?: string;
        thickness?: string;
      }) => ReturnType;

      /**
       * Toggle a strikethrough mark with custom styles
       */
      toggleStrikethrough: () => ReturnType;

      /**
       * Unset a strikethrough mark
       */
      unsetStrikethrough: () => ReturnType;
    };
  }
}

/**
 *  Strikethrough extension that supports custom styling
 */
export const Strikethrough = Mark.create<StrikethroughOptions>({
  name: "strikethrough",

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
          // Try to parse color from style attribute
          const style = element.getAttribute("style");
          if (style) {
            const match = style.match(/text-decoration-color:\s*([^;]+)/);
            return match ? match[1] : null;
          }
          return null;
        },
        renderHTML: (attributes) => {
          if (!attributes.color) {
            return {};
          }

          return {
            style: `text-decoration-color: ${attributes.color}`,
          };
        },
      },

      style: {
        default: "solid",
        parseHTML: (element) => {
          // Try to parse decoration style from style attribute
          const style = element.getAttribute("style");
          if (style) {
            const match = style.match(/text-decoration-style:\s*([^;]+)/);
            return match ? match[1] : "solid";
          }
          return "solid";
        },
        renderHTML: (attributes) => {
          if (!attributes.style || attributes.style === "solid") {
            return {};
          }

          return {
            style: `text-decoration-style: ${attributes.style}`,
          };
        },
      },

      thickness: {
        default: null,
        parseHTML: (element) => {
          // Try to parse thickness from style attribute
          const style = element.getAttribute("style");
          if (style) {
            const match = style.match(/text-decoration-thickness:\s*([^;]+)/);
            return match ? match[1] : null;
          }
          return null;
        },
        renderHTML: (attributes) => {
          if (!attributes.thickness) {
            return {};
          }

          return {
            style: `text-decoration-thickness: ${attributes.thickness}`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "s",
      },
      {
        tag: "del",
      },
      {
        style: "text-decoration",
        consuming: false,
        getAttrs: (style) => {
          return (style as string).includes("line-through") ? {} : false;
        },
      },
      {
        style: "text-decoration-line",
        consuming: false,
        getAttrs: (style) => {
          return (style as string).includes("line-through") ? {} : false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // Combine all styles into a single style attribute
    const styles: string[] = [];

    // Always add line-through as the text-decoration-line
    styles.push("text-decoration-line: line-through");

    if (HTMLAttributes.color) {
      styles.push(`text-decoration-color: ${HTMLAttributes.color}`);
    }

    if (HTMLAttributes.style && HTMLAttributes.style !== "solid") {
      styles.push(`text-decoration-style: ${HTMLAttributes.style}`);
    }

    if (HTMLAttributes.thickness) {
      styles.push(`text-decoration-thickness: ${HTMLAttributes.thickness}`);
    }

    // Create a combined style attribute if there are any styles
    const styleAttribute =
      styles.length > 0 ? { style: styles.join("; ") } : {};

    // Filter out the individual attributes to avoid duplication
    const { color, style, thickness, ...otherAttributes } = HTMLAttributes;

    // Return the s element with the merged attributes
    return [
      "s",
      mergeAttributes(
        this.options.HTMLAttributes,
        otherAttributes,
        styleAttribute,
      ),
      0,
    ];
  },

  addCommands() {
    return {
      setStrikethrough:
        (attributes) =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes);
        },

      toggleStrikethrough:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name);
        },

      unsetStrikethrough:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      "Mod-Shift-x": () => this.editor.commands.toggleStrikethrough(),
      "Mod-Shift-X": () => this.editor.commands.toggleStrikethrough(),
    };
  },
});
