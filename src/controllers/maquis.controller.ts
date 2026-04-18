import type { Request, Response } from "express";
import { uploadImageBuffer } from "../services/cloudinaryUpload.service.js";
import { maquisService } from "../services/maquis.service.js";
import { HttpError } from "../types/errors.js";
import type { CreateMaquisBody, UpdateMaquisBody } from "../validators/maquis.validator.js";

export const maquisController = {
  async list(_req: Request, res: Response): Promise<void> {
    const data = await maquisService.list();
    res.json({ success: true, data });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: "Identifiant manquant" });
      return;
    }
    const data = await maquisService.getById(id);
    res.json({ success: true, data });
  },

  async create(req: Request, res: Response): Promise<void> {
    const body = req.body as CreateMaquisBody;
    const data = await maquisService.create(body);
    res.status(201).json({ success: true, data });
  },

  async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: "Identifiant manquant" });
      return;
    }
    const body = req.body as UpdateMaquisBody;
    const data = await maquisService.update(id, body);
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
      "maquis",
    );
    const data = await maquisService.update(id, { imageUrl });
    res.json({ success: true, data });
  },

  async remove(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: "Identifiant manquant" });
      return;
    }
    await maquisService.remove(id);
    res.status(204).send();
  },
};
