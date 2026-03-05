import Gacha from "@/components/Pages/Gacha";
import { Metadata } from "next";

export function generateMetadata(): Metadata {
  return {
    title: "Gacha Simulator",
    description: "MangaHat - The ultimate gacha simulator",
    keywords: ["Gacha", "MangaHat", "Blue Archive", "Pokemon TCG", "Honkai Star Rail"],
  };
}

export default function Page() {
  return <Gacha />;
}
