import { useEffect } from "react";
import { useLanguage } from "@/i18n/use-language";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { buildSearchParams } from "@/i18n/action";
import { ACTIVE_LANGUAGE_DICTONARY, DEFAULT_LANGUAGE } from "@/i18n/config";

const LanguageSynchronizer = () => {
  const { language, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // URL'deki dil parametresini al
    const searchParams = new URLSearchParams(location.search);
    const urlLang = searchParams.get("lang") as Language | null;

    // URL'de dil parametresi var mı kontrol et
    if (urlLang) {
      // URL'deki dil değeri aktif listede var mı kontrol et
      const isUrlLangActive = ACTIVE_LANGUAGE_DICTONARY.some(
        (lang) => lang.value === urlLang,
      );

      // Eğer URL'deki dil aktif listede yoksa, geçerli bir dile yönlendir
      if (!isUrlLangActive) {
        // Mevcut language değeri aktif listede var mı kontrol et
        const isCurrentLangActive = ACTIVE_LANGUAGE_DICTONARY.some(
          (lang) => lang.value === language,
        );

        // Kullanılacak dili belirle: Önce mevcut dil aktifse onu kullan, değilse DEFAULT_LANGUAGE
        const targetLanguage = isCurrentLangActive
          ? language
          : ACTIVE_LANGUAGE_DICTONARY[0]?.value || DEFAULT_LANGUAGE;

        // Dil state'ini güncelle
        changeLanguage(targetLanguage as Language);

        // Yeni search parametrelerini oluştur
        const newParams = buildSearchParams(searchParams, targetLanguage);

        // URL'i güncelle
        navigate({
          to: location.pathname,
          search: newParams as any,
          replace: true,
        });
      }
    } else {
      // URL'de dil parametresi yoksa, mevcut dili ekle
      // Ama önce mevcut dilin aktif olup olmadığını kontrol et
      const isCurrentLangActive = ACTIVE_LANGUAGE_DICTONARY.some(
        (lang) => lang.value === language,
      );

      // Kullanılacak dili belirle
      const targetLanguage = isCurrentLangActive
        ? language
        : ACTIVE_LANGUAGE_DICTONARY[0]?.value || DEFAULT_LANGUAGE;

      // Eğer mevcut dil aktif değilse, dil state'ini güncelle
      if (!isCurrentLangActive) {
        changeLanguage(targetLanguage as Language);
      }

      // Yeni search parametrelerini oluştur
      const newParams = buildSearchParams(searchParams, targetLanguage);

      // URL'i güncelle
      navigate({
        to: location.pathname,
        search: newParams as any,
        replace: true,
      });
    }
  }, [location.pathname, location.search, language, navigate, changeLanguage]);

  return null;
};

export default LanguageSynchronizer;
