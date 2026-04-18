import type { MoyenDePaiement, StatutCommande } from "@prisma/client";

export interface LigneCommande {
  id: string;
  platId: string;
  quantite: number;
  prixUnitaire: string;
  plat?: {
    id: string;
    nom: string;
    maquisId: string;
  };
}

export interface Commande {
  id: string;
  userId: string;
  maquisId: string;
  statut: StatutCommande;
  moyenPaiement: MoyenDePaiement;
  montantTotal: string;
  commentaire: string | null;
  createdAt: string;
  updatedAt: string;
  lignes: LigneCommande[];
}
