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

  async createUser(data: { email: string; name: string }) {
    const existing = await usersRepository.findByEmail(data.email);
    if (existing) throw new HttpError(409, "Cet email est déjà utilisé");
    return usersRepository.create(data);
  },
};
