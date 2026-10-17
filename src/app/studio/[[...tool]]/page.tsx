import type { Metadata, Viewport } from "next";
import { NextStudio } from "next-sanity/studio";
import { sanityConectado } from "@/sanity/env";
import config from "../../../../sanity.config";

/**
 * Módulo de edición. El Studio es una aplicación de cliente dentro de esta
 * ruta; Sanity se encarga del inicio de sesión, así que no hace falta
 * autenticación propia.
 */
export const metadata: Metadata = {
  title: "Contenido — Julián Osorio",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function StudioPage() {
  if (!sanityConectado) return <SinProyecto />;
  return <NextStudio config={config} />;
}

/** Mientras no haya proyecto de Sanity conectado, en vez de un Studio roto se explica qué falta. */
function SinProyecto() {
  return (
    <main className="grid min-h-dvh place-items-center bg-noche p-6 text-hueso">
      <div className="max-w-lg">
        <p className="kicker text-brasa">Módulo de contenido</p>
        <h1 className="display mt-6 text-6xl">Falta conectar Sanity</h1>
        <p className="mt-6 leading-relaxed text-ceniza">
          Completá <code className="text-hueso">NEXT_PUBLIC_SANITY_PROJECT_ID</code> en las variables de entorno (ver{" "}
          <code className="text-hueso">.env.example</code> y el README) y volvé a desplegar. Mientras tanto, el sitio muestra el
          contenido de respaldo.
        </p>
      </div>
    </main>
  );
}
