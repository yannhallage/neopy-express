import { randomUUID } from "node:crypto";
import type { Filiere } from "../models/filiere.model.js";
import { prisma } from "../lib/prisma.js";
import { rethrowPrisma } from "../utils/prismaErrors.js";

function toDomain(row: {
  id: string;
  name: string;
  created_at: Date;
  profId: string;
}): Filiere {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at.toISOString(),
    profId: row.profId,
  };
}

export const filieresRepository = {
  async findAll(): Promise<Filiere[]> {
    const rows = await prisma.filiere.findMany({
      orderBy: { created_at: "desc" },
    });
    return rows.map(toDomain);
  },

  async findById(id: string): Promise<Filiere | null> {
    const row = await prisma.filiere.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  },

  async create(data: { name: string; profId: string }): Promise<Filiere> {
    try {
      const row = await prisma.filiere.create({
        data: {
          id: randomUUID(),
          name: data.name,
          profId: data.profId,
        },
      });
      return toDomain(row);
    } catch (e) {
      rethrowPrisma(e);
    }
  },

  async update(
    id: string,
    data: Partial<{ name: string; profId: string }>,
  ): Promise<Filiere> {
    try {
      const row = await prisma.filiere.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.profId !== undefined && { profId: data.profId }),
        },
      });
      return toDomain(row);
    } catch (e) {
      rethrowPrisma(e);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await prisma.filiere.delete({ where: { id } });
    } catch (e) {
      rethrowPrisma(e);
    }
  },
};
