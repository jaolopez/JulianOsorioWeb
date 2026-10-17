"use client";

import { useState } from "react";
import { useReproductor } from "@/components/audio/Reproductor";
import { Play } from "@/components/ui/Iconos";

/**
 * Video de YouTube que no carga nada de YouTube hasta que se toca: sólo la
 * miniatura. Así la página sigue liviana aunque tenga muchos videos. Al darle
 * play se pausa la música del sitio para que no suenen las dos cosas.
 */
export default function VideoYoutube({ id, titulo }: { id: string; titulo: string }) {
  const [activo, setActivo] = useState(false);
  const { sonando, alternar } = useReproductor();

  return (
    <div className="group relative aspect-video overflow-hidden rounded-sm bg-noche-3">
      {activo ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          data-cursor="Play"
          onClick={() => {
            if (sonando) alternar();
            setActivo(true);
          }}
          className="absolute inset-0 size-full"
          aria-label={`Ver «${titulo}»`}
        >
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="size-full object-cover opacity-80 transition-[scale,opacity] duration-1000 ease-[var(--ease-expo)] group-hover:scale-105 group-hover:opacity-100"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-noche/80 to-transparent" />
          <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brasa text-noche transition-transform duration-500 group-hover:scale-110">
            <Play className="size-6 translate-x-0.5" />
          </span>
        </button>
      )}
    </div>
  );
}
