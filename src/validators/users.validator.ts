import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

const createUserBodySchema = z.object({
  email: z.string().email("Email invalide"),
  name: z.string().min(1, "Le nom est requis").max(120),
});

export type CreateUserBody = z.infer<typeof createUserBodySchema>;

export function validateCreateUser(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const parsed = createUserBodySchema.safeParse(req.body);
  if (!parsed.success) {
    const message = parsed.error.issues.map((e) => e.message).join(", ");
    res.status(400).json({ success: false, message });
    return;
  }
  req.body = parsed.data;
  next();
}
