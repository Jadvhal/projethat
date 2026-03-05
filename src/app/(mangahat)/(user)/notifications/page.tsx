import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonitorCog, NotepadText, ServerOffIcon } from "lucide-react";
// import Notifications from "@/components/Notifications/notifications";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Streamdown } from "streamdown";
const items = [
  {
    value: "data_src_change",
    trigger: "01/03/2026 - Data source change",
    content:
      "For various reasons, MangaHat will now use [WeebDex API](https://api.weebdex.org/docs).\n\nAnyway, a final thank you to the MangaDex team. Everyone is honest until they aren't 🥀",
  },
  {
    value: "user_data",
    trigger: "01/03/2026 - User account and data",
    content:
      "Theoretically, MangaHat user accounts and data are separate from MangaDex, so changing the API mentioned above should ~~not affect anything~~.\n\nHowever, due to a coding oversight, your saved manga data will be temporarily unavailable. Please see below for details.",
  },
  {
    value: "what_affected",
    trigger: "01/03/2026 - So what is affected?",
    content:
      "I will try to fix the issues below in the future, but no timeline yet 🐧 \n\n| Feature | Status | Details |\n|---|---|---|\n| Link | ❌ Unavailable | Links using MangaDex uuid will not be accessible. |\n| Library & Reading History | ⚠️ Limited | Manga saved to account/device and reading history before **02/03/2026** will not be displayed; the Save manga to account feature is temporarily disabled. |\n| New chapter notifications | 🔕 Temporarily disabled | Temporarily disabled to find a better solution. |\n| Recommendations & Rankings | 📴 Temporarily hidden | WeebDex only recently started operating, not enough data to calculate. |\n| Comments | ⚠️ Limited | Comments before **02/03/2026** will appear in `Recent Comments`, but not on manga using the new API. New comments after **02/03/2026** work normally. |",
  },
];

// interface pageProps {
//   searchParams: Promise<{
//     [key: string]: string | undefined;
//   }>;
// }

export const metadata: Metadata = {
  title: "Notifications",
};

export default async function Page() {
  // const { page } = await getSearchParams({ searchParams });
  const tabValues = [
    {
      value: "noti",
      label: "Manga",
      icon: <NotepadText size={16} className="mr-1" />,
    },
    {
      value: "system",
      label: "System",
      icon: <MonitorCog size={16} className="mr-1" />,
    },
  ];
  return (
    <>
      <div>
        <hr className="w-9 h-1 bg-primary border-none" />
        <h1 className="text-2xl font-black uppercase">Notifications</h1>
      </div>

      <Tabs defaultValue="system" className="mt-4">
        <TabsList className="w-full">
          {tabValues.map((tab) => (
            <TabsTrigger
              key={tab.value}
              className="w-full flex items-center"
              value={tab.value}
            >
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="noti">
          <Empty className="bg-muted/30 h-full mt-2">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ServerOffIcon />
              </EmptyMedia>
              <EmptyTitle>Feature temporarily unavailable</EmptyTitle>
              <EmptyDescription className="max-w-xs text-pretty">
                Temporarily disabled for maintenance, bear with it 🤪
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
          {/* <Accordion
            type="single"
            collapsible
            className="bg-secondary rounded-md px-2 mb-2"
          >
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="py-2">
                <div className="flex items-center gap-1.5">
                  <CircleHelp size={18} /> Good to know:
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                New manga notifications are stored on your device; if you
                clear browser data, notifications will also be cleared.
                <br />
                Due to this limitation, sometimes there won't be a notification even if the manga
                has a new chapter
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Notifications page={page} /> */}
        </TabsContent>
        <TabsContent value="system">
          <Accordion
            type="multiple"
            className=""
            defaultValue={["data_src_change", "user_data", "what_affected"]}
          >
            {items.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger className="font-semibold uppercase">
                  {item.trigger}
                </AccordionTrigger>
                <AccordionContent>
                  <Streamdown
                    controls={{ table: false }}
                    linkSafety={{ enabled: false }}
                    className="**:data-[streamdown='table-wrapper']:grid!"
                  >
                    {item.content}
                  </Streamdown>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>
    </>
  );
}

// const getSearchParams = async ({ searchParams }: pageProps) => {
//   const params = await searchParams;
//   let page = params["page"] ? parseInt(params["page"]) : 1;
//   if (page < 1) page = 1;

//   return { page };
// };
