import type { Request, Response } from "express";
import { usersService } from "../services/users.service.js";
import type {
  CompleteProfileBody,
  CreateUserBody,
  UpdateUserBody,
} from "../validators/users.validator.js";

export const usersController = {
  async list(_req: Request, res: Response): Promise<void> {
    const users = await usersService.listUsers();
    res.json({ success: true, data: users });
  },

  async getById(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: "Identifiant manquant" });
      return;
    }
    const user = await usersService.getUserById(id);
    res.json({ success: true, data: user });
  },

  async create(req: Request, res: Response): Promise<void> {
    const body = req.body as CreateUserBody;
    const user = await usersService.createUser(body);
    res.status(201).json({ success: true, data: user });
  },

  async update(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: "Identifiant manquant" });
      return;
    }
    const body = req.body as UpdateUserBody;
    const user = await usersService.updateUser(id, body);
    res.json({ success: true, data: user });
  },

  async completeProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Non authentifié." });
      return;
    }
    const body = req.body as CompleteProfileBody;
    const user = await usersService.completeProfile(userId, body);
    res.json({ success: true, data: user });
  },

  async remove(req: Request, res: Response): Promise<void> {
    const id = req.params.id;
    if (!id) {
      res.status(400).json({ success: false, message: "Identifiant manquant" });
      return;
    }
    await usersService.deleteUser(id);
    res.status(204).send();
  },
};
