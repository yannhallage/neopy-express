import { HttpError } from "../types/errors.js";
import { maquisRepository } from "../repositories/maquis.repository.js";
import { usersRepository } from "../repositories/users.repository.js";

export const maquisService = {
  async list() {
    return maquisRepository.findAll();
  },

  async getById(id: string) {
    const m = await maquisRepository.findById(id);
    if (!m) throw new HttpError(404, "Maquis introuvable");
    return m;
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
  }) {
    const owner = await usersRepository.findById(data.proprietaireId);
    if (!owner) throw new HttpError(404, "Propriétaire introuvable");
    return maquisRepository.create(data);
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
  ) {
    await this.getById(id);
    if (data.proprietaireId) {
      const owner = await usersRepository.findById(data.proprietaireId);
      if (!owner) throw new HttpError(404, "Propriétaire introuvable");
    }
    return maquisRepository.update(id, data);
  },

  async remove(id: string) {
    await this.getById(id);
    return maquisRepository.delete(id);
  },
};
