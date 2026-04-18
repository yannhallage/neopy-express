import type { Role } from "@prisma/client";

export interface User {
  id: string;
  email: string;
  telephone: string | null;
  nom: string;
  prenom: string | null;
  role: Role;
  maquisId: string | null;
  actif: boolean;
  createdAt: string;
  updatedAt: string;
}
