// app/components/editor/create/form.tsx
import React, { useState } from "react";
import { Input, Textarea, Select, Checkbox } from "./ui";
import { useCreateBlog } from "../store";
import { LANGUAGE_DICTONARY_TR } from "@/i18n/config";

interface BlogFormData {
  title: string;
  description: string;
  coverImage: string;
  tags: string[];
  categories: string[];
  language: string;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
}

export function CreateBlogForm() {
  const {
    view: { mode, setMode },
  } = useCreateBlog();

  return (
    <div className="mx-auto max-w-3xl py-6">
      <div className="mb-8">
        <h1 className="mb-1 text-2xl font-bold text-zinc-900">
          Blog Detayları
        </h1>
        <p className="text-sm text-zinc-500">
          Blog yazınızın başlığı, açıklaması ve diğer detaylarını ayarlayın.
          İçerik eklemek için "İçerik" sekmesine geçebilirsiniz.
        </p>
      </div>

      <div className="space-y-8">
        {/* Ana Bilgiler */}
        <div className="space-y-6">
          {/* Başlık */}
          <Input
            id="title"
            label="Başlık"
            placeholder="Blog yazınızın başlığını girin"
            isRequired
            helperText="Başlık, blog yazınızın ana konusunu yansıtmalıdır."
          />

          {/* Açıklama */}
          <Textarea
            id="description"
            label="Kısa Açıklama"
            placeholder="Blog yazınızın kısa bir açıklamasını girin"
            isRequired
            helperText="Bu açıklama blog listesinde ve önizlemede görünecektir."
            maxLength={200}
            showCharCount
            rows={3}
          />

          <p>slug-creator (eklenicek)</p>
          <p>Kapak görseli (eklenicek)</p>
          <p>Kategoriler (eklenicek)</p>
          <p>Tag (eklenicek)</p>
          <p>Okuma Süresi (eklenicek)</p>
        </div>

        {/* SEO Ayarları */}
        <div>
          <h2 className="mb-4 border-b border-zinc-200 pb-2 text-lg font-medium text-zinc-800">
            SEO Ayarları
          </h2>

          <div className="space-y-4">
            {/* SEO Başlık */}
            <Input
              id="seoTitle"
              label="SEO Başlığı"
              placeholder="SEO için başlık (boş bırakılırsa normal başlık kullanılır)"
              helperText="Google ve diğer arama motorlarında görünecek başlık."
            />

            {/* SEO Açıklama */}
            <Textarea
              id="seoDescription"
              label="SEO Açıklaması"
              placeholder="SEO için açıklama (boş bırakılırsa normal açıklama kullanılır)"
              helperText="Google ve diğer arama motorlarında görünecek açıklama."
              maxLength={160}
              showCharCount
              rows={2}
            />
          </div>
        </div>

        {/* Diğer Ayarlar */}
        <div>
          <h2 className="mb-4 border-b border-zinc-200 pb-2 text-lg font-medium text-zinc-800">
            Diğer Ayarlar
          </h2>

          <div className="space-y-4">
            {/* Dil Seçimi */}
            <Select
              id="language"
              label="İçerik Dili"
              options={LANGUAGE_DICTONARY_TR}
            />

            {/* Öne Çıkarma Seçeneği */}
            <Checkbox
              id="featured"
              label="Öne Çıkan İçerik Olarak İşaretle"
              helperText="Bu blog yazısı ana sayfada ve öne çıkan içerikler bölümünde gösterilecektir."
              containerClassName="flex items-center mt-2"
              labelClassName="flex items-center gap-1.5 font-medium"
            />

            <p>post initial status (eklenicek)</p>
          </div>
        </div>

        {/* Alt Butonlar */}
        <div className="flex justify-end pt-4">
          <button className="bg-primary-500 hover:bg-primary-600 focus:ring-primary-200 flex items-center gap-1.5 rounded-md px-6 py-2 text-sm font-medium text-white focus:ring-2 focus:ring-offset-2 focus:outline-none">
            İçerik Ekle
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
