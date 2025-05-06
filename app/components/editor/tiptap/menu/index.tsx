import { useState } from "react";
import { AlertBoxButton } from "./alert-box";
import { FontFamilyButton } from "./font-family";
import { FontSizeButton } from "./font-size";
import { FontWeightButton } from "./font-weight";
import { HighlightButton } from "./highlight";
import { EnhancedImageButton } from "./image";
import { LinkButton } from "./link";
import { StrikeThroughButton } from "./strike-through";
import { UnderlineButton } from "./underline";
import { HeadingButtons } from "./headings";
import { BlockquoteButton } from "./blockquote";
import { BulletListButton } from "./bullet-list";
import { SubscriptButton } from "./subscript";
import { SuperscriptButton } from "./superscript";
import { ItalicButton } from "./italic";
import { TextAlignButtons } from "./text-aligns";
import { HorizontalRuleButton } from "./horizontal-rule";
import { InstagramCarouselButton } from "./instagram-carousel";

export const EditorRichMenu = () => {
  const [hidden, setHidden] = useState(false);

  return (
    <div className="sticky top-0 right-0 z-40">
      <div className="sticky w-full">
        <div className="mx-auto w-full">
          <div
            aria-hidden={hidden}
            className="border-t border-zinc-200 bg-white py-2 transition-[padding_,border] duration-300 aria-hidden:overflow-hidden aria-hidden:border-t-0 aria-hidden:py-0"
          >
            <div
              aria-hidden={hidden}
              className="mx-auto grid max-w-5xl grid-rows-[1fr] bg-white px-4 transition-[grid_template_rows] duration-300 aria-hidden:grid-rows-[0fr]"
            >
              <div className="custom-scrollbar flex min-h-0 max-w-5xl flex-wrap items-center justify-start gap-1">
                <HeadingButtons />
                <EnhancedImageButton />
                <LinkButton />
                <BlockquoteButton />
                <BulletListButton />
                <SubscriptButton />
                <SuperscriptButton />
                <ItalicButton />
                <FontWeightButton />
                <FontSizeButton />
                <UnderlineButton />
                <StrikeThroughButton />
                <FontFamilyButton />
                <HighlightButton />
                <TextAlignButtons />
                <AlertBoxButton />
                <HorizontalRuleButton />
                <InstagramCarouselButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
