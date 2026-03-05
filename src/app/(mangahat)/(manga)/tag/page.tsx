import { Metadata } from "next";
import TagsPageWeebdex from "./_components";

export function generateMetadata(): Metadata {
  return {
    title: "Genres",
    description: "Manga by genre",
    keywords: ["Genres", "Genre", "WeebDex"],
  };
}

export default function Page() {
  return (
    <>
      <div>
        <hr className="w-9 h-1 bg-primary border-none" />
        <h1 className="text-2xl font-black uppercase">Genres</h1>
      </div>

      <div className="w-full mt-4">
        <TagsPageWeebdex />
      </div>
    </>
  );
}
