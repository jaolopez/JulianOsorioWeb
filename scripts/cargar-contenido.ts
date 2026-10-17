/**
 * Carga el contenido inicial al Studio: el disco «Infinito más cercano» con
 * sus tres canciones, las fotos, las galerías, la experiencia gastronómica,
 * la portada, «Acerca de mí» y las dos primeras publicaciones de la bitácora.
 *
 * Los textos de muestra de Escritura NO se suben: los publica Julián.
 *
 * Uso (con la sesión de Sanity iniciada: `npx sanity login`):
 *
 *   npx sanity exec scripts/cargar-contenido.ts --with-user-token
 *
 * Se puede correr más de una vez: los documentos tienen id fijo y las fotos
 * no se duplican (Sanity reconoce el archivo por su contenido).
 */
import { createReadStream } from "node:fs";
import { basename, join } from "node:path";
import { getCliClient } from "sanity/cli";
import * as c from "../src/lib/contenido";
import type { Foto } from "../src/lib/tipos";

const client = getCliClient({ apiVersion: "2026-10-01" });
const PUBLICO = join(process.cwd(), "public");

const subidas = new Map<string, string>();

/** Sube un archivo de /public y devuelve el id del asset. */
async function subir(ruta: string, tipo: "image" | "file") {
  const ya = subidas.get(ruta);
  if (ya) return ya;
  const asset = await client.assets.upload(tipo, createReadStream(join(PUBLICO, ruta)), { filename: basename(ruta) });
  subidas.set(ruta, asset._id);
  console.log(`  ↑ ${ruta}`);
  return asset._id;
}

const clave = () => Math.random().toString(36).slice(2, 10);

async function imagen(f?: Foto, conClave = false) {
  if (!f) return undefined;
  return {
    _type: "image",
    ...(conClave ? { _key: clave() } : {}),
    asset: { _type: "reference", _ref: await subir(f.src, "image") },
    alt: f.alt,
    ...(f.pie ? { pie: f.pie } : {}),
  };
}

const slug = (s: string) => ({ _type: "slug", current: s });

async function main() {
  console.log("Cargando contenido en", client.config().projectId, "/", client.config().dataset);
  const tx = client.transaction();

  for (const a of c.ALBUMES) {
    tx.createOrReplace({
      _id: `album-${a.slug}`,
      _type: "album",
      titulo: a.titulo,
      slug: slug(a.slug),
      tipo: a.tipo,
      anio: a.anio,
      genero: a.genero,
      descripcion: a.descripcion,
      portada: await imagen(a.portada),
      canciones: await Promise.all(
        a.canciones.map(async (s) => ({
          _type: "cancion",
          _key: clave(),
          titulo: s.titulo,
          duracion: s.duracion,
          ...(s.audio ? { audio: { _type: "file", asset: { _type: "reference", _ref: await subir(s.audio, "file") } } } : {}),
        }))
      ),
      enlaces: a.enlaces,
    });
  }

  for (const g of c.GALERIAS) {
    tx.createOrReplace({
      _id: `galeria-${g.slug}`,
      _type: "galeria",
      titulo: g.titulo,
      slug: slug(g.slug),
      fecha: g.fecha,
      lugar: g.lugar,
      descripcion: g.descripcion,
      portada: await imagen(g.portada),
      fotos: await Promise.all(g.fotos.map((f) => imagen(f, true))),
    });
  }

  for (const e of c.EXPERIENCIAS) {
    tx.createOrReplace({
      _id: `experiencia-${e.slug}`,
      _type: "experiencia",
      titulo: e.titulo,
      slug: slug(e.slug),
      fecha: e.fecha,
      lugar: e.lugar,
      descripcion: e.descripcion,
      menu: e.menu,
      portada: await imagen(e.portada),
      fotos: await Promise.all(e.fotos.map((f) => imagen(f, true))),
    });
  }

  for (const p of c.PUBLICACIONES) {
    tx.createOrReplace({
      _id: `publicacion-${p.slug}`,
      _type: "publicacion",
      titulo: p.titulo,
      slug: slug(p.slug),
      fecha: p.fecha,
      mundo: p.mundo,
      extracto: p.extracto,
      portada: await imagen(p.portada),
      contenido: p.contenido,
    });
  }

  tx.createOrReplace({
    _id: "portada",
    _type: "portada",
    titular: c.PORTADA.titular,
    bajada: c.PORTADA.bajada,
    manifiesto: c.PORTADA.manifiesto,
    albumDestacado: { _type: "reference", _ref: `album-${c.PORTADA.albumSlug}` },
    mundos: await Promise.all(
      c.PORTADA.mundos.map(async (m) => ({ _type: "mundo", _key: m.clave, clave: m.clave, frase: m.frase, foto: await imagen(m.foto) }))
    ),
  });

  tx.createOrReplace({
    _id: "acerca",
    _type: "acerca",
    retrato: await imagen(c.ACERCA.retrato),
    intro: c.ACERCA.intro,
    bio: c.ACERCA.bio,
    hitos: c.ACERCA.hitos.map((h) => ({ _type: "hito", _key: clave(), ...h })),
  });

  tx.createOrReplace({
    _id: "ajustes",
    _type: "ajustes",
    ciudad: c.AJUSTES.ciudad,
    descripcion: c.AJUSTES.descripcion,
    redes: {},
  });

  const r = await tx.commit();
  console.log(`Listo: ${r.results.length} documentos publicados.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
