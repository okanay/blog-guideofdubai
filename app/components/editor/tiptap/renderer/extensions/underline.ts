// app/components/editor/renderer/extensions/underline.ts
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
        underlineStyle?: string;
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
  name: "underline",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          return element.style.textDecorationColor;
        },
        renderHTML: (attributes: { color: string }) => {
          return {
            style: `text-decoration-color: ${attributes.color}`,
          };
        },
      },
      underlineStyle: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          return element.style.textDecorationStyle;
        },
        renderHTML: (attributes: { underlineStyle: string }) => {
          return {
            style: `text-decoration-style: ${attributes.underlineStyle}`,
          };
        },
      },
      thickness: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          return element.style.textDecorationThickness;
        },
        renderHTML: (attributes: { thickness: string }) => {
          return {
            style: `text-decoration-thickness: ${attributes.thickness}`,
          };
        },
      },
      offset: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          return element.style.textUnderlineOffset;
        },
        renderHTML: (attributes: { offset: string }) => {
          return {
            style: `text-underline-offset: ${attributes.offset}`,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "u",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "u",
      mergeAttributes(this.options.HTMLAttributes, {
        style: HTMLAttributes.style,
      }),
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
});
