import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ListTree, ListX } from "lucide-react";
import { ChapterCard, ChapterGroup } from "./chapter-card";
import { useTranslation } from "@/lib/i18n";

export interface VolumeGroup {
  vol: string | undefined;
  chapters: ChapterGroup[];
}

interface VolumeCardProps {
  volume: VolumeGroup;
  finalChapter?: string;
  readChapterIds?: Set<string>;
}

const getVolumeRange = (chapters: ChapterGroup[]): string => {
  if (chapters.length === 0 || chapters.length === 1) return "";

  const firstChapter = chapters[0]?.chapter;
  const lastChapter = chapters[chapters.length - 1]?.chapter;

  if (!firstChapter && !lastChapter) return "";
  if (!lastChapter) return `Ch. ${firstChapter}`;
  if (!firstChapter) return `Ch. ${lastChapter}`;

  return `Ch. ${lastChapter} - ${firstChapter}`;
};

export const VolumeCard = ({
  volume,
  finalChapter,
  readChapterIds,
}: VolumeCardProps) => {
  const t = useTranslation();
  const volumeLabel = volume.vol ? `${t.manga.volume} ${volume.vol}` : t.manga.noVolume;
  const volumeRange = getVolumeRange(volume.chapters);

  return (
    <Accordion type="multiple" defaultValue={["vol"]}>
      <AccordionItem value="vol" className="border-none">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex gap-0.5 items-center text-base">
            {volumeLabel === t.manga.noVolume ? (
              <ListX className="size-5" />
            ) : (
              <ListTree className="size-5" />
            )}
            {volumeLabel}
          </div>
          {!!volumeRange && (
            <span className="text-muted-foreground font-medium">
              {volumeRange}
            </span>
          )}
        </AccordionTrigger>

        {volume.chapters.map((chapter) => (
          <AccordionContent key={chapter.chapter ?? "oneshot"} className="pb-2">
            <ChapterCard
              chapters={chapter}
              finalChapter={finalChapter}
              readChapterIds={readChapterIds}
            />
          </AccordionContent>
        ))}
      </AccordionItem>
    </Accordion>
  );
};
