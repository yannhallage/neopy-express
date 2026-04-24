import bcrypt from "bcryptjs";
import type { User } from "../models/user.model.js";
import type { UserAuthRecord } from "../repositories/users.repository.js";
import { usersRepository } from "../repositories/users.repository.js";
import { signAccessToken } from "../lib/jwt.js";
import { HttpError } from "../types/errors.js";

const BCRYPT_ROUNDS = 10;

const INVALID_LOGIN = "Email ou mot de passe incorrect.";

function toPublicUser(row: UserAuthRecord): User {
  return {
    id: row.id,
    email: row.email,
    telephone: row.telephone,
    nom: row.nom,
    prenom: row.prenom,
    role: row.role,
    maquisId: row.maquisId,
    actif: row.actif,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export const authService = {
  async login(email: string, password: string) {
    const row = await usersRepository.findAuthByEmail(email);
    if (!row) {
      throw new HttpError(401, INVALID_LOGIN);
    }
    if (!row.actif) {
      throw new HttpError(403, "Ce compte est désactivé.");
    }
    if (!row.motDePasseHash) {
      throw new HttpError(401, INVALID_LOGIN);
    }
    const ok = await bcrypt.compare(password, row.motDePasseHash);
    if (!ok) {
      throw new HttpError(401, INVALID_LOGIN);
    }
    const accessToken = await signAccessToken({
      sub: row.id,
      email: row.email,
      role: row.role,
    });
    return {
      accessToken,
      tokenType: "Bearer" as const,
      user: toPublicUser(row),
    };
  },

  async register(data: {
    email: string;
    password: string;
    nom: string;
    prenom?: string | null;
    telephone?: string | null;
  }) {
    const existing = await usersRepository.findByEmail(data.email);
    if (existing) {
      throw new HttpError(409, "Cet email est déjà utilisé.");
    }
    const motDePasseHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
    const user = await usersRepository.create({
      email: data.email,
      nom: data.nom,
      prenom: data.prenom,
      telephone: data.telephone,
      role: "CLIENT",
      motDePasseHash,
    });
    const accessToken = await signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    return {
      accessToken,
      tokenType: "Bearer" as const,
      user,
    };
  },
};
