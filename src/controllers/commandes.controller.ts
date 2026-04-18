import type { Request, Response } from "express";
import { commandesService } from "../services/commandes.service.js";
import type {
  CreateCommandeBody,
  UpdateCommandeBody,
} from "../validators/commandes.validator.js";

function filtersFromQuery(req: Request): { userId?: string; maquisId?: string } {
  const userId = typeof req.query.userId === "string" && req.query.userId.length > 0
    ? req.query.userId
    : undefined;
  const maquisId =
    typeof req.query.maquisId === "string" && req.query.maquisId.length > 0
      ? req.query.maquisId
      : undefined;
  return { userId, maquisId };
}

export const commandesController = {
  async list(req: Request, res: Response): Promise<void> {
    const data = await commandesService.list(filtersFromQuery(req));
    res.json({ success: true, data });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: "Identifiant manquant" });
      return;
    }
    const data = await commandesService.getById(id);
    res.json({ success: true, data });
  },

  async create(req: Request, res: Response): Promise<void> {
    const body = req.body as CreateCommandeBody;
    const data = await commandesService.create(body);
    res.status(201).json({ success: true, data });
  },

  async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: "Identifiant manquant" });
      return;
    }
    const body = req.body as UpdateCommandeBody;
    const data = await commandesService.update(id, body);
    res.json({ success: true, data });
  },

  async remove(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: "Identifiant manquant" });
      return;
    }
    await commandesService.remove(id);
    res.status(204).send();
  },
};
