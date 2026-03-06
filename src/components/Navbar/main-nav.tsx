"use client";

import Link from "next/link";
import useScrollOffset from "@/hooks/use-scroll-offset";
import { cn } from "@/lib/utils";

export function MainNav() {
  const { isAtTop } = useScrollOffset();

  return (
    <Link
      href="/"
      className="me-4 flex items-center justify-start lg:me-6 group relative"
    >
      <div className="relative flex items-center justify-center">
        {/* Modern after effect loop animations: floating, glowing, and spinning background */}
        <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse scale-150 rounded-full" />
        <span className={cn(
          "font-extrabold text-2xl tracking-tight bg-gradient-to-br from-primary via-primary/80 to-primary/40 bg-clip-text text-transparent drop-shadow-sm",
          "relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-105",
          "animate-[float_3s_ease-in-out_infinite]",
          !isAtTop ? "opacity-90" : "opacity-100"
        )}>
          MangaHat
        </span>
      </div>
    </Link>
  );
}
