import type { Request, Response } from "express";
import { authService } from "../services/auth.service.js";
import { usersService } from "../services/users.service.js";
import type {
  ConfirmEmailBody,
  LoginBody,
  RegisterBody,
} from "../validators/auth.validator.js";
export const authController = {
  async login(req: Request, res: Response): Promise<void> {
    const body = req.body as LoginBody;
    const data = await authService.login(body.email, body.password);
    res.json({ success: true, data });
  },

  async register(req: Request, res: Response): Promise<void> {
    const body = req.body as RegisterBody;
    const data = await authService.register(body);
    res.status(201).json({ success: true, data });
  },

  async confirmEmail(req: Request, res: Response): Promise<void> {
    const body = req.body as ConfirmEmailBody;
    const data = await authService.confirmEmail(body);
    res.json({ success: true, data });
  },

  async me(req: Request, res: Response): Promise<void> {
    const id = req.user?.id;
    if (!id) {
      res.status(401).json({ success: false, message: "Non authentifié." });
      return;
    }
    const user = await usersService.getUserById(id);
    res.json({ success: true, data: user });
  },
};
