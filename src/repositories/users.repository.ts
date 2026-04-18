import type { User } from "../models/user.model.js";
import { prisma } from "../lib/prisma.js";

function toDomain(row: {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
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

  async create(data: Pick<User, "email" | "name">): Promise<User> {
    const row = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        name: data.name,
      },
    });
    return toDomain(row);
  },
};
