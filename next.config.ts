import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Memoiza componentes en compilación; la versión en Rust corre dentro de Turbopack.
  reactCompiler: true,
  experimental: {
    turbopackRustReactCompiler: true,
  },
  images: {
    // AVIF primero (más liviano), luego WebP.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    qualities: [70, 80, 90],
    // Fotos subidas desde el Studio: viven en la CDN de Sanity.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  /* Direcciones del sitio anterior en WordPress: quien llegue desde un enlace
     viejo o desde Google cae en la sección equivalente. El sitio son el
     inicio y cuatro páginas; cada disco, texto o galería vive dentro de la
     suya y se enlaza con #. */
  async redirects() {
    return [
      { source: "/musica-portfolio/:path*", destination: "/musica", permanent: true },
      { source: "/poema-portfolio/:path*", destination: "/escritura", permanent: true },
      { source: "/galerias/:path*", destination: "/fotografia", permanent: true },
      { source: "/gastronomia-albums/:path*", destination: "/gastronomia", permanent: true },
      { source: "/acerca-de-mi/:path*", destination: "/#acerca", permanent: true },
      { source: "/acerca", destination: "/#acerca", permanent: true },
      { source: "/bitacora/:path*", destination: "/", permanent: true },
      { source: "/musica/:slug", destination: "/musica#:slug", permanent: true },
      { source: "/escritura/:slug", destination: "/escritura#:slug", permanent: true },
      { source: "/fotografia/:slug", destination: "/fotografia#:slug", permanent: true },
      { source: "/wp-admin/:path*", destination: "/studio", permanent: false },
      { source: "/wp-login.php", destination: "/studio", permanent: false },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
