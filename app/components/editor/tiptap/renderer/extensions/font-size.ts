import { Extension } from "@tiptap/core";

// Font boyutu seçenekleri: kullanıcı dostu isimler ve teknik değerler
export const FONT_SIZE_OPTIONS = [
  {
    value: "xs",
    label: "Çok Küçük (Dipnot)",
    size: "clamp(0.7rem, 0.65rem + 0.25vw, 0.75rem)",
    leading: "clamp(0.875rem, 0.8125rem + 0.3125vw, 1rem)",
  },
  {
    value: "sm",
    label: "Küçük (H6)",
    size: "clamp(1rem, 0.9rem + 0.5vw, 1.125rem)",
    leading: "clamp(1.25rem, 1.125rem + 0.5vw, 1.5rem)",
  },
  {
    value: "base",
    label: "Normal (Paragraf)",
    size: "clamp(1rem, 0.9375rem + 0.3125vw, 1.125rem)",
    leading: "clamp(1.625rem, 1.5625rem + 0.3125vw, 1.75rem)",
  },
  {
    value: "lg",
    label: "Büyük (H5)",
    size: "clamp(1.125rem, 1rem + 0.625vw, 1.25rem)",
    leading: "clamp(1.5rem, 1.375rem + 0.625vw, 1.75rem)",
  },
  {
    value: "xl",
    label: "Daha Büyük (H4)",
    size: "clamp(1.25rem, 1.125rem + 0.625vw, 1.5rem)",
    leading: "clamp(1.75rem, 1.625rem + 0.625vw, 2rem)",
  },
  {
    value: "2xl",
    label: "Çok Büyük (H3)",
    size: "clamp(1.5rem, 1.25rem + 0.9375vw, 1.875rem)",
    leading: "clamp(2rem, 1.75rem + 0.625vw, 2.25rem)",
  },
  {
    value: "3xl",
    label: "Daha Büyük (H2)",
    size: "clamp(1.75rem, 1.5rem + 1.25vw, 2.25rem)",
    leading: "clamp(2.25rem, 1.875rem + 1.25vw, 2.75rem)",
  },
  {
    value: "4xl",
    label: "Devasa (H1)",
    size: "clamp(2.25rem, 1.875rem + 1.875vw, 3rem)",
    leading: "clamp(2.75rem, 2.25rem + 2vw, 3.5rem)",
  },
];

// Type tanımlamaları
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      /**
       * Metin boyutunu ayarla
       */
      setFontSize: (fontSize: string) => ReturnType;
      /**
       * Metin boyutunu sıfırla
       */
      unsetFontSize: () => ReturnType;
    };
  }
}

export type FontSizeOptions = {
  types: string[];
};

export const FontSize = Extension.create<FontSizeOptions>({
  name: "fontSize",

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
          fontSize: {
            default: null,
            parseHTML: (element) => {
              // HTML'den font boyutunu çıkart
              const fontSize = element.style.fontSize;
              if (!fontSize) return null;

              // En yakın Tailwind boyutunu bul
              const option = FONT_SIZE_OPTIONS.find(
                (opt) => opt.size === fontSize,
              );
              return option ? option.value : null;
            },
            renderHTML: (attributes) => {
              if (!attributes.fontSize) {
                return {};
              }

              // Font boyutu değerini bul
              const option = FONT_SIZE_OPTIONS.find(
                (opt) => opt.value === attributes.fontSize,
              );

              if (!option) return {};

              // Hem font-size hem de line-height stil özelliklerini uygula
              return {
                style: `font-size: ${option.size}; line-height: ${option.leading};`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});
