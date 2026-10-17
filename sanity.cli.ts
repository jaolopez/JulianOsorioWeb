import { defineCliConfig } from "sanity/cli";

/**
 * Línea de comandos de Sanity (`npx sanity ...`): cargar el contenido
 * inicial, exportar respaldos, administrar CORS, etc.
 */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
});
