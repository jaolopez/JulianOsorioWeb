import type { PortableTextBlock } from "next-sanity";

/**
 * Forma de los datos que usan las páginas, venga el contenido de Sanity o del
 * respaldo en código. Las consultas de `sanity/queries.ts` devuelven
 * exactamente esto, así los componentes no saben de dónde salió cada cosa.
 */

export type Foto = {
  src: string;
  ancho: number;
  alto: number;
  alt: string;
  /** Miniatura borrosa en base64 (Sanity la calcula al subir la foto). */
  lqip?: string;
  /** Punto de interés marcado en el Studio, de 0 a 1. */
  foco?: { x: number; y: number };
  pie?: string;
};

export type ClaveMundo = "musica" | "escritura" | "fotografia" | "gastronomia";

export type Redes = Partial<Record<"instagram" | "spotify" | "youtube" | "appleMusic" | "tiktok" | "facebook", string>>;

export type Ajustes = {
  correo?: string;
  whatsapp?: string;
  ciudad?: string;
  redes: Redes;
  descripcion: string;
};

export type MundoPortada = { clave: ClaveMundo; frase: string; foto?: Foto };

export type Portada = {
  titular: string;
  bajada: string;
  manifiesto: string;
  fotoManifiesto?: Foto;
  /** Disco o canción que suena desde el inicio (por su `slug`). */
  destacado?: { tipo: "album" | "cancion"; slug: string };
  textoSlug?: string;
  mundos: MundoPortada[];
};

export type Cancion = {
  titulo: string;
  audio?: string;
  duracion?: string;
  letra?: string;
  /** Carátula propia (canciones sueltas); si falta, la del disco. */
  portada?: Foto;
  /** Ancla dentro de /musica (canciones sueltas). */
  slug?: string;
};

/**
 * Disco con sus canciones. Una canción suelta también llega con esta forma
 * (`tipo: "sencillo"`, una sola canción), así se muestra y se escucha igual.
 */
export type Album = {
  slug: string;
  titulo: string;
  tipo: "album" | "ep" | "sencillo";
  anio: number;
  genero?: string;
  portada?: Foto;
  descripcion?: string;
  canciones: Cancion[];
  enlaces: Partial<Record<"spotify" | "youtube" | "appleMusic" | "deezer", string>>;
};

export type Video = { id: string; titulo: string; fecha: string; descripcion?: string };

export type Evento = {
  id: string;
  titulo: string;
  fecha: string;
  lugar?: string;
  ciudad?: string;
  enlace?: string;
};

export type Texto = {
  slug: string;
  titulo: string;
  tipo: "poema" | "prosa" | "relato";
  fecha: string;
  cuerpo: string;
  extracto: string;
  imagen?: Foto;
};

export type Galeria = {
  slug: string;
  titulo: string;
  fecha: string;
  lugar?: string;
  descripcion?: string;
  portada: Foto;
  fotos: Foto[];
};

export type Experiencia = {
  slug: string;
  titulo: string;
  fecha: string;
  lugar?: string;
  descripcion?: string;
  menu: string[];
  portada?: Foto;
  fotos: Foto[];
};

export type Acerca = {
  retrato?: Foto;
  intro: string;
  bio: PortableTextBlock[];
  hitos: { anio: string; texto: string }[];
};
