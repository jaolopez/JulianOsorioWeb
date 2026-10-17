import { defineField } from "sanity";

/**
 * Campos que se repiten en varios documentos. Se definen una vez para que el
 * Studio se comporte igual en todos lados.
 */

/** "Infinito más cercano" → "infinito-mas-cercano". Tildes y ñ en una dirección se rompen al compartirla. */
export function slugificar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export const campoSlug = (fuente = "titulo") =>
  defineField({
    name: "slug",
    title: "Dirección web",
    type: "slug",
    description: "Se arma sola: escribí el título y tocá «Generate».",
    options: { source: fuente, maxLength: 80, slugify: slugificar },
    validation: (r) =>
      r.required().custom((valor?: { current?: string }) =>
        !valor?.current || /^[a-z0-9]+(-[a-z0-9]+)*$/.test(valor.current)
          ? true
          : "Sólo minúsculas sin tilde, números y guiones. Tocá «Generate» para corregirla."
      ),
  });

/** Foto con texto alternativo (lo leen los lectores de pantalla y Google). */
export const campoFoto = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    type: "image",
    description,
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Descripción de la foto",
        type: "string",
        description: "Una frase corta de lo que se ve. Ej: «Julián cantando en el estudio».",
      }),
    ],
  });

/** Lista de fotos para galerías. */
export const campoFotos = (name = "fotos", title = "Fotos") =>
  defineField({
    name,
    title,
    type: "array",
    description: "Arrastrá varias fotos a la vez. Se pueden reordenar arrastrándolas.",
    options: { layout: "grid" },
    of: [
      {
        type: "image",
        options: { hotspot: true },
        fields: [
          defineField({ name: "alt", title: "Descripción de la foto", type: "string" }),
          defineField({ name: "pie", title: "Pie de foto", type: "string", description: "Opcional. Se muestra debajo al ampliar." }),
        ],
      },
    ],
  });

export const campoFecha = (title = "Fecha") =>
  defineField({
    name: "fecha",
    title,
    type: "date",
    options: { dateFormat: "D [de] MMMM [de] YYYY" },
    initialValue: () => new Date().toISOString().slice(0, 10),
    validation: (r) => r.required(),
  });

export const campoOrden = defineField({
  name: "orden",
  title: "Orden",
  type: "number",
  description: "Número menor aparece primero. Opcional.",
});

export const MUNDOS = [
  { title: "Música", value: "musica" },
  { title: "Escritura", value: "escritura" },
  { title: "Fotografía", value: "fotografia" },
  { title: "Gastronomía", value: "gastronomia" },
  { title: "General", value: "general" },
];
