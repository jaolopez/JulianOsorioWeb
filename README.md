# Julián Osorio — Universo creativo

Sitio de [julianosoriomusic.com](https://www.julianosoriomusic.com): música, escritura, fotografía y gastronomía, con un módulo de edición (Sanity Studio) en `/studio` para publicar sin tocar código.

Reemplaza al sitio anterior en WordPress y conserva su forma: **el inicio y cuatro páginas** —Música, Escritura, Fotografía y Gastronomía—. El inicio es la casa de Julián: su nombre, las cuatro puertas a sus mundos desde la primera pantalla, quién es y un adelanto de cada mundo. Cada disco, texto o galería vive dentro de su página y se enlaza con `#` (por ejemplo `/escritura#lo-que-queda` abre ese texto).

Las direcciones viejas (`/musica-portfolio`, `/poema-portfolio`, `/galerias`, `/gastronomia-albums`, `/acerca-de-mi`) redirigen a las nuevas.

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

4. **Cargar el contenido inicial** (disco, canciones, fotos, galerías, portada, acerca de mí):

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

## Cómo publicar desde `/studio`

El panel tiene el mismo orden que el sitio. Nada pide «dirección web» ni campos técnicos: se escribe el título y se publica.

| Para… | Ir a | Hacer |
| --- | --- | --- |
| Subir una canción | Música → **Canciones** → ✎ | Arrastrar el MP3 → **Publicar**. El título sale del nombre del archivo (se puede cambiar); carátula y letra son opcionales. |
| Subir un disco | Música → **Discos** → ✎ | Nombre del disco → arrastrar **todos los MP3 a la vez** sobre «Canciones» → carátula → **Publicar**. Se ordenan arrastrándolas. |
| Agregar un video | Música → **Videos** → ✎ | Pegar el enlace de YouTube → **Publicar**. El título se toma de YouTube si se deja vacío. |
| Anunciar un concierto | Música → **Fechas de conciertos** | Nombre, fecha y lugar. Las fechas pasadas desaparecen solas. |
| Publicar un poema o texto | **Textos y poemas** | Pegar el texto tal cual (los renglones se respetan). |
| Subir fotos | **Galerías de fotos** | Arrastrar varias fotos a la vez. |
| Gastronomía | **Experiencias gastronómicas** | Fotos, descripción y menú. |
| Cambiar el inicio | **Portada** / **Acerca de mí** | Frases, foto de cada puerta, música y texto destacados, biografía. |
| Correo y redes | **Contacto y redes** | Las que queden vacías no se muestran. |

Los videos van a YouTube y no al Studio a propósito: un video pesa cientos de MB y el plan gratuito de Sanity tiene cupo de archivos y de tráfico; YouTube los sirve gratis y mejor. Los MP3 (unos pocos MB cada uno) sí se suben al Studio.

La duración de cada canción no hay que escribirla: el sitio la lee del archivo.

## Estructura

```
src/
  app/(sitio)/        páginas públicas (inicio, música, escritura, fotografía, gastronomía)
  app/studio/         Sanity Studio
  app/api/revalidate  webhook de Sanity
  components/
    audio/            reproductor persistente, analizador y ecualizador
    inicio/           secciones del inicio (nombre y cuatro puertas sobre el shader, acerca de mí…)
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
| `data-cursor="Ver"` | una burbuja con la palabra acompaña al puntero |

Todo respeta `prefers-reduced-motion`.

### Fluidez

Las animaciones mueven sólo `transform`, `opacity` y `clip-path`, que la tarjeta de video resuelve sin volver a dibujar la página. Además:

- Sin `backdrop-filter` ni `filter: blur()` grandes: sobre el humo animado obligarían a recalcular el desenfoque en cada cuadro. Los halos son degradados.
- El shader del humo se dibuja a media resolución y a 60 cuadros como máximo, y se detiene fuera de pantalla.
- El puntero del sistema nunca se esconde (es el único que no llega tarde); la burbuja que lo acompaña duerme cuando no hay nada que mostrar.
- Los bucles de animación (ecualizador, progreso del reproductor) sólo corren mientras se ven o mientras suena algo.

## Despliegue

Pensado para Vercel (plan Hobby): importar el repositorio, cargar las variables de entorno y desplegar. Las imágenes subidas al Studio las optimiza la CDN de Sanity, así que no consumen el cupo de optimización de Vercel.
