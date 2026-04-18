import type { Request, Response } from "express";
import { usersService } from "../services/users.service.js";
import type { CreateUserBody } from "../validators/users.validator.js";

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
};
