import { defineArrayMember, defineField, defineType } from "sanity";
import { campoFoto } from "./campos";

/** Datos generales: contacto, redes y textos para Google. */
export const ajustes = defineType({
  name: "ajustes",
  title: "Contacto y redes",
  type: "document",
  fields: [
    defineField({ name: "correo", title: "Correo de contacto", type: "string", validation: (r) => r.email() }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp",
      type: "string",
      description: "Con indicativo del país, sólo números. Ej: 573001234567",
      validation: (r) => r.regex(/^\d{8,15}$/, { name: "número" }),
    }),
    defineField({ name: "ciudad", title: "Ciudad", type: "string", initialValue: "Medellín, Colombia" }),
    defineField({
      name: "redes",
      title: "Redes y plataformas",
      type: "object",
      description: "Pegá la dirección completa de cada perfil. Las que queden vacías no se muestran.",
      options: { collapsible: false },
      fields: [
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
        defineField({ name: "spotify", title: "Spotify", type: "url" }),
        defineField({ name: "youtube", title: "YouTube", type: "url" }),
        defineField({ name: "appleMusic", title: "Apple Music", type: "url" }),
        defineField({ name: "tiktok", title: "TikTok", type: "url" }),
        defineField({ name: "facebook", title: "Facebook", type: "url" }),
      ],
    }),
    defineField({
      name: "descripcion",
      title: "Descripción para Google",
      type: "text",
      rows: 3,
      description: "Dos líneas que resumen el sitio. Es lo que aparece debajo del título en los buscadores.",
    }),
  ],
  preview: { prepare: () => ({ title: "Contacto y redes" }) },
});

/** Portada: lo primero que se ve al entrar. */
export const portada = defineType({
  name: "portada",
  title: "Portada",
  type: "document",
  fields: [
    defineField({
      name: "titular",
      title: "Frase bajo el nombre",
      type: "string",
      description: "Acompaña al nombre grande del inicio. Ej: «Universo creativo».",
      validation: (r) => r.max(40),
    }),
    defineField({
      name: "bajada",
      title: "Presentación corta",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "manifiesto",
      title: "Manifiesto",
      type: "text",
      rows: 4,
      description: "Párrafo que se ilumina palabra por palabra al bajar por la página.",
    }),
    defineField({
      name: "albumDestacado",
      title: "Música destacada",
      type: "reference",
      to: [{ type: "album" }, { type: "cancion" }],
      description: "El disco o la canción que suena desde la portada. Si queda vacío se usa el disco más reciente.",
    }),
    defineField({
      name: "textoDestacado",
      title: "Texto destacado",
      type: "reference",
      to: [{ type: "texto" }],
      description: "El poema o texto que se muestra en la portada.",
    }),
    defineField({
      name: "mundos",
      title: "Los cuatro mundos",
      type: "array",
      description: "Foto y frase de cada sección en las cuatro puertas del inicio. Deben ser cuatro, en el orden en que aparecen.",
      validation: (r) => r.max(4),
      of: [
        defineArrayMember({
          type: "object",
          name: "mundo",
          fields: [
            defineField({
              name: "clave",
              title: "Sección",
              type: "string",
              options: {
                list: [
                  { title: "Música", value: "musica" },
                  { title: "Escritura", value: "escritura" },
                  { title: "Fotografía", value: "fotografia" },
                  { title: "Gastronomía", value: "gastronomia" },
                ],
              },
              validation: (r) => r.required(),
            }),
            defineField({ name: "frase", title: "Frase", type: "text", rows: 2 }),
            campoFoto("foto", "Foto"),
          ],
          preview: { select: { title: "clave", subtitle: "frase", media: "foto" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Portada" }) },
});

/** «Acerca de mí»: la sección del inicio que cuenta quién es Julián. */
export const acerca = defineType({
  name: "acerca",
  title: "Acerca de mí",
  type: "document",
  fields: [
    campoFoto("retrato", "Retrato"),
    defineField({ name: "intro", title: "Frase de entrada", type: "text", rows: 2 }),
    defineField({
      name: "bio",
      title: "Biografía",
      type: "array",
      of: [{ type: "block", styles: [{ title: "Normal", value: "normal" }, { title: "Cita", value: "blockquote" }] }],
    }),
    defineField({
      name: "hitos",
      title: "Momentos",
      type: "array",
      description: "Línea de tiempo. Ej: 2017 — Lanzamiento de «Infinito más cercano».",
      of: [
        defineArrayMember({
          type: "object",
          name: "hito",
          fields: [
            defineField({ name: "anio", title: "Año", type: "string", validation: (r) => r.required() }),
            defineField({ name: "texto", title: "Qué pasó", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "anio", subtitle: "texto" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Acerca de mí" }) },
});
