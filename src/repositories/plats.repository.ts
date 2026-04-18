import type { Plat } from "../models/plat.model.js";
import { prisma } from "../lib/prisma.js";
import { rethrowPrisma } from "../utils/prismaErrors.js";
import type { Prisma } from "@prisma/client";

function toDomain(row: {
  id: string;
  maquisId: string;
  nom: string;
  description: string | null;
  prix: Prisma.Decimal;
  imageUrl: string | null;
  disponible: boolean;
  createdAt: Date;
  updatedAt: Date;
}): Plat {
  return {
    id: row.id,
    maquisId: row.maquisId,
    nom: row.nom,
    description: row.description,
    prix: row.prix.toString(),
    imageUrl: row.imageUrl,
    disponible: row.disponible,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export const platsRepository = {
  async findAll(maquisId?: string): Promise<Plat[]> {
    const rows = await prisma.plat.findMany({
      where: maquisId ? { maquisId } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toDomain);
  },

  async findById(id: string): Promise<Plat | null> {
    const row = await prisma.plat.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  },

  async findByIds(ids: string[]): Promise<Plat[]> {
    if (ids.length === 0) return [];
    const rows = await prisma.plat.findMany({
      where: { id: { in: ids } },
    });
    return rows.map(toDomain);
  },

  async create(data: {
    maquisId: string;
    nom: string;
    description?: string | null;
    prix: number | string;
    imageUrl?: string | null;
    disponible?: boolean;
  }): Promise<Plat> {
    try {
      const row = await prisma.plat.create({
        data: {
          maquisId: data.maquisId,
          nom: data.nom,
          prix: data.prix,
          ...(data.description !== undefined && { description: data.description }),
          ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
          ...(data.disponible !== undefined && { disponible: data.disponible }),
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
      nom: string;
      description: string | null;
      prix: number | string;
      imageUrl: string | null;
      disponible: boolean;
      maquisId: string;
    }>,
  ): Promise<Plat> {
    try {
      const row = await prisma.plat.update({
        where: { id },
        data: {
          ...(data.nom !== undefined && { nom: data.nom }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.prix !== undefined && { prix: data.prix }),
          ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
          ...(data.disponible !== undefined && { disponible: data.disponible }),
          ...(data.maquisId !== undefined && { maquisId: data.maquisId }),
        },
      });
      return toDomain(row);
    } catch (e) {
      rethrowPrisma(e);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await prisma.plat.delete({ where: { id } });
    } catch (e) {
      rethrowPrisma(e);
    }
  },
};
