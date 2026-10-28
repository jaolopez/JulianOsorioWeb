/**
 * Un texto tal como se escribió en el Studio: cada renglón se respeta y un
 * renglón vacío separa estrofas (o párrafos, si es prosa).
 */
export function estrofas(cuerpo: string) {
  return cuerpo
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((e) => e.split("\n").map((l) => l.trimEnd()))
    .filter((e) => e.some((l) => l.trim()));
}

export default function Poema({
  cuerpo,
  prosa = false,
  animado = true,
  renglones = false,
  className = "",
}: {
  cuerpo: string;
  prosa?: boolean;
  /** Que la coreografía lo anime al bajar. */
  animado?: boolean;
  /** Marca cada estrofa o párrafo con `data-renglon`, para animarlos desde afuera. */
  renglones?: boolean;
  className?: string;
}) {
  const renglon = renglones ? "" : undefined;
  const bloques = estrofas(cuerpo);
  if (prosa) {
    return (
      <div className={`space-y-6 text-[clamp(1.125rem,0.5vw+1rem,1.375rem)] leading-[1.75] text-hueso/85 ${className}`}>
        {bloques.map((b, i) => (
          <p key={i} data-aparecer={animado ? "" : undefined} data-renglon={renglon} className="first-of-type:first-letter:float-left first-of-type:first-letter:mr-3 first-of-type:first-letter:font-display first-of-type:first-letter:text-[4.5em] first-of-type:first-letter:leading-[0.8] first-of-type:first-letter:text-[var(--tono)]">
            {b.join(" ")}
          </p>
        ))}
      </div>
    );
  }
  return (
    <div className={`space-y-[1.1em] font-display text-[clamp(1.6rem,2.8vw,2.6rem)] leading-[1.2] ${className}`}>
      {bloques.map((b, i) => (
        <p key={i} data-titular={animado ? "" : undefined} data-renglon={renglon}>
          {b.map((linea, j) => (
            <span key={j} className="block">
              {linea || " "}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
