import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const createEtudiantBodySchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(120),
  prenom: z.string().min(1, "Le prénom est requis").max(120),
  email: z.string().email("Email invalide"),
  matricule: z.string().min(1, "Le matricule est requis").max(64),
  filiereId: z.string().min(1).nullable().optional(),
  userId: z.string().min(1).nullable().optional(),
});

export type CreateEtudiantBody = z.infer<typeof createEtudiantBodySchema>;

const updateEtudiantBodySchema = z
  .object({
    name: z.string().min(1).max(120).optional(),
    prenom: z.string().min(1).max(120).optional(),
    email: z.string().email("Email invalide").optional(),
    matricule: z.string().min(1).max(64).optional(),
    filiereId: z.string().min(1).nullable().optional(),
    userId: z.string().min(1).nullable().optional(),
  })
  .refine(
    (o) =>
      o.name !== undefined ||
      o.prenom !== undefined ||
      o.email !== undefined ||
      o.matricule !== undefined ||
      o.filiereId !== undefined ||
      o.userId !== undefined,
    { message: "Au moins un champ à mettre à jour est requis" },
  );

export type UpdateEtudiantBody = z.infer<typeof updateEtudiantBodySchema>;

function parseFail(res: Response, parsed: z.SafeParseError<unknown>): void {
  const message = parsed.error.issues.map((e) => e.message).join(", ");
  res.status(400).json({ success: false, message });
}

export function validateCreateEtudiant(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const parsed = createEtudiantBodySchema.safeParse(req.body);
  if (!parsed.success) {
    parseFail(res, parsed);
    return;
  }
  req.body = parsed.data;
  next();
}

export function validateUpdateEtudiant(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const parsed = updateEtudiantBodySchema.safeParse(req.body);
  if (!parsed.success) {
    parseFail(res, parsed);
    return;
  }
  req.body = parsed.data;
  next();
}
