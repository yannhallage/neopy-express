import { HttpError } from "../types/errors.js";
import { historiquesRepository } from "../repositories/historiques.repository.js";

export const historiquesService = {
  async list(filters: { userId?: string; commandeId?: string; maquisId?: string }) {
    return historiquesRepository.findAll(filters);
  },

  async getById(id: string) {
    const historique = await historiquesRepository.findById(id);
    if (!historique) throw new HttpError(404, "Historique introuvable");
    return historique;
  },

  async create(data: {
    userId?: string | null;
    commandeId?: string | null;
    maquisId?: string | null;
    action: string;
    details?: string | null;
  }) {
    return historiquesRepository.create(data);
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
  ) {
    await this.getById(id);
    return historiquesRepository.update(id, data);
  },

  async remove(id: string) {
    await this.getById(id);
    return historiquesRepository.delete(id);
  },
};
