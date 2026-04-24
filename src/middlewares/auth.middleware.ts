import type { RequestHandler } from "express";
import { verifyAccessToken } from "../lib/jwt.js";
import { HttpError } from "../types/errors.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function bearerToken(authorization: string | undefined): string | null {
  if (!authorization) return null;
  const [type, token] = authorization.split(/\s+/);
  if (type?.toLowerCase() !== "bearer" || !token) return null;
  return token;
}

export const requireAuth: RequestHandler = asyncHandler(
  async (req, _res, next) => {
    const token = bearerToken(req.get("authorization"));
    if (!token) {
      throw new HttpError(401, "Authentification requise (Bearer token).");
    }
    const payload = await verifyAccessToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    next();
  },
);
