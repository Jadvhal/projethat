import { Metadata } from "next";
import RandomManga from "./_components";

export const metadata: Metadata = {
  title: "Random Manga",
  description: "Random manga",
};

export default function Page() {
  return <RandomManga />;
}
