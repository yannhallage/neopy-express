import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { usersController } from "../controllers/users.controller.js";
import { validateCreateUser } from "../validators/users.validator.js";

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
 */
usersRouter.get("/", asyncHandler(usersController.list));
usersRouter.get("/:id", asyncHandler(usersController.getById));
usersRouter.post(
  "/",
  validateCreateUser,
  asyncHandler(usersController.create),
);
