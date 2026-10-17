import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, sanityConectado } from "./env";

/**
 * Cliente de lectura del sitio público.
 *
 * `useCdn: false`: el caché lo lleva Next (`"use cache"` en queries.ts), no la
 * CDN de Sanity. Next sólo consulta a Sanity al revalidar, así que el volumen
 * de peticiones queda muy por debajo del límite del plan gratuito.
 */
export const client = createClient({
  // Sin proyecto conectado se usa un id de relleno; las consultas no llegan a salir.
  projectId: sanityConectado ? projectId : "sin-proyecto",
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});
