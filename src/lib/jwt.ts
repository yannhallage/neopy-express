import type { Role } from "@prisma/client";
import * as jose from "jose";
import { env } from "../config/env.js";
import { HttpError } from "../types/errors.js";

const roles: Role[] = ["CLIENT", "GERANT", "ADMIN"];

function isRole(value: string): value is Role {
  return roles.includes(value as Role);
}

export async function signAccessToken(payload: {
  sub: string;
  email: string;
  role: Role;
}): Promise<string> {
  if (!env.jwtSecret) {
    throw new HttpError(500, "JWT_SECRET est requis en production.");
  }
  const secret = new TextEncoder().encode(env.jwtSecret);
  return new jose.SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(env.jwtExpiresIn)
    .sign(secret);
}

export async function verifyAccessToken(token: string): Promise<{
  sub: string;
  email: string;
  role: Role;
}> {
  if (!env.jwtSecret) {
    throw new HttpError(500, "JWT_SECRET est requis en production.");
  }
  const secret = new TextEncoder().encode(env.jwtSecret);
  try {
    const { payload } = await jose.jwtVerify(token, secret, {
      algorithms: ["HS256"],
    });
    const sub = payload.sub;
    const email = payload.email;
    const role = payload.role;
    if (
      typeof sub !== "string" ||
      typeof email !== "string" ||
      typeof role !== "string" ||
      !isRole(role)
    ) {
      throw new HttpError(401, "Token invalide.");
    }
    return { sub, email, role };
  } catch (e) {
    if (e instanceof HttpError) throw e;
    throw new HttpError(401, "Token invalide ou expiré.");
  }
}
