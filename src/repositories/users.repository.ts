import type { Role } from "@prisma/client";
import type { User } from "../models/user.model.js";
import { prisma } from "../lib/prisma.js";
import { rethrowPrisma } from "../utils/prismaErrors.js";

function toDomain(row: {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  role: Role;
}): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    createdAt: row.createdAt.toISOString(),
  };
}

export const usersRepository = {
  async findAll(): Promise<User[]> {
    const rows = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toDomain);
  },

  async findById(id: string): Promise<User | null> {
    const row = await prisma.user.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  },

  async findByEmail(email: string): Promise<User | null> {
    const row = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    return row ? toDomain(row) : null;
  },

  async create(data: {
    email: string;
    name: string;
    role?: Role;
  }): Promise<User> {
    try {
      const row = await prisma.user.create({
        data: {
          email: data.email.toLowerCase(),
          name: data.name,
          ...(data.role !== undefined ? { role: data.role } : {}),
        },
      });
      return toDomain(row);
    } catch (e) {
      rethrowPrisma(e);
    }
  },

  async update(
    id: string,
    data: Partial<{ email: string; name: string; role: Role }>,
  ): Promise<User> {
    try {
      const row = await prisma.user.update({
        where: { id },
        data: {
          ...(data.email !== undefined && { email: data.email.toLowerCase() }),
          ...(data.name !== undefined && { name: data.name }),
          ...(data.role !== undefined && { role: data.role }),
        },
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
