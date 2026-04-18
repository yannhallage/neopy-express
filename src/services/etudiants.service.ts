import { HttpError } from "../types/errors.js";
import { etudiantsRepository } from "../repositories/etudiants.repository.js";
import { filieresRepository } from "../repositories/filieres.repository.js";
import { usersRepository } from "../repositories/users.repository.js";

export const etudiantsService = {
  async list() {
    return etudiantsRepository.findAll();
  },

  async getById(id: string) {
    const row = await etudiantsRepository.findById(id);
    if (!row) throw new HttpError(404, "Étudiant introuvable");
    return row;
  },

  async create(data: {
    name: string;
    prenom: string;
    email: string;
    matricule: string;
    filiereId?: string | null;
    userId?: string | null;
  }) {
    const emailTaken = await etudiantsRepository.findByEmail(data.email);
    if (emailTaken) throw new HttpError(409, "Cet email est déjà utilisé");
    const matTaken = await etudiantsRepository.findByMatricule(data.matricule);
    if (matTaken) throw new HttpError(409, "Ce matricule est déjà utilisé");

    if (data.filiereId) {
      const f = await filieresRepository.findById(data.filiereId);
      if (!f) throw new HttpError(400, "Filière introuvable");
    }
    if (data.userId) {
      const u = await usersRepository.findById(data.userId);
      if (!u) throw new HttpError(400, "Utilisateur introuvable");
    }

    return etudiantsRepository.create(data);
  },

  async update(
    id: string,
    data: Partial<{
      name: string;
      prenom: string;
      email: string;
      matricule: string;
      filiereId: string | null;
      userId: string | null;
    }>,
  ) {
    const current = await this.getById(id);

    if (data.email && data.email.toLowerCase() !== current.email) {
      const taken = await etudiantsRepository.findByEmail(data.email);
      if (taken && taken.id !== id) {
        throw new HttpError(409, "Cet email est déjà utilisé");
      }
    }
    if (data.matricule && data.matricule !== current.matricule) {
      const taken = await etudiantsRepository.findByMatricule(data.matricule);
      if (taken && taken.id !== id) {
        throw new HttpError(409, "Ce matricule est déjà utilisé");
      }
    }
    if (data.filiereId) {
      const f = await filieresRepository.findById(data.filiereId);
      if (!f) throw new HttpError(400, "Filière introuvable");
    }
    if (data.userId) {
      const u = await usersRepository.findById(data.userId);
      if (!u) throw new HttpError(400, "Utilisateur introuvable");
    }

    return etudiantsRepository.update(id, data);
  },

  async delete(id: string) {
    await this.getById(id);
    return etudiantsRepository.delete(id);
  },
};
