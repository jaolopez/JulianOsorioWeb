import { CalendarIcon } from "@sanity/icons/Calendar";
import { PlayIcon } from "@sanity/icons/Play";
import { VideoIcon } from "@sanity/icons/Video";
import { createElement } from "react";
import { defineArrayMember, defineField, defineType } from "sanity";
import { tituloDeArchivo } from "@/lib/pistas";
import { idYoutube, miniaturaYoutube } from "@/lib/youtube";
import { campoFecha, campoFoto, campoOrden } from "./campos";

/*
 * Música en el Studio, pensada para que publicar sea arrastrar y soltar:
 *
 * - Una canción suelta: «Canción» → arrastrar el MP3 → Publicar.
 * - Un disco: «Disco» → arrastrar todos los MP3 a la vez → Publicar.
 * - Un video: «Video» → pegar el enlace de YouTube → Publicar.
 *
 * Los títulos salen solos (del nombre del archivo o de YouTube) y se pueden
 * cambiar si hace falta. Los videos no se suben al Studio sino a YouTube:
 * pesan demasiado para el plan gratuito y YouTube los sirve mejor.
 */

const enlaces = defineField({
  name: "enlaces",
  title: "Escuchar también en",
  type: "object",
  description: "Opcional. Pegá el enlace en las plataformas donde esté.",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "spotify", title: "Spotify", type: "url" }),
    defineField({ name: "youtube", title: "YouTube", type: "url" }),
    defineField({ name: "appleMusic", title: "Apple Music", type: "url" }),
    defineField({ name: "deezer", title: "Deezer", type: "url" }),
  ],
});

/** Sencillo: una canción que no es parte de un disco. */
export const cancion = defineType({
  name: "cancion",
  icon: PlayIcon,
  title: "Canción",
  type: "document",
  fields: [
    defineField({
      name: "audio",
      title: "Archivo de la canción",
      type: "file",
      description: "Arrastrá aquí el MP3 (o tocá «Subir»).",
      options: { accept: "audio/*" },
      validation: (r) => r.required().assetRequired(),
    }),
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      description: "Si lo dejás vacío se usa el nombre del archivo.",
    }),
    campoFoto("portada", "Carátula", "Opcional. Cuadrada, de al menos 1000 × 1000 px."),
    campoFecha("Fecha de lanzamiento"),
    defineField({ name: "letra", title: "Letra", type: "text", rows: 14, description: "Opcional." }),
    enlaces,
  ],
  orderings: [{ title: "Más recientes", name: "fechaDesc", by: [{ field: "fecha", direction: "desc" }] }],
  preview: {
    select: { titulo: "titulo", archivo: "audio.asset.originalFilename", fecha: "fecha", media: "portada" },
    prepare: ({ titulo, archivo, fecha, media }) => ({
      title: titulo || tituloDeArchivo(archivo) || "Canción sin archivo",
      subtitle: ["Canción", fecha?.slice(0, 4)].filter(Boolean).join(" · "),
      media,
    }),
  },
});

/** Álbum o EP, con sus canciones para escuchar en el sitio. */
export const album = defineType({
  name: "album",
  title: "Disco",
  type: "document",
  fields: [
    defineField({ name: "titulo", title: "Nombre del disco", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "canciones",
      title: "Canciones",
      type: "array",
      description:
        "Arrastrá aquí todos los MP3 del disco a la vez. El título de cada una sale del nombre del archivo (tocala para cambiarlo o agregar la letra). Arrastralas para ordenarlas.",
      of: [
        defineArrayMember({
          type: "file",
          name: "pista",
          title: "Canción",
          options: { accept: "audio/*" },
          fields: [
            defineField({ name: "titulo", title: "Título", type: "string", description: "Si lo dejás vacío se usa el nombre del archivo." }),
            defineField({ name: "letra", title: "Letra", type: "text", rows: 14 }),
          ],
          preview: {
            select: { titulo: "titulo", archivo: "asset.originalFilename", letra: "letra" },
            prepare: ({ titulo, archivo, letra }) => ({
              title: titulo || tituloDeArchivo(archivo) || "Canción sin archivo",
              subtitle: letra ? "con letra" : undefined,
            }),
          },
        }),
      ],
      validation: (r) => r.min(1).error("Agregá al menos una canción."),
    }),
    campoFoto("portada", "Carátula", "Cuadrada idealmente, de al menos 1000 × 1000 px."),
    defineField({
      name: "anio",
      title: "Año",
      type: "number",
      initialValue: () => new Date().getFullYear(),
      validation: (r) => r.required().min(1950).max(2100),
    }),
    defineField({
      name: "tipo",
      title: "Tipo",
      type: "string",
      options: {
        list: [
          { title: "Álbum", value: "album" },
          { title: "EP", value: "ep" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "album",
    }),
    defineField({ name: "genero", title: "Género", type: "string", description: "Ej: Rock" }),
    defineField({ name: "descripcion", title: "Descripción", type: "text", rows: 4 }),
    enlaces,
    campoOrden,
  ],
  orderings: [{ title: "Más recientes", name: "anioDesc", by: [{ field: "anio", direction: "desc" }] }],
  preview: {
    select: { title: "titulo", anio: "anio", tipo: "tipo", media: "portada", canciones: "canciones" },
    prepare: ({ title, anio, tipo, media, canciones }) => ({
      title,
      subtitle: [tipo === "ep" ? "EP" : "Álbum", anio, canciones?.length ? `${canciones.length} canciones` : null]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});

/** Video de YouTube: basta con pegar el enlace. */
export const video = defineType({
  name: "video",
  icon: VideoIcon,
  title: "Video",
  type: "document",
  fields: [
    defineField({
      name: "url",
      title: "Enlace de YouTube",
      type: "url",
      description: "Copiá la dirección del video en YouTube (o tocá «Compartir» → «Copiar») y pegala aquí.",
      validation: (r) =>
        r.required().custom((v?: string) => (!v || idYoutube(v) ? true : "Ese enlace no parece de un video de YouTube.")),
    }),
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      description: "Si lo dejás vacío se usa el que tiene en YouTube.",
    }),
    campoFecha(),
    defineField({ name: "descripcion", title: "Descripción", type: "text", rows: 2, description: "Opcional." }),
  ],
  orderings: [{ title: "Más recientes", name: "fechaDesc", by: [{ field: "fecha", direction: "desc" }] }],
  preview: {
    select: { titulo: "titulo", url: "url", fecha: "fecha" },
    prepare: ({ titulo, url, fecha }) => {
      const id = idYoutube(url);
      return {
        title: titulo || (id ? "Video de YouTube" : "Video sin enlace"),
        subtitle: fecha,
        media: id
          ? createElement("img", { src: miniaturaYoutube(id), alt: "", style: { width: "100%", height: "100%", objectFit: "cover" } })
          : undefined,
      };
    },
  },
});

/** Fecha de concierto o presentación. */
export const evento = defineType({
  name: "evento",
  icon: CalendarIcon,
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
