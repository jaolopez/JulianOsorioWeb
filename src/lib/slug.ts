/** "Infinito más cercano" → "infinito-mas-cercano". Tildes y ñ en una dirección se rompen al compartirla. */
export function slugificar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Le da a cada elemento un `slug` sacado de su título, para enlazarlo con
 * `#slug` dentro de su página. Así quien publica no tiene que inventar ni
 * generar direcciones: escribe el título y listo. Si dos títulos coinciden,
 * el segundo lleva «-2».
 */
export function conSlugs<T extends { titulo: string }>(lista: T[]): (T & { slug: string })[] {
  const usados = new Map<string, number>();
  return lista.map((x) => {
    const base = slugificar(x.titulo) || "sin-titulo";
    const n = (usados.get(base) ?? 0) + 1;
    usados.set(base, n);
    return { ...x, slug: n > 1 ? `${base}-${n}` : base };
  });
}
