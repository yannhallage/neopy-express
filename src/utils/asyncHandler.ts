import type { RequestHandler } from "express";

/**
 * Enveloppe un handler async pour que les erreurs soient transmises à next().
 */
export function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req, res, next) => {
    void Promise.resolve(fn(req, res, next)).catch(next);
  };
}
