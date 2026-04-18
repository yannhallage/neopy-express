/**
 * Définition OpenAPI de base (sans `paths`, complétés par swagger-jsdoc depuis les routes).
 */
export const openApiDefinition = {
  openapi: "3.0.3",
  info: {
    title: "Express Backend API",
    version: "1.0.0",
    description:
      "Documentation de l’API REST. Les succès utilisent `{ success: true, data?: ... }` ou `{ success: true, message }`. Les erreurs : `{ success: false, message }` ; en développement, une erreur 500 peut inclure `stack`.",
  },
  servers: [
    { url: "/api/v1", description: "API version 1" },
    { url: "/", description: "Racine (métadonnées)" },
  ],
  tags: [
    { name: "Système", description: "État du service" },
    { name: "Utilisateurs", description: "Gestion des utilisateurs" },
    { name: "Documentation", description: "Spécification machine" },
  ],
  components: {
    schemas: {
      User: {
        type: "object",
        required: ["id", "email", "name", "createdAt"],
        properties: {
          id: { type: "string", example: "clxyz123" },
          email: { type: "string", format: "email" },
          name: { type: "string", maxLength: 120 },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Date de création (ISO 8601)",
          },
        },
      },
      SuccessUser: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/User" },
        },
      },
      SuccessUserList: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/User" },
          },
        },
      },
      SuccessHealth: {
        type: "object",
        required: ["success", "message"],
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "OK" },
        },
      },
      ErrorBody: {
        type: "object",
        required: ["success", "message"],
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
          stack: {
            type: "string",
            description: "Présent en développement pour certaines erreurs 500",
          },
        },
      },
      CreateUserRequest: {
        type: "object",
        required: ["email", "name"],
        properties: {
          email: { type: "string", format: "email" },
          name: { type: "string", minLength: 1, maxLength: 120 },
        },
      },
    },
    responses: {
      ErreurValidation: {
        description: "Requête invalide (validation ou paramètre)",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorBody" },
          },
        },
      },
      ErreurConflit: {
        description: "Conflit métier (ex. email déjà utilisé)",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorBody" },
          },
        },
      },
      ErreurIntrouvable: {
        description: "Ressource introuvable",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorBody" },
          },
        },
      },
      ErreurServeur: {
        description: "Erreur interne ou non gérée",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorBody" },
          },
        },
      },
    },
  },
};
