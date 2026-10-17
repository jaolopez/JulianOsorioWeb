import { defineArrayMember, defineField, defineType } from "sanity";
import { campoFecha, campoFoto, campoFotos, campoSlug, MUNDOS } from "./campos";

/** Poema, prosa o relato. */
export const texto = defineType({
  name: "texto",
  title: "Texto",
  type: "document",
  fields: [
    defineField({ name: "titulo", title: "Título", type: "string", validation: (r) => r.required() }),
    campoSlug(),
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
    campoFoto("imagen", "Imagen", "Opcional. Acompaña el texto en el listado."),
  ],
  orderings: [{ title: "Más recientes", name: "fechaDesc", by: [{ field: "fecha", direction: "desc" }] }],
  preview: { select: { title: "titulo", subtitle: "tipo", media: "imagen" } },
});

/** Serie o galería de fotografías. */
export const galeria = defineType({
  name: "galeria",
  title: "Galería de fotos",
  type: "document",
  fields: [
    defineField({ name: "titulo", title: "Título", type: "string", validation: (r) => r.required() }),
    campoSlug(),
    campoFecha(),
    defineField({ name: "lugar", title: "Lugar", type: "string" }),
    defineField({ name: "descripcion", title: "Descripción", type: "text", rows: 3 }),
    campoFoto("portada", "Foto de portada", "Si queda vacía se usa la primera de la galería."),
    campoFotos(),
  ],
  orderings: [{ title: "Más recientes", name: "fechaDesc", by: [{ field: "fecha", direction: "desc" }] }],
  preview: { select: { title: "titulo", subtitle: "lugar", media: "portada" } },
});

/** Experiencia gastronómica (#experienciasoneto). */
export const experiencia = defineType({
  name: "experiencia",
  title: "Experiencia gastronómica",
  type: "document",
  fields: [
    defineField({ name: "titulo", title: "Título", type: "string", validation: (r) => r.required() }),
    campoSlug(),
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
    campoFoto("portada", "Foto de portada"),
    campoFotos(),
  ],
  orderings: [{ title: "Más recientes", name: "fechaDesc", by: [{ field: "fecha", direction: "desc" }] }],
  preview: { select: { title: "titulo", subtitle: "fecha", media: "portada" } },
});

/** Entrada de la bitácora: noticias, lanzamientos, notas. */
export const publicacion = defineType({
  name: "publicacion",
  title: "Publicación",
  type: "document",
  fields: [
    defineField({ name: "titulo", title: "Título", type: "string", validation: (r) => r.required() }),
    campoSlug(),
    campoFecha("Fecha de publicación"),
    defineField({
      name: "mundo",
      title: "Sección",
      type: "string",
      options: { list: MUNDOS, layout: "radio", direction: "horizontal" },
      initialValue: "general",
    }),
    defineField({
      name: "extracto",
      title: "Resumen",
      type: "text",
      rows: 3,
      description: "Dos o tres líneas; es lo que se ve en el listado.",
    }),
    campoFoto("portada", "Imagen de portada"),
    defineField({
      name: "contenido",
      title: "Contenido",
      type: "array",
      description: "Admite subtítulos, listas, negritas, enlaces, fotos y videos de YouTube.",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Subtítulo", value: "h2" },
            { title: "Subtítulo pequeño", value: "h3" },
            { title: "Cita", value: "blockquote" },
          ],
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Descripción de la foto", type: "string" }),
            defineField({ name: "pie", title: "Pie de foto", type: "string" }),
          ],
        }),
        defineArrayMember({
          type: "object",
          name: "youtube",
          title: "Video de YouTube",
          fields: [defineField({ name: "url", title: "Dirección del video", type: "url" })],
          preview: { select: { title: "url" }, prepare: ({ title }) => ({ title: "Video", subtitle: title }) },
        }),
      ],
    }),
  ],
  orderings: [{ title: "Más recientes", name: "fechaDesc", by: [{ field: "fecha", direction: "desc" }] }],
  preview: { select: { title: "titulo", subtitle: "fecha", media: "portada" } },
});
