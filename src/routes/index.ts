import { Router } from "express";
import { usersRouter } from "./users.routes.js";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.json({ success: true, message: "OK" });
});

apiRouter.use("/users", usersRouter);
