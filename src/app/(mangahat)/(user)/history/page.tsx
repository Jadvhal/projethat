import { Metadata } from "next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import HistoryList from "./_components/history-list";


export function generateMetadata(): Metadata {
  return {
    title: "Reading History",
    description: "Reading History",
    keywords: ["History", "MangaHat"],
  };
}
export default function Page() {
  return (
    <>
      <div>
        <hr className="w-9 h-1 bg-primary border-none" />
        <h1 className="text-2xl font-black uppercase">Reading History</h1>
      </div>

      <Alert className="mt-4 rounded-sm">
        <Terminal size={18} />
        <AlertTitle>Good to know:</AlertTitle>
        <AlertDescription>
          Reading history is saved locally on your device, so if you clear your
          browser data, the history will also be cleared.
        </AlertDescription>
      </Alert>

      <div className="mt-4">
        <HistoryList />
      </div>
    </>
  );
}
