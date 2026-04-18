import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { etudiantsController } from "../controllers/etudiants.controller.js";
import {
  validateCreateEtudiant,
  validateUpdateEtudiant,
} from "../validators/etudiants.validator.js";

export const etudiantsRouter = Router();

/**
 * @openapi
 * /etudiants:
 *   get:
 *     tags:
 *       - Étudiants
 *     summary: Lister les étudiants
 *     operationId: listEtudiants
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         $ref: '#/components/responses/ErreurServeur'
 *   post:
 *     tags:
 *       - Étudiants
 *     summary: Créer un étudiant
 *     operationId: createEtudiant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEtudiantRequest'
 *     responses:
 *       201:
 *         description: Créé
 *       400:
 *         $ref: '#/components/responses/ErreurValidation'
 *       409:
 *         $ref: '#/components/responses/ErreurConflit'
 * /etudiants/{id}:
 *   get:
 *     tags:
 *       - Étudiants
 *     summary: Détail étudiant
 *     operationId: getEtudiantById
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
 *       - Étudiants
 *     summary: Mettre à jour un étudiant
 *     operationId: updateEtudiant
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
 *             $ref: '#/components/schemas/UpdateEtudiantRequest'
 *     responses:
 *       200:
 *         description: OK
 *       400:
 *         $ref: '#/components/responses/ErreurValidation'
 *       404:
 *         $ref: '#/components/responses/ErreurIntrouvable'
 *   delete:
 *     tags:
 *       - Étudiants
 *     summary: Supprimer un étudiant
 *     operationId: deleteEtudiant
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
etudiantsRouter.get("/", asyncHandler(etudiantsController.list));
etudiantsRouter.get("/:id", asyncHandler(etudiantsController.getById));
etudiantsRouter.post(
  "/",
  validateCreateEtudiant,
  asyncHandler(etudiantsController.create),
);
etudiantsRouter.patch(
  "/:id",
  validateUpdateEtudiant,
  asyncHandler(etudiantsController.update),
);
etudiantsRouter.delete("/:id", asyncHandler(etudiantsController.remove));
