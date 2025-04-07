import { Extension } from "@tiptap/core";

export const TextDecoration = Extension.create({
  name: "textDecoration",

  addOptions() {
    return {};
  },

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          // Ana dekorasyon özellikleri
          textDecoration: {
            default: null,
            parseHTML: (element) => element.style.textDecoration,
            renderHTML: (attributes) => {
              if (!attributes.textDecoration) return {};
              return { style: `text-decoration: ${attributes.textDecoration}` };
            },
          },
          textDecorationStyle: {
            default: null,
            parseHTML: (element) => element.style.textDecorationStyle,
            renderHTML: (attributes) => {
              if (!attributes.textDecorationStyle) return {};
              return {
                style: `text-decoration-style: ${attributes.textDecorationStyle}`,
              };
            },
          },
          textDecorationThickness: {
            default: null,
            parseHTML: (element) => element.style.textDecorationThickness,
            renderHTML: (attributes) => {
              if (!attributes.textDecorationThickness) return {};
              return {
                style: `text-decoration-thickness: ${attributes.textDecorationThickness}`,
              };
            },
          },
          textDecorationColor: {
            default: null,
            parseHTML: (element) => element.style.textDecorationColor,
            renderHTML: (attributes) => {
              if (!attributes.textDecorationColor) return {};
              return {
                style: `text-decoration-color: ${attributes.textDecorationColor}`,
              };
            },
          },
          textUnderlineOffset: {
            default: null,
            parseHTML: (element) => element.style.textUnderlineOffset,
            renderHTML: (attributes) => {
              if (!attributes.textUnderlineOffset) return {};
              return {
                style: `text-underline-offset: ${attributes.textUnderlineOffset}`,
              };
            },
          },
        },
      },
    ];
  },
});
