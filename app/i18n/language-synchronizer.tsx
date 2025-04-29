import { useEffect } from "react";
import { useLanguage } from "@/i18n/use-language";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { buildSearchParams } from "@/i18n/action";

const LanguageSynchronizer = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // URL search parametrelerini al
    const searchParams = new URLSearchParams(location.search);

    // Eğer lang parametresi yoksa, mevcut dili URL'e ekle
    if (!searchParams.has("lang")) {
      // Yeni search parametreleri oluştur
      const newParams = buildSearchParams(searchParams, language);

      // URL'i güncelle, fakat sayfayı yeniden yükleme
      navigate({
        to: location.pathname,
        search: newParams as any,
        replace: true, // Tarayıcı geçmişinde değişiklik yapma
      });
    }
  }, [location.pathname, location.search, language, navigate]);

  // Bu bileşen görsel olarak hiçbir şey render etmez
  return null;
};

export default LanguageSynchronizer;
