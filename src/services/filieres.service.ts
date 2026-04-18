import { HttpError } from "../types/errors.js";
import { filieresRepository } from "../repositories/filieres.repository.js";
import { usersRepository } from "../repositories/users.repository.js";

export const filieresService = {
  async list() {
    return filieresRepository.findAll();
  },

  async getById(id: string) {
    const row = await filieresRepository.findById(id);
    if (!row) throw new HttpError(404, "Filière introuvable");
    return row;
  },

  async create(data: { name: string; profId: string }) {
    const prof = await usersRepository.findById(data.profId);
    if (!prof) throw new HttpError(400, "Professeur (utilisateur) introuvable");
    return filieresRepository.create(data);
  },

  async update(id: string, data: Partial<{ name: string; profId: string }>) {
    await this.getById(id);
    if (data.profId) {
      const prof = await usersRepository.findById(data.profId);
      if (!prof) throw new HttpError(400, "Professeur (utilisateur) introuvable");
    }
    return filieresRepository.update(id, data);
  },

  async delete(id: string) {
    await this.getById(id);
    return filieresRepository.delete(id);
  },
};
