import bcrypt from "bcryptjs";
import type { Role } from "@prisma/client";
import type { User } from "../models/user.model.js";
import type { UserAuthRecord } from "../repositories/users.repository.js";
import { usersRepository } from "../repositories/users.repository.js";
import { signAccessToken } from "../lib/jwt.js";
import { mailService } from "./mail.service.js";
import { HttpError } from "../types/errors.js";
import { ROLE_PERMISSIONS, ROLE_UI_DROPDOWN } from "../config/permissions.js";

const BCRYPT_ROUNDS = 10;
const EMAIL_CONFIRMATION_TTL_MS = 15 * 60 * 1000;

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
      if (!row.emailVerifiedAt) {
        throw new HttpError(403, "Confirmez votre email avant de vous connecter.");
      }
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
      permissions: [...ROLE_PERMISSIONS[row.role]],
      uiPermissions: [...ROLE_UI_DROPDOWN[row.role]],
    };
  },

  async register(data: {
    email: string;
    password: string;
    nom: string;
    prenom?: string | null;
    telephone?: string | null;
    role?: Role;
  }) {
    const existing = await usersRepository.findByEmail(data.email);
    if (existing) {
      throw new HttpError(409, "Cet email est déjà utilisé.");
    }
    const motDePasseHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
    const confirmationCode = mailService.generateConfirmationCode();
    const confirmationExpiresAt = new Date(
      Date.now() + EMAIL_CONFIRMATION_TTL_MS,
    );

    const user = await usersRepository.create({
      email: data.email,
      nom: data.nom,
      prenom: data.prenom,
      telephone: data.telephone,
      role: data.role ?? "CLIENT",
      motDePasseHash,
      actif: false,
      emailVerificationCode: confirmationCode,
      emailVerificationExpiresAt: confirmationExpiresAt,
    });

    await mailService.sendSignupConfirmationEmail({
      to: user.email,
      nom: user.nom,
      prenom: user.prenom,
      code: confirmationCode,
    });
    return {
      message:
        "Compte cree. Verifiez votre email pour confirmer votre inscription.",
      email: user.email,
    };
  },

  async confirmEmail(data: { email: string; code: string }) {
    const user = await usersRepository.findAuthByEmail(data.email);
    if (!user) {
      throw new HttpError(400, "Code de confirmation invalide.");
    }
    if (user.emailVerifiedAt) {
      return { message: "Email deja confirme." };
    }
    if (!user.emailVerificationCode || !user.emailVerificationExpiresAt) {
      throw new HttpError(400, "Aucun code de confirmation actif.");
    }
    if (new Date(user.emailVerificationExpiresAt).getTime() < Date.now()) {
      throw new HttpError(400, "Le code de confirmation a expire.");
    }
    if (user.emailVerificationCode !== data.code.trim().toUpperCase()) {
      throw new HttpError(400, "Code de confirmation invalide.");
    }

    const verifiedAt = new Date();
    await usersRepository.update(user.id, {
      actif: true,
      emailVerifiedAt: verifiedAt,
      emailVerificationCode: null,
      emailVerificationExpiresAt: null,
    });

    const accessToken = await signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      message: "Email confirme avec succes.",
      accessToken,
      tokenType: "Bearer" as const,
      permissions: [...ROLE_PERMISSIONS[user.role]],
      uiPermissions: [...ROLE_UI_DROPDOWN[user.role]],
    };
  },
};
