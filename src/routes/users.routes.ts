import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { usersController } from "../controllers/users.controller.js";
import {
  validateCreateUser,
  validateUpdateUser,
} from "../validators/users.validator.js";

export const usersRouter = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     tags:
 *       - Utilisateurs
 *     summary: Lister les utilisateurs
 *     operationId: listUsers
 *     responses:
 *       200:
 *         description: Liste triée par date de création (plus récent en premier)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessUserList'
 *       500:
 *         $ref: '#/components/responses/ErreurServeur'
 *   post:
 *     tags:
 *       - Utilisateurs
 *     summary: Créer un utilisateur
 *     operationId: createUser
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessUser'
 *       400:
 *         $ref: '#/components/responses/ErreurValidation'
 *       409:
 *         $ref: '#/components/responses/ErreurConflit'
 *       500:
 *         $ref: '#/components/responses/ErreurServeur'
 * /users/{id}:
 *   get:
 *     tags:
 *       - Utilisateurs
 *     summary: Obtenir un utilisateur par identifiant
 *     operationId: getUserById
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant CUID de l'utilisateur
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessUser'
 *       400:
 *         $ref: '#/components/responses/ErreurValidation'
 *       404:
 *         $ref: '#/components/responses/ErreurIntrouvable'
 *       500:
 *         $ref: '#/components/responses/ErreurServeur'
 *   patch:
 *     tags:
 *       - Utilisateurs
 *     summary: Mettre à jour un utilisateur
 *     operationId: updateUser
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
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessUser'
 *       400:
 *         $ref: '#/components/responses/ErreurValidation'
 *       404:
 *         $ref: '#/components/responses/ErreurIntrouvable'
 *       409:
 *         $ref: '#/components/responses/ErreurConflit'
 *       500:
 *         $ref: '#/components/responses/ErreurServeur'
 *   delete:
 *     tags:
 *       - Utilisateurs
 *     summary: Supprimer un utilisateur
 *     operationId: deleteUser
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Supprimé
 *       400:
 *         $ref: '#/components/responses/ErreurValidation'
 *       404:
 *         $ref: '#/components/responses/ErreurIntrouvable'
 *       500:
 *         $ref: '#/components/responses/ErreurServeur'
 */
usersRouter.get("/", asyncHandler(usersController.list));
usersRouter.get("/:id", asyncHandler(usersController.getById));
usersRouter.post(
  "/",
  validateCreateUser,
  asyncHandler(usersController.create),
);
usersRouter.patch(
  "/:id",
  validateUpdateUser,
  asyncHandler(usersController.update),
);
usersRouter.delete("/:id", asyncHandler(usersController.remove));
