import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { usersRouter } from "./users.routes.js";
import { maquisRouter } from "./maquis.routes.js";
import { platsRouter } from "./plats.routes.js";
import { commandesRouter } from "./commandes.routes.js";

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

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/maquis", maquisRouter);
apiRouter.use("/plats", platsRouter);
apiRouter.use("/commandes", commandesRouter);
