import { useState } from "react";
import { Link as LinkIcon, ExternalLink, X } from "lucide-react";
import RichButtonModal from "./ui/modal";
import { useTiptapContext } from "../store";

const LinkButton = () => {
  const { editor } = useTiptapContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Bu fonksiyon URL'in güvenli olup olmadığını kontrol eder
  const isValidUrl = (url: string): boolean => {
    try {
      // URL oluştur
      const parsedUrl = url.includes(":")
        ? new URL(url)
        : new URL(`https://${url}`);

      // İzin verilmeyen protokoller
      const disallowedProtocols = ["ftp", "file", "mailto", "javascript"];
      const protocol = parsedUrl.protocol.replace(":", "");

      if (disallowedProtocols.includes(protocol)) {
        setValidationError(
          `Protokol güvenlik nedeniyle izin verilmiyor: ${protocol}`,
        );
        return false;
      }

      // Sadece belirli protokollere izin ver
      const allowedProtocols = ["https"];
      if (!allowedProtocols.includes(protocol)) {
        setValidationError(
          `Sadece şu protokollere izin verilir: ${allowedProtocols.join(", ")}`,
        );
        return false;
      }

      // İzin verilmeyen domainler
      const disallowedDomains = [];
      const domain = parsedUrl.hostname;

      if (disallowedDomains.includes(domain)) {
        setValidationError(
          `Bu domain güvenlik nedeniyle engellenmiştir: ${domain}`,
        );
        return false;
      }

      // Tüm kontroller geçildi
      setValidationError("");
      return true;
    } catch (error) {
      setValidationError("Geçersiz URL formatı");
      return false;
    }
  };

  const handleOpenModal = () => {
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, "");

    // Eğer metin seçiliyse, o metni varsayılan bağlantı metni olarak kullan
    if (selectedText) {
      setLinkText(selectedText);
    } else {
      setLinkText("");
    }

    // Eğer zaten bir bağlantı varsa, onun bilgilerini al
    if (editor.isActive("link")) {
      const attrs = editor.getAttributes("link");
      setLinkUrl(attrs.href || "");
      setOpenInNewTab(attrs.target === "_blank");
    } else {
      setLinkUrl("");
      setOpenInNewTab(false);
    }

    setIsModalOpen(true);
  };

  const handleInsertLink = () => {
    if (!linkUrl.trim()) return;

    // URL güvenlik kontrolü
    if (!isValidUrl(linkUrl.trim())) return;

    const finalUrl = linkUrl.includes(":") ? linkUrl : `https://${linkUrl}`;

    // Link özellikleri
    const attrs = {
      href: finalUrl,
      target: openInNewTab ? "_blank" : null,
      rel: openInNewTab ? "noopener noreferrer" : null,
    };

    // Seçili metin yokken ve özel metin belirtilmişse
    if (linkText && editor.state.selection.empty) {
      // Özel metni kullanarak yeni bir bağlantı oluştur
      editor
        .chain()
        .focus()
        .insertContent({
          type: "text",
          text: linkText,
          marks: [{ type: "link", attrs }],
        })
        .run();
    } else {
      // Standart bağlantı ekleme
      editor.chain().focus().extendMarkRange("link").setLink(attrs).run();
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleUnlink = () => {
    editor.chain().focus().unsetLink().run();
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setLinkUrl("");
    setLinkText("");
    setOpenInNewTab(false);
    setValidationError("");
  };

  const isActive = editor.isActive("link");

  return (
    <>
      <button
        onClick={handleOpenModal}
        aria-pressed={isActive}
        aria-label="Bağlantı Ekle"
        className="flex size-8 items-center justify-center rounded-md border border-transparent p-1 text-zinc-700 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-100 aria-pressed:border-zinc-300 aria-pressed:bg-zinc-100"
        style={isActive ? { color: "#3b82f6" } : {}}
      >
        <LinkIcon size={16} />
      </button>

      <RichButtonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Bağlantı Ekle"
      >
        <div className="flex flex-col gap-4 p-1">
          {/* URL Girişi */}
          <div>
            <h3 className="mb-1.5 text-sm font-medium text-zinc-700">
              Bağlantı URL'i
            </h3>
            <div className="relative">
              <input
                id="link-url"
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border border-zinc-300 px-3 py-2 focus:ring-1 focus:outline-none"
                autoFocus
              />
              {validationError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {validationError}
                </p>
              )}
            </div>
          </div>

          {/* Link Metni (boş seçimde) */}
          {editor.state.selection.empty && (
            <div>
              <h3 className="mb-1.5 text-sm font-medium text-zinc-700">
                Bağlantı Metni
              </h3>
              <input
                id="link-text"
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Bağlantı için görünen metin"
                className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-md border border-zinc-300 px-3 py-2 focus:ring-1 focus:outline-none"
              />
            </div>
          )}

          {/* Yeni Sekmede Açma Seçeneği */}
          <div>
            <h3 className="mb-1.5 text-sm font-medium text-zinc-700">
              Seçenekler
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <input
                  id="open-new-tab"
                  type="checkbox"
                  checked={openInNewTab}
                  onChange={(e) => setOpenInNewTab(e.target.checked)}
                  className="text-primary-500 focus:ring-primary-500 h-4 w-4 rounded border-zinc-300"
                />
                <label
                  htmlFor="open-new-tab"
                  className="ml-2 flex items-center gap-1 text-sm text-zinc-700"
                >
                  Yeni sekmede aç
                  <ExternalLink size={14} className="text-zinc-500" />
                </label>
              </div>
            </div>
          </div>

          {/* Alt butonlar - Minimal tasarım */}
          <div className="flex justify-between border-t border-zinc-100 pt-4">
            {isActive && (
              <button
                onClick={handleUnlink}
                className="flex items-center gap-1 rounded border border-red-400 bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-red-600 focus:ring-1 focus:ring-red-400 focus:outline-none"
              >
                <X size={14} />
                <span>Kaldır</span>
              </button>
            )}
            {!isActive && <div />} {/* Boş div ile dengeleyici */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="focus:ring-primary-400 w-fit rounded border border-zinc-200 bg-zinc-50 px-6 py-1.5 text-sm font-medium text-zinc-800 transition-all hover:bg-zinc-100 focus:ring-1 focus:outline-none"
              >
                İptal
              </button>
              <button
                onClick={handleInsertLink}
                className="focus:ring-primary-400 border-primary-500 bg-primary-500 hover:bg-primary-600 w-fit rounded border px-6 py-1.5 text-sm font-medium text-white transition-all focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!linkUrl.trim() || !!validationError}
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

export { LinkButton };
