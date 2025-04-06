import { Mark, mergeAttributes } from "@tiptap/core";

type Options = { className: string; name: string };
export const fontWeightOptions: Record<number, Options> = {
  0: {
    className: "font-thin",
    name: "100",
  },
  1: {
    className: "font-extralight",
    name: "200",
  },
  2: {
    className: "font-light",
    name: "300",
  },
  3: {
    className: "font-normal",
    name: "400",
  },
  4: {
    className: "font-medium",
    name: "500",
  },
  5: {
    className: "font-semibold",
    name: "600",
  },
  6: {
    className: "font-bold",
    name: "700",
  },
  7: {
    className: "font-extrabold",
    name: "800",
  },
  8: {
    className: "font-black",
    name: "900",
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
