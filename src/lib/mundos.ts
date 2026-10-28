import type { ClaveMundo } from "./tipos";

/**
 * Los cuatro mundos del sitio. Cada uno tiene su número, su lema (heredados
 * del sitio anterior) y un tono de luz propio que tiñe los detalles de su
 * sección; el resto de la paleta es común.
 */
export const MUNDOS: Record<
  ClaveMundo,
  { numero: string; nombre: string; lema: string; href: `/${string}`; tono: string }
> = {
  musica: {
    numero: "01",
    nombre: "Música",
    lema: "Paisajes sonoros",
    href: "/musica",
    tono: "var(--color-brasa)",
  },
  escritura: {
    numero: "02",
    nombre: "Escritura",
    lema: "Palabra de artista",
    href: "/escritura",
    tono: "var(--color-tinta)",
  },
  fotografia: {
    numero: "03",
    nombre: "Fotografía",
    lema: "La luz detenida",
    href: "/fotografia",
    tono: "var(--color-plata)",
  },
  gastronomia: {
    numero: "04",
    nombre: "Gastronomía",
    lema: "Legado artesanal",
    href: "/gastronomia",
    tono: "var(--color-ambar)",
  },
};

export const ORDEN_MUNDOS: ClaveMundo[] = ["musica", "escritura", "fotografia", "gastronomia"];

/** Menú principal: las cuatro páginas, en el orden en que aparecen en la barra y en el Studio. */
export const NAVEGACION = ORDEN_MUNDOS.map((c) => ({
  href: MUNDOS[c].href,
  nombre: MUNDOS[c].nombre,
  numero: MUNDOS[c].numero,
  tono: MUNDOS[c].tono,
}));
