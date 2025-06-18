
/**
 * Types pour la base de données EPIE Connect
 */

export interface Employee {
  id: string;
  civilite: 'M.' | 'Mme';
  nom: string;
  prenom: string;
  poste: string;
  service: 'Direction' | 'Pédagogie' | 'Administration' | 'Autres';
  email: string;
  telephone: string;
  statut: 'Actif' | 'Congé' | 'Inactif';
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  civilite: 'M.' | 'Mme';
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  date_naissance: string;
  adresse: string;
  ville: string;
  code_postal: string;
  niveau_etudes: string;
  situation_professionnelle: string;
  statut: 'Actif' | 'Diplômé' | 'Abandon' | 'Suspendu';
  created_at: string;
  updated_at: string;
}

export interface Training {
  id: string;
  title: string;
  category: 'numerique' | 'socles' | 'linguistique';
  duration: number; // en heures
  description: string;
  objectifs: string[];
  prerequis: string[];
  statut: 'Actif' | 'Inactif' | 'Archivé';
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  training_id: string;
  nom: string;
  date_debut: string;
  date_fin: string;
  horaires: string;
  lieu: string;
  formateur_id: string;
  max_participants: number;
  participants_inscrits: number;
  statut: 'Planifiée' | 'En cours' | 'Terminée' | 'Annulée';
  created_at: string;
  updated_at: string;
}

export interface Internship {
  id: string;
  student_id: string;
  entreprise: string;
  tuteur_entreprise: string;
  email_tuteur: string;
  telephone_tuteur: string;
  date_debut: string;
  date_fin: string;
  duree_semaines: number;
  objectifs: string;
  competences_visees: string[];
  statut: 'En cours' | 'Terminé' | 'Annulé';
  evaluation: number | null; // Note sur 20
  commentaires: string;
  created_at: string;
  updated_at: string;
}
