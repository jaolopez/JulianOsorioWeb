"use client";

/**
 * Señal de audio compartida.
 *
 * El reproductor escribe aquí, en cada cuadro, el volumen y las frecuencias
 * de lo que suena; el shader del inicio y los visualizadores lo leen en su
 * propio bucle. Es un objeto mutable fuera de React a propósito: pasar 60
 * valores por segundo por estado re-renderizaría medio sitio.
 */
export const bus = {
  /** Volumen general suavizado, de 0 a 1. */
  nivel: 0,
  /** Graves (bombo, bajo), de 0 a 1. */
  graves: 0,
  /** Frecuencias crudas del analizador (0–255), o null si no hay análisis. */
  frecuencias: null as Uint8Array<ArrayBuffer> | null,
  sonando: false,
};

let contexto: AudioContext | null = null;
let analizador: AnalyserNode | null = null;
let conectado: HTMLAudioElement | null = null;
let bucle = 0;

/**
 * Conecta el elemento <audio> al analizador. Sólo puede hacerse tras un gesto
 * del usuario (los navegadores bloquean el audio automático), por eso se
 * llama al primer «play».
 */
export function conectarAnalizador(audio: HTMLAudioElement) {
  if (conectado === audio) {
    void contexto?.resume();
    return;
  }
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    contexto = new Ctx();
    analizador = contexto.createAnalyser();
    analizador.fftSize = 256;
    analizador.smoothingTimeConstant = 0.82;
    const fuente = contexto.createMediaElementSource(audio);
    fuente.connect(analizador);
    analizador.connect(contexto.destination);
    bus.frecuencias = new Uint8Array(analizador.frequencyBinCount);
    conectado = audio;
    void contexto.resume();
  } catch {
    // Sin Web Audio el sonido sigue saliendo; sólo se pierden las visuales.
    analizador = null;
  }
}

/** Lee el analizador en cada cuadro mientras suena y deja la señal en `bus`. */
export function iniciarLectura() {
  cancelAnimationFrame(bucle);
  const paso = () => {
    if (analizador && bus.frecuencias) {
      analizador.getByteFrequencyData(bus.frecuencias);
      const f = bus.frecuencias;
      let total = 0;
      let bajos = 0;
      for (let i = 0; i < f.length; i++) {
        total += f[i];
        if (i < 8) bajos += f[i];
      }
      const nivel = total / f.length / 255;
      const graves = bajos / 8 / 255;
      // Sube rápido y baja lento, como la aguja de un vúmetro.
      bus.nivel += (nivel - bus.nivel) * (nivel > bus.nivel ? 0.5 : 0.08);
      bus.graves += (graves - bus.graves) * (graves > bus.graves ? 0.6 : 0.1);
    }
    bucle = requestAnimationFrame(paso);
  };
  bucle = requestAnimationFrame(paso);
}

/** Al pausar, la señal se apaga suavemente en vez de cortarse. */
export function detenerLectura() {
  cancelAnimationFrame(bucle);
  const apagar = () => {
    bus.nivel *= 0.9;
    bus.graves *= 0.88;
    if (bus.nivel > 0.002) bucle = requestAnimationFrame(apagar);
    else bus.nivel = bus.graves = 0;
  };
  bucle = requestAnimationFrame(apagar);
}
