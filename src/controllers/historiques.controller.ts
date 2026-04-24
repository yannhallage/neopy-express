import type { Request, Response } from "express";
import { historiquesService } from "../services/historiques.service.js";
import type {
  CreateHistoriqueBody,
  UpdateHistoriqueBody,
} from "../validators/historiques.validator.js";

function filtersFromQuery(req: Request): {
  userId?: string;
  commandeId?: string;
  maquisId?: string;
} {
  const userId =
    typeof req.query.userId === "string" && req.query.userId.length > 0
      ? req.query.userId
      : undefined;
  const commandeId =
    typeof req.query.commandeId === "string" && req.query.commandeId.length > 0
      ? req.query.commandeId
      : undefined;
  const maquisId =
    typeof req.query.maquisId === "string" && req.query.maquisId.length > 0
      ? req.query.maquisId
      : undefined;
  return { userId, commandeId, maquisId };
}

export const historiquesController = {
  async list(req: Request, res: Response): Promise<void> {
    const data = await historiquesService.list(filtersFromQuery(req));
    res.json({ success: true, data });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: "Identifiant manquant" });
      return;
    }
    const data = await historiquesService.getById(id);
    res.json({ success: true, data });
  },

  async create(req: Request, res: Response): Promise<void> {
    const body = req.body as CreateHistoriqueBody;
    const data = await historiquesService.create(body);
    res.status(201).json({ success: true, data });
  },

  async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: "Identifiant manquant" });
      return;
    }
    const body = req.body as UpdateHistoriqueBody;
    const data = await historiquesService.update(id, body);
    res.json({ success: true, data });
  },

  async remove(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: "Identifiant manquant" });
      return;
    }
    await historiquesService.remove(id);
    res.status(204).send();
  },
};
