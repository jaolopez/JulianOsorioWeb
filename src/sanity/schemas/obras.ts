import { BookIcon } from "@sanity/icons/Book";
import { ImagesIcon } from "@sanity/icons/Images";
import { LemonIcon } from "@sanity/icons/Lemon";
import { defineArrayMember, defineField, defineType } from "sanity";
import { campoFecha, campoFoto, campoFotos } from "./campos";

/** Poema, prosa o relato. */
export const texto = defineType({
  name: "texto",
  icon: BookIcon,
  title: "Texto",
  type: "document",
  fields: [
    defineField({ name: "titulo", title: "Título", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "tipo",
      title: "Tipo",
      type: "string",
      options: {
        list: [
          { title: "Poema", value: "poema" },
          { title: "Prosa", value: "prosa" },
          { title: "Relato", value: "relato" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "poema",
    }),
    campoFecha(),
    defineField({
      name: "cuerpo",
      title: "Texto",
      type: "text",
      rows: 22,
      description:
        "Escribilo o pegalo tal cual. Cada renglón se respeta; un renglón vacío separa estrofas o párrafos.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "extracto",
      title: "Verso o frase destacada",
      type: "string",
      description: "Opcional. Se muestra en el listado. Si queda vacío se usa el primer renglón.",
    }),
    campoFoto("imagen", "Imagen", "Opcional. Acompaña el texto."),
  ],
  orderings: [{ title: "Más recientes", name: "fechaDesc", by: [{ field: "fecha", direction: "desc" }] }],
  preview: { select: { title: "titulo", subtitle: "tipo", media: "imagen" } },
});

/** Serie o galería de fotografías. */
export const galeria = defineType({
  name: "galeria",
  icon: ImagesIcon,
  title: "Galería de fotos",
  type: "document",
  fields: [
    defineField({ name: "titulo", title: "Título", type: "string", validation: (r) => r.required() }),
    campoFecha(),
    defineField({ name: "lugar", title: "Lugar", type: "string" }),
    defineField({ name: "descripcion", title: "Descripción", type: "text", rows: 3 }),
    campoFoto("portada", "Foto de portada", "Si queda vacía se usa la primera de la galería."),
    campoFotos("fotos", "Fotos", 1),
  ],
  orderings: [{ title: "Más recientes", name: "fechaDesc", by: [{ field: "fecha", direction: "desc" }] }],
  preview: { select: { title: "titulo", subtitle: "lugar", media: "portada" } },
});

/** Experiencia gastronómica (#experienciasoneto). */
export const experiencia = defineType({
  name: "experiencia",
  icon: LemonIcon,
  title: "Experiencia gastronómica",
  type: "document",
  fields: [
    defineField({ name: "titulo", title: "Título", type: "string", validation: (r) => r.required() }),
    campoFecha(),
    defineField({ name: "lugar", title: "Lugar", type: "string" }),
    defineField({ name: "descripcion", title: "Descripción", type: "text", rows: 4 }),
    defineField({
      name: "menu",
      title: "Menú",
      type: "array",
      description: "Opcional. Cada plato o trago en un renglón.",
      of: [defineArrayMember({ type: "string" })],
    }),
    campoFoto("portada", "Foto de portada", "La foto grande. Si queda vacía se usa la primera de las fotos."),
    campoFotos("fotos", "Más fotos"),
  ],
  validation: (r) =>
    r.custom((doc) =>
      doc?.portada || (Array.isArray(doc?.fotos) && doc.fotos.length) ? true : "Subí al menos una foto (de portada o en «Más fotos»)."
    ),
  orderings: [{ title: "Más recientes", name: "fechaDesc", by: [{ field: "fecha", direction: "desc" }] }],
  preview: { select: { title: "titulo", subtitle: "fecha", media: "portada" } },
});
