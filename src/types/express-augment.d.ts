import type { Role } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      /** Renseigné par le middleware `requireAuth` après validation du JWT. */
      user?: { id: string; email: string; role: Role };
    }
  }
}

export {};
