import express from "express";
import cors from "cors";
import helmetImport from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import {
  OPENAPI_JSON_PATH,
  SWAGGER_UI_PATH,
  buildOpenApiSpec,
  createSwaggerUiHandlers,
} from "./config/swagger.js";
import { apiRouter } from "./routes/index.js";
import { notFound } from "./middlewares/notFound.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

export function createApp(): express.Application {
  const app = express();
  const helmetFactory =
    (helmetImport as unknown as {
      default?: (options?: Record<string, unknown>) => express.RequestHandler;
    }).default ??
    (helmetImport as unknown as (
      options?: Record<string, unknown>,
    ) => express.RequestHandler);
  const openApiSpec = buildOpenApiSpec();
  const normalizeOrigin = (value: string): string =>
    value.trim().replace(/\/+$/, "").toLowerCase();
  const fromEnv = (value: string | undefined): string[] =>
    (value ?? "")
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

  const allowedOrigins = new Set(
    [
      ...fromEnv(process.env.FRONTEND_URL),
      ...fromEnv(process.env.REACT_APP_URL),
      // Liste des origines autorisées pour CORS :
      // - http://localhost:5173 et http://127.0.0.1:5173 : développement local (Vite front-end)
      // - http://localhost:3000 et http://127.0.0.1:3000 : développement local (React ou autres apps front-end)
      // - http://127.0.0.1:4000 et http://localhost:4000 : accès API en local sur différents ports
      // - https://neo-ga.vercel.app : déploiement de l'application front-end en production sur Vercel
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:4000",
      "https://neo-ga.vercel.app",
      "http://localhost:4000",
    ].map(normalizeOrigin),
  );
  const localDevOriginRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

  app.use(
    helmetFactory({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }),
  );
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) {
          callback(null, true);
          return;
        }
        const normalized = normalizeOrigin(origin);
        if (
          allowedOrigins.has(normalized) ||
          (env.isDev && localDevOriginRegex.test(normalized))
        ) {
          callback(null, true);
          return;
        }
        callback(new Error(`CORS: origine non autorisee (${origin})`));
      },
    }),
  );
  app.use(express.json());
  if (env.isDev) {
    app.use(morgan("dev"));
  }

  app.get(OPENAPI_JSON_PATH, (_req, res) => {
    res.json(openApiSpec);
  });

  app.use(SWAGGER_UI_PATH, ...createSwaggerUiHandlers(openApiSpec));

  app.use("/api/v1", apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
