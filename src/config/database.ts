
/**
 * Configuration de la base de données pour EPIE Connect
 */

export const DATABASE_CONFIG = {
  // Configuration pour localStorage (développement)
  storage: {
    employees: 'epie_employees',
    students: 'epie_students',
    trainings: 'epie_trainings',
    sessions: 'epie_sessions',
    internships: 'epie_internships',
  },
  
  // Configuration pour Supabase (production)
  supabase: {
    tables: {
      employees: 'employees',
      students: 'students',
      trainings: 'trainings',
      sessions: 'sessions',
      internships: 'internships',
    },
  },
  
  // Paramètres généraux
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
  
  // Validation des données
  validation: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    telephone: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
    codePostal: /^\d{5}$/,
  },
};

/**
 * Utilitaires pour la validation des données
 */
export const validateData = {
  email: (email: string): boolean => DATABASE_CONFIG.validation.email.test(email),
  telephone: (tel: string): boolean => DATABASE_CONFIG.validation.telephone.test(tel),
  codePostal: (code: string): boolean => DATABASE_CONFIG.validation.codePostal.test(code),
};
