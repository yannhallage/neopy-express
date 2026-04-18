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
 *     tags: [Utilisateurs]
 *     summary: Lister les utilisateurs
 *     operationId: listUsers
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessUserList'
 *   post:
 *     tags: [Utilisateurs]
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessUser'
 *       400:
 *         $ref: '#/components/responses/ErreurValidation'
 *       409:
 *         $ref: '#/components/responses/ErreurConflit'
 * /users/{id}:
 *   get:
 *     tags: [Utilisateurs]
 *     summary: Détail utilisateur
 *     operationId: getUserById
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
 *               $ref: '#/components/schemas/SuccessUser'
 *       404:
 *         $ref: '#/components/responses/ErreurIntrouvable'
 *   patch:
 *     tags: [Utilisateurs]
 *     summary: Mettre à jour un utilisateur
 *     operationId: updateUser
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
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessUser'
 *       400:
 *         $ref: '#/components/responses/ErreurValidation'
 *       404:
 *         $ref: '#/components/responses/ErreurIntrouvable'
 *   delete:
 *     tags: [Utilisateurs]
 *     summary: Supprimer un utilisateur
 *     operationId: deleteUser
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Supprimé
 *       404:
 *         $ref: '#/components/responses/ErreurIntrouvable'
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
