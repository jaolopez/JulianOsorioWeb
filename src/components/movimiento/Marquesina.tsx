/**
 * Cinta de texto que corre sin fin. Es sólo CSS: el contenido se duplica y
 * la pista se desplaza la mitad de su ancho en bucle, así el salto no se ve.
 */
export default function Marquesina({
  children,
  velocidad = 30,
  invertida = false,
  className = "",
}: {
  children: React.ReactNode;
  velocidad?: number;
  invertida?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex overflow-hidden whitespace-nowrap select-none ${className}`} aria-hidden>
      <div
        className="flex shrink-0 items-center"
        style={{ animation: `marquesina ${velocidad}s linear infinite`, animationDirection: invertida ? "reverse" : "normal" }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex shrink-0 items-center">
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
