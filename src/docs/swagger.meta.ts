/**
 * @openapi
 * /api-docs.json:
 *   get:
 *     tags:
 *       - Documentation
 *     summary: Spécification OpenAPI au format JSON
 *     description: Même contenu que celui consommé par Swagger UI ; utile pour Postman, génération de clients, etc.
 *     operationId: getOpenApiJson
 *     responses:
 *       200:
 *         description: Document OpenAPI 3
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

export {};
