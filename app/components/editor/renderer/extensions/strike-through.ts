// app/components/editor/renderer/extensions/strike-through.ts
import { Mark, mergeAttributes } from "@tiptap/core";

export interface StrikeThroughOptions {
  /**
   * HTML attributes to add to the strike-through element.
   * @default {}
   */
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    StrikeThrough: {
      /**
       * Set a strike-through mark with custom styles
       */
      setStrikeThrough: (attributes?: {
        color?: string;
        strikeStyle?: string;
        thickness?: string;
      }) => ReturnType;

      /**
       * Toggle a strike-through mark with custom styles
       */
      toggleStrikeThrough: () => ReturnType;

      /**
       * Unset a strike-through mark
       */
      unsetStrikeThrough: () => ReturnType;
    };
  }
}

/**
 *  Strike-through extension that supports custom styling
 */
export const StrikeThrough = Mark.create<StrikeThroughOptions>({
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
        parseHTML: (element: HTMLElement) => {
          return element.style.textDecorationColor;
        },
        renderHTML: (attributes: { color: string }) => {
          return {
            style: `text-decoration-color: ${attributes.color}`,
          };
        },
      },
      strikeStyle: {
        default: null,
        parseHTML: (element: HTMLElement) => {
          return element.style.textDecorationStyle;
        },
        renderHTML: (attributes: { strikeStyle: string }) => {
          return {
            style: `text-decoration-style: ${attributes.strikeStyle}`,
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
    };
  },

  parseHTML() {
    return [
      {
        tag: "s",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "s",
      mergeAttributes(this.options.HTMLAttributes, {
        style: HTMLAttributes.style,
      }),
      0,
    ];
  },

  addCommands() {
    return {
      setStrikeThrough:
        (attributes = {}) =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes);
        },

      toggleStrikeThrough:
        () =>
        ({ commands }) => {
          return commands.toggleMark(this.name);
        },

      unsetStrikeThrough:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});
