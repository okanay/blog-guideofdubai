import React from "react";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { mergeAttributes, Node, NodeViewProps } from "@tiptap/core";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

// Instagram Card özellikleri için tipleri tanımlayalım
export interface InstagramCardAttributes {
  imageUrl: string;
  username: string;
  userProfileImage?: string;
  postUrl?: string;
  caption?: string;
  likesCount?: number;
  location?: string;
  timestamp?: string;
}

// Extension Node
export const InstagramCard = Node.create({
  name: "instagramCard",
  group: "block",
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      imageUrl: {
        default: null,
      },
      username: {
        default: null,
      },
      userProfileImage: {
        default: null,
      },
      postUrl: {
        default: null,
      },
      caption: {
        default: null,
      },
      likesCount: {
        default: 0,
      },
      location: {
        default: null,
      },
      timestamp: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-instagram-card]",
        getAttrs: (node) => {
          if (!(node instanceof HTMLElement)) return {};

          return {
            imageUrl: node.getAttribute("data-image-url"),
            username: node.getAttribute("data-username"),
            userProfileImage: node.getAttribute("data-user-profile-image"),
            postUrl: node.getAttribute("data-post-url"),
            caption: node.getAttribute("data-caption"),
            likesCount: parseInt(
              node.getAttribute("data-likes-count") || "0",
              10,
            ),
            location: node.getAttribute("data-location"),
            timestamp: node.getAttribute("data-timestamp"),
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(
        { "data-instagram-card": "" },
        {
          "data-image-url": HTMLAttributes.imageUrl,
          "data-username": HTMLAttributes.username,
          "data-user-profile-image": HTMLAttributes.userProfileImage,
          "data-post-url": HTMLAttributes.postUrl,
          "data-caption": HTMLAttributes.caption,
          "data-likes-count": HTMLAttributes.likesCount,
          "data-location": HTMLAttributes.location,
          "data-timestamp": HTMLAttributes.timestamp,
        },
      ),
      // Boş içerik, tüm render işlemi NodeView tarafından yapılacak
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(InstagramCardView);
  },
});

// Editör için Node View Komponenti
const InstagramCardView: React.FC<NodeViewProps> = ({ node }) => {
  const attrs = node.attrs as InstagramCardAttributes;

  return (
    <NodeViewWrapper>
      <InstagramCardUI {...attrs} />
    </NodeViewWrapper>
  );
};

// UI Komponenti - hem editör içinde hem de render edilmiş görünümde kullanılır
// UI Komponenti - hem editör içinde hem de render edilmiş görünümde kullanılır
export const InstagramCardUI: React.FC<InstagramCardAttributes> = ({
  imageUrl,
  username,
  userProfileImage,
  postUrl,
  caption,
  likesCount,
  location,
  timestamp,
}) => {
  // Varsayılan profil resmi
  const defaultProfileImage = "https://via.placeholder.com/150?text=Profile";

  // Timestamp'i formatla (basit bir formatlama)
  const formattedTimestamp = timestamp ? timestamp : "1 saat önce";

  return (
    <div className="instagram-card relative my-6 max-w-sm rounded-lg border border-zinc-200 bg-white shadow-sm">
      {/* Kart Başlık */}
      <div className="flex items-center justify-between border-b border-zinc-100 p-2.5">
        <div className="flex items-center gap-2">
          <div className="ring-primary-50 relative size-10 overflow-hidden rounded-full ring-1">
            <img
              src={userProfileImage || defaultProfileImage}
              alt={`${username} profil fotoğrafı`}
              className="absolute inset-0 h-full w-full translate-y-[-40%] object-scale-down"
            />
          </div>
          <div>
            <span className="text-sm font-semibold">{username}</span>
          </div>
        </div>
        <button className="text-zinc-600 hover:text-zinc-900">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Görsel */}
      <div className="aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={caption || `${username} tarafından paylaşılan gönderi`}
          className="h-full w-full translate-y-[-20px] rounded-none object-cover"
        />
      </div>

      {/* Açıklama */}
      {caption && (
        <div className="px-3 py-1.5">
          <p className="text-sm">
            <span className="font-semibold">{username}</span> {caption}
          </p>
        </div>
      )}

      {/* Zaman */}
      <div className="px-3 pt-0 pb-2">
        <p className="text-xs text-zinc-400 uppercase">{formattedTimestamp}</p>
      </div>

      {/* Link varsa tıklanabilir kart yapısı */}
      {postUrl && (
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10 cursor-pointer"
          aria-label={`${username} tarafından paylaşılan gönderiye git`}
        />
      )}
    </div>
  );
};

// Renderer komponenti - JSON'dan direkt render etmek için kullanılır
export const InstagramCardRenderer = ({ node }: { node: any }) => {
  return <InstagramCardUI {...node.attrs} />;
};
