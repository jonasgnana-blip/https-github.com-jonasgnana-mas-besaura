import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard crawlers: full access to public content
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/reservar/exito", "/reservar/cancelado"],
      },
      // Major AI crawlers: explicitly allowed on public pages
      {
        userAgent: ["GPTBot", "ChatGPT-User", "ClaudeBot", "anthropic-ai",
                    "PerplexityBot", "Applebot-Extended", "GoogleOther",
                    "Googlebot", "bingbot", "CCBot"],
        allow: ["/", "/la-casa", "/alojamiento", "/actividades", "/alquiler"],
        disallow: ["/admin/", "/api/", "/reservar/"],
      },
    ],
    sitemap: "https://masbesaura.com/sitemap.xml",
    host: "https://masbesaura.com",
  };
}
