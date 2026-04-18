import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { usersController } from "../controllers/users.controller.js";
import { validateCreateUser } from "../validators/users.validator.js";

export const usersRouter = Router();

usersRouter.get("/", asyncHandler(usersController.list));
usersRouter.get("/:id", asyncHandler(usersController.getById));
usersRouter.post(
  "/",
  validateCreateUser,
  asyncHandler(usersController.create),
);
