import { HttpError } from "../types/errors.js";
import { platsRepository } from "../repositories/plats.repository.js";
import { maquisRepository } from "../repositories/maquis.repository.js";

export const platsService = {
  async list(maquisId?: string) {
    return platsRepository.findAll(maquisId);
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
