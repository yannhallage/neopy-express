import type { Role } from "@prisma/client";
import type { User } from "../models/user.model.js";
import { prisma } from "../lib/prisma.js";
import { rethrowPrisma } from "../utils/prismaErrors.js";

const authSelect = {
  id: true,
  email: true,
  telephone: true,
  nom: true,
  prenom: true,
  role: true,
  maquisId: true,
  actif: true,
  isComplete: true,
  motDePasseHash: true,
  emailVerificationCode: true,
  emailVerificationExpiresAt: true,
  emailVerifiedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export type UserAuthRecord = {
  id: string;
  email: string;
  telephone: string | null;
  nom: string;
  prenom: string | null;
  role: Role;
  maquisId: string | null;
  actif: boolean;
  isComplete: boolean;
  motDePasseHash: string | null;
  emailVerificationCode: string | null;
  emailVerificationExpiresAt: string | null;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

function toAuthRecord(row: {
  id: string;
  email: string;
  telephone: string | null;
  nom: string;
  prenom: string | null;
  role: Role;
  maquisId: string | null;
  actif: boolean;
  isComplete: boolean;
  motDePasseHash: string | null;
  emailVerificationCode: string | null;
  emailVerificationExpiresAt: Date | null;
  emailVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): UserAuthRecord {
  return {
    id: row.id,
    email: row.email,
    telephone: row.telephone,
    nom: row.nom,
    prenom: row.prenom,
    role: row.role,
    maquisId: row.maquisId,
    actif: row.actif,
    isComplete: row.isComplete,
    motDePasseHash: row.motDePasseHash,
    emailVerificationCode: row.emailVerificationCode,
    emailVerificationExpiresAt: row.emailVerificationExpiresAt
      ? row.emailVerificationExpiresAt.toISOString()
      : null,
    emailVerifiedAt: row.emailVerifiedAt ? row.emailVerifiedAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

const userSelect = {
  id: true,
  email: true,
  telephone: true,
  nom: true,
  prenom: true,
  role: true,
  maquisId: true,
  actif: true,
  isComplete: true,
  createdAt: true,
  updatedAt: true,
} as const;

function toDomain(row: {
  id: string;
  email: string;
  telephone: string | null;
  nom: string;
  prenom: string | null;
  role: Role;
  maquisId: string | null;
  actif: boolean;
  isComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}): User {
  return {
    id: row.id,
    email: row.email,
    telephone: row.telephone,
    nom: row.nom,
    prenom: row.prenom,
    role: row.role,
    maquisId: row.maquisId,
    actif: row.actif,
    isComplete: row.isComplete,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export const usersRepository = {
  async findAll(): Promise<User[]> {
    const rows = await prisma.user.findMany({
      select: userSelect,
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toDomain);
  },

  async findById(id: string): Promise<User | null> {
    const row = await prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
    return row ? toDomain(row) : null;
  },

  async findByEmail(email: string): Promise<User | null> {
    const row = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: userSelect,
    });
    return row ? toDomain(row) : null;
  },

  async findAuthByEmail(email: string): Promise<UserAuthRecord | null> {
    const row = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: authSelect,
    });
    return row ? toAuthRecord(row) : null;
  },

  async create(data: {
    email: string;
    nom: string;
    prenom?: string | null;
    telephone?: string | null;
    role?: Role;
    maquisId?: string | null;
    motDePasseHash?: string | null;
    actif?: boolean;
    emailVerificationCode?: string | null;
    emailVerificationExpiresAt?: Date | null;
    emailVerifiedAt?: Date | null;
  }): Promise<User> {
    try {
      const row = await prisma.user.create({
        data: {
          email: data.email.toLowerCase(),
          nom: data.nom,
          ...(data.prenom !== undefined && { prenom: data.prenom }),
          ...(data.telephone !== undefined && { telephone: data.telephone }),
          ...(data.role !== undefined ? { role: data.role } : {}),
          ...(data.maquisId !== undefined && { maquisId: data.maquisId }),
          ...(data.motDePasseHash !== undefined && {
            motDePasseHash: data.motDePasseHash,
          }),
          ...(data.actif !== undefined && { actif: data.actif }),
          ...(data.emailVerificationCode !== undefined && {
            emailVerificationCode: data.emailVerificationCode,
          }),
          ...(data.emailVerificationExpiresAt !== undefined && {
            emailVerificationExpiresAt: data.emailVerificationExpiresAt,
          }),
          ...(data.emailVerifiedAt !== undefined && {
            emailVerifiedAt: data.emailVerifiedAt,
          }),
        },
        select: userSelect,
      });
      return toDomain(row);
    } catch (e) {
      rethrowPrisma(e);
    }
  },

  async update(
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
      emailVerificationCode: string | null;
      emailVerificationExpiresAt: Date | null;
      emailVerifiedAt: Date | null;
    }>,
  ): Promise<User> {
    try {
      const row = await prisma.user.update({
        where: { id },
        data: {
          ...(data.email !== undefined && { email: data.email.toLowerCase() }),
          ...(data.nom !== undefined && { nom: data.nom }),
          ...(data.prenom !== undefined && { prenom: data.prenom }),
          ...(data.telephone !== undefined && { telephone: data.telephone }),
          ...(data.role !== undefined && { role: data.role }),
          ...(data.maquisId !== undefined && { maquisId: data.maquisId }),
          ...(data.actif !== undefined && { actif: data.actif }),
          ...(data.isComplete !== undefined && { isComplete: data.isComplete }),
          ...(data.emailVerificationCode !== undefined && {
            emailVerificationCode: data.emailVerificationCode,
          }),
          ...(data.emailVerificationExpiresAt !== undefined && {
            emailVerificationExpiresAt: data.emailVerificationExpiresAt,
          }),
          ...(data.emailVerifiedAt !== undefined && {
            emailVerifiedAt: data.emailVerifiedAt,
          }),
        },
        select: userSelect,
      });
      return toDomain(row);
    } catch (e) {
      rethrowPrisma(e);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await prisma.user.delete({ where: { id } });
    } catch (e) {
      rethrowPrisma(e);
    }
  },
};
