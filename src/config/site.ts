export const siteConfig = {
  name: "MangaHat",
  url: "https://mangahat.com",
  ogImage: "https://mangahat.com/og-image.png",
  description: "MangaHat - Manga reading web app",
  links: {
    discord: "https://discord.gg/dongmoe",
    github: "https://github.com/Jadvhal/projethat",
    facebook: "https://facebook.com/mangahat",
  },
  mangahat: {
    domain: "https://suicaodex.com",
    mato_domain: "https://mato.suicaodex.com",
    apiURL: "https://api2.suicaodex.com", //pls use your own proxy server; or use built-in proxy, see /lib/axios.ts
  },
  weebdex: {
    domain: "https://weebdex.org",
    ogURL: "https://og.weebdex.org",
    proxyURL: "https://wd.memaydex.online",
  },
};

export type SiteConfig = typeof siteConfig;

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};
