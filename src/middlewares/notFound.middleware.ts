import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../types/errors.js";

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(
    new HttpError(
      404,
      `Route introuvable : ${req.method} ${req.originalUrl}`,
    ),
  );
}
