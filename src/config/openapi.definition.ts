/**
 * Définition OpenAPI de base (sans `paths`, complétés par swagger-jsdoc depuis les routes).
 */
export const openApiDefinition = {
  openapi: "3.0.3",
  info: {
    title: "API Maquis & Garba",
    version: "1.0.0",
    description:
      "API REST pour utilisateurs, maquis, plats et commandes. Succès : `{ success: true, data?: … }` ou `{ success: true, message }`. Erreurs : `{ success: false, message }`.",
  },
  servers: [
    { url: "/api/v1", description: "API version 1" },
    { url: "/", description: "Racine (métadonnées)" },
  ],
  tags: [
    { name: "Système", description: "État du service" },
    {
      name: "Authentification",
      description: "Connexion JWT, inscription client, profil connecté",
    },
    { name: "Utilisateurs", description: "Comptes clients, gérants, admin" },
    { name: "Maquis", description: "Points de vente" },
    { name: "Plats", description: "Carte (garba, attiéké, etc.)" },
    { name: "Commandes", description: "Commandes clients" },
    { name: "Documentation", description: "Spécification machine" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT obtenu via POST /auth/login ou /auth/register",
      },
    },
    schemas: {
      Role: {
        type: "string",
        enum: ["CLIENT", "GERANT", "ADMIN"],
      },
      StatutCommande: {
        type: "string",
        enum: [
          "EN_ATTENTE",
          "EN_PREPARATION",
          "PRETE",
          "LIVREE",
          "ANNULEE",
        ],
      },
      MoyenDePaiement: {
        type: "string",
        enum: [
          "ESPECES",
          "ORANGE_MONEY",
          "MTN_MONEY",
          "MOOV_MONEY",
          "WAVE",
          "CARTE_BANCAIRE",
          "AUTRE",
        ],
      },
      User: {
        type: "object",
        required: [
          "id",
          "email",
          "telephone",
          "nom",
          "prenom",
          "role",
          "maquisId",
          "actif",
          "createdAt",
          "updatedAt",
        ],
        properties: {
          id: { type: "string" },
          email: { type: "string", format: "email" },
          telephone: { type: "string", nullable: true },
          nom: { type: "string" },
          prenom: { type: "string", nullable: true },
          role: { $ref: "#/components/schemas/Role" },
          maquisId: { type: "string", nullable: true },
          actif: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Maquis: {
        type: "object",
        required: [
          "id",
          "nom",
          "description",
          "adresse",
          "ville",
          "telephone",
          "imageUrl",
          "ouvert",
          "proprietaireId",
          "createdAt",
          "updatedAt",
        ],
        properties: {
          id: { type: "string" },
          nom: { type: "string" },
          description: { type: "string", nullable: true },
          adresse: { type: "string" },
          ville: { type: "string", nullable: true },
          telephone: { type: "string", nullable: true },
          imageUrl: { type: "string", nullable: true },
          ouvert: { type: "boolean" },
          proprietaireId: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Plat: {
        type: "object",
        required: [
          "id",
          "maquisId",
          "nom",
          "description",
          "prix",
          "imageUrl",
          "disponible",
          "createdAt",
          "updatedAt",
        ],
        properties: {
          id: { type: "string" },
          maquisId: { type: "string" },
          nom: { type: "string" },
          description: { type: "string", nullable: true },
          prix: { type: "string", description: "Montant décimal (chaîne)" },
          imageUrl: { type: "string", nullable: true },
          disponible: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      LigneCommande: {
        type: "object",
        required: ["id", "platId", "quantite", "prixUnitaire"],
        properties: {
          id: { type: "string" },
          platId: { type: "string" },
          quantite: { type: "integer" },
          prixUnitaire: { type: "string" },
          plat: {
            type: "object",
            nullable: true,
            properties: {
              id: { type: "string" },
              nom: { type: "string" },
              maquisId: { type: "string" },
            },
          },
        },
      },
      Commande: {
        type: "object",
        required: [
          "id",
          "userId",
          "maquisId",
          "statut",
          "moyenPaiement",
          "montantTotal",
          "commentaire",
          "createdAt",
          "updatedAt",
          "lignes",
        ],
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          maquisId: { type: "string" },
          statut: { $ref: "#/components/schemas/StatutCommande" },
          moyenPaiement: { $ref: "#/components/schemas/MoyenDePaiement" },
          montantTotal: { type: "string" },
          commentaire: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          lignes: {
            type: "array",
            items: { $ref: "#/components/schemas/LigneCommande" },
          },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["email", "password", "nom"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password", minLength: 8 },
          nom: { type: "string" },
          prenom: { type: "string" },
          telephone: { type: "string" },
          role: { $ref: "#/components/schemas/Role" },
        },
      },
      AuthSession: {
        type: "object",
        required: ["accessToken", "tokenType", "user"],
        properties: {
          accessToken: { type: "string" },
          tokenType: { type: "string", example: "Bearer" },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      SuccessAuth: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/AuthSession" },
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
          data: { type: "array", items: { $ref: "#/components/schemas/User" } },
        },
      },
      SuccessMaquis: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/Maquis" },
        },
      },
      SuccessMaquisList: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean", example: true },
          data: { type: "array", items: { $ref: "#/components/schemas/Maquis" } },
        },
      },
      SuccessPlat: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/Plat" },
        },
      },
      SuccessPlatList: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean", example: true },
          data: { type: "array", items: { $ref: "#/components/schemas/Plat" } },
        },
      },
      SuccessCommande: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean", example: true },
          data: { $ref: "#/components/schemas/Commande" },
        },
      },
      SuccessCommandeList: {
        type: "object",
        required: ["success", "data"],
        properties: {
          success: { type: "boolean", example: true },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Commande" },
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
          stack: { type: "string" },
        },
      },
      CreateUserRequest: {
        type: "object",
        required: ["email", "nom"],
        properties: {
          email: { type: "string", format: "email" },
          nom: { type: "string" },
          prenom: { type: "string" },
          telephone: { type: "string" },
          role: { $ref: "#/components/schemas/Role" },
          maquisId: { type: "string" },
        },
      },
      UpdateUserRequest: {
        type: "object",
        minProperties: 1,
        properties: {
          email: { type: "string", format: "email" },
          nom: { type: "string" },
          prenom: { type: "string", nullable: true },
          telephone: { type: "string", nullable: true },
          role: { $ref: "#/components/schemas/Role" },
          maquisId: { type: "string", nullable: true },
          actif: { type: "boolean" },
        },
      },
      CreateMaquisRequest: {
        type: "object",
        required: ["nom", "adresse", "proprietaireId"],
        properties: {
          nom: { type: "string" },
          description: { type: "string" },
          adresse: { type: "string" },
          ville: { type: "string" },
          telephone: { type: "string" },
          imageUrl: { type: "string" },
          ouvert: { type: "boolean" },
          proprietaireId: { type: "string" },
        },
      },
      UpdateMaquisRequest: {
        type: "object",
        minProperties: 1,
        properties: {
          nom: { type: "string" },
          description: { type: "string", nullable: true },
          adresse: { type: "string" },
          ville: { type: "string", nullable: true },
          telephone: { type: "string", nullable: true },
          imageUrl: { type: "string", nullable: true },
          ouvert: { type: "boolean" },
          proprietaireId: { type: "string" },
        },
      },
      CreatePlatRequest: {
        type: "object",
        required: ["maquisId", "nom", "prix"],
        properties: {
          maquisId: { type: "string" },
          nom: { type: "string" },
          description: { type: "string" },
          prix: { type: "number" },
          imageUrl: { type: "string" },
          disponible: { type: "boolean" },
        },
      },
      UpdatePlatRequest: {
        type: "object",
        minProperties: 1,
        properties: {
          maquisId: { type: "string" },
          nom: { type: "string" },
          description: { type: "string", nullable: true },
          prix: { type: "number" },
          imageUrl: { type: "string", nullable: true },
          disponible: { type: "boolean" },
        },
      },
      LigneCommandeInput: {
        type: "object",
        required: ["platId", "quantite"],
        properties: {
          platId: { type: "string" },
          quantite: { type: "integer", minimum: 1 },
        },
      },
      CreateCommandeRequest: {
        type: "object",
        required: ["userId", "maquisId", "lignes"],
        properties: {
          userId: { type: "string" },
          maquisId: { type: "string" },
          lignes: {
            type: "array",
            minItems: 1,
            items: { $ref: "#/components/schemas/LigneCommandeInput" },
          },
          moyenPaiement: { $ref: "#/components/schemas/MoyenDePaiement" },
          commentaire: { type: "string" },
        },
      },
      UpdateCommandeRequest: {
        type: "object",
        minProperties: 1,
        properties: {
          statut: { $ref: "#/components/schemas/StatutCommande" },
          moyenPaiement: { $ref: "#/components/schemas/MoyenDePaiement" },
          commentaire: { type: "string", nullable: true },
        },
      },
    },
    responses: {
      ErreurValidation: {
        description: "Requête invalide",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorBody" },
          },
        },
      },
      ErreurConflit: {
        description: "Conflit (unicité, etc.)",
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
        description: "Erreur serveur",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorBody" },
          },
        },
      },
    },
  },
};
