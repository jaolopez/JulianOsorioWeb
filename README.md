# Julián Osorio — Universo creativo

Sitio de [julianosoriomusic.com](https://www.julianosoriomusic.com): música, escritura, fotografía y gastronomía, con un módulo de edición (Sanity Studio) en `/studio` para publicar sin tocar código.

Reemplaza al sitio anterior en WordPress. Las direcciones viejas (`/musica-portfolio`, `/poema-portfolio`, `/galerias`, `/gastronomia-albums`, `/acerca-de-mi`) redirigen a las nuevas.

## Tecnologías

| | |
| --- | --- |
| Framework | Next.js 16.4 (App Router, Turbopack, Cache Components + Partial Prerendering) |
| UI | React 19.3 (React Compiler en Rust, View Transitions), TypeScript |
| Estilos | Tailwind CSS 4 |
| Movimiento | GSAP 3.15 (ScrollTrigger, SplitText, CustomEase), Lenis, View Transitions API, animaciones CSS ligadas al scroll |
| Gráficos | Shader WebGL propio (humo de escenario) que reacciona al mouse y a la música |
| Audio | Web Audio API (analizador en vivo), Media Session API (controles en pantalla de bloqueo) |
| Contenido | Sanity Studio 6 embebido en `/studio`, **plan gratuito** |

## Desarrollo

```bash
npm install
cp .env.example .env.local   # completar con los datos de Sanity
npm run dev                  # http://localhost:3000
```

Sin `NEXT_PUBLIC_SANITY_PROJECT_ID` el sitio funciona igual con el contenido de respaldo de `src/lib/contenido.ts`.

## Conectar Sanity (una sola vez, plan gratuito)

El plan gratuito alcanza de sobra para este sitio y el cliente no paga nada: el Studio está configurado sin funciones de pago, y el sitio consulta a Sanity sólo al revalidar su caché (no en cada visita).

1. **Crear el proyecto**

   ```bash
   npx sanity login
   npx sanity projects create "Julián Osorio" --dataset production --dataset-visibility public
   # anota el projectId que imprime
   ```

2. **Variables de entorno**: en `.env.local` (y en Vercel → Settings → Environment Variables):

   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=<projectId>
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_REVALIDATE_SECRET=<cadena larga al azar>
   ```

3. **Permitir el Studio desde el sitio (CORS)**

   ```bash
   npx sanity cors add http://localhost:3000 --credentials
   npx sanity cors add https://www.julianosoriomusic.com --credentials
   ```

4. **Cargar el contenido inicial** (disco, canciones, fotos, galerías, portada, bitácora):

   ```bash
   npm run cargar-contenido
   ```

5. **Publicación instantánea (webhook)**: en [sanity.io/manage](https://www.sanity.io/manage) → API → Webhooks → *Create webhook*:
   - URL: `https://www.julianosoriomusic.com/api/revalidate`
   - Dataset: `production` · Trigger on: Create, Update, Delete
   - Projection: `{_type}`
   - Secret: el mismo `SANITY_REVALIDATE_SECRET`

   Sin webhook los cambios igual aparecen solos en menos de una hora.

6. **Invitar a Julián**: sanity.io/manage → Members → Invite (rol *Editor*). Entra a `/studio` con su correo de Google o con usuario y contraseña.

## Qué se edita desde `/studio`

- **Portada**: titular, bajada, manifiesto, álbum y texto destacados, foto y frase de cada mundo.
- **Bitácora**: publicaciones con texto, fotos y videos de YouTube.
- **Música**: álbumes y sencillos (carátula, canciones con su MP3 y letra, enlaces a plataformas), videos y agenda de fechas.
- **Escritura**: poemas, prosa y relatos. Se pegan tal cual; los renglones se respetan.
- **Fotografía**: galerías (se arrastran varias fotos a la vez).
- **Gastronomía**: experiencias #experienciasoneto con fotos y menú.
- **Acerca de mí** y **Contacto y redes** (correo, WhatsApp, Instagram, Spotify, YouTube…).

## Estructura

```
src/
  app/(sitio)/        páginas públicas (inicio, música, escritura, fotografía, gastronomía, bitácora, acerca)
  app/studio/         Sanity Studio
  app/api/revalidate  webhook de Sanity
  components/
    audio/            reproductor persistente, analizador y ecualizador
    inicio/           secciones de la portada (Hero con shader, manifiesto, mundos…)
    movimiento/       scroll suave, coreografía de animaciones, cursor, precarga
  lib/                tipos, contenido de respaldo, utilidades
  sanity/             esquemas del Studio, consultas y cliente
scripts/              carga del contenido inicial
```

### Animaciones por atributos

Las páginas son componentes de servidor; para animar algo basta marcarlo:

| Atributo | Efecto |
| --- | --- |
| `data-titular` | el texto sube línea por línea (con `="ya"`, al cargar) |
| `data-letras` | letra por letra, para titulares gigantes |
| `data-aparecer` | aparece subiendo al entrar en pantalla |
| `data-parallax="0.15"` | se desplaza más lento que el scroll |
| `data-palabras` | cada palabra se enciende al bajar |
| `data-revelar` | la imagen se descubre como un telón |
| `data-cursor="Ver"` | el cursor crece y muestra la palabra |

Todo respeta `prefers-reduced-motion`.

## Despliegue

Pensado para Vercel (plan Hobby): importar el repositorio, cargar las variables de entorno y desplegar. Las imágenes subidas al Studio las optimiza la CDN de Sanity, así que no consumen el cupo de optimización de Vercel.
