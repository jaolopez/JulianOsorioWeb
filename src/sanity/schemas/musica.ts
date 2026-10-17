import { defineArrayMember, defineField, defineType } from "sanity";
import { campoFecha, campoFoto, campoOrden, campoSlug } from "./campos";

/** Álbum, EP o sencillo, con sus canciones para escuchar en el sitio. */
export const album = defineType({
  name: "album",
  title: "Álbum",
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
          { title: "Álbum", value: "album" },
          { title: "EP", value: "ep" },
          { title: "Sencillo", value: "sencillo" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "album",
    }),
    defineField({
      name: "anio",
      title: "Año",
      type: "number",
      validation: (r) => r.required().min(1950).max(2100),
    }),
    defineField({ name: "genero", title: "Género", type: "string", description: "Ej: Rock" }),
    campoFoto("portada", "Carátula", "Cuadrada idealmente, de al menos 1000 × 1000 px."),
    defineField({ name: "descripcion", title: "Descripción", type: "text", rows: 4 }),
    defineField({
      name: "canciones",
      title: "Canciones",
      type: "array",
      description: "En el orden del disco. El audio es opcional: sin él la canción aparece sin botón de reproducir.",
      of: [
        defineArrayMember({
          type: "object",
          name: "cancion",
          fields: [
            defineField({ name: "titulo", title: "Título", type: "string", validation: (r) => r.required() }),
            defineField({
              name: "audio",
              title: "Archivo de audio",
              type: "file",
              description: "MP3. Se escucha en el reproductor del sitio.",
              options: { accept: "audio/*" },
            }),
            defineField({ name: "duracion", title: "Duración", type: "string", description: "Ej: 3:49" }),
            defineField({ name: "letra", title: "Letra", type: "text", rows: 12 }),
          ],
          preview: {
            select: { title: "titulo", subtitle: "duracion", audio: "audio.asset" },
            prepare: ({ title, subtitle, audio }) => ({
              title,
              subtitle: [subtitle, audio ? "con audio" : "sin audio"].filter(Boolean).join(" · "),
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "enlaces",
      title: "Escuchar en",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: "spotify", title: "Spotify", type: "url" }),
        defineField({ name: "youtube", title: "YouTube", type: "url" }),
        defineField({ name: "appleMusic", title: "Apple Music", type: "url" }),
        defineField({ name: "deezer", title: "Deezer", type: "url" }),
      ],
    }),
    campoOrden,
  ],
  orderings: [{ title: "Más recientes", name: "anioDesc", by: [{ field: "anio", direction: "desc" }] }],
  preview: {
    select: { title: "titulo", anio: "anio", tipo: "tipo", media: "portada" },
    prepare: ({ title, anio, tipo, media }) => ({
      title,
      subtitle: [tipo === "ep" ? "EP" : tipo === "sencillo" ? "Sencillo" : "Álbum", anio].filter(Boolean).join(" · "),
      media,
    }),
  },
});

/** Video de YouTube o Vimeo. */
export const video = defineType({
  name: "video",
  title: "Video",
  type: "document",
  fields: [
    defineField({ name: "titulo", title: "Título", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "url",
      title: "Dirección del video",
      type: "url",
      description: "Pegá el enlace de YouTube tal como aparece en el navegador.",
      validation: (r) =>
        r.required().custom((v?: string) =>
          !v || /youtu\.?be/.test(v) ? true : "Por ahora sólo se admiten videos de YouTube."
        ),
    }),
    campoFecha(),
    defineField({ name: "descripcion", title: "Descripción", type: "text", rows: 2 }),
  ],
  orderings: [{ title: "Más recientes", name: "fechaDesc", by: [{ field: "fecha", direction: "desc" }] }],
  preview: { select: { title: "titulo", subtitle: "fecha" } },
});

/** Fecha de concierto o presentación. */
export const evento = defineType({
  name: "evento",
  title: "Fecha en agenda",
  type: "document",
  fields: [
    defineField({ name: "titulo", title: "Nombre", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "fecha",
      title: "Fecha y hora",
      type: "datetime",
      options: { dateFormat: "D [de] MMMM [de] YYYY", timeFormat: "h:mm a" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "lugar", title: "Lugar", type: "string", description: "Ej: Teatro Pablo Tobón Uribe" }),
    defineField({ name: "ciudad", title: "Ciudad", type: "string" }),
    defineField({ name: "enlace", title: "Enlace de entradas o información", type: "url" }),
  ],
  orderings: [{ title: "Próximas primero", name: "fechaAsc", by: [{ field: "fecha", direction: "asc" }] }],
  preview: { select: { title: "titulo", subtitle: "fecha" } },
});
