import type { Request, Response } from "express";
import { filieresService } from "../services/filieres.service.js";
import type {
  CreateFiliereBody,
  UpdateFiliereBody,
} from "../validators/filieres.validator.js";

export const filieresController = {
  async list(_req: Request, res: Response): Promise<void> {
    const data = await filieresService.list();
    res.json({ success: true, data });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: "Identifiant manquant" });
      return;
    }
    const data = await filieresService.getById(id);
    res.json({ success: true, data });
  },

  async create(req: Request, res: Response): Promise<void> {
    const body = req.body as CreateFiliereBody;
    const data = await filieresService.create(body);
    res.status(201).json({ success: true, data });
  },

  async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: "Identifiant manquant" });
      return;
    }
    const body = req.body as UpdateFiliereBody;
    const data = await filieresService.update(id, body);
    res.json({ success: true, data });
  },

  async remove(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: "Identifiant manquant" });
      return;
    }
    await filieresService.delete(id);
    res.status(204).send();
  },
};
