/**
 * Configuración del proyecto Sanity.
 *
 * El projectId y el dataset no son secretos: viajan al navegador en cada
 * consulta. Mientras no haya proyecto conectado el sitio sigue funcionando con
 * el contenido de respaldo de `lib/contenido.ts`, así que la falta de estas
 * variables no rompe la compilación.
 */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

/** Fecha de la API: fijarla evita que un cambio futuro de Sanity rompa el sitio. */
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-10-01";

/** ¿Hay un proyecto de Sanity conectado? */
export const sanityConectado = /^[a-z0-9-]+$/.test(projectId);
