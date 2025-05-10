import React, { useEffect, useState, useRef, useCallback } from "react";
import { X as LucideX, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";

type GalleryImageInfo = {
  src: string;
  rect: DOMRect;
  element: HTMLImageElement;
};

export const ImageGalleryOverlay: React.FC = () => {
  const [imageInfos, setImageInfos] = useState<GalleryImageInfo[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [activeImageInitialRect, setActiveImageInitialRect] =
    useState<DOMRect | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [isAnimatingZoom, setIsAnimatingZoom] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const overlayImageRef = useRef<HTMLImageElement>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLImageElement | null)[]>([]);
  const routerState = useRouterState();

  // Thumbnail ref'leri hazırla
  useEffect(() => {
    thumbnailRefs.current = Array(imageInfos.length).fill(null);
  }, [imageInfos.length]);

  // Tüm timeout'ları temizle
  const clearAllTimeouts = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  };

  // Komponent unmount olduğunda timeout'ları temizle
  useEffect(() => {
    return () => clearAllTimeouts();
  }, []);

  // Seçilen thumbnail'a kaydırma fonksiyonu
  const scrollToActiveThumbnail = useCallback((index: number) => {
    if (
      !thumbnailContainerRef.current ||
      thumbnailRefs.current.length <= index ||
      !thumbnailRefs.current[index]
    ) {
      return;
    }

    const container = thumbnailContainerRef.current;
    const thumbnail = thumbnailRefs.current[index];
    if (!thumbnail) return;

    // Thumbnail'ın container içindeki pozisyonunu hesapla
    const thumbnailRect = thumbnail.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Thumbnail'ı merkeze getirmek için gerekli kaydırma miktarı
    const targetScrollLeft =
      thumbnail.offsetLeft - containerRect.width / 2 + thumbnailRect.width / 2;

    // Kaydırma animasyonu - smooth scrolling
    container.scrollTo({
      left: targetScrollLeft,
      behavior: "smooth",
    });
  }, []);

  // Resmi değiştirme işlemi (core)
  const changeImage = useCallback(
    (newIndex: number, newRect?: DOMRect) => {
      if (newIndex < 0 || newIndex >= imageInfos.length) return;

      // Yeni rect verilmezse, mevcut resmi kullan
      const targetRect = newRect || imageInfos[newIndex]?.rect;
      if (!targetRect) return;

      setCurrentIndex(newIndex);
      setActiveImageInitialRect(targetRect);

      // Thumbnail'a kaydır (küçük bir gecikme ile)
      setTimeout(() => {
        scrollToActiveThumbnail(newIndex);
      }, 50);
    },
    [imageInfos, scrollToActiveThumbnail],
  );

  // Zoom animasyonu ile geçiş (ilk tıklanma için)
  const zoomImage = useCallback(
    (index: number, rect: DOMRect) => {
      clearAllTimeouts();

      if (isOverlayVisible && currentIndex !== null && currentIndex !== index) {
        // Önce küçült
        setIsAnimatingZoom(false);
        setIsTransitioning(true);

        animationTimeoutRef.current = setTimeout(() => {
          changeImage(index, rect);

          // CSS transition süresinden sonra yeniden yakınlaştır
          requestAnimationFrame(() => {
            setIsAnimatingZoom(true);
            setIsTransitioning(false);
          });
        }, 300); // CSS ile uyumlu geçiş süresi
      } else {
        // İlk açılma
        changeImage(index, rect);
        setIsOverlayVisible(true);

        requestAnimationFrame(() => {
          setIsAnimatingZoom(true);
        });
      }
    },
    [isOverlayVisible, currentIndex, changeImage],
  );

  // Direkt geçiş (ok tuşları ve thumbnail tıklaması için)
  const switchImage = useCallback(
    (newIndex: number) => {
      if (newIndex < 0) {
        newIndex = imageInfos.length - 1; // Sona git
      } else if (newIndex >= imageInfos.length) {
        newIndex = 0; // Başa dön
      }

      if (newIndex === currentIndex || !imageInfos[newIndex] || isTransitioning)
        return;

      clearAllTimeouts();
      setIsTransitioning(true);

      // Fade-out efekti
      if (overlayImageRef.current) {
        overlayImageRef.current.style.opacity = "0";
      }

      animationTimeoutRef.current = setTimeout(() => {
        changeImage(newIndex);

        // Fade-in efekti
        if (overlayImageRef.current) {
          requestAnimationFrame(() => {
            overlayImageRef.current!.style.opacity = "1";

            setTimeout(() => {
              setIsTransitioning(false);
            }, 150); // Fade-in süresi
          });
        }
      }, 150); // Fade-out süresi
    },
    [imageInfos, currentIndex, changeImage, isTransitioning],
  );

  // Blog post içindeki orijinal resme tıklama
  const handleOriginalImageClick = useCallback(
    (index: number) => {
      if (!imageInfos[index]) return;

      const clickedImg = imageInfos[index].element;
      const currentRect = clickedImg.getBoundingClientRect();
      zoomImage(index, currentRect);
    },
    [imageInfos, zoomImage],
  );

  // Thumbnail'a tıklama
  const handleThumbnailClick = useCallback(
    (index: number, event: React.MouseEvent<HTMLImageElement>) => {
      if (index === currentIndex && isAnimatingZoom) return;

      if (isAnimatingZoom) {
        // Zaten açıksa, direkt geçiş yap
        switchImage(index);
      } else {
        // Kapalıysa veya animasyon arasındaysa, zoom efekti kullan
        const thumbnailRect = event.currentTarget.getBoundingClientRect();
        zoomImage(index, thumbnailRect);
      }
    },
    [currentIndex, isAnimatingZoom, switchImage, zoomImage],
  );

  // Modalı kapatma
  const handleClose = useCallback(() => {
    if (isTransitioning || !isOverlayVisible) return;

    clearAllTimeouts();
    setIsAnimatingZoom(false);
    setIsTransitioning(true);

    const completeClose = () => {
      setIsOverlayVisible(false);

      // Aktif görsel DOM'da yoksa veya currentIndex geçersizse erken çık
      if (currentIndex === null || !imageInfos[currentIndex]) {
        setCurrentIndex(null);
        setActiveImageInitialRect(null);
        setIsTransitioning(false);
        return;
      }

      // Aktif görselin DOM elementini al
      const activeElement = imageInfos[currentIndex].element;

      // Görselin ekrandaki pozisyonunu kontrol et
      const rect = activeElement.getBoundingClientRect();
      const isInViewport =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth);

      // Eğer görsel tamamen görünür değilse, ona doğru yumuşak kaydırma yap
      if (!isInViewport) {
        // Önce scroll özelliği destekleniyor mu kontrol et
        if ("scrollIntoView" in activeElement) {
          // Görsele yumuşak kaydırma
          activeElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });

          // Kaydırma tamamlandıktan sonra durumları temizle
          setTimeout(() => {
            setCurrentIndex(null);
            setActiveImageInitialRect(null);
            setIsTransitioning(false);
          }, 500); // Kaydırma animasyonu için yeterli süre
        } else {
          // scrollIntoView desteklenmiyorsa manuel olarak kaydır
          const elementTop = rect.top + window.pageYOffset;
          const middle = elementTop - window.innerHeight / 2 + rect.height / 2;
          window.scrollTo({
            top: middle,
            behavior: "smooth",
          });

          setTimeout(() => {
            setCurrentIndex(null);
            setActiveImageInitialRect(null);
            setIsTransitioning(false);
          }, 500);
        }
      } else {
        // Görsel zaten görünürse, sadece durumları temizle
        setCurrentIndex(null);
        setActiveImageInitialRect(null);
        setIsTransitioning(false);
      }
    };

    // Küçülme animasyonu tamamlandığında veya timeout ile kapat
    if (overlayImageRef.current) {
      overlayImageRef.current.addEventListener("transitionend", completeClose, {
        once: true,
      });

      // Fallback: transitionend çalışmazsa yine de kapat
      animationTimeoutRef.current = setTimeout(completeClose, 350);
    } else {
      completeClose();
    }
  }, [isTransitioning, isOverlayVisible, currentIndex, imageInfos]);

  // Klavye tuşları için event listener
  useEffect(() => {
    if (!isOverlayVisible) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTransitioning) return;

      switch (event.key) {
        case "Escape":
          handleClose();
          break;
        case "ArrowLeft":
          if (currentIndex !== null) {
            switchImage(currentIndex - 1);
          }
          break;
        case "ArrowRight":
          if (currentIndex !== null) {
            switchImage(currentIndex + 1);
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    isOverlayVisible,
    currentIndex,
    switchImage,
    handleClose,
    isTransitioning,
  ]);

  const handleOriginalImageClickRef = useRef<(index: number) => void>(() => {});

  handleOriginalImageClickRef.current = (index: number) => {
    if (!imageInfos[index]) return;
    const clickedImg = imageInfos[index].element;
    const currentRect = clickedImg.getBoundingClientRect();
    zoomImage(index, currentRect);
  };

  // Modal açıldığında scroll'u aktif thumbnail'a getir
  useEffect(() => {
    if (isOverlayVisible && currentIndex !== null && isAnimatingZoom) {
      scrollToActiveThumbnail(currentIndex);
    }
  }, [
    isOverlayVisible,
    currentIndex,
    isAnimatingZoom,
    scrollToActiveThumbnail,
  ]);

  // Blog içerisindeki resimleri bul ve tıklanabilir yap
  useEffect(() => {
    const container = document.querySelector(".prose");
    if (!container) return;

    const imgElements = Array.from(
      container.querySelectorAll("img:not(.overlay-ignore)"),
    ) as HTMLImageElement[];

    const collectedImageInfos: GalleryImageInfo[] = imgElements.map((img) => ({
      src: img.src,
      rect: img.getBoundingClientRect(),
      element: img,
    }));

    setImageInfos(collectedImageInfos);

    const cleanupListeners: Array<() => void> = [];

    imgElements.forEach((img, index) => {
      img.style.cursor = "zoom-in";
      const clickHandler = () => handleOriginalImageClickRef.current(index);
      img.addEventListener("click", clickHandler);
      cleanupListeners.push(() =>
        img.removeEventListener("click", clickHandler),
      );
    });

    return () => {
      cleanupListeners.forEach((cleanup) => cleanup());
      imgElements.forEach((img) => {
        img.style.cursor = "";
      });
    };
  }, [routerState]);

  // Overlay yoksa hiçbir şey render etme
  if (!isOverlayVisible || currentIndex === null || !imageInfos[currentIndex]) {
    return null;
  }

  // Mevcut resim bilgisi
  const currentImageInfo = imageInfos[currentIndex];
  const displayRect = activeImageInitialRect || currentImageInfo.rect;
  const activeSrc = currentImageInfo.src;

  // Resim stili - zoom/küçültme için
  const imageStyle: React.CSSProperties = {
    position: "fixed",
    objectFit: "contain",
    borderRadius: "8px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.15s linear",
    zIndex: 51,
    top: isAnimatingZoom ? "50%" : `${displayRect.top}px`,
    left: isAnimatingZoom ? "50%" : `${displayRect.left}px`,
    width: isAnimatingZoom ? "90vw" : `${displayRect.width}px`,
    height: isAnimatingZoom ? "auto" : `${displayRect.height}px`,
    transform: isAnimatingZoom ? "translate(-50%, -50%)" : "translate(0%, 0%)",
    maxWidth: "90vw",
    maxHeight: "90vh",
    cursor: isAnimatingZoom ? "default" : "zoom-out",
  };

  // Buton ortak CSS sınıfları
  const buttonClasses =
    "absolute z-55 p-2 bg-black/40 rounded-full text-white hover:bg-black/60 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-60 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg";

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isTransitioning) {
          handleClose();
        }
      }}
    >
      {/* Kapatma butonu */}
      <button
        className={`${buttonClasses} top-4 right-4`}
        onClick={handleClose}
        aria-label="Galeriyi kapat"
        disabled={isTransitioning}
      >
        <LucideX size={30} strokeWidth={2.5} />
      </button>

      {/* Sol/Sağ butonları (birden fazla resim varsa) */}
      {imageInfos.length > 1 && (
        <>
          <button
            className={`${buttonClasses} bg-primary text-color-font-invert hover:bg-primary-dark top-1/2 left-3 -translate-y-1/2 text-sm sm:left-4 sm:text-base`}
            onClick={() => switchImage(currentIndex - 1)}
            aria-label="Önceki görsel"
            disabled={isTransitioning}
          >
            <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={2.5} />
          </button>
          <button
            className={`${buttonClasses} bg-primary text-color-font-invert hover:bg-primary-dark top-1/2 right-3 -translate-y-1/2 text-sm sm:right-4 sm:text-base`}
            onClick={() => switchImage(currentIndex + 1)}
            aria-label="Sonraki görsel"
            disabled={isTransitioning}
          >
            <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" strokeWidth={2.5} />
          </button>
        </>
      )}

      {/* Ana görsel */}
      <img
        ref={overlayImageRef}
        src={activeSrc}
        alt="Genişletilmiş Galeri Resmi"
        style={imageStyle}
        onClick={(e) => {
          // Resmin kendisine tıklandığında ve zoom durumundaysa kapat
          if (isAnimatingZoom && !isTransitioning) {
            e.stopPropagation();
            handleClose();
          }
        }}
      />

      {/* Thumbnail nav bar */}
      <div className="absolute right-0 bottom-0 left-0 z-51 w-full overflow-x-auto bg-black/50 p-3 backdrop-blur-sm sm:p-4">
        <div
          ref={thumbnailContainerRef}
          style={{ scrollbarWidth: "none", scrollBehavior: "smooth" }}
          className="scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent relative z-51 mx-auto flex w-full max-w-screen-lg justify-start gap-2 pb-1 sm:gap-3"
        >
          {imageInfos.map(({ src }, i) => (
            <img
              key={`thumbnail-${i}-${src}`}
              ref={(el) => {
                thumbnailRefs.current[i] = el;
              }}
              src={src}
              alt={`Thumbnail ${i + 1}`}
              onClick={(event) => {
                if (!isTransitioning) {
                  handleThumbnailClick(i, event);
                }
              }}
              className={`h-16 w-20 flex-shrink-0 rounded-md border-2 object-cover shadow-md transition-all duration-200 ease-in-out sm:h-20 sm:w-24 ${
                i === currentIndex
                  ? "border-primary-cover scale-105 opacity-100"
                  : "border-transparent opacity-70 hover:border-gray-400 hover:opacity-100"
              }`}
              style={{
                cursor: isTransitioning ? "default" : "pointer",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
