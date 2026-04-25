import { Router } from "express";
import { maquisController } from "../controllers/maquis.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { parseSingleImageUpload } from "../middlewares/uploadImage.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  validateCreateMaquis,
  validateUpdateMaquis,
} from "../validators/maquis.validator.js";

export const maquisRouter = Router();

/**
 * @openapi
 * /maquis:
 *   get:
 *     tags: [Maquis]
 *     summary: Lister les maquis
 *     operationId: listMaquis
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMaquisList'
 *   post:
 *     tags: [Maquis]
 *     summary: Créer un maquis
 *     operationId: createMaquis
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMaquisRequest'
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMaquis'
 *       400:
 *         $ref: '#/components/responses/ErreurValidation'
 * /maquis/{id}:
 *   get:
 *     tags: [Maquis]
 *     summary: Détail maquis
 *     operationId: getMaquisById
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
 *               $ref: '#/components/schemas/SuccessMaquis'
 *       404:
 *         $ref: '#/components/responses/ErreurIntrouvable'
 *   patch:
 *     tags: [Maquis]
 *     summary: Mettre à jour un maquis
 *     operationId: updateMaquis
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
 *             $ref: '#/components/schemas/UpdateMaquisRequest'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMaquis'
 *   delete:
 *     tags: [Maquis]
 *     summary: Supprimer un maquis
 *     operationId: deleteMaquis
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Supprimé
 * /maquis/{id}/image:
 *   post:
 *     tags: [Maquis]
 *     summary: Téléverser l’image du maquis (Cloudinary)
 *     operationId: uploadMaquisImage
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [image]
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessMaquis'
 *       400:
 *         $ref: '#/components/responses/ErreurValidation'
 *       404:
 *         $ref: '#/components/responses/ErreurIntrouvable'
 *       413:
 *         description: Fichier trop volumineux
 *       503:
 *         description: Cloudinary non configuré
 */
maquisRouter.get("/", asyncHandler(maquisController.list));
maquisRouter.get("/all", asyncHandler(maquisController.listAll));
maquisRouter.get("/user/:userId", asyncHandler(maquisController.listByUser));
maquisRouter.post(
  "/:id/image",
  parseSingleImageUpload,
  asyncHandler(maquisController.uploadImage),
);
maquisRouter.get("/:id", asyncHandler(maquisController.getById));
maquisRouter.post(
  "/",
  requireAuth,
  validateCreateMaquis,
  asyncHandler(maquisController.create),
);
maquisRouter.patch(
  "/:id",
  validateUpdateMaquis,
  asyncHandler(maquisController.update),
);
maquisRouter.delete("/:id", asyncHandler(maquisController.remove));
