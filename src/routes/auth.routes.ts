import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { validateLogin, validateRegister } from "../validators/auth.validator.js";

export const authRouter = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Authentification]
 *     summary: Connexion (JWT)
 *     operationId: login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessAuth'
 *       400:
 *         $ref: '#/components/responses/ErreurValidation'
 *       401:
 *         description: Identifiants invalides
 *       403:
 *         description: Compte désactivé
 * /auth/register:
 *   post:
 *     tags: [Authentification]
 *     summary: Inscription client (mot de passe hashé)
 *     operationId: register
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessAuth'
 *       400:
 *         $ref: '#/components/responses/ErreurValidation'
 *       409:
 *         $ref: '#/components/responses/ErreurConflit'
 * /auth/me:
 *   get:
 *     tags: [Authentification]
 *     summary: Profil de l’utilisateur connecté
 *     operationId: authMe
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessUser'
 *       401:
 *         description: Token manquant ou invalide
 *       404:
 *         $ref: '#/components/responses/ErreurIntrouvable'
 */
authRouter.post("/login", validateLogin, asyncHandler(authController.login));
authRouter.post(
  "/register",
  validateRegister,
  asyncHandler(authController.register),
);
authRouter.get("/me", requireAuth, asyncHandler(authController.me));
