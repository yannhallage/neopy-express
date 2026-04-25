import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { commandesController } from "../controllers/commandes.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  validateCreateCommande,
  validateUpdateCommande,
} from "../validators/commandes.validator.js";

export const commandesRouter = Router();

/**
 * @openapi
 * /commandes:
 *   get:
 *     tags: [Commandes]
 *     summary: Lister les commandes
 *     operationId: listCommandes
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *       - in: query
 *         name: maquisId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessCommandeList'
 *   post:
 *     tags: [Commandes]
 *     summary: Créer une commande (lignes + total calculé côté serveur)
 *     operationId: createCommande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommandeRequest'
 *     responses:
 *       201:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessCommande'
 *       400:
 *         $ref: '#/components/responses/ErreurValidation'
 * /commandes/all:
 *   get:
 *     tags: [Commandes]
 *     summary: Lister toutes les commandes (ADMIN/DEBUG)
 *     operationId: listAllCommandes
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessCommandeList'
 * /commandes/user/{userId}:
 *   get:
 *     tags: [Commandes]
 *     summary: Lister les commandes d'un utilisateur par son identifiant
 *     operationId: listCommandesByUser
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessCommandeList'
 *       404:
 *         $ref: '#/components/responses/ErreurIntrouvable'
 * /commandes/{id}:
 *   get:
 *     tags: [Commandes]
 *     summary: Détail commande
 *     operationId: getCommandeById
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
 *               $ref: '#/components/schemas/SuccessCommande'
 *       404:
 *         $ref: '#/components/responses/ErreurIntrouvable'
 *   patch:
 *     tags: [Commandes]
 *     summary: Mettre à jour statut / paiement / commentaire
 *     operationId: updateCommande
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
 *             $ref: '#/components/schemas/UpdateCommandeRequest'
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessCommande'
 *   delete:
 *     tags: [Commandes]
 *     summary: Supprimer une commande
 *     operationId: deleteCommande
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

commandesRouter.get("/", requireAuth, asyncHandler(commandesController.list));

commandesRouter.get(
  "/all",
  /**
   * @openapi
   * /commandes/all:
   *   get:
   *     tags: [Commandes]
   *     summary: Lister toutes les commandes (ADMIN/DEBUG)
   *     operationId: listAllCommandes
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessCommandeList'
   */
  asyncHandler(commandesController.listAll)
);

commandesRouter.get(
  "/user/:userId",
  /**
   * @openapi
   * /commandes/user/{userId}:
   *   get:
   *     tags: [Commandes]
   *     summary: Lister les commandes d'un utilisateur par son identifiant
   *     operationId: listCommandesByUser
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessCommandeList'
   *       404:
   *         $ref: '#/components/responses/ErreurIntrouvable'
   */
  asyncHandler(commandesController.listByUser)
);

commandesRouter.get("/:id", asyncHandler(commandesController.getById));
commandesRouter.post(
  "/",
  validateCreateCommande,
  asyncHandler(commandesController.create),
);
commandesRouter.patch(
  "/:id",
  validateUpdateCommande,
  asyncHandler(commandesController.update),
);
commandesRouter.delete("/:id", asyncHandler(commandesController.remove));
