import { HttpError } from "../types/errors.js";
import { platsRepository } from "../repositories/plats.repository.js";
import { maquisRepository } from "../repositories/maquis.repository.js";
import { usersRepository } from "../repositories/users.repository.js";

export const platsService = {
  async list(maquisId?: string) {
    return platsRepository.findAll({ maquisId });
  },

  async listAll() {
    return platsRepository.findAll();
  },

  async listByUser(userId: string) {
    const user = await usersRepository.findById(userId);
    if (!user) throw new HttpError(404, "Utilisateur introuvable");

    const maquisIds = await maquisRepository.findIdsByProprietaireId(userId);
    if (maquisIds.length === 0) return [];
    return platsRepository.findAll({ maquisIds });
  },

  async getById(id: string) {
    const p = await platsRepository.findById(id);
    if (!p) throw new HttpError(404, "Plat introuvable");
    return p;
  },

  async create(data: {
    maquisId: string;
    nom: string;
    description?: string | null;
    prix: number | string;
    imageUrl?: string | null;
    disponible?: boolean;
    supplements?: string[];
  }) {
    const maquis = await maquisRepository.findById(data.maquisId);
    if (!maquis) throw new HttpError(404, "Maquis introuvable");
    return platsRepository.create(data);
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
      supplements: string[];
    }>,
  ) {
    await this.getById(id);
    if (data.maquisId) {
      const maquis = await maquisRepository.findById(data.maquisId);
      if (!maquis) throw new HttpError(404, "Maquis introuvable");
    }
    return platsRepository.update(id, data);
  },

  async remove(id: string) {
    await this.getById(id);
    return platsRepository.delete(id);
  },
};
