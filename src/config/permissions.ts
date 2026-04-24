import type { Role } from "@prisma/client";

/**
 * Droits RBAC alignés sur `enum Role` et les domaines `User`, `Maquis`, `Plat`, `Commande`.
 * Le périmètre métier (ex. « son » maquis, `userId` de la commande) reste à appliquer dans les services / contrôleurs.
 *
 * Les entrées {@link UiPermission} servent aux menus / dropdowns (libellés côté front), sans remplacer les contrôles API.
 */
export const Permission = {
  // Utilisateurs
  USERS_LIST: "users:list",
  USERS_READ_ANY: "users:read:any",
  USERS_READ_SELF: "users:read:self",
  USERS_CREATE: "users:create",
  USERS_UPDATE_ANY: "users:update:any",
  USERS_UPDATE_SELF: "users:update:self",
  USERS_DELETE_ANY: "users:delete:any",
  BUTTON_PROFIL: "button:profil",
  BUTTON_COMMANDES: "button:commandes",
  BUTTON_PANIER: "button:panier",
  USER_READ_PANIER: "user:read:panier",
  USER_UPDATE_PANIER: "user:update:panier",
  USER_DELETE_PANIER: "user:delete:panier",
  // USER_READ_HISTORIQUE: "user:read:historique",
  // USER_UPDATE_HISTORIQUE: "user:update:historique",
  // USER_DELETE_HISTORIQUE: "user:delete:historique",
  // USER_READ_PARAMETRES: "user:read:parametres",
  // USER_UPDATE_PARAMETRES: "user:update:parametres",
  // USER_DELETE_PARAMETRES: "user:delete:parametres",
  // BUTTON_PAYER: "button:payer",
  BUTTON_HISTORIQUE: "button:historique",
  BUTTON_PARAMETRES: "button:parametres",
  USER_ISCOMPLETE: "user:iscomplete",
  // BUTTON_DECONNEXION: "button:deconnexion",
  // BUTTON_AIDE: "button:aide",
  // BUTTON_CONTACT: "button:contact",
  // BUTTON_MENTIONS_LEGLES: "button:mentions-legales",

  // Maquis
  MAQUIS_LIST: "maquis:list",
  MAQUIS_READ: "maquis:read",
  MAQUIS_CREATE: "maquis:create",
  MAQUIS_UPDATE: "maquis:update",
  MAQUIS_DELETE: "maquis:delete",
  MAQUIS_UPLOAD_IMAGE: "maquis:upload-image",

  // Plats
  PLATS_LIST: "plats:list",
  PLATS_READ: "plats:read",
  PLATS_CREATE: "plats:create",
  PLATS_UPDATE: "plats:update",
  PLATS_DELETE: "plats:delete",
  PLATS_UPLOAD_IMAGE: "plats:upload-image",

  // Commandes
  COMMANDES_CREATE: "commandes:create",
  COMMANDES_LIST_SELF: "commandes:list:self",
  COMMANDES_LIST_MAQUIS: "commandes:list:maquis",
  COMMANDES_LIST_ALL: "commandes:list:all",
  COMMANDES_READ_SELF: "commandes:read:self",
  COMMANDES_READ_MAQUIS: "commandes:read:maquis",
  COMMANDES_READ_ANY: "commandes:read:any",
  COMMANDES_UPDATE_SELF: "commandes:update:self",
  COMMANDES_UPDATE_MAQUIS: "commandes:update:maquis",
  COMMANDES_DELETE_SELF: "commandes:delete:self",
  COMMANDES_DELETE_MAQUIS: "commandes:delete:maquis",
  COMMANDES_DELETE_ANY: "commandes:delete:any",
} as const;

export type PermissionCode = (typeof Permission)[keyof typeof Permission];

/** Liste exhaustive des codes permission (utile pour tests / admin). */
export const ALL_PERMISSIONS = Object.values(Permission) as readonly PermissionCode[];

/**
 * Clés stables pour l’UI (dropdown utilisateur, navigation). Préfixe `ui:` pour les distinguer des droits API.
 */
export const UiPermission = {
  USER_PROFIL: "profil",
  USER_COMMANDES: "commandes",
  USER_COMPLETER_PROFIL: "completer-profil",
  USER_PANIER: "panier",
  // PAYER: "payer",
  USER_HISTORIQUE: "historique",
  PARAMETRES: "parametres",
  // DECONNEXION: "deconnexion",
  // AIDE: "aide",
  // CONTACT: "contact",
  // MENTIONS_LEGLES: "mentions-legales",

  MON_MAQUIS: "mon-maquis",
  CARTE_PLATS: "carte-plats",
  COMMANDES_ETABLISSEMENT: "commandes-etablissement",

  ADMIN_UTILISATEURS: "admin-utilisateurs",
  ADMIN_MAQUIS: "admin-maquis",
  ADMIN_COMMANDES: "admin-commandes",
} as const;

export type UiPermissionCode = (typeof UiPermission)[keyof typeof UiPermission];

export const ALL_UI_PERMISSIONS = Object.values(
  UiPermission,
) as readonly UiPermissionCode[];

/**
 * Entrées de menu / dropdown par rôle (sous-ensemble de {@link UiPermission}).
 * Le front affiche une ligne si `roleHasUiDropdownItem(role, code)` est vrai.
 */
export const ROLE_UI_DROPDOWN: Record<Role, readonly UiPermissionCode[]> = {
  CLIENT: [
    UiPermission.USER_PROFIL,
    UiPermission.USER_COMMANDES,
    UiPermission.USER_PANIER,
    UiPermission.USER_COMPLETER_PROFIL,
  ],

  GERANT: [
    UiPermission.USER_PROFIL,
    UiPermission.MON_MAQUIS,
    UiPermission.CARTE_PLATS,
    UiPermission.COMMANDES_ETABLISSEMENT,
  ],

  ADMIN: [
    UiPermission.USER_PROFIL,
    UiPermission.ADMIN_UTILISATEURS,
    UiPermission.ADMIN_MAQUIS,
    UiPermission.ADMIN_COMMANDES,
  ],
};

/**
 * Permissions par profil (`Role` Prisma).
 *
 * - **CLIENT** : catalogue public, compte perso, passation et suivi de ses commandes.
 * - **GERANT** : gestion de son établissement, cartes et commandes rattachées à son maquis (périmètre à filtrer côté API).
 * - **ADMIN** : pilotage plateforme (utilisateurs, tout périmètre commandes).
 */
export const ROLE_PERMISSIONS: Record<Role, readonly PermissionCode[]> = {
  CLIENT: [
    Permission.USERS_READ_SELF,
    Permission.USERS_UPDATE_SELF,

    Permission.MAQUIS_LIST,
    Permission.MAQUIS_READ,

    Permission.PLATS_LIST,
    Permission.PLATS_READ,

    Permission.COMMANDES_CREATE,
    Permission.COMMANDES_LIST_SELF,
    Permission.COMMANDES_READ_SELF,
    Permission.COMMANDES_UPDATE_SELF,
    Permission.COMMANDES_DELETE_SELF,

    Permission.USER_READ_PANIER,
    Permission.USER_UPDATE_PANIER,
    Permission.USER_DELETE_PANIER,
    Permission.USER_ISCOMPLETE,

    Permission.BUTTON_COMMANDES,
    Permission.BUTTON_PROFIL,
  ],

  GERANT: [
    Permission.USERS_READ_SELF,
    Permission.USERS_UPDATE_SELF,
    
    Permission.USER_READ_PANIER,
    Permission.USER_UPDATE_PANIER,
    Permission.USER_DELETE_PANIER,
    Permission.USER_ISCOMPLETE,
    Permission.MAQUIS_LIST,
    Permission.MAQUIS_READ,
    Permission.MAQUIS_CREATE,
    Permission.MAQUIS_UPDATE,
    Permission.MAQUIS_DELETE,
    Permission.MAQUIS_UPLOAD_IMAGE,

    Permission.PLATS_LIST,
    Permission.PLATS_READ,
    Permission.PLATS_CREATE,
    Permission.PLATS_UPDATE,
    Permission.PLATS_DELETE,
    Permission.PLATS_UPLOAD_IMAGE,

    Permission.COMMANDES_LIST_MAQUIS,
    Permission.COMMANDES_READ_MAQUIS,
    Permission.COMMANDES_UPDATE_MAQUIS,
    Permission.COMMANDES_DELETE_MAQUIS,
  ],

  ADMIN: [...ALL_PERMISSIONS],
};

const roleSet = new Map<Role, ReadonlySet<PermissionCode>>(
  (Object.keys(ROLE_PERMISSIONS) as Role[]).map((role) => [
    role,
    new Set(ROLE_PERMISSIONS[role]),
  ]),
);

const roleUiDropdownSet = new Map<Role, ReadonlySet<UiPermissionCode>>(
  (Object.keys(ROLE_UI_DROPDOWN) as Role[]).map((role) => [
    role,
    new Set(ROLE_UI_DROPDOWN[role]),
  ]),
);

/** Indique si un rôle possède une permission (sans vérifier le périmètre métier). */
export function roleHasPermission(
  role: Role,
  permission: PermissionCode,
): boolean {
  return roleSet.get(role)?.has(permission) ?? false;
}

/** Indique si le menu / dropdown utilisateur doit afficher cette entrée pour le rôle. */
export function roleHasUiDropdownItem(
  role: Role,
  item: UiPermissionCode,
): boolean {
  return roleUiDropdownSet.get(role)?.has(item) ?? false;
}
