import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const createHistoriqueBodySchema = z.object({
  userId: z.string().min(1).optional().nullable(),
  commandeId: z.string().min(1).optional().nullable(),
  maquisId: z.string().min(1).optional().nullable(),
  action: z.string().min(1, "L'action est requise").max(255),
  details: z.string().max(2000).optional().nullable(),
});

export type CreateHistoriqueBody = z.infer<typeof createHistoriqueBodySchema>;

const updateHistoriqueBodySchema = z
  .object({
    userId: z.string().min(1).optional().nullable(),
    commandeId: z.string().min(1).optional().nullable(),
    maquisId: z.string().min(1).optional().nullable(),
    action: z.string().min(1).max(255).optional(),
    details: z.string().max(2000).optional().nullable(),
  })
  .refine(
    (o) =>
      o.userId !== undefined ||
      o.commandeId !== undefined ||
      o.maquisId !== undefined ||
      o.action !== undefined ||
      o.details !== undefined,
    { message: "Au moins un champ à mettre à jour est requis" },
  );

export type UpdateHistoriqueBody = z.infer<typeof updateHistoriqueBodySchema>;

function parseFail(res: Response, parsed: z.SafeParseError<unknown>): void {
  const message = parsed.error.issues.map((e) => e.message).join(", ");
  res.status(400).json({ success: false, message });
}

export function validateCreateHistorique(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const parsed = createHistoriqueBodySchema.safeParse(req.body);
  if (!parsed.success) {
    parseFail(res, parsed);
    return;
  }
  req.body = parsed.data;
  next();
}

export function validateUpdateHistorique(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const parsed = updateHistoriqueBodySchema.safeParse(req.body);
  if (!parsed.success) {
    parseFail(res, parsed);
    return;
  }
  req.body = parsed.data;
  next();
}
