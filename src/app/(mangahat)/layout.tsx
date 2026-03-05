"use client";

import { SiteHeader } from "@/components/Navbar/site-header";
import { AppSidebar } from "@/components/Sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useLocale, isRTL } from "@/lib/i18n";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [locale] = useLocale();
  const sidebarSide = isRTL(locale) ? "right" : "left";

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar side={sidebarSide} />
      <div className="border-grid flex flex-1 flex-col">
        <SiteHeader />
        <main className="flex-1 py-4 mx-4 md:mx-8 lg:mx-12">{children}</main>
      </div>
    </SidebarProvider>
  );
}
