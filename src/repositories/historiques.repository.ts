import { prisma } from "../lib/prisma.js";
import type { Historique } from "../models/historique.model.js";
import { rethrowPrisma } from "../utils/prismaErrors.js";

function toDomain(row: {
  id: string;
  userId: string | null;
  commandeId: string | null;
  maquisId: string | null;
  action: string;
  details: string | null;
  createdAt: Date;
}): Historique {
  return {
    id: row.id,
    userId: row.userId,
    commandeId: row.commandeId,
    maquisId: row.maquisId,
    action: row.action,
    details: row.details,
    createdAt: row.createdAt.toISOString(),
  };
}

export const historiquesRepository = {
  async findAll(filters: {
    userId?: string;
    commandeId?: string;
    maquisId?: string;
  }): Promise<Historique[]> {
    const rows = await prisma.historique.findMany({
      where: {
        ...(filters.userId && { userId: filters.userId }),
        ...(filters.commandeId && { commandeId: filters.commandeId }),
        ...(filters.maquisId && { maquisId: filters.maquisId }),
      },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toDomain);
  },

  async findById(id: string): Promise<Historique | null> {
    const row = await prisma.historique.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  },

  async create(data: {
    userId?: string | null;
    commandeId?: string | null;
    maquisId?: string | null;
    action: string;
    details?: string | null;
  }): Promise<Historique> {
    try {
      const row = await prisma.historique.create({
        data: {
          ...(data.userId !== undefined && { userId: data.userId }),
          ...(data.commandeId !== undefined && { commandeId: data.commandeId }),
          ...(data.maquisId !== undefined && { maquisId: data.maquisId }),
          action: data.action,
          ...(data.details !== undefined && { details: data.details }),
        },
      });
      return toDomain(row);
    } catch (e) {
      rethrowPrisma(e);
    }
  },

  async update(
    id: string,
    data: Partial<{
      userId: string | null;
      commandeId: string | null;
      maquisId: string | null;
      action: string;
      details: string | null;
    }>,
  ): Promise<Historique> {
    try {
      const row = await prisma.historique.update({
        where: { id },
        data: {
          ...(data.userId !== undefined && { userId: data.userId }),
          ...(data.commandeId !== undefined && { commandeId: data.commandeId }),
          ...(data.maquisId !== undefined && { maquisId: data.maquisId }),
          ...(data.action !== undefined && { action: data.action }),
          ...(data.details !== undefined && { details: data.details }),
        },
      });
      return toDomain(row);
    } catch (e) {
      rethrowPrisma(e);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await prisma.historique.delete({ where: { id } });
    } catch (e) {
      rethrowPrisma(e);
    }
  },
};
