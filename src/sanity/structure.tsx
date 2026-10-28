import { BookIcon } from "@sanity/icons/Book";
import { CalendarIcon } from "@sanity/icons/Calendar";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { HomeIcon } from "@sanity/icons/Home";
import { ImagesIcon } from "@sanity/icons/Images";
import { LemonIcon } from "@sanity/icons/Lemon";
import { PlayIcon } from "@sanity/icons/Play";
import { UserIcon } from "@sanity/icons/User";
import { VideoIcon } from "@sanity/icons/Video";
import type { ComponentType } from "react";
import type { StructureBuilder, StructureResolver } from "sanity/structure";

/**
 * Panel lateral del Studio, ordenado como el sitio: el inicio y luego las
 * cuatro páginas. Todo en una sola lista, sin carpetas que abrir: quien edita
 * ve de un vistazo dónde va cada cosa.
 *
 * Las piezas fijas (inicio, acerca de mí, contacto) se abren directo en su
 * formulario: no tiene sentido una lista con un solo elemento ni dejar que
 * alguien cree un segundo por error.
 */

export const TIPOS_UNICOS = ["portada", "acerca", "ajustes"];

type Icono = ComponentType;

const unico = (S: StructureBuilder, titulo: string, tipo: string, icono: Icono) =>
  S.listItem()
    .title(titulo)
    .id(tipo)
    .icon(icono)
    .schemaType(tipo)
    .child(S.document().schemaType(tipo).documentId(tipo).title(titulo));

const lista = (S: StructureBuilder, tipo: string, titulo: string, icono: Icono) =>
  S.documentTypeListItem(tipo).title(titulo).icon(icono);

/** Ícono de disco: el de la librería no trae uno. */
const DiscoIcon: Icono = () => (
  <svg viewBox="0 0 25 25" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth={1.2}>
    <circle cx="12.5" cy="12.5" r="8" />
    <circle cx="12.5" cy="12.5" r="2.2" />
  </svg>
);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido del sitio")
    .items([
      S.divider().title("Inicio"),
      unico(S, "Portada", "portada", HomeIcon),
      unico(S, "Acerca de mí", "acerca", UserIcon),

      S.divider().title("Música"),
      lista(S, "cancion", "Canciones", PlayIcon),
      lista(S, "album", "Discos", DiscoIcon),
      lista(S, "video", "Videos", VideoIcon),
      lista(S, "evento", "Fechas de conciertos", CalendarIcon),

      S.divider().title("Escritura · Fotografía · Gastronomía"),
      lista(S, "texto", "Textos y poemas", BookIcon),
      lista(S, "galeria", "Galerías de fotos", ImagesIcon),
      lista(S, "experiencia", "Experiencias gastronómicas", LemonIcon),

      S.divider(),
      unico(S, "Contacto y redes", "ajustes", EnvelopeIcon),
    ]);
