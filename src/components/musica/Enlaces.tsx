import type { Album } from "@/lib/tipos";
import { AppleMusic, Spotify, YouTube } from "@/components/ui/Iconos";

const PLATAFORMAS = {
  spotify: { nombre: "Spotify", Icono: Spotify },
  youtube: { nombre: "YouTube", Icono: YouTube },
  appleMusic: { nombre: "Apple Music", Icono: AppleMusic },
  deezer: { nombre: "Deezer", Icono: null },
} as const;

/** «Escuchar en…»: sólo las plataformas que se cargaron en el Studio. */
export default function Enlaces({ enlaces }: { enlaces: Album["enlaces"] }) {
  const lista = (Object.keys(PLATAFORMAS) as (keyof typeof PLATAFORMAS)[]).filter((k) => enlaces[k]);
  if (!lista.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {lista.map((k) => {
        const { nombre, Icono } = PLATAFORMAS[k];
        return (
          <li key={k}>
            <a
              href={enlaces[k]}
              target="_blank"
              rel="noopener noreferrer"
              className="kicker flex items-center gap-2 rounded-full border border-linea px-4 py-2.5 text-ceniza transition-colors hover:border-hueso hover:text-hueso"
            >
              {Icono && <Icono className="size-4" />}
              {nombre}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
