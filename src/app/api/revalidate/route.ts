import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity llama a esta ruta cada vez que alguien publica en el Studio.
 *
 * Cada consulta del sitio está etiquetada con el tipo de documento que lee
 * ("album", "texto", "portada"…): basta invalidar la etiqueta del documento
 * publicado para que las páginas que lo muestran se regeneren en la próxima
 * visita.
 *
 * La firma se verifica con SANITY_REVALIDATE_SECRET: sin ella cualquiera
 * podría forzar regeneraciones en bucle.
 */
export async function POST(req: NextRequest) {
  const secreto = process.env.SANITY_REVALIDATE_SECRET;
  if (!secreto) {
    return NextResponse.json({ error: "Falta SANITY_REVALIDATE_SECRET" }, { status: 500 });
  }

  try {
    // El `true` espera a que el cambio esté disponible para lectura antes de invalidar.
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secreto, true);
    if (!isValidSignature) return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
    if (!body?._type) return NextResponse.json({ error: "Falta _type" }, { status: 400 });

    // expire: 0 → la próxima visita ya trae el contenido nuevo.
    revalidateTag(body._type, { expire: 0 });
    return NextResponse.json({ revalidado: body._type });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
