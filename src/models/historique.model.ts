export interface Historique {
  id: string;
  userId: string | null;
  commandeId: string | null;
  maquisId: string | null;
  action: string;
  details: string | null;
  createdAt: string;
}
