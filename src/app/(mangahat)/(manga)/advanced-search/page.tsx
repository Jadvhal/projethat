import { Suspense } from "react";
import WeebdexAdvancedSearch from "./_components/advanced-search";
import { Metadata } from "next";

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const p = await searchParams;
  const page = Math.max(1, parseInt(p["page"] ?? "1") || 1);
  return {
    title:
      page === 1
        ? "Advanced Search - WeebDex"
        : `Page ${page} - Advanced Search - WeebDex`,
    description: "WeebDex advanced search tool",
  };
}

export default function Page() {
  return (
    <Suspense>
      <WeebdexAdvancedSearch />
    </Suspense>
  );
}
