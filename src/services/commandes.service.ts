import { Prisma, type MoyenDePaiement, type StatutCommande } from "@prisma/client";
import { HttpError } from "../types/errors.js";
import { commandesRepository } from "../repositories/commandes.repository.js";
import { usersRepository } from "../repositories/users.repository.js";
import { maquisRepository } from "../repositories/maquis.repository.js";
import { platsRepository } from "../repositories/plats.repository.js";
import type { CreateCommandeBody } from "../validators/commandes.validator.js";

export const commandesService = {
  async listAll() {
    return commandesRepository.findAll({});
  },

  async listByUser(userId: string) {
    const user = await usersRepository.findById(userId);
    if (!user) throw new HttpError(404, "Utilisateur introuvable");
    return commandesRepository.findAll({ userId });
  },

  async list(
    filters: { userId?: string; maquisId?: string; maquisIds?: string[] },
    requester: { id: string; role: "CLIENT" | "GERANT" | "ADMIN" },
  ) {
    if (requester.role === "ADMIN") {
      return commandesRepository.findAll(filters);
    }

    if (requester.role === "CLIENT") {
      return commandesRepository.findAll({
        userId: requester.id,
        maquisId: filters.maquisId,
      });
    }

    const maquisIds = await maquisRepository.findIdsByProprietaireId(requester.id);
    if (maquisIds.length === 0) return [];

    if (filters.maquisId && !maquisIds.includes(filters.maquisId)) {
      throw new HttpError(403, "Accès interdit à ce maquis");
    }

    return commandesRepository.findAll({
      maquisIds: filters.maquisId ? [filters.maquisId] : maquisIds,
    });
  },

  async getById(id: string) {
    const c = await commandesRepository.findById(id);
    if (!c) throw new HttpError(404, "Commande introuvable");
    return c;
  },

  async create(body: CreateCommandeBody) {
    const user = await usersRepository.findById(body.userId);
    if (!user) throw new HttpError(404, "Utilisateur introuvable");

    const maquis = await maquisRepository.findById(body.maquisId);
    if (!maquis) throw new HttpError(404, "Maquis introuvable");
    if (!maquis.ouvert) {
      throw new HttpError(400, "Ce maquis n’accepte pas de commandes pour le moment");
    }

    if (body.lignes.length === 0) {
      throw new HttpError(400, "La commande doit contenir au moins une ligne");
    }

    const platIds = [...new Set(body.lignes.map((l) => l.platId))];
    const plats = await platsRepository.findByIds(platIds);
    if (plats.length !== platIds.length) {
      throw new HttpError(404, "Un ou plusieurs plats sont introuvables");
    }

    for (const p of plats) {
      if (p.maquisId !== body.maquisId) {
        throw new HttpError(400, "Tous les plats doivent appartenir au maquis choisi");
      }
      if (!p.disponible) {
        throw new HttpError(400, `Le plat « ${p.nom} » n’est pas disponible`);
      }
    }

    let montantTotal = new Prisma.Decimal(0);
    const lignes: Array<{
      platId: string;
      quantite: number;
      prixUnitaire: Prisma.Decimal;
    }> = [];

    for (const line of body.lignes) {
      const plat = plats.find((p) => p.id === line.platId)!;
      const prixUnitaire = new Prisma.Decimal(plat.prix);
      montantTotal = montantTotal.add(prixUnitaire.mul(line.quantite));
      lignes.push({
        platId: line.platId,
        quantite: line.quantite,
        prixUnitaire,
      });
    }

    return commandesRepository.createWithLignes({
      userId: body.userId,
      maquisId: body.maquisId,
      moyenPaiement: body.moyenPaiement ?? "ESPECES",
      commentaire: body.commentaire ?? null,
      montantTotal,
      lignes,
    });
  },

  async update(
    id: string,
    data: Partial<{
      statut: StatutCommande;
      commentaire: string | null;
      moyenPaiement: MoyenDePaiement;
    }>,
  ) {
    await this.getById(id);
    return commandesRepository.update(id, data);
  },

  async remove(id: string) {
    await this.getById(id);
    return commandesRepository.delete(id);
  },
};
