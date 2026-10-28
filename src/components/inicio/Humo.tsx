"use client";

import { useEffect, useRef } from "react";
import { bus } from "@/components/audio/bus";

/**
 * Fondo del inicio: humo de escenario atravesado por una luz cálida, como en
 * la carátula de «Infinito más cercano». Es un shader de fragmentos en WebGL
 * puro (sin librerías): ruido fractal deformado sobre sí mismo, que sigue al
 * puntero y respira con los graves de la canción que esté sonando.
 *
 * Se dibuja a resolución reducida —el humo es suave, no necesita píxeles—,
 * a 60 cuadros como máximo aunque la pantalla vaya a 120 (el humo no se ve
 * distinto y la tarjeta de video trabaja la mitad), con una capa menos de
 * ruido en celulares, y se detiene cuando sale de la pantalla o la pestaña
 * queda oculta.
 */

const VERTICES = `
attribute vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAGMENTOS = `
precision highp float;
uniform vec2 uRes;
uniform float uT;
uniform vec2 uMouse;
uniform float uAudio;
uniform float uGraves;
uniform float uEntrada;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float ruido(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 giro = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < OCTAVAS; i++) { v += a * ruido(p); p = giro * p * 2.03; a *= 0.5; }
  return v;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec2 m = (uMouse - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  float t = uT * 0.05;

  // El puntero empuja el humo como una mano en la niebla.
  vec2 haciaMouse = p - m;
  p += haciaMouse * 0.18 * exp(-dot(haciaMouse, haciaMouse) * 6.0);

  // Deformación de dominio: ruido dentro de ruido, que es lo que lo hace parecer humo.
  vec2 q = vec2(fbm(p * 1.5 + vec2(0.0, t)), fbm(p * 1.5 + vec2(5.2, -t * 0.8)));
  vec2 r = vec2(fbm(p * 1.3 + 3.2 * q + vec2(1.7, 9.2) + t * 0.6 + uGraves * 0.4),
                fbm(p * 1.3 + 3.2 * q + vec2(8.3, 2.8) - t * 0.5));
  float humo = fbm(p * 1.1 + 2.6 * r);

  // Luz de escenario: cae desde arriba a la derecha, como el foco de la carátula.
  vec2 foco = vec2(0.42 * uRes.x / uRes.y, 0.62);
  float luz = smoothstep(1.35, 0.0, length((p - foco) * vec2(0.9, 1.25)));
  luz += 0.55 * exp(-length(p - m) * 2.6);

  vec3 noche = vec3(0.043, 0.039, 0.035);
  vec3 violeta = vec3(0.22, 0.06, 0.2);
  vec3 brasa = vec3(1.0, 0.36, 0.12);
  vec3 ambar = vec3(1.0, 0.72, 0.38);

  float densidad = pow(humo, 2.2);
  vec3 col = noche;
  col = mix(col, violeta, clamp(r.y * r.y * 1.4, 0.0, 1.0) * 0.55);
  col = mix(col, brasa, clamp(densidad * luz * (1.6 + uGraves * 2.4 + uAudio), 0.0, 1.0));
  col = mix(col, ambar, clamp(pow(densidad * luz, 3.0) * (2.0 + uAudio * 3.0), 0.0, 0.85));

  // Viñeta, entrada desde negro y un poco de grano para que no haya bandas.
  vec2 uv = gl_FragCoord.xy / uRes;
  col *= smoothstep(1.25, 0.25, length(uv - vec2(0.55, 0.5)));
  col *= uEntrada;
  col += (hash(gl_FragCoord.xy + uT) - 0.5) * 0.025;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compilar(gl: WebGLRenderingContext, tipo: number, fuente: string) {
  const s = gl.createShader(tipo)!;
  gl.shaderSource(s, fuente);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(s));
    return null;
  }
  return s;
}

export default function Humo({ className = "" }: { className?: string }) {
  const lienzo = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = lienzo.current;
    const gl = c?.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!c || !gl) return;

    const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tactil = !window.matchMedia("(pointer: fine)").matches;

    const vs = compilar(gl, gl.VERTEX_SHADER, VERTICES);
    const fs = compilar(gl, gl.FRAGMENT_SHADER, `#define OCTAVAS ${tactil ? 4 : 5}\n${FRAGMENTOS}`);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Un triángulo que cubre toda la pantalla.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);

    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes"), uT = u("uT"), uMouse = u("uMouse"), uAudio = u("uAudio"), uGraves = u("uGraves"), uEntrada = u("uEntrada");

    // Menos píxeles en celulares: el humo se ve igual y la batería lo agradece.
    const escala = tactil ? 0.4 : 0.5;

    const medir = () => {
      c.width = Math.max(1, Math.round(c.clientWidth * escala));
      c.height = Math.max(1, Math.round(c.clientHeight * escala));
      gl.viewport(0, 0, c.width, c.height);
      gl.uniform2f(uRes, c.width, c.height);
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(c);

    const mouse = { x: 0.7, y: 0.6, tx: 0.7, ty: 0.6 };
    const mover = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = 1 - (e.clientY - r.top) / r.height;
    };
    window.addEventListener("pointermove", mover, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);

    let id = 0;
    let entrada = 0;
    let ultimo = 0;
    const inicio = performance.now();
    const cuadro = (ahora: number) => {
      id = requestAnimationFrame(cuadro);
      if (!visible || document.hidden) return;
      if (ahora - ultimo < 15) return;
      const dt = Math.min(4, (ahora - (ultimo || ahora - 16.7)) / 16.7);
      ultimo = ahora;
      const k = 1 - Math.pow(0.95, dt);
      mouse.x += (mouse.tx - mouse.x) * k;
      mouse.y += (mouse.ty - mouse.y) * k;
      entrada = Math.min(1, entrada + 0.012 * dt);
      gl.uniform1f(uT, quieto ? 12 : (ahora - inicio) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uAudio, bus.nivel);
      gl.uniform1f(uGraves, bus.graves);
      gl.uniform1f(uEntrada, quieto ? 1 : 1 - Math.pow(1 - entrada, 3));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    id = requestAnimationFrame(cuadro);

    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", mover);
      /* Se liberan los recursos pero no el contexto: el lienzo puede volver a
         montarse (React lo hace en desarrollo) y pediría el mismo contexto. */
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return <canvas ref={lienzo} aria-hidden className={`size-full ${className}`} />;
}
