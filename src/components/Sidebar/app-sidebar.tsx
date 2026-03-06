"use client";

import * as React from "react";
import {
  Bookmark,
  BookOpen,
  Gamepad2,
  Info,
  Megaphone,
  ScrollText,
  Shield,
  FileText,
  Users,
  Library,
  History,
  Search,
  Clock,
  Sparkles,
  Tags,
  Shuffle,
  MessageSquare,
  UsersRound,
  User,
  Gift,
  Cat,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";
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
            icon: Library,
          },
          {
            title: t.nav.readingHistory,
            url: "/history",
            icon: History,
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
            icon: Search,
          },
          {
            title: t.nav.latestUpdates,
            url: "/latest",
            icon: Clock,
          },
          {
            title: t.nav.newManga,
            url: "/recent",
            icon: Sparkles,
          },
          {
            title: t.nav.genres,
            url: "/tag",
            icon: Tags,
          },
          {
            title: t.nav.randomManga,
            url: "/random",
            icon: Shuffle,
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
            icon: MessageSquare,
          },
          {
            title: t.nav.scanlationGroups,
            url: "/groups",
            icon: UsersRound,
          },
          {
            title: t.nav.users,
            url: "/users",
            icon: User,
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
            icon: Gift,
          },
          {
            title: t.nav.cats,
            url: "/meo",
            icon: Cat,
          },
        ],
      },
      {
        title: "MangaHat",
        url: "#",
        icon: Info,
        items: [
          {
            title: t.nav.aboutUs,
            url: "/about",
            icon: Info,
          },
          {
            title: t.nav.announcements,
            url: "/announcements",
            icon: Megaphone,
          },
          {
            title: t.nav.guidelines,
            url: "/guidelines",
            icon: ScrollText,
          },
          {
            title: t.nav.privacyPolicy,
            url: "/privacy",
            icon: Shield,
          },
          {
            title: t.nav.termsOfService,
            url: "/terms",
            icon: FileText,
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="h-12 items-center justify-center">
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} label={t.nav.shortcuts} />
        <NavSettings />
      </SidebarContent>
      <SidebarFooter className="p-0" />
      <SidebarRail />
    </Sidebar>
  );
}
