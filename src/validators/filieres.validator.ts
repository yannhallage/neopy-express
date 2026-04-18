import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const createFiliereBodySchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(120),
  profId: z.string().min(1, "profId est requis"),
});

export type CreateFiliereBody = z.infer<typeof createFiliereBodySchema>;

const updateFiliereBodySchema = z
  .object({
    name: z.string().min(1).max(120).optional(),
    profId: z.string().min(1).optional(),
  })
  .refine((o) => o.name !== undefined || o.profId !== undefined, {
    message: "Au moins un champ à mettre à jour est requis",
  });

export type UpdateFiliereBody = z.infer<typeof updateFiliereBodySchema>;

function parseFail(res: Response, parsed: z.SafeParseError<unknown>): void {
  const message = parsed.error.issues.map((e) => e.message).join(", ");
  res.status(400).json({ success: false, message });
}

export function validateCreateFiliere(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const parsed = createFiliereBodySchema.safeParse(req.body);
  if (!parsed.success) {
    parseFail(res, parsed);
    return;
  }
  req.body = parsed.data;
  next();
}

export function validateUpdateFiliere(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const parsed = updateFiliereBodySchema.safeParse(req.body);
  if (!parsed.success) {
    parseFail(res, parsed);
    return;
  }
  req.body = parsed.data;
  next();
}
