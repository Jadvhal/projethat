import type { SearchParams } from "nuqs/server";
import { loadSearchParams } from "./searchParams";
import { Metadata } from "next";
import Recent from "./_components";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  let { page } = await loadSearchParams(searchParams);
  if (page < 1 || isNaN(page)) page = 1;

  return {
    title: page === 1 ? "New Manga" : `Page ${page} - New Manga`,
    description: "Newly added manga",
    keywords: ["New Manga", "New Manga", "Manga"],
  };
}

export default async function Page({ searchParams }: PageProps) {
  let { page } = await loadSearchParams(searchParams);
  if (page < 1 || isNaN(page)) page = 1;

  return (
    <>
      <div>
        <hr className="w-9 h-1 bg-primary border-none" />
        <h1 className="text-2xl font-black uppercase">New Manga</h1>
      </div>
      <div className="mt-4">
        <Recent page={page} />
      </div>
    </>
  );
}
