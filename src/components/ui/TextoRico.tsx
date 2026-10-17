import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";
import VideoYoutube from "@/components/musica/VideoYoutube";
import { idYoutube } from "@/sanity/queries";
import type { Foto as TFoto } from "@/lib/tipos";
import Foto from "./Foto";

/**
 * Sólo se enlazan destinos conocidos: un `javascript:` pegado desde un
 * correo ejecutaría código al hacer clic. En ese caso el texto queda sin enlace.
 */
const DESTINO_SEGURO = /^(https?:\/\/|mailto:|tel:|\/(?!\/))/i;

const componentes: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href.trim() : "";
      if (!DESTINO_SEGURO.test(href)) return <>{children}</>;
      const externo = /^https?:\/\//i.test(href);
      return (
        <a href={href} {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }: { value: TFoto }) =>
      value?.src ? (
        <figure className="!my-14">
          <div data-revelar className="relative overflow-hidden rounded-sm" style={{ aspectRatio: `${value.ancho} / ${value.alto}` }}>
            <Foto foto={value} fill sizes="(min-width: 768px) 48rem, 100vw" className="object-cover" />
          </div>
          {value.pie && <figcaption className="kicker mt-3 text-humo">{value.pie}</figcaption>}
        </figure>
      ) : null,
    youtube: ({ value }: { value: { url?: string } }) => {
      const id = idYoutube(value?.url);
      return id ? (
        <div className="!my-14">
          <VideoYoutube id={id} titulo="Video" />
        </div>
      ) : null;
    },
  },
};

/** Texto enriquecido escrito en el Studio: subtítulos, listas, enlaces, fotos y videos. */
export default function TextoRico({ value, className = "" }: { value?: PortableTextBlock[]; className?: string }) {
  if (!value?.length) return null;
  return (
    <div className={`prosa ${className}`}>
      <PortableText value={value} components={componentes} />
    </div>
  );
}
