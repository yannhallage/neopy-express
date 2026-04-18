import { HttpError } from "../types/errors.js";
import { usersRepository } from "../repositories/users.repository.js";
import type { Role } from "@prisma/client";

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
    name: string;
    role?: Role;
  }) {
    const existing = await usersRepository.findByEmail(data.email);
    if (existing) throw new HttpError(409, "Cet email est déjà utilisé");
    return usersRepository.create(data);
  },

  async updateUser(
    id: string,
    data: Partial<{ email: string; name: string; role: Role }>,
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

  async deleteUser(id: string) {
    await this.getUserById(id);
    return usersRepository.delete(id);
  },
};
