export interface Etudiant {
  id: string;
  name: string;
  prenom: string;
  email: string;
  matricule: string;
  createdAt: string;
  filiereId: string | null;
  userId: string | null;
}
