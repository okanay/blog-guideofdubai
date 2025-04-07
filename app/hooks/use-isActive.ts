import { useState } from "react";

export type Category = {
  label: string;
  value: string;
  icon?: React.ComponentType<any>;
};

export const useIsActive = (
  categories: Category[],
  initialActiveCategory: Category,
) => {
  const [activeCategories, setActiveCategories] = useState<Category[]>([
    initialActiveCategory,
  ]);

  const toggleCategory = (category: Category) => {
    // "all" kategorisine tıklandıysa, sadece onu seç
    if (category.value === "all") {
      setActiveCategories([category]);
      return;
    }

    // Aktif kategorilerde "all" varsa ve başka bir kategoriye tıklandıysa, "all"ı kaldır
    if (activeCategories.some((cat) => cat.value === "all")) {
      setActiveCategories([category]);
      return;
    }

    // Kategori zaten seçili mi kontrol et
    const isAlreadyActive = activeCategories.some(
      (cat) => cat.value === category.value,
    );

    if (isAlreadyActive) {
      // Eğer tek seçili kategori ise ve ona tekrar tıklandıysa "all" kategorisine geç
      if (activeCategories.length === 1) {
        const allCategory = categories.find((cat) => cat.value === "all");
        if (allCategory) {
          setActiveCategories([allCategory]);
        }
        return;
      }

      // BUG DÜZELTME: Burada cat.value !== category.label yerine cat.value !== category.value olmalı
      // Kategori zaten seçili ise listeden çıkar
      setActiveCategories(
        activeCategories.filter((cat) => cat.value !== category.value),
      );
    } else {
      // Kategori seçili değilse listeye ekle
      setActiveCategories([...activeCategories, category]);
    }
  };

  const isHidden = (value: string): boolean => {
    // "all" seçili ise hiçbir şey gizlenmiyor
    if (activeCategories.some((cat) => cat.value === "all")) {
      return false;
    }

    // Seçili kategoriler içinde ilgili değer var mı kontrol et
    return !activeCategories.some((cat) => cat.value === value);
  };

  const isCategoryActive = (category: Category): boolean => {
    return activeCategories.some((cat) => cat.value === category.value);
  };

  return {
    activeCategories,
    toggleCategory,
    isHidden,
    isCategoryActive,
  };
};
