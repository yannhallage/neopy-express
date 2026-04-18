import { Router } from "express";
import { usersRouter } from "./users.routes.js";
import { etudiantsRouter } from "./etudiants.routes.js";
import { filieresRouter } from "./filieres.routes.js";

export const apiRouter = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Système
 *     summary: Vérification de disponibilité
 *     operationId: getHealth
 *     responses:
 *       200:
 *         description: Service joignable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessHealth'
 *       500:
 *         $ref: '#/components/responses/ErreurServeur'
 */
apiRouter.get("/health", (_req, res) => {
  res.json({ success: true, message: "OK" });
});

apiRouter.use("/users", usersRouter);
apiRouter.use("/etudiants", etudiantsRouter);
apiRouter.use("/filieres", filieresRouter);
