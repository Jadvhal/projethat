import { Metadata } from "next";
import {
  Album,
  BookmarkCheck,
  BookOpen,
  CircleHelp,
  CircleUser,
  CloudOff,
  ListCheck,
  NotebookPen,
  ServerOffIcon,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import LibraryList from "./_components/library-list";
// import { auth } from "@/auth";
// import SyncLib from "@/components/Library/sync-lib";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function generateMetadata(): Metadata {
  return {
    title: "Library",
    // description: "Library",
    // keywords: ["History", "MangaHat"],
  };
}
export default async function Page() {
  // const session = await auth();
  // console.log(session);
  const tabValues = [
    { value: "following", icon: <BookmarkCheck /> },
    { value: "reading", icon: <Album /> },
    { value: "plan", icon: <NotebookPen /> },
    { value: "completed", icon: <ListCheck /> },
  ];
  return (
    <>
      <div>
        <hr className="w-9 h-1 bg-primary border-none" />
        <h1 className="text-2xl font-black uppercase">Library</h1>
      </div>

      <Tabs defaultValue="local" className="mt-4">
        <TabsList className="w-full">
          <TabsTrigger className="w-full flex items-center" value="local">
            <CloudOff size={16} className="mr-1" />
            From device
          </TabsTrigger>
          <TabsTrigger className="w-full flex items-center" value="cloud">
            <CircleUser size={16} className="mr-1" />
            From account
          </TabsTrigger>
        </TabsList>
        <TabsContent value="local">
          <Accordion
            type="single"
            collapsible
            className="bg-secondary rounded-md px-2"
          >
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="py-2">
                <div className="flex items-center gap-1.5">
                  <CircleHelp size={18} /> Good to know:
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                This library is saved locally on your device, it does not
                sync with the library on your account. If you clear your
                browser data, this library will also be cleared.
                <br />
                Also, each category only saves up to 500 manga. Adding more
                will automatically delete the oldest ones.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Tabs defaultValue="following" className="mt-2">
            <TabsList className="rounded-sm gap-1 h-10">
              {tabValues.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  className="rounded-sm"
                  value={tab.value}
                >
                  {tab.icon}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabValues.map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="w-full">
                <LibraryList category={tab.value as any} />
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
        <TabsContent value="cloud">
          <Empty className="bg-muted/30 h-full mt-2">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ServerOffIcon />
              </EmptyMedia>
              <EmptyTitle>Feature temporarily unavailable</EmptyTitle>
              <EmptyDescription className="max-w-xs text-pretty">
                Temporarily disabled for maintenance, please use the other one 🤪
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
          {/* {!!session ? (
            <SyncLib session={session} />
          ) : (
            <Alert className="rounded-sm justify-center text-center">
              <AlertTitle>You need to log in to use this feature!</AlertTitle>
            </Alert>
          )} */}
        </TabsContent>
      </Tabs>
    </>
  );
}
