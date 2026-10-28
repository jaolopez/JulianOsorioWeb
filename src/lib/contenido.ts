import type { PortableTextBlock } from "next-sanity";
import type {
  Acerca,
  Ajustes,
  Album,
  Evento,
  Experiencia,
  Foto,
  Galeria,
  Portada,
  Texto,
  Video,
} from "./tipos";

/**
 * Contenido de respaldo.
 *
 * Es lo que se muestra mientras no hay proyecto de Sanity conectado, y es lo
 * que `scripts/cargar-contenido.ts` sube al Studio la primera vez. Sale del
 * sitio anterior: el disco «Infinito más cercano» con sus tres canciones, las
 * frases de cada sección y las fotos que estaban publicadas.
 *
 * Los textos de la sección Escritura marcados con `muestra: true` son de
 * relleno para ver el diseño y NO se suben a Sanity: Julián publica los suyos.
 */

const foto = (src: string, ancho: number, alto: number, alt: string, pie?: string): Foto => ({
  src,
  ancho,
  alto,
  alt,
  pie,
});

/** Párrafos sueltos → texto enriquecido, para tener la misma forma que Sanity. */
export function parrafos(...textos: string[]): PortableTextBlock[] {
  return textos.map((texto, i) => ({
    _type: "block",
    _key: `p${i}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `s${i}`, text: texto, marks: [] }],
  }));
}

export const FOTOS = {
  escenario: foto("/img/musica/julian-escenario.png", 700, 415, "Julián Osorio cantando con su guitarra"),
  infinito: foto("/img/musica/julian-infinito.jpg", 554, 354, "Julián Osorio cantando frente al micrófono"),
  caratula: foto("/img/musica/infinito-portada.png", 328, 257, "Carátula de «Infinito más cercano»"),
  concierto: foto("/img/musica/concierto.avif", 1200, 900, "Luces sobre el público en un concierto"),
  cuaderno: foto("/img/escritura/portada.avif", 1200, 901, "Cuaderno de notas y lápiz sobre la mesa"),
  rostro: foto("/img/escritura/lotte-meijer.jpg", 1600, 2262, "Rostro en blanco y negro"),
  ventana: foto("/img/escritura/marina-khrapova.jpg", 1600, 2400, "Silueta frente a una ventana redonda"),
  luz: foto("/img/escritura/tal-heres.jpg", 1600, 2400, "Mujer mirando hacia la luz"),
  mano: foto("/img/escritura/jairo-alzate.jpg", 1600, 2378, "Mano iluminada en la oscuridad"),
  sombrero: foto("/img/escritura/piron-guillaume.jpg", 1600, 1600, "Retrato con sombrero en penumbra"),
  retrato: foto("/img/escritura/peter-sjo.jpg", 1600, 2400, "Retrato en blanco y negro"),
  camara: foto("/img/foto/portada.avif", 1200, 800, "Cámara suspendida en el aire en un bosque"),
  cangrejo: foto("/img/foto/cangrejo.jpg", 800, 518, "Cangrejo naranja sobre la arena"),
  cangrejoRojo: foto("/img/foto/cangrejo-rojo.jpg", 1600, 1200, "Cangrejo rojo de cerca"),
  luna: foto("/img/foto/luna-sobre-el-mar.jpg", 1600, 966, "Reflejo de la luna sobre el mar de noche"),
  abeja: foto("/img/foto/abeja.jpg", 1600, 800, "Abeja entre flores amarillas"),
  medellin: foto("/img/foto/medellin-noche.jpg", 700, 450, "Medellín iluminada de noche"),
  tranvia: foto("/img/foto/tranvia.jpg", 930, 827, "Tranvía de Ayacucho en Medellín"),
  comuna13: foto("/img/foto/comuna-13.jpg", 755, 425, "Casas de colores y escaleras eléctricas de la Comuna 13"),
  mesa: foto("/img/gastro/portada.jpg", 1200, 960, "Croissants recién horneados sobre pizarra"),
};

export const AJUSTES: Ajustes = {
  ciudad: "Medellín, Colombia",
  redes: {},
  descripcion:
    "Julián Osorio, artista. Música, escritura, fotografía y gastronomía: un universo creativo hecho de guitarras, palabras, luz y mesa compartida.",
};

export const PORTADA: Portada = {
  titular: "Universo creativo",
  bajada: "Música, palabra, luz y mesa. Cuatro maneras de contar lo mismo.",
  manifiesto:
    "Las guitarras, las letras, las melodías. La palabra que se escribe en prosa y en verso. Una imagen que compromete la visual. Una mesa con amigos, algunos tragos y buena música. Todo nace del mismo lugar.",
  destacado: { tipo: "album", slug: "infinito-mas-cercano" },
  textoSlug: "lo-que-queda",
  mundos: [
    {
      clave: "musica",
      frase:
        "Las guitarras, las letras, las melodías y todos esos elementos que se suman para seguir haciendo eso que estremece al ser humano al ser escuchado.",
      foto: FOTOS.escenario,
    },
    {
      clave: "escritura",
      frase: "Desde la palabra que se escribe en prosa, en verso, que fecunda la mente y trae los significados.",
      foto: FOTOS.cuaderno,
    },
    {
      clave: "fotografia",
      frase: "Una imagen que compromete la visual, un momento que se queda en la memoria.",
      foto: FOTOS.luna,
    },
    {
      clave: "gastronomia",
      frase:
        "Desde la cocina y #experienciasoneto se han creado espacios para compartir entre amigos, algunos tragos y buena música.",
      foto: FOTOS.mesa,
    },
  ],
};

export const ALBUMES: Album[] = [
  {
    slug: "infinito-mas-cercano",
    titulo: "Infinito más cercano",
    tipo: "album",
    anio: 2017,
    genero: "Rock",
    portada: FOTOS.caratula,
    descripcion:
      "Canciones escritas y compuestas por Julián Osorio. Guitarras, letras y melodías que se suman para estremecer al ser escuchadas.",
    canciones: [
      { titulo: "Infinito más cerca", audio: "/audio/01-infinito-mas-cerca.mp3", duracion: "3:49" },
      { titulo: "¿Por qué no más en ti?", audio: "/audio/02-por-que-no-mas-en-ti.mp3", duracion: "4:18" },
      { titulo: "Separación seis", audio: "/audio/03-separacion-seis.mp3", duracion: "3:59" },
    ],
    enlaces: {},
  },
];

/** Canciones sueltas: las sube Julián desde el Studio. */
export const SENCILLOS: Album[] = [];

export const VIDEOS: Video[] = [];

export const EVENTOS: Evento[] = [];

export const TEXTOS: (Texto & { muestra?: boolean })[] = [
  {
    slug: "lo-que-queda",
    titulo: "Lo que queda",
    tipo: "poema",
    fecha: "2026-06-02",
    muestra: true,
    extracto: "Queda la cuerda que todavía vibra",
    imagen: FOTOS.luz,
    cuerpo: `Queda la cuerda que todavía vibra
cuando la canción ya se fue,
queda el eco en la madera,
la huella tibia del acorde.

Queda la mesa con sus copas,
la risa que nadie anotó,
el humo lento de la cocina
y una ventana abierta al sol.

Queda la foto que no tomé
porque estaba mirando,
y la palabra justa
que llegó tarde, pero llegó.`,
  },
  {
    slug: "separacion",
    titulo: "Separación",
    tipo: "poema",
    fecha: "2026-05-20",
    muestra: true,
    extracto: "Seis cuerdas y una distancia",
    imagen: FOTOS.ventana,
    cuerpo: `Seis cuerdas y una distancia.
Entre la primera y la última
cabe todo lo que no dijimos.

Afino despacio,
como quien vuelve a una casa
donde ya no vive nadie
y todavía suena.`,
  },
  {
    slug: "cuaderno-de-noche",
    titulo: "Cuaderno de noche",
    tipo: "prosa",
    fecha: "2026-04-11",
    muestra: true,
    extracto: "Escribo de noche porque de día las palabras tienen prisa",
    imagen: FOTOS.mano,
    cuerpo: `Escribo de noche porque de día las palabras tienen prisa. A esta hora se sientan, se quitan los zapatos, me cuentan de dónde vienen.

Hay palabras que llegan desde una canción, otras desde un plato que alguien cocinó con paciencia, otras desde una foto que se quedó mirando más de la cuenta.

Las anoto todas. Algunas serán verso; otras, apenas una línea al margen. Ninguna se pierde del todo.`,
  },
];

export const GALERIAS: Galeria[] = [
  {
    slug: "medellin",
    titulo: "Medellín",
    fecha: "2026-06-02",
    lugar: "Medellín, Colombia",
    descripcion: "La ciudad de noche, sus rieles y sus colores.",
    portada: FOTOS.medellin,
    fotos: [FOTOS.medellin, FOTOS.tranvia, FOTOS.comuna13],
  },
  {
    slug: "orillas",
    titulo: "Orillas",
    fecha: "2026-06-01",
    descripcion: "El mar de noche y los que caminan de lado.",
    portada: FOTOS.luna,
    fotos: [FOTOS.luna, FOTOS.cangrejoRojo, FOTOS.cangrejo],
  },
  {
    slug: "pequenos-mundos",
    titulo: "Pequeños mundos",
    fecha: "2026-05-28",
    descripcion: "Lo que pasa cuando uno se acerca lo suficiente.",
    portada: FOTOS.abeja,
    fotos: [FOTOS.abeja, FOTOS.cangrejo, FOTOS.camara],
  },
];

export const EXPERIENCIAS: Experiencia[] = [
  {
    slug: "experiencias-oneto",
    titulo: "#experienciasoneto",
    fecha: "2026-06-02",
    descripcion:
      "Desde la cocina y #experienciasoneto se han creado espacios para compartir entre amigos, algunos tragos y buena música.",
    menu: [],
    portada: FOTOS.mesa,
    fotos: [FOTOS.mesa],
  },
];

export const ACERCA: Acerca = {
  retrato: FOTOS.infinito,
  intro: "Guitarras, palabras, luz y mesa compartida.",
  bio: parrafos(
    "Julián Osorio es músico y compositor. Su trabajo se mueve entre cuatro mundos —la música, la escritura, la fotografía y la cocina— que para él son uno solo: la forma de contar lo que estremece.",
    "En la música escribe y compone sus propias canciones; en 2017 publicó «Infinito más cercano», un disco de rock hecho de guitarras, letras y melodías.",
    "En la escritura busca la palabra que fecunda la mente, en prosa y en verso. En la fotografía, el momento que se queda en la memoria. Y desde la cocina, con #experienciasoneto, arma espacios para compartir entre amigos, algunos tragos y buena música."
  ),
  hitos: [{ anio: "2017", texto: "Lanza «Infinito más cercano»" }],
};
