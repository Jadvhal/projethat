"use client";

import useContentHeight from "@/hooks/use-content-height";
import { Manga } from "@/lib/weebdex/model";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Streamdown } from "streamdown";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ChevronsDown, ChevronsUp, Undo2 } from "lucide-react";
import { SiGoogletranslate } from "@icons-pack/react-simple-icons";
import MangaSubInfo from "./manga-subinfo";
import { useTranslation, useLocale } from "@/lib/i18n";
import { useAutoTranslate } from "@/hooks/use-auto-translate";

interface MangaDescriptionProps {
  content: string;
  maxHeight: number;
  manga?: Manga;
}

export default function MangaDescription({
  content,
  maxHeight,
  manga,
}: MangaDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslation();
  const [locale] = useLocale();
  const [showOriginal, setShowOriginal] = useState(false);

  const { text: translatedContent, isFetching } = useAutoTranslate(content);
  const isTranslated = locale !== "en" && !showOriginal && translatedContent !== content;

  const displayContent = showOriginal ? content : translatedContent;

  const { contentRef, fullHeight } = useContentHeight({
    expanded,
    dependencies: [showOriginal, translatedContent],
  });

  const handleTranslate = () => {
    setShowOriginal((prev) => !prev);
  };

  const handleExpand = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className="relative flex flex-col gap-1">
      <div
        className="overflow-hidden transition-[max-height,height] text-sm h-auto"
        style={{
          maxHeight: expanded ? fullHeight : maxHeight,
          maskImage:
            expanded || fullHeight <= maxHeight
              ? "none"
              : "linear-gradient(black 0%, black 60%, transparent 100%)",
        }}
      >
        <div ref={contentRef}>
          {!!content && (
            <Streamdown
              controls={{ table: false }}
              className="text-pretty"
            >
              {displayContent}
            </Streamdown>
          )}

          {locale !== "en" && (
            <Button
              size="sm"
              className="opacity-50 hover:opacity-100 mt-2"
              onClick={handleTranslate}
              variant="ghost"
            >
              {isFetching ? (
                <Spinner />
              ) : isTranslated ? (
                <Undo2 />
              ) : (
                <SiGoogletranslate />
              )}
              {isTranslated ? t.manga.viewOriginal : t.manga.translate}
            </Button>
          )}

          {!!manga && (
            <div className={cn("xl:hidden", !!content ? "py-4" : "pb-2")}>
              <MangaSubInfo manga={manga} />
            </div>
          )}
        </div>
      </div>

      {fullHeight > maxHeight && (
        <div
          className={cn(
            "flex justify-center w-full border-t transition-[border-color]",
            expanded ? "border-transparent" : "border-primary",
          )}
        >
          <Button
            size="sm"
            className="rounded-t-none h-4 px-1! text-xs"
            onClick={handleExpand}
            variant={expanded ? "secondary" : "default"}
          >
            {expanded ? (
              <>
                <ChevronsUp />
                {t.manga.showLess}
                <ChevronsUp />
              </>
            ) : (
              <>
                <ChevronsDown />
                {t.manga.seeMore}
                <ChevronsDown />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
