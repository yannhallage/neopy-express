import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { historiquesController } from "../controllers/historiques.controller.js";
import {
  validateCreateHistorique,
  validateUpdateHistorique,
} from "../validators/historiques.validator.js";

export const historiquesRouter = Router();

historiquesRouter.get("/", asyncHandler(historiquesController.list));
historiquesRouter.get("/:id", asyncHandler(historiquesController.getById));
historiquesRouter.post(
  "/",
  validateCreateHistorique,
  asyncHandler(historiquesController.create),
);
historiquesRouter.patch(
  "/:id",
  validateUpdateHistorique,
  asyncHandler(historiquesController.update),
);
historiquesRouter.delete("/:id", asyncHandler(historiquesController.remove));
