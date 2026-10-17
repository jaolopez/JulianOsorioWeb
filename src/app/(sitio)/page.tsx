import Bitacora from "@/components/inicio/Bitacora";
import Hablemos from "@/components/inicio/Hablemos";
import Hero from "@/components/inicio/Hero";
import LuzDetenida from "@/components/inicio/LuzDetenida";
import Manifiesto from "@/components/inicio/Manifiesto";
import Mesa from "@/components/inicio/Mesa";
import Mundos from "@/components/inicio/Mundos";
import MusicaDestacada from "@/components/inicio/MusicaDestacada";
import PoemaDestacado from "@/components/inicio/PoemaDestacado";
import Escena from "@/components/movimiento/Escena";
import Agenda from "@/components/musica/Agenda";
import { FOTOS } from "@/lib/contenido";
import { pistasDe } from "@/lib/pistas";
import {
  getAjustes,
  getAlbumes,
  getExperiencias,
  getGalerias,
  getPortada,
  getProximosEventos,
  getPublicaciones,
  getTextos,
} from "@/sanity/queries";

export default async function Inicio() {
  const [portada, ajustes, albumes, textos, galerias, experiencias, publicaciones, eventos] = await Promise.all([
    getPortada(),
    getAjustes(),
    getAlbumes(),
    getTextos(),
    getGalerias(),
    getExperiencias(),
    getPublicaciones(),
    getProximosEventos(),
  ]);

  const album = albumes.find((a) => a.slug === portada.albumSlug) ?? albumes[0];
  const texto = textos.find((t) => t.slug === portada.textoSlug) ?? textos[0];
  const mesa = experiencias[0];
  const fraseMesa = portada.mundos.find((m) => m.clave === "gastronomia")?.frase ?? mesa?.descripcion ?? "";
  const fotoMusica = portada.mundos.find((m) => m.clave === "musica")?.foto;

  // Una tira con fotos de todas las galerías, alternando entre ellas y sin repetir.
  const vistas = new Set<string>();
  const tira = galerias
    .flatMap((g) => g.fotos.map((foto, i) => ({ foto, galeria: g.titulo, slug: g.slug, i })))
    .sort((a, b) => a.i - b.i)
    .filter(({ foto }) => !vistas.has(foto.src) && vistas.add(foto.src))
    .slice(0, 7);

  return (
    <main>
      <Hero
        titular={portada.titular}
        bajada={portada.bajada}
        ciudad={ajustes.ciudad}
        pistas={album ? pistasDe(album) : []}
        disco={album?.titulo}
      />
      <Manifiesto texto={portada.manifiesto} foto={fotoMusica ?? FOTOS.escenario} />
      <Mundos mundos={portada.mundos} />
      {album && <MusicaDestacada album={album} funda={fotoMusica} />}
      <Agenda eventos={eventos.slice(0, 4)} titulo="Próximas fechas" />
      {texto && <PoemaDestacado texto={texto} />}
      {tira.length > 0 && <LuzDetenida items={tira} />}
      {mesa && <Mesa experiencia={mesa} frase={fraseMesa} />}
      <Bitacora publicaciones={publicaciones} />
      <Hablemos ajustes={ajustes} />
      <Escena />
    </main>
  );
}
