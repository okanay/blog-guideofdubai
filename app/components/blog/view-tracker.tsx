import { useState, useRef, useEffect } from "react";

type IncreaseViewTrackerProps = {
  blogId: string;
};

export function IncreaseViewTracker({ blogId }: IncreaseViewTrackerProps) {
  const [tracked, setTracked] = useState(false);
  const attemptCountRef = useRef(0);

  useEffect(() => {
    if (!tracked && blogId) {
      const trackView = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_APP_BACKEND_URL}/blog/view?id=${blogId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );

          if (response.ok) {
            setTracked(true);
          } else {
            // Başarısızsa tekrar dene
            attemptRetry();
          }
        } catch (error) {
          attemptRetry();
        }
      };

      const attemptRetry = () => {
        attemptCountRef.current += 1;
        if (attemptCountRef.current < 3) {
          // 1 saniye sonra tekrar dene
          setTimeout(trackView, 1000);
        } else {
        }
      };

      // İlk deneme
      window.requestIdleCallback
        ? window.requestIdleCallback(() => trackView())
        : setTimeout(trackView, 1000);
    }
  }, [blogId, tracked]);

  return null;
}
