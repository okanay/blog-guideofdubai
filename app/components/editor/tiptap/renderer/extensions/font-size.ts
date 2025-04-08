import { Extension } from "@tiptap/core";

// Font boyutu seçenekleri: kullanıcı dostu isimler ve teknik değerler
export const FONT_SIZE_OPTIONS = [
  { value: "default", label: "Varsayılan", size: "default", leading: "1.5rem" },
  { value: "xs", label: "Çok Küçük", size: "0.75rem", leading: "1rem" },
  { value: "sm", label: "Küçük", size: "0.875rem", leading: "1.25rem" },
  { value: "base", label: "Normal", size: "1rem", leading: "1.5rem" },
  { value: "lg", label: "Büyük", size: "1.125rem", leading: "1.75rem" },
  { value: "xl", label: "Daha Büyük", size: "1.25rem", leading: "1.75rem" },
  { value: "2xl", label: "Çok Büyük", size: "1.5rem", leading: "2rem" },
  { value: "3xl", label: "En Büyük", size: "1.875rem", leading: "2.25rem" },
  { value: "4xl", label: "Devasa", size: "2.25rem", leading: "2.5rem" },
  { value: "5xl", label: "Muazzam", size: "3rem", leading: "1" },
  { value: "6xl", label: "İnanılmaz Büyük", size: "3.75rem", leading: "1" },
  { value: "7xl", label: "Aşırı Büyük", size: "4.5rem", leading: "1" },
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
