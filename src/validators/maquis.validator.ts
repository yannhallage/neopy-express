import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const createMaquisBodySchema = z.object({
  nom: z.string().min(1).max(160),
  description: z.string().max(2000).optional().nullable(),
  adresse: z.string().min(1).max(500),
  ville: z.string().max(120).optional().nullable(),
  telephone: z.string().max(32).optional().nullable(),
  imageUrl: z.string().max(2000).optional().nullable(),
  ouvert: z.boolean().optional(),
});

export type CreateMaquisBody = z.infer<typeof createMaquisBodySchema>;

const updateMaquisBodySchema = z
  .object({
    nom: z.string().min(1).max(160).optional(),
    description: z.string().max(2000).optional().nullable(),
    adresse: z.string().min(1).max(500).optional(),
    ville: z.string().max(120).optional().nullable(),
    telephone: z.string().max(32).optional().nullable(),
    imageUrl: z.string().max(2000).optional().nullable(),
    ouvert: z.boolean().optional(),
    proprietaireId: z.string().min(1).optional(),
  })
  .refine((o) => Object.keys(o).length > 0, {
    message: "Au moins un champ à mettre à jour est requis",
  });

export type UpdateMaquisBody = z.infer<typeof updateMaquisBodySchema>;

function parseFail(res: Response, parsed: z.SafeParseError<unknown>): void {
  const message = parsed.error.issues.map((e) => e.message).join(", ");
  res.status(400).json({ success: false, message });
}

export function validateCreateMaquis(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const parsed = createMaquisBodySchema.safeParse(req.body);
  if (!parsed.success) {
    parseFail(res, parsed);
    return;
  }
  req.body = parsed.data;
  next();
}

export function validateUpdateMaquis(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const parsed = updateMaquisBodySchema.safeParse(req.body);
  if (!parsed.success) {
    parseFail(res, parsed);
    return;
  }
  req.body = parsed.data;
  next();
}
