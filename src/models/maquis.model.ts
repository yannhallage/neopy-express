export interface Maquis {
  id: string;
  nom: string;
  description: string | null;
  adresse: string;
  ville: string | null;
  telephone: string | null;
  imageUrl: string | null;
  ouvert: boolean;
  proprietaireId: string;
  createdAt: string;
  updatedAt: string;
}
