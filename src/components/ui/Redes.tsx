import type { Redes as TRedes } from "@/lib/tipos";
import { AppleMusic, Facebook, Instagram, Spotify, TikTok, YouTube } from "./Iconos";

const RED = {
  instagram: { nombre: "Instagram", Icono: Instagram },
  spotify: { nombre: "Spotify", Icono: Spotify },
  youtube: { nombre: "YouTube", Icono: YouTube },
  appleMusic: { nombre: "Apple Music", Icono: AppleMusic },
  tiktok: { nombre: "TikTok", Icono: TikTok },
  facebook: { nombre: "Facebook", Icono: Facebook },
} as const;

/** Redes cargadas en el Studio. Las vacías no se muestran. */
export function listaRedes(redes: TRedes) {
  return (Object.keys(RED) as (keyof typeof RED)[])
    .filter((k) => redes[k])
    .map((k) => ({ clave: k, href: redes[k]!, ...RED[k] }));
}

export default function Redes({ redes, className = "", conNombre = false }: { redes: TRedes; className?: string; conNombre?: boolean }) {
  const lista = listaRedes(redes);
  if (!lista.length) return null;
  return (
    <ul className={`flex flex-wrap items-center gap-x-5 gap-y-3 ${className}`}>
      {lista.map(({ clave, href, nombre, Icono }) => (
        <li key={clave}>
          <a href={href} target="_blank" rel="noopener noreferrer" aria-label={nombre} className="flex items-center gap-2 text-ceniza transition-colors hover:text-hueso">
            <Icono className="size-5" />
            {conNombre && <span className="kicker">{nombre}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
