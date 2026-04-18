import { randomUUID } from "node:crypto";
import type { Etudiant } from "../models/etudiant.model.js";
import { prisma } from "../lib/prisma.js";
import { rethrowPrisma } from "../utils/prismaErrors.js";

function toDomain(row: {
  id: string;
  name: string;
  prenom: string;
  email: string;
  matricule: string;
  created_at: Date;
  filiereId: string | null;
  userId: string | null;
}): Etudiant {
  return {
    id: row.id,
    name: row.name,
    prenom: row.prenom,
    email: row.email,
    matricule: row.matricule,
    createdAt: row.created_at.toISOString(),
    filiereId: row.filiereId,
    userId: row.userId,
  };
}

export const etudiantsRepository = {
  async findAll(): Promise<Etudiant[]> {
    const rows = await prisma.etudiant.findMany({
      orderBy: { created_at: "desc" },
    });
    return rows.map(toDomain);
  },

  async findById(id: string): Promise<Etudiant | null> {
    const row = await prisma.etudiant.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  },

  async findByEmail(email: string): Promise<Etudiant | null> {
    const row = await prisma.etudiant.findUnique({
      where: { email: email.toLowerCase() },
    });
    return row ? toDomain(row) : null;
  },

  async findByMatricule(matricule: string): Promise<Etudiant | null> {
    const row = await prisma.etudiant.findUnique({
      where: { matricule },
    });
    return row ? toDomain(row) : null;
  },

  async create(data: {
    name: string;
    prenom: string;
    email: string;
    matricule: string;
    filiereId?: string | null;
    userId?: string | null;
  }): Promise<Etudiant> {
    try {
      const row = await prisma.etudiant.create({
        data: {
          id: randomUUID(),
          name: data.name,
          prenom: data.prenom,
          email: data.email.toLowerCase(),
          matricule: data.matricule,
          ...(data.filiereId !== undefined && { filiereId: data.filiereId }),
          ...(data.userId !== undefined && { userId: data.userId }),
        },
      });
      return toDomain(row);
    } catch (e) {
      rethrowPrisma(e);
    }
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
  ): Promise<Etudiant> {
    try {
      const row = await prisma.etudiant.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.prenom !== undefined && { prenom: data.prenom }),
          ...(data.email !== undefined && { email: data.email.toLowerCase() }),
          ...(data.matricule !== undefined && { matricule: data.matricule }),
          ...(data.filiereId !== undefined && { filiereId: data.filiereId }),
          ...(data.userId !== undefined && { userId: data.userId }),
        },
      });
      return toDomain(row);
    } catch (e) {
      rethrowPrisma(e);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await prisma.etudiant.delete({ where: { id } });
    } catch (e) {
      rethrowPrisma(e);
    }
  },
};
