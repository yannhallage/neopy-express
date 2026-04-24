import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
  .max(128, "Mot de passe trop long.");

const loginBodySchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export type LoginBody = z.infer<typeof loginBodySchema>;

const registerBodySchema = z.object({
  email: z.string().email("Email invalide"),
  password: passwordSchema,
  nom: z.string().min(1, "Le nom est requis").max(120),
  prenom: z.string().max(120).optional().nullable(),
  telephone: z.string().max(32).optional().nullable(),
});

export type RegisterBody = z.infer<typeof registerBodySchema>;

function parseFail(res: Response, parsed: z.SafeParseError<unknown>): void {
  const message = parsed.error.issues.map((e) => e.message).join(", ");
  res.status(400).json({ success: false, message });
}

export function validateLogin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const parsed = loginBodySchema.safeParse(req.body);
  if (!parsed.success) {
    parseFail(res, parsed);
    return;
  }
  req.body = parsed.data;
  next();
}

export function validateRegister(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const parsed = registerBodySchema.safeParse(req.body);
  if (!parsed.success) {
    parseFail(res, parsed);
    return;
  }
  req.body = parsed.data;
  next();
}
