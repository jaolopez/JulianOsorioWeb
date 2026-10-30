import { defineField } from "sanity";

/**
 * Campos que se repiten en varios documentos. Se definen una vez para que el
 * Studio se comporte igual en todos lados.
 */

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
export const campoFotos = (name = "fotos", title = "Fotos", minimo = 0) =>
  defineField({
    name,
    title,
    type: "array",
    validation: (r) => (minimo ? r.min(minimo).error("Agregá al menos una foto: sin fotos la galería no se muestra.") : r),
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
