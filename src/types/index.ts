
/**
 * Types TypeScript pour EPIE Connect
 * 
 * Ce fichier contient toutes les définitions de types utilisées
 * dans l'application pour assurer la cohérence des données
 */

// Types pour l'authentification et les utilisateurs
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Énumération des rôles utilisateur
export type UserRole = 'admin' | 'manager' | 'trainer' | 'employee';

// Interface pour les données d'authentification
export interface AuthData {
  user: User;
  token: string;
  refreshToken: string;
}

// Types pour les stagiaires avec tous les champs détaillés
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: Date;
  age: number;
  
  // Informations de résidence
  address: string;
  postalCode: string;
  city: string;
  department: string;
  
  // Informations de naissance
  birthCity: string;
  birthCountry: string;
  
  // Organisme prescripteur
  prescribingOrganization: string;
  prescribingCity: string;
  
  // Formation et niveau
  educationLevel: string;
  
  // Dates et présences importantes
  infoCollectiveDate?: Date;
  presentAtInfoCollective: boolean;
  presentAtIndividualInterview: boolean;
  
  // Évaluation et positionnement
  positioning: string;
  centerDecision: string;
  result: string;
  
  // Parcours
  pathway1?: string;
  pathway2?: string;
  
  // Communication
  candidateInformation: string;
  
  // Relations avec formations
  trainings: string[]; // IDs des formations
  status: StudentStatus;
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

// Statuts possibles pour un stagiaire
export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'dropped';

// Interface pour les adresses (conservée pour compatibilité)
export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

// Types pour les formations
export interface Training {
  id: string;
  name: string;
  category: TrainingCategory;
  description: string;
  duration: number; // en heures
  supervisors: string[]; // IDs des formateurs superviseurs
  sessions: TrainingSession[];
  students: string[]; // IDs des stagiaires
  maxCapacity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Catégories de formations
export type TrainingCategory = 
  | 'numerique' 
  | 'socles-competences' 
  | 'linguistique';

// Interface pour les sessions de formation
export interface TrainingSession {
  id: string;
  startDate: Date;
  endDate: Date;
  location: string;
  status: SessionStatus;
  participants: string[]; // IDs des stagiaires participants
}

// Statuts des sessions
export type SessionStatus = 'planned' | 'ongoing' | 'completed' | 'cancelled';

// Types pour les partenaires
export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  contactInfo: ContactInfo;
  isActive: boolean;
  collaborations: string[]; // IDs des formations ou projets
  createdAt: Date;
  updatedAt: Date;
}

// Types de partenaires
export type PartnerType = 'enterprise' | 'institution' | 'ngo' | 'government';

// Informations de contact
export interface ContactInfo {
  email: string;
  phone: string;
  address: Address;
  website?: string;
  contactPerson: string;
}

// Types pour les documents
export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  url: string;
  uploadDate: Date;
  uploadedBy: string; // ID de l'utilisateur
  relatedTo: {
    type: 'student' | 'training' | 'partner';
    id: string;
  };
}

// Types de documents
export type DocumentType = 
  | 'contract' 
  | 'certificate' 
  | 'course-material' 
  | 'assessment' 
  | 'other';

// Types pour les statistiques du tableau de bord
export interface DashboardStats {
  students: StudentStats;
  trainings: TrainingStats;
  employees: EmployeeStats;
  partners: PartnerStats;
}

// Statistiques des stagiaires
export interface StudentStats {
  total: number;
  active: number;
  byTraining: Array<{
    trainingName: string;
    count: number;
  }>;
  byStatus: Record<StudentStatus, number>;
  recentEnrollments: number; // Inscriptions des 30 derniers jours
}

// Statistiques des formations
export interface TrainingStats {
  total: number;
  active: number;
  upcoming: number;
  completed: number;
  byCategory: Record<TrainingCategory, number>;
  averageCompletionRate: number;
}

// Statistiques des employés
export interface EmployeeStats {
  total: number;
  byRole: Record<UserRole, number>;
  byDepartment: Array<{
    department: string;
    count: number;
  }>;
  activeTrainers: number;
}

// Statistiques des partenaires
export interface PartnerStats {
  total: number;
  active: number;
  byType: Record<PartnerType, number>;
  recentPartnerships: number;
}

// Types pour les événements du calendrier
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  type: EventType;
  relatedTo: {
    type: 'training' | 'session' | 'meeting';
    id: string;
  };
  participants: string[]; // IDs des participants
}

// Types d'événements
export type EventType = 'session' | 'exam' | 'meeting' | 'deadline' | 'event';

// Types pour les notifications
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  recipientId: string;
  createdAt: Date;
  actionUrl?: string;
}

// Types de notifications
export type NotificationType = 'info' | 'warning' | 'success' | 'error';

// Types pour les filtres de recherche
export interface SearchFilters {
  query?: string;
  category?: string;
  status?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
}

// Types pour la pagination
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Réponse paginée générique
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Types pour les erreurs
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

// Configuration de l'application
export interface AppConfig {
  apiUrl: string;
  appName: string;
  version: string;
  features: {
    notifications: boolean;
    calendar: boolean;
    documents: boolean;
    reports: boolean;
  };
}
