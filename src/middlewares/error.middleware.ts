import type { NextFunction, Request, Response } from "express";
import { MulterError } from "multer";
import { env } from "../config/env.js";
import { isHttpError } from "../types/errors.js";

function getStatusCode(err: unknown): number {
  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") return 413;
    return 400;
  }
  if (isHttpError(err)) return err.statusCode;
  if (
    typeof err === "object" &&
    err !== null &&
    "statusCode" in err &&
    typeof (err as { statusCode: unknown }).statusCode === "number"
  ) {
    return (err as { statusCode: number }).statusCode;
  }
  if (
    typeof err === "object" &&
    err !== null &&
    "status" in err &&
    typeof (err as { status: unknown }).status === "number"
  ) {
    return (err as { status: number }).status;
  }
  return 500;
}

function getMessage(err: unknown): string {
  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return "Image trop volumineuse (max. 5 Mo).";
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return "Champ fichier inattendu : utilisez le champ « image ».";
    }
    return err.message || "Erreur lors de l’upload du fichier.";
  }
  if (err instanceof Error) return err.message;
  return String(err);
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = getStatusCode(err);
  const rawMessage = getMessage(err);
  const message =
    statusCode === 500 && !env.isDev
      ? "Erreur interne du serveur"
      : rawMessage;

  if (env.isDev && statusCode === 500) {
    console.error(err);
  }

  const stack = err instanceof Error ? err.stack : undefined;

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.isDev && stack ? { stack } : {}),
  });
}
