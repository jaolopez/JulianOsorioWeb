"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { esESLocale } from "@sanity/locale-es-es";
import { apiVersion, dataset, projectId, sanityConectado } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemas";
import { structure, TIPOS_UNICOS } from "@/sanity/structure";

/**
 * Studio embebido en el propio sitio, servido en /studio.
 *
 * Un solo repositorio y un solo despliegue: Julián entra a
 * julianosoriomusic.com/studio, inicia sesión y publica.
 *
 * Pensado para el plan gratuito de Sanity: todo lo que es de pago está
 * apagado, así el Studio no muestra botones que no harían nada ni consulta
 * por funciones que devolverían error.
 */
export default defineConfig({
  name: "julian-osorio",
  title: "Julián Osorio — contenido",
  basePath: "/studio",
  projectId: sanityConectado ? projectId : "sin-proyecto",
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({ structure }),
    // Menús, botones y avisos del Studio en español.
    esESLocale(),
    // Consola de consultas para programadores: sólo en local.
    ...(process.env.NODE_ENV === "development" ? [visionTool({ defaultApiVersion: apiVersion })] : []),
  ],
  // Funciones de los planes pagos.
  releases: { enabled: false },
  scheduledDrafts: { enabled: false },
  tasks: { enabled: false },
  announcements: { enabled: false },
  document: {
    comments: { enabled: false },
    // El «+» de arriba sólo ofrece lo que se puede tener varias veces.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global" ? prev.filter((t) => !TIPOS_UNICOS.includes(t.templateId)) : prev,
    // Las piezas fijas del sitio no se duplican ni se borran.
    actions: (prev, { schemaType }) =>
      TIPOS_UNICOS.includes(schemaType)
        ? prev.filter(({ action }) => action !== "duplicate" && action !== "delete" && action !== "unpublish")
        : prev,
  },
});
