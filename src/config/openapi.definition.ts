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
    { name: "Étudiants", description: "Gestion des étudiants" },
    { name: "Filières", description: "Gestion des filières" },
    { name: "Documentation", description: "Spécification machine" },
  ],
  components: {
    schemas: {
      Role: {
        type: "string",
        enum: ["ADMIN", "PROF", "ETUDIANT"],
        description: "Rôle applicatif",
      },
      User: {
        type: "object",
        required: ["id", "email", "name", "role", "createdAt"],
        properties: {
          id: { type: "string", example: "clxyz123" },
          email: { type: "string", format: "email" },
          name: { type: "string", maxLength: 120 },
          role: { $ref: "#/components/schemas/Role" },
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
          role: { $ref: "#/components/schemas/Role" },
        },
      },
      UpdateUserRequest: {
        type: "object",
        minProperties: 1,
        properties: {
          email: { type: "string", format: "email" },
          name: { type: "string", minLength: 1, maxLength: 120 },
          role: { $ref: "#/components/schemas/Role" },
        },
      },
      Etudiant: {
        type: "object",
        required: [
          "id",
          "name",
          "prenom",
          "email",
          "matricule",
          "createdAt",
          "filiereId",
          "userId",
        ],
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          prenom: { type: "string" },
          email: { type: "string", format: "email" },
          matricule: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          filiereId: { type: "string", nullable: true },
          userId: { type: "string", nullable: true },
        },
      },
      Filiere: {
        type: "object",
        required: ["id", "name", "createdAt", "profId"],
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          profId: { type: "string", description: "Identifiant utilisateur (professeur)" },
        },
      },
      CreateEtudiantRequest: {
        type: "object",
        required: ["name", "prenom", "email", "matricule"],
        properties: {
          name: { type: "string", minLength: 1, maxLength: 120 },
          prenom: { type: "string", minLength: 1, maxLength: 120 },
          email: { type: "string", format: "email" },
          matricule: { type: "string", minLength: 1, maxLength: 64 },
          filiereId: { type: "string", nullable: true },
          userId: { type: "string", nullable: true },
        },
      },
      UpdateEtudiantRequest: {
        type: "object",
        minProperties: 1,
        properties: {
          name: { type: "string", minLength: 1, maxLength: 120 },
          prenom: { type: "string", minLength: 1, maxLength: 120 },
          email: { type: "string", format: "email" },
          matricule: { type: "string", minLength: 1, maxLength: 64 },
          filiereId: { type: "string", nullable: true },
          userId: { type: "string", nullable: true },
        },
      },
      CreateFiliereRequest: {
        type: "object",
        required: ["name", "profId"],
        properties: {
          name: { type: "string", minLength: 1, maxLength: 120 },
          profId: { type: "string", minLength: 1 },
        },
      },
      UpdateFiliereRequest: {
        type: "object",
        minProperties: 1,
        properties: {
          name: { type: "string", minLength: 1, maxLength: 120 },
          profId: { type: "string", minLength: 1 },
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
