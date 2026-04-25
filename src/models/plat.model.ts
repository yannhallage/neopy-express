export interface Plat {
  id: string;
  maquisId: string;
  nom: string;
  description: string | null;
  prix: string;
  imageUrl: string | null;
  disponible: boolean;
  supplements: string[];
  createdAt: string;
  updatedAt: string;
}
