import type { Commande, LigneCommande } from "../models/commande.model.js";
import { prisma } from "../lib/prisma.js";
import { rethrowPrisma } from "../utils/prismaErrors.js";
import type {
  MoyenDePaiement,
  Prisma,
  StatutCommande,
} from "@prisma/client";

function mapLigne(row: {
  id: string;
  platId: string;
  quantite: number;
  prixUnitaire: Prisma.Decimal;
  plat?: { id: string; nom: string; maquisId: string };
}): LigneCommande {
  return {
    id: row.id,
    platId: row.platId,
    quantite: row.quantite,
    prixUnitaire: row.prixUnitaire.toString(),
    ...(row.plat && {
      plat: { id: row.plat.id, nom: row.plat.nom, maquisId: row.plat.maquisId },
    }),
  };
}

function mapCommande(row: {
  id: string;
  userId: string;
  maquisId: string;
  statut: StatutCommande;
  moyenPaiement: MoyenDePaiement;
  montantTotal: Prisma.Decimal;
  commentaire: string | null;
  createdAt: Date;
  updatedAt: Date;
  lignes: Array<{
    id: string;
    platId: string;
    quantite: number;
    prixUnitaire: Prisma.Decimal;
    plat?: { id: string; nom: string; maquisId: string };
  }>;
}): Commande {
  return {
    id: row.id,
    userId: row.userId,
    maquisId: row.maquisId,
    statut: row.statut,
    moyenPaiement: row.moyenPaiement,
    montantTotal: row.montantTotal.toString(),
    commentaire: row.commentaire,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    lignes: row.lignes.map(mapLigne),
  };
}

const commandeInclude = {
  lignes: {
    include: {
      plat: { select: { id: true, nom: true, maquisId: true } },
    },
    orderBy: { id: "asc" as const },
  },
} as const;

export const commandesRepository = {
  async findAll(filters: { userId?: string; maquisId?: string }): Promise<Commande[]> {
    const rows = await prisma.commande.findMany({
      where: {
        ...(filters.userId && { userId: filters.userId }),
        ...(filters.maquisId && { maquisId: filters.maquisId }),
      },
      include: commandeInclude,
      orderBy: { createdAt: "desc" },
    });
    return rows.map(mapCommande);
  },

  async findById(id: string): Promise<Commande | null> {
    const row = await prisma.commande.findUnique({
      where: { id },
      include: commandeInclude,
    });
    return row ? mapCommande(row) : null;
  },

  async createWithLignes(input: {
    userId: string;
    maquisId: string;
    moyenPaiement: MoyenDePaiement;
    commentaire?: string | null;
    montantTotal: Prisma.Decimal;
    lignes: Array<{
      platId: string;
      quantite: number;
      prixUnitaire: Prisma.Decimal;
    }>;
  }): Promise<Commande> {
    try {
      const row = await prisma.commande.create({
        data: {
          userId: input.userId,
          maquisId: input.maquisId,
          moyenPaiement: input.moyenPaiement,
          montantTotal: input.montantTotal,
          ...(input.commentaire !== undefined && { commentaire: input.commentaire }),
          lignes: {
            create: input.lignes.map((l) => ({
              platId: l.platId,
              quantite: l.quantite,
              prixUnitaire: l.prixUnitaire,
            })),
          },
        },
        include: commandeInclude,
      });
      return mapCommande(row);
    } catch (e) {
      rethrowPrisma(e);
    }
  },

  async update(
    id: string,
    data: Partial<{
      statut: StatutCommande;
      commentaire: string | null;
      moyenPaiement: MoyenDePaiement;
    }>,
  ): Promise<Commande> {
    try {
      const row = await prisma.commande.update({
        where: { id },
        data: {
          ...(data.statut !== undefined && { statut: data.statut }),
          ...(data.commentaire !== undefined && { commentaire: data.commentaire }),
          ...(data.moyenPaiement !== undefined && { moyenPaiement: data.moyenPaiement }),
        },
        include: commandeInclude,
      });
      return mapCommande(row);
    } catch (e) {
      rethrowPrisma(e);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await prisma.commande.delete({ where: { id } });
    } catch (e) {
      rethrowPrisma(e);
    }
  },
};
