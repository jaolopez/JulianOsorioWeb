"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { gsap, sinMovimiento, useGSAP } from "@/lib/gsap";
import { NAVEGACION } from "@/lib/mundos";
import type { Ajustes } from "@/lib/tipos";
import Redes from "./Redes";

const TONOS: Record<string, string> = {
  "/musica": "var(--color-brasa)",
  "/escritura": "var(--color-tinta)",
  "/fotografia": "var(--color-plata)",
  "/gastronomia": "var(--color-ambar)",
};

export default function Navegacion({ ajustes }: { ajustes: Ajustes }) {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);
  const [oculta, setOculta] = useState(false);
  const [solida, setSolida] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const boton = useRef<HTMLButtonElement>(null);
  const linea = useRef<gsap.core.Timeline>(null);

  const activo = (href: string) => ruta === href || ruta.startsWith(`${href}/`);

  // Se esconde al bajar y vuelve al subir: la pantalla del celular es chica.
  useEffect(() => {
    let previo = window.scrollY;
    const alScroll = () => {
      const y = window.scrollY;
      setSolida(y > 40);
      setOculta(y > 320 && y > previo + 2);
      if (y < previo - 2) setOculta(false);
      previo = y;
    };
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  // Telón del menú: un círculo que nace del botón y cubre la pantalla.
  useGSAP(
    () => {
      const el = panel.current;
      if (!el) return;
      const tl = gsap.timeline({ paused: true });
      tl.set(el, { visibility: "visible" })
        .fromTo(
          el,
          { clipPath: "circle(0% at calc(100% - 2.5rem) 2.25rem)" },
          { clipPath: "circle(150% at calc(100% - 2.5rem) 2.25rem)", duration: 1.1, ease: "telon" }
        )
        .from(el.querySelectorAll("[data-menu-enlace]"), { yPercent: 110, rotate: 3, duration: 1, stagger: 0.06 }, 0.35)
        .from(el.querySelectorAll("[data-menu-pie]"), { opacity: 0, y: 20, duration: 0.8, stagger: 0.08 }, 0.6);
      linea.current = tl;
    },
    { scope: panel }
  );

  useEffect(() => {
    const tl = linea.current;
    if (!tl) return;
    if (abierto) {
      window.__lenis?.stop();
      document.documentElement.style.overflow = "hidden";
      if (sinMovimiento()) tl.progress(1);
      else tl.timeScale(1).play();
    } else {
      window.__lenis?.start();
      document.documentElement.style.overflow = "";
      if (sinMovimiento()) tl.progress(0);
      else tl.timeScale(1.8).reverse();
    }
  }, [abierto]);

  // Al navegar se cierra solo. Escape también lo cierra.
  useEffect(() => setAbierto(false), [ruta]);
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[70] transition-[translate,background-color,backdrop-filter] duration-700 ease-[var(--ease-expo)] ${
          oculta && !abierto ? "-translate-y-full" : "translate-y-0"
        } ${solida && !abierto ? "bg-noche/60 backdrop-blur-xl" : ""}`}
      >
        <nav aria-label="Principal" className="contenedor flex h-[var(--barra)] items-center justify-between gap-6">
          <Link href="/" aria-label="Julián Osorio — inicio" className="relative z-10 text-hueso transition-opacity hover:opacity-70">
            <Logo className="h-[1.375rem] w-auto md:h-6" />
          </Link>

          <ul className="hidden items-center gap-7 lg:flex">
            {NAVEGACION.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={`group flex items-baseline gap-1.5 text-[0.8125rem] transition-colors ${activo(n.href) ? "text-hueso" : "text-ceniza hover:text-hueso"}`}
                >
                  <span className="kicker text-[0.5625rem] transition-colors" style={{ color: activo(n.href) ? TONOS[n.href] ?? "var(--color-brasa)" : undefined }}>
                    {n.numero}
                  </span>
                  <span className="enlace-linea pb-0.5">{n.nombre}</span>
                </Link>
              </li>
            ))}
          </ul>

          <button
            ref={boton}
            type="button"
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-movil"
            className="relative z-10 -mr-2 flex h-11 items-center gap-3 px-2 lg:hidden"
          >
            <span className="kicker text-hueso">{abierto ? "Cerrar" : "Menú"}</span>
            <span className="relative block h-3 w-6" aria-hidden>
              <span className={`absolute left-0 h-px w-full bg-hueso transition-transform duration-500 ease-[var(--ease-expo)] ${abierto ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-full bg-hueso transition-transform duration-500 ease-[var(--ease-expo)] ${abierto ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </nav>
      </header>

      <div
        ref={panel}
        id="menu-movil"
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        inert={!abierto}
        className="invisible fixed inset-0 z-[65] flex flex-col bg-noche-2 pt-[calc(var(--barra)+2rem)] lg:hidden"
      >
        <div className="pointer-events-none absolute -right-1/3 -top-1/4 size-[120vw] rounded-full bg-brasa/15 blur-[100px]" aria-hidden />
        <ul className="contenedor relative flex flex-1 flex-col justify-center gap-1">
          {NAVEGACION.map((n) => (
            <li key={n.href} className="overflow-hidden">
              <Link
                href={n.href}
                data-menu-enlace
                className="flex items-baseline gap-4 py-1"
                style={{ color: activo(n.href) ? TONOS[n.href] ?? "var(--color-brasa)" : undefined }}
              >
                <span className="kicker w-6 text-ceniza">{n.numero}</span>
                <span className="display text-[clamp(3rem,15vw,6rem)] italic">{n.nombre}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="contenedor relative flex flex-col gap-5 border-t border-linea py-6 pb-[calc(env(safe-area-inset-bottom)+6rem)]">
          {ajustes.correo && (
            <a data-menu-pie href={`mailto:${ajustes.correo}`} className="text-lg text-hueso">
              {ajustes.correo}
            </a>
          )}
          <div data-menu-pie>
            <Redes redes={ajustes.redes} conNombre />
          </div>
          <p data-menu-pie className="kicker text-humo">
            {ajustes.ciudad}
          </p>
        </div>
      </div>
    </>
  );
}
