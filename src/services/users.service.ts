import type { Role } from "@prisma/client";
import { HttpError } from "../types/errors.js";
import { usersRepository } from "../repositories/users.repository.js";

export const usersService = {
  async listUsers() {
    return usersRepository.findAll();
  },

  async getUserById(id: string) {
    const user = await usersRepository.findById(id);
    if (!user) throw new HttpError(404, "Utilisateur introuvable");
    return user;
  },

  async createUser(data: {
    email: string;
    nom: string;
    prenom?: string | null;
    telephone?: string | null;
    role?: Role;
    maquisId?: string | null;
  }) {
    const existing = await usersRepository.findByEmail(data.email);
    if (existing) throw new HttpError(409, "Cet email est déjà utilisé");
    return usersRepository.create(data);
  },

  async updateUser(
    id: string,
    data: Partial<{
      email: string;
      nom: string;
      prenom: string | null;
      telephone: string | null;
      role: Role;
      maquisId: string | null;
      actif: boolean;
      isComplete: boolean;
    }>,
  ) {
    await this.getUserById(id);
    if (data.email) {
      const other = await usersRepository.findByEmail(data.email);
      if (other && other.id !== id) {
        throw new HttpError(409, "Cet email est déjà utilisé");
      }
    }
    return usersRepository.update(id, data);
  },

  async completeProfile(
    userId: string,
    data: { nom: string; prenom: string; telephone: string; email?: string },
  ) {
    await this.getUserById(userId);
    const email = data.email?.toLowerCase();
    if (email) {
      const other = await usersRepository.findByEmail(email);
      if (other && other.id !== userId) {
        throw new HttpError(409, "Cet email est déjà utilisé");
      }
    }
    return usersRepository.update(userId, {
      nom: data.nom,
      prenom: data.prenom,
      telephone: data.telephone,
      ...(email !== undefined && { email }),
      isComplete: true,
    });
  },

  async deleteUser(id: string) {
    await this.getUserById(id);
    return usersRepository.delete(id);
  },
};
