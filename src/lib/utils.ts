import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNowStrict } from "date-fns";
import { enUS as locale } from "date-fns/locale";
import * as cheerio from "cheerio";
import { siteConfig } from "@/config/site";
import slugify from "slugify";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatDistanceLocale = {
  lessThanXSeconds: "just now",
  xSeconds: "just now",
  halfAMinute: "just now",
  lessThanXMinutes: "{{count}} min",
  xMinutes: "{{count}} min",
  aboutXHours: "{{count}} hr",
  xHours: "{{count}} hr",
  xDays: "{{count}} d",
  aboutXWeeks: "{{count}} w",
  xWeeks: "{{count}} w",
  aboutXMonths: "{{count}} mo",
  xMonths: "{{count}} mo",
  aboutXYears: "{{count}} yr",
  xYears: "{{count}} yr",
  overXYears: "{{count}} yr",
  almostXYears: "{{count}} yr",
};

function formatDistance(token: string, count: number, options?: any): string {
  options = options || {};

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace("{{count}}", count.toString());

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return "in about " + result;
    } else {
      if (result === "just now") return result;

      return result + " ago";
    }
  }

  return result;
}

export function getContentLength(html: string): number {
  const $ = cheerio.load(html);
  const text = $.text().trim();
  const textLength = text.length;
  const imgCount = $("img").length;
  return textLength + imgCount;
}

export function formatTimeToNow(date: Date | number): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance,
    },
  });
}

// Format time in short form: 2s, 5m, 3h, 1d, 2w, 3mo, 1y
const formatDistanceShort = {
  lessThanXSeconds: "{{count}}s",
  xSeconds: "{{count}}s",
  halfAMinute: "30s",
  lessThanXMinutes: "{{count}}m",
  xMinutes: "{{count}}m",
  aboutXHours: "{{count}}h",
  xHours: "{{count}}h",
  xDays: "{{count}}d",
  aboutXWeeks: "{{count}}w",
  xWeeks: "{{count}}w",
  aboutXMonths: "{{count}}mo",
  xMonths: "{{count}}mo",
  aboutXYears: "{{count}}y",
  xYears: "{{count}}y",
  overXYears: "{{count}}y",
  almostXYears: "{{count}}y",
};

function formatDistanceShortFn(token: string, count: number): string {
  return formatDistanceShort[token as keyof typeof formatDistanceShort].replace(
    "{{count}}",
    count.toString(),
  );
}

export function formatShortTime(date: Date | number): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: false,
    locale: {
      ...locale,
      formatDistance: formatDistanceShortFn,
    },
  });
}

let currentImageProxyUrl: string | null = null;

export function getCurrentImageProxyUrl(): string {
  return currentImageProxyUrl || siteConfig.mangahat.apiURL;
}

export function getCoverImageUrl(
  mangaId: string,
  fileName: string,
  size: string = "",
): string {
  const apiUrl = getCurrentImageProxyUrl();

  if (size === "full") {
    return `${apiUrl}/covers/${mangaId}/${fileName}`;
  }

  const sizeStr = size ? `.${size}` : "";
  return `${apiUrl}/covers/${mangaId}/${fileName}${sizeStr}.jpg`;
}

export function formatNumber(num: number): string {
  const f = Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
  });
  return f.format(num);
}

export function generateSlug(title: string): string {
  if (!title) return "";
  const titleWithDash = title.replace(/\//g, "-");
  return slugify(titleWithDash, {
    lower: true,
    locale: "en",
    remove: /[*+~.,()'\"!?:@\[\]]/g,
  });
}

export function formatChapterTitle(
  chapter: { chapter?: string | null; title?: string | null },
  includeTitle: boolean = true,
): string {
  if (!chapter.chapter) {
    return "Oneshot";
  }
  if (!includeTitle) {
    return `Ch. ${chapter.chapter}`;
  }
  return chapter.title
    ? `Ch. ${chapter.chapter} - ${chapter.title}`
    : `Ch. ${chapter.chapter}`;
}
