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
      origin: true,
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
