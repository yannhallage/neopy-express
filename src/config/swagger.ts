import path from "node:path";
import { fileURLToPath } from "node:url";
import swaggerJsdoc from "swagger-jsdoc";
import type { RequestHandler } from "express";
import swaggerUi from "swagger-ui-express";
import { openApiDefinition } from "./openapi.definition.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Extension des fichiers sources annotés (alignée sur l’exécution : `tsx` → `.ts`, `node dist/` → `.js`). */
function annotatedSourcesExt(): "ts" | "js" {
  return import.meta.url.endsWith(".ts") ? "ts" : "js";
}

/** URL de l’interface Swagger UI. */
export const SWAGGER_UI_PATH = "/api-docs";

/** URL du document OpenAPI (JSON). */
export const OPENAPI_JSON_PATH = "/api-docs.json";

function apiDocGlobs(): string[] {
  const ext = annotatedSourcesExt();
  const routesGlob = path.join(__dirname, "..", "routes", `**/*.${ext}`);
  const metaFile = path.join(__dirname, "..", "docs", `swagger.meta.${ext}`);
  return [routesGlob, metaFile].map((p) => p.replaceAll("\\", "/"));
}

/** Spécification OpenAPI complète (définition + annotations sur les routes). */
export function buildOpenApiSpec(): Record<string, unknown> {
  return swaggerJsdoc({
    definition: openApiDefinition,
    failOnErrors: false,
    apis: apiDocGlobs(),
  }) as Record<string, unknown>;
}

/** Options passées à `swaggerUi.setup`. */
export const swaggerUiSetupOptions = {
  customSiteTitle: "Documentation API",
} as const;

/** Middlewares Express pour servir Swagger UI (`serve` + `setup`). */
export function createSwaggerUiHandlers(
  openApiSpec: Record<string, unknown>,
): RequestHandler[] {
  return [
    ...swaggerUi.serve,
    swaggerUi.setup(openApiSpec, swaggerUiSetupOptions),
  ];
}
