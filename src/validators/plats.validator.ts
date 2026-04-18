import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const createPlatBodySchema = z.object({
  maquisId: z.string().min(1),
  nom: z.string().min(1).max(160),
  description: z.string().max(2000).optional().nullable(),
  prix: z.coerce.number().positive("Le prix doit être positif"),
  imageUrl: z.string().max(2000).optional().nullable(),
  disponible: z.boolean().optional(),
});

export type CreatePlatBody = z.infer<typeof createPlatBodySchema>;

const updatePlatBodySchema = z
  .object({
    maquisId: z.string().min(1).optional(),
    nom: z.string().min(1).max(160).optional(),
    description: z.string().max(2000).optional().nullable(),
    prix: z.coerce.number().positive().optional(),
    imageUrl: z.string().max(2000).optional().nullable(),
    disponible: z.boolean().optional(),
  })
  .refine((o) => Object.keys(o).length > 0, {
    message: "Au moins un champ à mettre à jour est requis",
  });

export type UpdatePlatBody = z.infer<typeof updatePlatBodySchema>;

function parseFail(res: Response, parsed: z.SafeParseError<unknown>): void {
  const message = parsed.error.issues.map((e) => e.message).join(", ");
  res.status(400).json({ success: false, message });
}

export function validateCreatePlat(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const parsed = createPlatBodySchema.safeParse(req.body);
  if (!parsed.success) {
    parseFail(res, parsed);
    return;
  }
  req.body = parsed.data;
  next();
}

export function validateUpdatePlat(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const parsed = updatePlatBodySchema.safeParse(req.body);
  if (!parsed.success) {
    parseFail(res, parsed);
    return;
  }
  req.body = parsed.data;
  next();
}
