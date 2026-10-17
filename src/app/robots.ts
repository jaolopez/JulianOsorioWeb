import type { MetadataRoute } from "next";

const SITIO = process.env.NEXT_PUBLIC_SITE_URL || "https://www.julianosoriomusic.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/studio", "/api/"] },
    sitemap: `${SITIO}/sitemap.xml`,
  };
}
