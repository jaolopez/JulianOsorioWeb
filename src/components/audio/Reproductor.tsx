"use client";

import { createContext, use, useEffect, useRef, useState } from "react";
import type { Foto } from "@/lib/tipos";
import { bus, conectarAnalizador, detenerLectura, iniciarLectura } from "./bus";

export type Pista = {
  titulo: string;
  audio: string;
  album?: string;
  albumSlug?: string;
  portada?: Foto;
};

type Estado = {
  cola: Pista[];
  indice: number;
  sonando: boolean;
  /** Pista en curso, o null si todavía no se ha reproducido nada. */
  actual: Pista | null;
  /** Elemento <audio>, para quien necesite leer el tiempo en cada cuadro. */
  audio: React.RefObject<HTMLAudioElement | null>;
  reproducir: (cola: Pista[], indice?: number) => void;
  alternar: () => void;
  siguiente: () => void;
  anterior: () => void;
  buscar: (fraccion: number) => void;
};

const Contexto = createContext<Estado | null>(null);

export function useReproductor() {
  const ctx = use(Contexto);
  if (!ctx) throw new Error("useReproductor fuera de <ReproductorProvider>");
  return ctx;
}

/**
 * Reproductor del sitio. Vive en el layout, así que la música sigue sonando
 * mientras se navega de una página a otra.
 */
export function ReproductorProvider({ children }: { children: React.ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [cola, setCola] = useState<Pista[]>([]);
  const [indice, setIndice] = useState(0);
  const [sonando, setSonando] = useState(false);
  const actual = cola[indice] ?? null;

  const tocar = async () => {
    const el = audio.current;
    if (!el) return;
    conectarAnalizador(el);
    try {
      await el.play();
    } catch {
      setSonando(false);
    }
  };

  const reproducir = (nueva: Pista[], i = 0) => {
    const el = audio.current;
    if (!el || !nueva[i]) return;
    // Misma pista: funciona como play/pausa.
    if (actual && nueva[i].audio === actual.audio) {
      if (el.paused) void tocar();
      else el.pause();
      return;
    }
    setCola(nueva);
    setIndice(i);
    el.src = nueva[i].audio;
    void tocar();
  };

  const irA = (i: number) => {
    const el = audio.current;
    if (!el || !cola.length) return;
    const n = (i + cola.length) % cola.length;
    setIndice(n);
    el.src = cola[n].audio;
    void tocar();
  };

  const alternar = () => {
    const el = audio.current;
    if (!el || !actual) return;
    if (el.paused) void tocar();
    else el.pause();
  };

  const siguiente = () => irA(indice + 1);
  const anterior = () => {
    const el = audio.current;
    // Como en cualquier reproductor: si ya avanzó, «anterior» vuelve al inicio.
    if (el && el.currentTime > 3) el.currentTime = 0;
    else irA(indice - 1);
  };

  const buscar = (fraccion: number) => {
    const el = audio.current;
    if (el && Number.isFinite(el.duration)) el.currentTime = fraccion * el.duration;
  };

  // Controles del sistema: pantalla de bloqueo, auriculares, teclas multimedia.
  useEffect(() => {
    if (!("mediaSession" in navigator) || !actual) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: actual.titulo,
      artist: "Julián Osorio",
      album: actual.album ?? "",
      artwork: actual.portada
        ? [{ src: new URL(actual.portada.src, location.origin).href, sizes: "512x512" }]
        : [],
    });
    navigator.mediaSession.setActionHandler("play", alternar);
    navigator.mediaSession.setActionHandler("pause", alternar);
    navigator.mediaSession.setActionHandler("nexttrack", siguiente);
    navigator.mediaSession.setActionHandler("previoustrack", anterior);
  });

  return (
    <Contexto value={{ cola, indice, sonando, actual, audio, reproducir, alternar, siguiente, anterior, buscar }}>
      {children}
      <audio
        ref={audio}
        crossOrigin="anonymous"
        preload="none"
        onPlay={() => {
          setSonando(true);
          bus.sonando = true;
          iniciarLectura();
        }}
        onPause={() => {
          setSonando(false);
          bus.sonando = false;
          detenerLectura();
        }}
        onEnded={() => {
          if (indice < cola.length - 1) irA(indice + 1);
        }}
      />
    </Contexto>
  );
}
