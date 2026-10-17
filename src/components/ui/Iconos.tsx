import type { SVGProps } from "react";

/** Íconos dibujados a mano en la misma retícula (24 px, trazo 1.5). */

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

export const Play = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 4.5v15l12.5-7.5L7 4.5Z" fill="currentColor" stroke="none" />
  </svg>
);

export const Pausa = (p: P) => (
  <svg {...base(p)}>
    <rect x="6" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none" />
    <rect x="14" y="4.5" width="4" height="15" rx="1" fill="currentColor" stroke="none" />
  </svg>
);

export const Siguiente = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 5.5v13L15 12 5 5.5Z" fill="currentColor" stroke="none" />
    <path d="M18.5 5.5v13" strokeWidth={2} />
  </svg>
);

export const Anterior = (p: P) => (
  <svg {...base(p)}>
    <path d="M19 5.5v13L9 12l10-6.5Z" fill="currentColor" stroke="none" />
    <path d="M5.5 5.5v13" strokeWidth={2} />
  </svg>
);

export const Flecha = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const FlechaDiagonal = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const Cerrar = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const Instagram = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
  </svg>
);

export const Spotify = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M7.5 9.6c3-1 6.6-.7 9.2.8M8 12.6c2.5-.7 5.3-.4 7.4.8M8.6 15.4c2-.5 4-.3 5.6.6" />
  </svg>
);

export const YouTube = (p: P) => (
  <svg {...base(p)}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
    <path d="M10.5 9.5v5l4.3-2.5-4.3-2.5Z" fill="currentColor" stroke="none" />
  </svg>
);

export const AppleMusic = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 18V6.5l10-2V16" />
    <circle cx="6.8" cy="18" r="2.2" />
    <circle cx="16.8" cy="16" r="2.2" />
  </svg>
);

export const TikTok = (p: P) => (
  <svg {...base(p)}>
    <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5M14 4c.4 2.4 2.2 4.2 4.5 4.5" />
  </svg>
);

export const Facebook = (p: P) => (
  <svg {...base(p)}>
    <path d="M14.5 8H17V4.5h-2.5C12.6 4.5 11 6.1 11 8v2.5H8.5V14H11v6h3.5v-6H17l.5-3.5h-3V8.5c0-.3.2-.5.5-.5Z" />
  </svg>
);

export const WhatsApp = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 19.5l1.2-3.6A8 8 0 1 1 8.4 18.6L4.5 19.5Z" />
    <path d="M9.2 8.8c.2-.5.5-.6.8-.6h.4c.2 0 .3.1.4.3l.6 1.4c.1.2 0 .4-.1.5l-.4.5c.5 1 1.3 1.8 2.3 2.3l.5-.4c.2-.1.4-.2.5-.1l1.4.6c.2.1.3.2.3.4v.4c0 .3-.1.6-.6.8-.6.3-1.4.3-2.4-.2a7.6 7.6 0 0 1-3.6-3.6c-.5-1-.5-1.8-.2-2.3Z" fill="currentColor" stroke="none" />
  </svg>
);

export const Correo = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);
