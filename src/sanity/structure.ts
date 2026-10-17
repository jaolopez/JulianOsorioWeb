import type { StructureBuilder, StructureResolver } from "sanity/structure";

/**
 * Panel lateral del Studio, ordenado igual que el menú del sitio: quien edita
 * busca por el nombre que ve en la página y ahí encuentra lo que se cambia en
 * ella.
 *
 * Las piezas fijas (portada, acerca de mí, contacto) se abren directo en su
 * formulario: no tiene sentido una lista con un solo elemento ni dejar que
 * alguien cree un segundo por error.
 */

export const TIPOS_UNICOS = ["portada", "acerca", "ajustes"];

const unico = (S: StructureBuilder, titulo: string, tipo: string) =>
  S.listItem()
    .title(titulo)
    .id(tipo)
    .schemaType(tipo)
    .child(S.document().schemaType(tipo).documentId(tipo).title(titulo));

const lista = (S: StructureBuilder, tipo: string, titulo: string) =>
  S.documentTypeListItem(tipo).title(titulo);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Contenido del sitio")
    .items([
      unico(S, "Portada", "portada"),
      lista(S, "publicacion", "Bitácora · publicaciones"),
      S.divider(),
      S.listItem()
        .title("Música")
        .id("musica")
        .child(
          S.list()
            .title("Música")
            .items([
              lista(S, "album", "Álbumes y sencillos"),
              lista(S, "video", "Videos"),
              lista(S, "evento", "Agenda de fechas"),
            ])
        ),
      lista(S, "texto", "Escritura"),
      lista(S, "galeria", "Fotografía"),
      lista(S, "experiencia", "Gastronomía"),
      S.divider(),
      unico(S, "Acerca de mí", "acerca"),
      unico(S, "Contacto y redes", "ajustes"),
    ]);
