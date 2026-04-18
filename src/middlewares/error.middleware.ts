import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { isHttpError } from "../types/errors.js";

function getStatusCode(err: unknown): number {
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
