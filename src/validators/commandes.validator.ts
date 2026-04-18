import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const moyenPaiementSchema = z.enum([
  "ESPECES",
  "ORANGE_MONEY",
  "MTN_MONEY",
  "MOOV_MONEY",
  "WAVE",
  "CARTE_BANCAIRE",
  "AUTRE",
]);

const statutCommandeSchema = z.enum([
  "EN_ATTENTE",
  "EN_PREPARATION",
  "PRETE",
  "LIVREE",
  "ANNULEE",
]);

const ligneSchema = z.object({
  platId: z.string().min(1),
  quantite: z.number().int().min(1),
});

const createCommandeBodySchema = z.object({
  userId: z.string().min(1),
  maquisId: z.string().min(1),
  lignes: z.array(ligneSchema).min(1),
  moyenPaiement: moyenPaiementSchema.optional(),
  commentaire: z.string().max(2000).optional().nullable(),
});

export type CreateCommandeBody = z.infer<typeof createCommandeBodySchema>;

const updateCommandeBodySchema = z
  .object({
    statut: statutCommandeSchema.optional(),
    moyenPaiement: moyenPaiementSchema.optional(),
    commentaire: z.string().max(2000).optional().nullable(),
  })
  .refine((o) => o.statut !== undefined || o.moyenPaiement !== undefined || o.commentaire !== undefined, {
    message: "Au moins un champ à mettre à jour est requis",
  });

export type UpdateCommandeBody = z.infer<typeof updateCommandeBodySchema>;

function parseFail(res: Response, parsed: z.SafeParseError<unknown>): void {
  const message = parsed.error.issues.map((e) => e.message).join(", ");
  res.status(400).json({ success: false, message });
}

export function validateCreateCommande(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const parsed = createCommandeBodySchema.safeParse(req.body);
  if (!parsed.success) {
    parseFail(res, parsed);
    return;
  }
  req.body = parsed.data;
  next();
}

export function validateUpdateCommande(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const parsed = updateCommandeBodySchema.safeParse(req.body);
  if (!parsed.success) {
    parseFail(res, parsed);
    return;
  }
  req.body = parsed.data;
  next();
}
