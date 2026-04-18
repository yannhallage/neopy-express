import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { filieresController } from "../controllers/filieres.controller.js";
import {
  validateCreateFiliere,
  validateUpdateFiliere,
} from "../validators/filieres.validator.js";

export const filieresRouter = Router();

/**
 * @openapi
 * /filieres:
 *   get:
 *     tags:
 *       - Filières
 *     summary: Lister les filières
 *     operationId: listFilieres
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         $ref: '#/components/responses/ErreurServeur'
 *   post:
 *     tags:
 *       - Filières
 *     summary: Créer une filière
 *     operationId: createFiliere
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateFiliereRequest'
 *     responses:
 *       201:
 *         description: Créé
 *       400:
 *         $ref: '#/components/responses/ErreurValidation'
 * /filieres/{id}:
 *   get:
 *     tags:
 *       - Filières
 *     summary: Détail filière
 *     operationId: getFiliereById
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *       404:
 *         $ref: '#/components/responses/ErreurIntrouvable'
 *   patch:
 *     tags:
 *       - Filières
 *     summary: Mettre à jour une filière
 *     operationId: updateFiliere
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateFiliereRequest'
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         $ref: '#/components/responses/ErreurValidation'
 *       404:
 *         $ref: '#/components/responses/ErreurIntrouvable'
 *   delete:
 *     tags:
 *       - Filières
 *     summary: Supprimer une filière
 *     operationId: deleteFiliere
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Supprimé
 *       404:
 *         $ref: '#/components/responses/ErreurIntrouvable'
 */
filieresRouter.get("/", asyncHandler(filieresController.list));
filieresRouter.get("/:id", asyncHandler(filieresController.getById));
filieresRouter.post(
  "/",
  validateCreateFiliere,
  asyncHandler(filieresController.create),
);
filieresRouter.patch(
  "/:id",
  validateUpdateFiliere,
  asyncHandler(filieresController.update),
);
filieresRouter.delete("/:id", asyncHandler(filieresController.remove));
