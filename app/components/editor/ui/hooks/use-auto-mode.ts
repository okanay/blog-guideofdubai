import { useState, useEffect, useRef } from "react";

interface UseAutoModeProps {
  isAutoMode: boolean;
  initialAutoMode: boolean;
  syncSource: string;
  targetValue: string;
  onChange?: (value: string) => void;
}

export function useAutoMode({
  isAutoMode,
  initialAutoMode,
  syncSource,
  targetValue,
  onChange,
}: UseAutoModeProps) {
  // Auto mod durumunu tutan state
  const [isAuto, setIsAuto] = useState(initialAutoMode);

  // Değer değişikliklerini takip etmek için son değer referansı
  const lastSyncValue = useRef(syncSource);
  const lastTargetValue = useRef(targetValue);

  // Auto modu değiştiren fonksiyon
  const toggleAutoMode = () => {
    const newAutoMode = !isAuto;
    setIsAuto(newAutoMode);

    // Auto moda geçildiğinde, sync source'dan değeri al
    if (newAutoMode && syncSource !== targetValue) {
      onChange?.(syncSource);
    }
  };

  // syncSource değeri değiştiğinde otomatik mod aktifse değeri güncelle
  useEffect(() => {
    if (isAuto && syncSource !== lastSyncValue.current) {
      onChange?.(syncSource);
    }
    lastSyncValue.current = syncSource;
  }, [isAuto, syncSource, onChange]);

  // Dışarıdan gelen targetValue değişikliklerini takip et
  useEffect(() => {
    if (targetValue !== lastTargetValue.current) {
      lastTargetValue.current = targetValue;
    }
  }, [targetValue]);

  // isAutoMode prop'u değişirse state'i güncelle
  useEffect(() => {
    if (!isAutoMode) {
      setIsAuto(false);
    }
  }, [isAutoMode]);

  return {
    isAuto,
    toggleAutoMode,
    effectiveValue: isAuto ? syncSource : targetValue,
  };
}
