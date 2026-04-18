import { prisma } from "../lib/prisma.js";

/**
 * Connexion Prisma (Neon / PostgreSQL).
 * Les chaînes `DATABASE_URL` et `DIRECT_URL` viennent du tableau Neon.
 */
export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
}

/** Vérifie que la base répond (requête minimale après connexion). */
export async function verifyDatabase(): Promise<void> {
  await prisma.$queryRaw`SELECT 1`;
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
