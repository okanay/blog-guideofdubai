import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";

export function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Sayfa yüklendikten sonra en üste kaydır
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // veya "smooth" için yumuşak kaydırma
    });
  }, [location.pathname]); // location.pathname değiştiğinde çalışır

  return null;
}
