/** "2026-10-17" → "17 de octubre de 2026". El mediodía evita que la zona horaria corra el día. */
export function fechaLarga(iso: string) {
  const d = iso.length === 10 ? new Date(`${iso}T12:00:00`) : new Date(iso);
  return d.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Bogota" });
}

/** "2026-10-17" → "17.10.26", para rótulos. */
export function fechaCorta(iso: string) {
  const [a, m, d] = iso.slice(0, 10).split("-");
  return `${d}.${m}.${a.slice(2)}`;
}

/** Partes de una fecha de evento, en hora de Colombia. */
export function partesEvento(iso: string) {
  const d = new Date(iso);
  const op = { timeZone: "America/Bogota" } as const;
  return {
    dia: d.toLocaleDateString("es-CO", { ...op, day: "2-digit" }),
    mes: d.toLocaleDateString("es-CO", { ...op, month: "short" }).replace(".", ""),
    anio: d.toLocaleDateString("es-CO", { ...op, year: "numeric" }),
    hora: d.toLocaleTimeString("es-CO", { ...op, hour: "numeric", minute: "2-digit" }),
  };
}
