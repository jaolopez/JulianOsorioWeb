import Hablemos from "@/components/inicio/Hablemos";
import Hero from "@/components/inicio/Hero";
import LuzDetenida from "@/components/inicio/LuzDetenida";
import Manifiesto from "@/components/inicio/Manifiesto";
import Mesa from "@/components/inicio/Mesa";
import MusicaDestacada from "@/components/inicio/MusicaDestacada";
import PoemaDestacado from "@/components/inicio/PoemaDestacado";
import Quien from "@/components/inicio/Quien";
import Escena from "@/components/movimiento/Escena";
import Agenda from "@/components/musica/Agenda";
import { FOTOS } from "@/lib/contenido";
import { pistasDe } from "@/lib/pistas";
import {
  getAcerca,
  getAjustes,
  getAlbumes,
  getExperiencias,
  getGalerias,
  getPortada,
  getProximosEventos,
  getSencillos,
  getTextos,
} from "@/sanity/queries";

/**
 * El inicio es la casa de Julián: su nombre y las cuatro puertas arriba, y
 * al bajar, quién es y un adelanto de cada mundo.
 */
export default async function Inicio() {
  const [portada, ajustes, acerca, albumes, sencillos, textos, galerias, experiencias, eventos] = await Promise.all([
    getPortada(),
    getAjustes(),
    getAcerca(),
    getAlbumes(),
    getSencillos(),
    getTextos(),
    getGalerias(),
    getExperiencias(),
    getProximosEventos(),
  ]);

  // Lo que suena desde el inicio: lo elegido en el Studio, o el disco más reciente.
  const elegido = portada.destacado;
  const album =
    (elegido && (elegido.tipo === "cancion" ? sencillos : albumes).find((a) => a.slug === elegido.slug)) ??
    albumes[0] ??
    sencillos[0];
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
        mundos={portada.mundos}
        pistas={album ? pistasDe(album) : []}
        disco={album?.titulo}
      />
      <Manifiesto texto={portada.manifiesto} foto={FOTOS.concierto} />
      <Quien acerca={acerca} ajustes={ajustes} />
      {album && <MusicaDestacada album={album} funda={album.tipo === "sencillo" ? undefined : fotoMusica} />}
      <Agenda eventos={eventos.slice(0, 4)} titulo="Próximas fechas" />
      {texto && <PoemaDestacado texto={texto} />}
      {tira.length > 0 && <LuzDetenida items={tira} />}
      {mesa && <Mesa experiencia={mesa} frase={fraseMesa} />}
      <Hablemos ajustes={ajustes} />
      <Escena />
    </main>
  );
}
