"use client";

import { generateSlug } from "@/lib/utils";
import { Relation, RelationType } from "@/lib/weebdex/model";
import { parseRelationTitle } from "@/lib/weebdex/utils";
import Link from "next/link";
import MangaCard from "./manga-card";
import { useMemo } from "react";

interface MangaRelatedProps {
  relations: Relation[];
}

const RELATION_TYPE_LABELS: Record<RelationType, string> = {
  main_story: "Main Story",
  side_story: "Side Story",
  prequel: "Prequel",
  sequel: "Sequel",
  adapted_from: "Adapted From",
  spin_off: "Spin-Off",
  based_on: "Based On",
  doujinshi: "Doujinshi",
  monochrome: "Monochrome Version",
  colored: "Colored Version",
  preserialization: "Pre-Serialization",
  serialization: "Serialization",
  alternate_story: "Alternate Story",
  alternate_version: "Alternate Version",
  same_franchise: "Same Franchise",
  shared_universe: "Shared Universe",
};

export default function MangaRelated({ relations }: MangaRelatedProps) {
  const grouped = useMemo(() => {
    const map = new Map<RelationType, Relation[]>();
    for (const rel of relations) {
      if (!rel.id || !rel.type) continue;
      const key = rel.type as RelationType;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(rel);
    }
    return map;
  }, [relations]);

  if (grouped.size === 0) return null;

  return (
    <div className="mt-2 flex flex-col gap-6">
      {Array.from(grouped.entries()).map(([type, items]) => (
        <div key={type} className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {RELATION_TYPE_LABELS[type] ?? type}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {items.map((rel) => {
              const cover = rel.relationships?.cover;
              const { title } = parseRelationTitle(rel);
              // relationships may not return alt_titles but parse just in case
              if (!rel.id || !cover) {
                return (
                  <Link
                    key={rel.id}
                    href={`/manga/${rel.id}/${generateSlug(title)}`}
                    prefetch={false}
                    className="flex items-center justify-center aspect-5/7 bg-muted rounded-sm text-sm text-center p-2"
                  >
                    {title}
                  </Link>
                );
              }
              return (
                <Link
                  key={rel.id}
                  href={`/manga/${rel.id}/${generateSlug(title)}`}
                  prefetch={false}
                >
                  <MangaCard
                    manga_id={rel.id}
                    title={title}
                    cover={cover}
                    className="w-full h-full"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
