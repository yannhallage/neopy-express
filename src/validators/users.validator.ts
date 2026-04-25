import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const roleSchema = z.enum(["CLIENT", "GERANT", "ADMIN"]);

const createUserBodySchema = z.object({
  email: z.string().email("Email invalide"),
  nom: z.string().min(1, "Le nom est requis").max(120),
  prenom: z.string().max(120).optional().nullable(),
  telephone: z.string().max(32).optional().nullable(),
  role: roleSchema.optional(),
  maquisId: z.string().min(1).optional().nullable(),
});

export type CreateUserBody = z.infer<typeof createUserBodySchema>;

const updateUserBodySchema = z
  .object({
    email: z.string().email("Email invalide").optional(),
    nom: z.string().min(1).max(120).optional(),
    prenom: z.string().max(120).optional().nullable(),
    telephone: z.string().max(32).optional().nullable(),
    role: roleSchema.optional(),
    maquisId: z.string().min(1).optional().nullable(),
    actif: z.boolean().optional(),
  })
  .refine(
    (o) =>
      o.email !== undefined ||
      o.nom !== undefined ||
      o.prenom !== undefined ||
      o.telephone !== undefined ||
      o.role !== undefined ||
      o.maquisId !== undefined ||
      o.actif !== undefined,
    { message: "Au moins un champ à mettre à jour est requis" },
  );

export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;

/** Corps pour finaliser le profil connecté (isComplete passera à true). */
const completeProfileBodySchema = z.object({
  nom: z.string().min(1, "Le nom est requis").max(120),
  prenom: z.string().min(1, "Le prénom est requis").max(120),
  telephone: z.string().min(1, "Le téléphone est requis").max(32),
  email: z.string().email("Email invalide").optional(),
});

export type CompleteProfileBody = z.infer<typeof completeProfileBodySchema>;

function parseFail(res: Response, parsed: z.SafeParseError<unknown>): void {
  const message = parsed.error.issues.map((e) => e.message).join(", ");
  res.status(400).json({ success: false, message });
}

export function validateCreateUser(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const parsed = createUserBodySchema.safeParse(req.body);
  if (!parsed.success) {
    parseFail(res, parsed);
    return;
  }
  req.body = parsed.data;
  next();
}

export function validateUpdateUser(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const parsed = updateUserBodySchema.safeParse(req.body);
  if (!parsed.success) {
    parseFail(res, parsed);
    return;
  }
  req.body = parsed.data;
  next();
}

export function validateCompleteProfile(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const parsed = completeProfileBodySchema.safeParse(req.body);
  if (!parsed.success) {
    parseFail(res, parsed);
    return;
  }
  req.body = parsed.data;
  next();
}
