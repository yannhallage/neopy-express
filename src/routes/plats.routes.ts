import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { platsController } from "../controllers/plats.controller.js";
import {
  validateCreatePlat,
  validateUpdatePlat,
} from "../validators/plats.validator.js";

export const platsRouter = Router();

/**
 * @openapi
 * /plats:
 *   get:
 *     tags: [Plats]
 *     summary: Lister les plats
 *     operationId: listPlats
 *     parameters:
 *       - in: query
 *         name: maquisId
 *         schema:
 *           type: string
 *         description: Filtrer par maquis
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessPlatList'
 *   post:
 *     tags: [Plats]
 *     summary: Créer un plat
 *     operationId: createPlat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePlatRequest'
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessPlat'
 *       400:
 *         $ref: '#/components/responses/ErreurValidation'
 * /plats/{id}:
 *   get:
 *     tags: [Plats]
 *     summary: Détail plat
 *     operationId: getPlatById
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessPlat'
 *       404:
 *         $ref: '#/components/responses/ErreurIntrouvable'
 *   patch:
 *     tags: [Plats]
 *     summary: Mettre à jour un plat
 *     operationId: updatePlat
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePlatRequest'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessPlat'
 *   delete:
 *     tags: [Plats]
 *     summary: Supprimer un plat
 *     operationId: deletePlat
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Supprimé
 */
platsRouter.get("/", asyncHandler(platsController.list));
platsRouter.get("/:id", asyncHandler(platsController.getById));
platsRouter.post(
  "/",
  validateCreatePlat,
  asyncHandler(platsController.create),
);
platsRouter.patch(
  "/:id",
  validateUpdatePlat,
  asyncHandler(platsController.update),
);
platsRouter.delete("/:id", asyncHandler(platsController.remove));
