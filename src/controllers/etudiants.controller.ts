import type { Request, Response } from "express";
import { etudiantsService } from "../services/etudiants.service.js";
import type {
  CreateEtudiantBody,
  UpdateEtudiantBody,
} from "../validators/etudiants.validator.js";

export const etudiantsController = {
  async list(_req: Request, res: Response): Promise<void> {
    const data = await etudiantsService.list();
    res.json({ success: true, data });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: "Identifiant manquant" });
      return;
    }
    const data = await etudiantsService.getById(id);
    res.json({ success: true, data });
  },

  async create(req: Request, res: Response): Promise<void> {
    const body = req.body as CreateEtudiantBody;
    const data = await etudiantsService.create(body);
    res.status(201).json({ success: true, data });
  },

  async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: "Identifiant manquant" });
      return;
    }
    const body = req.body as UpdateEtudiantBody;
    const data = await etudiantsService.update(id, body);
    res.json({ success: true, data });
  },

  async remove(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: "Identifiant manquant" });
      return;
    }
    await etudiantsService.delete(id);
    res.status(204).send();
  },
};
