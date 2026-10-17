import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

// Serif editorial para titulares: alto contraste, cursiva con carácter.
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

// Sans neutra para lectura y mono para rótulos y números.
const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

const SITIO = process.env.NEXT_PUBLIC_SITE_URL || "https://www.julianosoriomusic.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITIO),
  title: {
    default: "Julián Osorio — Universo creativo",
    template: "%s · Julián Osorio",
  },
  description:
    "Julián Osorio, artista. Música, escritura, fotografía y gastronomía: un universo creativo hecho de guitarras, palabras, luz y mesa compartida.",
  keywords: ["Julián Osorio", "música", "rock", "Infinito más cercano", "escritura", "poesía", "fotografía", "gastronomía", "Medellín"],
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Julián Osorio",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0b0a09",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${instrument.variable} ${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Antes de pintar: marca que hay JavaScript (los elementos que se animan
            arrancan ocultos sin parpadear; sin JS se ven siempre) y si la
            entrada ya se vio en esta sesión (para no repetirla). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('jo-visto'))d.classList.add('ya-visto')}catch(e){}",
          }}
        />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
