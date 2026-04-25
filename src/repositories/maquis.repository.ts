import type { Maquis } from "../models/maquis.model.js";
import { prisma } from "../lib/prisma.js";
import { rethrowPrisma } from "../utils/prismaErrors.js";

function toDomain(row: {
  id: string;
  nom: string;
  description: string | null;
  adresse: string;
  ville: string | null;
  telephone: string | null;
  imageUrl: string | null;
  ouvert: boolean;
  proprietaireId: string;
  createdAt: Date;
  updatedAt: Date;
}): Maquis {
  return {
    id: row.id,
    nom: row.nom,
    description: row.description,
    adresse: row.adresse,
    ville: row.ville,
    telephone: row.telephone,
    imageUrl: row.imageUrl,
    ouvert: row.ouvert,
    proprietaireId: row.proprietaireId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export const maquisRepository = {
  async findAll(): Promise<Maquis[]> {
    const rows = await prisma.maquis.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map(toDomain);
  },

  async findByProprietaireId(proprietaireId: string): Promise<Maquis[]> {
    const rows = await prisma.maquis.findMany({
      where: { proprietaireId },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toDomain);
  },

  async findById(id: string): Promise<Maquis | null> {
    const row = await prisma.maquis.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  },

  async findIdsByProprietaireId(proprietaireId: string): Promise<string[]> {
    const rows = await prisma.maquis.findMany({
      where: { proprietaireId },
      select: { id: true },
    });
    return rows.map((row) => row.id);
  },

  async create(data: {
    nom: string;
    description?: string | null;
    adresse: string;
    ville?: string | null;
    telephone?: string | null;
    imageUrl?: string | null;
    ouvert?: boolean;
    proprietaireId: string;
  }): Promise<Maquis> {
    try {
      const row = await prisma.maquis.create({
        data: {
          nom: data.nom,
          adresse: data.adresse,
          proprietaireId: data.proprietaireId,
          ...(data.description !== undefined && { description: data.description }),
          ...(data.ville !== undefined && { ville: data.ville }),
          ...(data.telephone !== undefined && { telephone: data.telephone }),
          ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
          ...(data.ouvert !== undefined && { ouvert: data.ouvert }),
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
      adresse: string;
      ville: string | null;
      telephone: string | null;
      imageUrl: string | null;
      ouvert: boolean;
      proprietaireId: string;
    }>,
  ): Promise<Maquis> {
    try {
      const row = await prisma.maquis.update({
        where: { id },
        data: {
          ...(data.nom !== undefined && { nom: data.nom }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.adresse !== undefined && { adresse: data.adresse }),
          ...(data.ville !== undefined && { ville: data.ville }),
          ...(data.telephone !== undefined && { telephone: data.telephone }),
          ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
          ...(data.ouvert !== undefined && { ouvert: data.ouvert }),
          ...(data.proprietaireId !== undefined && {
            proprietaireId: data.proprietaireId,
          }),
        },
      });
      return toDomain(row);
    } catch (e) {
      rethrowPrisma(e);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await prisma.maquis.delete({ where: { id } });
    } catch (e) {
      rethrowPrisma(e);
    }
  },
};
