import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NSAGENCY",
    short_name: "NSAGENCY",
    description:
      "Software development, communication and consulting agency based in Yaoundé, Cameroon.",
    lang: "en",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f7f4f3",
    theme_color: "#5b2333",
    categories: ["business", "technology"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
