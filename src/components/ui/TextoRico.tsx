import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";

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
};

/** Texto enriquecido escrito en el Studio (la biografía): párrafos, citas y enlaces. */
export default function TextoRico({ value, className = "" }: { value?: PortableTextBlock[]; className?: string }) {
  if (!value?.length) return null;
  return (
    <div className={`prosa ${className}`}>
      <PortableText value={value} components={componentes} />
    </div>
  );
}
