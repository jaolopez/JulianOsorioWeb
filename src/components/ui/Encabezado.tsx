/**
 * Encabezado de las páginas internas: rótulo con número, titular gigante que
 * entra letra por letra y una bajada. Un halo del tono de la sección asoma
 * desde arriba.
 */
export default function Encabezado({
  rotulo,
  titulo,
  cursiva,
  bajada,
  tono = "var(--color-brasa)",
  children,
}: {
  rotulo: string;
  titulo: string;
  /** Segunda línea del titular, en cursiva y con el tono de la sección. */
  cursiva?: string;
  bajada?: string;
  tono?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative isolate overflow-hidden pt-[calc(var(--barra)+4rem)] pb-14 md:pt-[calc(var(--barra)+7rem)] md:pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[60vh] w-[120vw] -translate-x-1/2 -translate-y-1/2 rounded-[50%] opacity-30 blur-[120px]"
        style={{ background: tono }}
      />
      <div className="contenedor">
        <p data-aparecer className="kicker flex items-center gap-3 text-ceniza">
          <span className="block h-px w-8" style={{ background: tono }} />
          {rotulo}
        </p>
        <h1 className="display mt-8 text-[clamp(3.75rem,13vw,13rem)]">
          <span data-letras="ya" className="block">
            {titulo}
          </span>
          {cursiva && (
            <span data-letras="ya" data-retraso="0.25" className="block pl-[8vw] italic" style={{ color: tono }}>
              {cursiva}
            </span>
          )}
        </h1>
        {(bajada || children) && (
          <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-12">
            {bajada && (
              <p data-aparecer className="max-w-xl text-pretty text-[1.0625rem] leading-relaxed text-ceniza md:col-span-6 md:col-start-7">
                {bajada}
              </p>
            )}
            {children}
          </div>
        )}
      </div>
    </header>
  );
}
