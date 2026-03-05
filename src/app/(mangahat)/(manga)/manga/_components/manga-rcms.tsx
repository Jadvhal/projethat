"use client";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { generateSlug } from "@/lib/utils";
import { useGetMangaIdRecommendations } from "@/lib/weebdex/hooks/manga/manga";
import { parseMangaTitle } from "@/lib/weebdex/utils";
import { BugIcon, Loader2, StarOff } from "lucide-react";
import Link from "next/link";
import MangaCard from "./manga-card";

interface MangaRcmsProps {
  id: string;
}

export default function MangaRcms({ id }: MangaRcmsProps) {
  const { data, error, isLoading } = useGetMangaIdRecommendations(id, {
    query: {
      queryKey: ["weebdex-manga-rcms", id],
      refetchInterval: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    },
  });

  const mangas = data?.status === 200 ? (data.data?.data ?? []) : [];

  if (isLoading)
    return (
      <div className="flex justify-center items-center w-full h-16">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );

  if (error || data?.status !== 200)
    return (
      <Empty className="bg-muted/30 h-full mt-2">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BugIcon />
          </EmptyMedia>
          <EmptyTitle>An error occurred 🤪</EmptyTitle>
          <EmptyDescription className="max-w-xs text-pretty">
            An error occurred, try refreshing the page
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );

  if (mangas.length === 0)
    return (
      <Empty className="bg-muted/30 h-full mt-2">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <StarOff />
          </EmptyMedia>
          <EmptyTitle>No results</EmptyTitle>
          <EmptyDescription className="max-w-xs text-pretty">
            No similar recommendations for this manga!
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );

  return (
    <div className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {mangas.map((manga) => {
        const { title } = parseMangaTitle(manga);
        const cover = manga.relationships?.cover;

        if (!manga.id || !cover) return null;

        return (
          <Link
            key={manga.id}
            href={`/manga/${manga.id}/${generateSlug(title)}`}
            prefetch={false}
          >
            <MangaCard
              manga_id={manga.id}
              title={title}
              cover={cover}
              className="w-full h-full"
            />
          </Link>
        );
      })}
    </div>
  );
}
