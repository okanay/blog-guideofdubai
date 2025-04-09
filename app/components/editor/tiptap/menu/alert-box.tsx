import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import RichButtonModal from "./ui/modal";
import {
  ALERT_CONFIG,
  AlertType,
  AlertBoxPreview,
} from "../renderer/extensions/alert-box";
import { useTiptapContext } from "../store";
import MenuButton from "./ui/button";

// Tip seçenekleri
const ALERT_TYPES = Object.entries(ALERT_CONFIG).map(([value, config]) => ({
  value,
  ...config,
}));

const AlertBoxButton = () => {
  const { editor } = useTiptapContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alertType, setAlertType] = useState<string>("information");
  const [alertTitle, setAlertTitle] = useState<string>("");

  // Modal açılınca eğer zaten bir alertBox içindeysek, mevcut bilgileri al
  const handleOpenModal = () => {
    if (editor.isActive("alertBox")) {
      const attrs = editor.getAttributes("alertBox");
      setAlertType(attrs.type || "information");
      setAlertTitle(attrs.title || "");
    } else {
      // Varsayılan değerleri ayarla
      setAlertType("information");
      setAlertTitle("");
    }

    setIsModalOpen(true);
  };

  // AlertBox ekle
  const handleInsertAlertBox = () => {
    editor
      .chain()
      .focus()
      .setNode("alertBox", {
        type: alertType,
        title: alertTitle.trim(),
      })
      .run();

    setIsModalOpen(false);
  };

  // AlertBox tipini değiştir
  const handleChangeType = (type: string) => {
    setAlertType(type);
  };

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const updateIsActive = () => {
      setIsActive(editor.isActive("alertBox"));
    };

    editor.on("selectionUpdate", updateIsActive);
    editor.on("transaction", updateIsActive);
    return () => {
      editor.off("selectionUpdate", updateIsActive);
      editor.off("transaction", updateIsActive);
    };
  }, [editor]);

  return (
    <>
      <MenuButton
        onClick={handleOpenModal}
        isActive={isActive}
        label="Uyarı Kutusu Ekle"
      >
        <MessageSquare size={16} />
      </MenuButton>

      <RichButtonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Uyarı Kutusu"
        maxWidth="max-w-sm"
      >
        <div className="flex flex-col gap-4 p-1">
          {/* Uyarı Kutusu Tipi */}
          <div>
            <h3 className="mb-2 text-sm font-medium text-zinc-700">Tip</h3>
            <div className="grid grid-cols-3 gap-2">
              {ALERT_TYPES.map((type) => {
                const TypeIcon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => handleChangeType(type.value)}
                    className={`flex flex-col items-center gap-1.5 rounded-md border p-2 transition-all ${
                      alertType === type.value
                        ? `border-${type.colorClass}-500 bg-${type.colorClass}-50`
                        : "border-zinc-200 bg-zinc-50 hover:border-zinc-300"
                    }`}
                  >
                    <TypeIcon
                      size={16}
                      className={`text-${type.colorClass}-500`}
                    />
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-xs text-zinc-500">
              {ALERT_CONFIG[alertType as AlertType].description}
            </p>
          </div>

          {/* Uyarı Başlığı (Opsiyonel) */}
          <div>
            <div className="flex items-center justify-between">
              <h3 className="mb-1 text-sm font-medium text-zinc-700">
                Başlık{" "}
                <span className="text-xs font-normal text-zinc-500">
                  (opsiyonel)
                </span>
              </h3>
            </div>
            <input
              type="text"
              value={alertTitle}
              onChange={(e) => setAlertTitle(e.target.value)}
              placeholder="Boş bırakılabilir"
              className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border border-zinc-300 px-3 py-1.5 text-sm focus:ring-1 focus:outline-none"
            />
          </div>

          {/* Önizleme - Artık ortak AlertBoxPreview bileşenini kullanıyor */}
          <div className="mt-1">
            <h3 className="mb-1.5 text-xs font-medium text-zinc-600">
              Önizleme
            </h3>

            <AlertBoxPreview
              type={alertType as AlertType}
              title={alertTitle.trim()}
            />
          </div>

          {/* Alt butonlar */}
          <div className="flex justify-end border-t border-zinc-100 pt-3">
            <div className="flex gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="focus:ring-primary-400 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-800 transition-all hover:bg-zinc-100 focus:ring-1 focus:outline-none"
              >
                İptal
              </button>
              <button
                onClick={handleInsertAlertBox}
                className="focus:ring-primary-400 border-primary-500 bg-primary-500 hover:bg-primary-600 rounded-md border px-3 py-1.5 text-xs font-medium text-white transition-all focus:ring-1 focus:outline-none"
              >
                {isActive ? "Güncelle" : "Ekle"}
              </button>
            </div>
          </div>
        </div>
      </RichButtonModal>
    </>
  );
};

export { AlertBoxButton };
