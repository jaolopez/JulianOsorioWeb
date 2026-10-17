import Image, { type ImageLoader, type ImageProps } from "next/image";
import type { Foto as TFoto } from "@/lib/tipos";

/**
 * Las fotos subidas al Studio ya las redimensiona y convierte la CDN de
 * Sanity: se le piden directamente al ancho justo, sin pasar por el
 * optimizador de Next (que en el plan gratuito de Vercel tiene cupo).
 */
const cargadorSanity: ImageLoader = ({ src, width, quality }) =>
  `${src}?w=${width}&q=${quality ?? 75}&auto=format&fit=max`;

type Props = Omit<ImageProps, "src" | "alt" | "width" | "height" | "placeholder" | "blurDataURL"> & {
  foto: TFoto;
  alt?: string;
};

export default function Foto({ foto, alt, fill, style, ...props }: Props) {
  const deSanity = foto.src.startsWith("https://cdn.sanity.io/");
  const foco = foto.foco ? `${foto.foco.x * 100}% ${foto.foco.y * 100}%` : undefined;
  return (
    <Image
      src={foto.src}
      alt={alt ?? foto.alt}
      loader={deSanity ? cargadorSanity : undefined}
      {...(fill ? { fill: true } : { width: foto.ancho, height: foto.alto })}
      {...(foto.lqip ? { placeholder: "blur" as const, blurDataURL: foto.lqip } : {})}
      style={{ objectPosition: foco, ...style }}
      {...props}
    />
  );
}
