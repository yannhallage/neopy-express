import { Prisma } from "@prisma/client";
import { HttpError } from "../types/errors.js";

export function rethrowPrisma(err: unknown): never {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      const target = (err.meta?.target as string[] | undefined)?.join(", ");
      throw new HttpError(
        409,
        target ? `Conflit d’unicité (${target})` : "Conflit d’unicité",
      );
    }
    if (err.code === "P2003") {
      throw new HttpError(
        400,
        "Référence invalide ou contrainte de clé étrangère non respectée",
      );
    }
    if (err.code === "P2025") {
      throw new HttpError(404, "Ressource introuvable");
    }
  }
  throw err;
}
