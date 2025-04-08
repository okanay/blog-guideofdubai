import { Extension } from "@tiptap/core";

export type HighlightOptions = {
  types: string[];
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    highlight: {
      setHighlight: (styles: {
        color?: string;
        backgroundColor?: string;
        padding?: string;
        borderRadius?: string;
        border?: string;
      }) => ReturnType;
      unsetHighlight: () => ReturnType;
    };
  }
}

export const Highlight = Extension.create<HighlightOptions>({
  name: "highlight",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          backgroundColor: {
            default: null,
            parseHTML: (element) => element.style.backgroundColor,
            renderHTML: (attributes) => {
              if (!attributes.backgroundColor) return {};
              return {
                style: `background-color: ${attributes.backgroundColor}`,
              };
            },
          },
          color: {
            default: null,
            parseHTML: (element) => element.style.color,
            renderHTML: (attributes) => {
              if (!attributes.color) return {};
              return {
                style: `color: ${attributes.color}`,
              };
            },
          },
          padding: {
            default: null,
            parseHTML: (element) => element.style.padding,
            renderHTML: (attributes) => {
              if (!attributes.padding) return {};
              return {
                style: `padding: ${attributes.padding}`,
              };
            },
          },
          borderRadius: {
            default: null,
            parseHTML: (element) => element.style.borderRadius,
            renderHTML: (attributes) => {
              if (!attributes.borderRadius) return {};
              return {
                style: `border-radius: ${attributes.borderRadius}`,
              };
            },
          },
          border: {
            default: null,
            parseHTML: (element) => element.style.border,
            renderHTML: (attributes) => {
              if (!attributes.border) return {};
              return {
                style: `border: ${attributes.border}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setHighlight:
        (styles) =>
        ({ chain }) => {
          return chain().setMark("textStyle", styles).run();
        },
      unsetHighlight:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", {
              color: "",
              backgroundColor: "",
              padding: "",
              borderRadius: "",
              border: "",
            })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});
