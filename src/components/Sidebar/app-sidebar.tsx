"use client";

import * as React from "react";
import { Bookmark, BookOpen, Gamepad2, Users } from "lucide-react";
import {
  SiDiscord,
  SiFacebook,
  SiGithub,
} from "@icons-pack/react-simple-icons";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";
import { siteConfig } from "@/config/site";
import { NavSupports } from "./nav-supports";
import { NavSettings } from "./nav-settings";
import { useTranslation } from "@/lib/i18n";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslation();

  const data = {
    user: {
      name: "Dorothy",
      email: "doro@mangahat.com",
      image: "/avatars/doro_think.webp",
    },

    navMain: [
      {
        title: t.nav.library,
        url: "#",
        icon: Bookmark,
        isActive: true,
        items: [
          {
            title: t.nav.myLibrary,
            url: "/my-library",
          },
          {
            title: t.nav.readingHistory,
            url: "/history",
          },
        ],
      },
      {
        title: t.nav.manga,
        url: "#",
        icon: BookOpen,
        isActive: true,
        items: [
          {
            title: t.nav.advancedSearch,
            url: "/advanced-search",
          },
          {
            title: t.nav.latestUpdates,
            url: "/latest",
          },
          {
            title: t.nav.newManga,
            url: "/recent",
          },
          {
            title: t.nav.genres,
            url: "/tag",
          },
          {
            title: t.nav.randomManga,
            url: "/random",
          },
        ],
      },
      {
        title: t.nav.community,
        url: "#",
        icon: Users,
        items: [
          {
            title: t.nav.forum,
            url: "https://github.com/Jadvhal/projethat/discussions",
          },
          {
            title: t.nav.scanlationGroups,
            url: "/groups",
          },
        ],
      },
      {
        title: t.nav.entertainment,
        url: "#",
        icon: Gamepad2,
        items: [
          {
            title: t.nav.gacha,
            url: "/gacha",
          },
          {
            title: t.nav.cats,
            url: "/meo",
          },
        ],
      },
    ],

    supports: [
      {
        name: "Facebook",
        url: siteConfig.links.facebook,
        icon: SiFacebook,
      },
      {
        name: "Discord",
        url: siteConfig.links.discord,
        icon: SiDiscord,
      },
      {
        name: "Github",
        url: siteConfig.links.github,
        icon: SiGithub,
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-12 items-center justify-center">
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSettings />
      </SidebarContent>
      <SidebarFooter className="p-0">
        <NavSupports supports={data.supports} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
