import type { Request, Response } from "express";
import { uploadImageBuffer } from "../services/cloudinaryUpload.service.js";
import { platsService } from "../services/plats.service.js";
import { HttpError } from "../types/errors.js";
import type { CreatePlatBody, UpdatePlatBody } from "../validators/plats.validator.js";

function maquisIdFromQuery(req: Request): string | undefined {
  const q = req.query.maquisId;
  return typeof q === "string" && q.length > 0 ? q : undefined;
}

export const platsController = {
  async listAll(_req: Request, res: Response): Promise<void> {
    const data = await platsService.listAll();
    res.json({ success: true, data });
  },

  async listByUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.userId;
    if (!userId) {
      res.status(400).json({ success: false, message: "Identifiant utilisateur manquant" });
      return;
    }
    const data = await platsService.listByUser(userId);
    res.json({ success: true, data });
  },

  async list(req: Request, res: Response): Promise<void> {
    const data = await platsService.list(maquisIdFromQuery(req));
    res.json({ success: true, data });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: "Identifiant manquant" });
      return;
    }
    const data = await platsService.getById(id);
    res.json({ success: true, data });
  },

  async create(req: Request, res: Response): Promise<void> {
    const body = req.body as CreatePlatBody;
    const data = await platsService.create(body);
    res.status(201).json({ success: true, data });
  },

  async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: "Identifiant manquant" });
      return;
    }
    const body = req.body as UpdatePlatBody;
    const data = await platsService.update(id, body);
    res.json({ success: true, data });
  },

  async uploadImage(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: "Identifiant manquant" });
      return;
    }
    if (!req.file) {
      throw new HttpError(
        400,
        "Image requise : envoyez un multipart/form-data avec le champ « image ».",
      );
    }
    const imageUrl = await uploadImageBuffer(
      req.file.buffer,
      req.file.mimetype,
      "plats",
    );
    const data = await platsService.update(id, { imageUrl });
    res.json({ success: true, data });
  },

  async remove(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: "Identifiant manquant" });
      return;
    }
    await platsService.remove(id);
    res.status(204).send();
  },
};
