import { Mark, mergeAttributes } from "@tiptap/core";

type Options = { className: string; name: string; label: string };
export const fontWeightOptions: Record<number, Options> = {
  0: {
    className: "font-normal",
    name: "400",
    label: "Normal",
  },
  1: {
    className: "font-medium",
    name: "500",
    label: "Medium",
  },
  2: {
    className: "font-semibold",
    name: "600",
    label: "Semi Bold",
  },
  3: {
    className: "font-bold",
    name: "700",
    label: "Bold",
  },
  4: {
    className: "font-extrabold",
    name: "800",
    label: "Extra Bold",
  },
};

export const FontWeightMark = Mark.create({
  name: "fontWeight",
  priority: 1004,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      weight: {
        default: "normal",
        renderHTML: (attributes) => {
          return {
            weight: attributes.weight,
          };
        },
      },
      index: {
        default: "0",
        renderHTML: (attributes) => {
          return {
            index: attributes.index,
            class: fontWeightOptions[attributes.index].className,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[weight]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {}),
      0,
    ];
  },
});
